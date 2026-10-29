// Recursos de validação e transação compartilhados pelas etapas clínicas.
import { ErroHttp } from '../http/respostas.js';
// Compartilha a regra de cadastro e seu identificador de tentativa com as operações relacionadas.
import { formatoChave } from '../pacientes/cadastro.js';

// IDs são números inteiros positivos; não se aceita o nome como relacionamento.
export function validarId(valor) {
  // Recusa este formato de entrada antes da gravação, evitando aceitar um dado que a interface sozinha não garante.
  if (!Number.isSafeInteger(valor) || valor <= 0) {
    throw new ErroHttp(400, 'Escolha um atendimento válido.');
  }
  return valor;
}

// Os limites de texto correspondem às colunas e à proposta documentada do projeto.
export function texto(valor, campo, limite, obrigatorio = true) {
  if (valor == null || valor === '') {
    if (obrigatorio) {
      throw new ErroHttp(400, `Preencha ${campo}.`);
    }
    return null;
  }
  if (typeof valor !== 'string' || valor.trim().length > limite || (obrigatorio && !valor.trim())) {
    throw new ErroHttp(400, `Confira ${campo}: máximo de ${limite} caracteres.`);
  }
  return valor.trim() || null;
}

// Valores opcionais vazios são NULL; os limites validam armazenamento, sem classificar risco.
export function medida(valor, campo, maximo, inteiro = false) {
  if (valor == null || valor === '') {
    return null;
  }
  if (!['number', 'string'].includes(typeof valor) || !/^\d+(\.\d{1,2})?$/.test(String(valor))) {
    throw new ErroHttp(400, `Confira o valor de ${campo}.`);
  }
  const numero = Number(valor);
  // Recusa este formato de entrada antes da gravação, evitando aceitar um dado que a interface sozinha não garante.
  if (
    !Number.isFinite(numero) ||
    numero < 0 ||
    numero > maximo ||
    (inteiro && !Number.isInteger(numero))
  ) {
    throw new ErroHttp(400, `Confira o formato de ${campo}.`);
  }
  return numero;
}

// A chave identifica o envio e pode ser reutilizada somente para repetir os mesmos dados.
export function validarChave(valor) {
  if (typeof valor !== 'string' || !formatoChave.test(valor)) {
    throw new ErroHttp(400, 'Chave da tentativa inválida.');
  }
  return valor.toLowerCase();
}

// Confirma todas as alterações juntas ou desfaz a operação inteira em caso de erro.
export async function comTransacao(banco, executar) {
  // Conexão reservada para esta operação; precisa ser encerrada ou devolvida ao pool.
  const conexao = await banco.getConnection();
  try {
    // Inicia a transação para que conferências e abertura sejam confirmadas como uma única operação.
    await conexao.beginTransaction();
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const resultado = await executar(conexao);
    // Confirma as alterações somente depois de concluir as regras desta tentativa.
    await conexao.commit();
    return resultado;
  } catch (erro) {
    // Desfaz alterações parciais se alguma etapa da abertura não puder ser concluída.
    await conexao.rollback();
    // Uma disputa de chave é um conflito esperado, sem exibir SQL ao usuário.
    if (erro.code === 'ER_DUP_ENTRY') {
      throw new ErroHttp(
        409,
        'Esta tentativa já foi registrada. Confira os dados antes de repetir.',
      );
    }
    // Mantém a falha original para que o tratamento central registre a causa e encerre a operação.
    throw erro;
  } finally {
    // Libera o recurso de conexão para não deixá-lo ocupado após a operação.
    conexao.release();
  }
}

// O bloqueio organiza gravações concorrentes, inclusive medicação e encerramento.
export async function bloquearAtendimento(conexao, id) {
  // Linhas recuperadas no MySQL; o primeiro registro só é usado quando a consulta encontra algo.
  const [linhas] = await conexao.execute('SELECT * FROM atendimentos WHERE id = ? FOR UPDATE', [
    validarId(id),
  ]);
  // Só reaproveita um registro depois de conferir que o banco encontrou a tentativa correspondente.
  if (!linhas.length) {
    throw new ErroHttp(404, 'Atendimento não encontrado.');
  }
  return linhas[0];
}

// Somente nomes de tabelas conhecidos pelo código podem compor uma consulta dinâmica.
const autores = {
  triagens: 'enfermeiro_id',
  consultas: 'medico_id',
  medicacoes: 'enfermeiro_id',
  encerramentos: 'medico_id',
};
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function repeticao(conexao, tabela, usuario, dados, campos) {
  const autor = autores[tabela];
  // Rejeita um hash com estrutura inesperada em vez de tentar interpretar dados incompletos.
  if (!autor) {
    throw new Error('Tabela de registro desconhecida.');
  }
  // Linhas recuperadas no MySQL; o primeiro registro só é usado quando a consulta encontra algo.
  const [linhas] = await conexao.execute(`SELECT * FROM ${tabela} WHERE chave_registro = ?`, [
    dados.chave_registro,
  ]);
  // Só reaproveita um registro depois de conferir que o banco encontrou a tentativa correspondente.
  if (!linhas.length) {
    return null;
  }
  const salvo = linhas[0];
  // A chave não pode revelar ou reaproveitar a tentativa de outro profissional.
  if (salvo[autor] !== usuario.id) {
    throw new ErroHttp(403, 'Esta tentativa pertence a outro usuário.');
  }
  // Confere todos os campos relevantes; uma chave já usada não pode servir a outros dados.
  const igual = campos.every((campo) => {
    // NULL significa ausência de preenchimento: Number(null) seria zero e esconderia uma alteração.
    if (salvo[campo] == null || dados[campo] == null) {
      return salvo[campo] === dados[campo];
    }
    // O driver pode devolver DECIMAL como texto; convertemos apenas valores realmente presentes.
    return typeof dados[campo] === 'number'
      ? Number(salvo[campo]) === dados[campo]
      : salvo[campo] === dados[campo];
  });
  // Reutilizar a chave com dados diferentes geraria uma resposta ambígua; a operação é recusada como conflito.
  if (!igual) {
    throw new ErroHttp(409, 'A chave já foi usada com outros dados.');
  }
  return salvo;
}
