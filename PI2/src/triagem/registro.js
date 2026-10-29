// A triagem permanece ligada ao atendimento selecionado e à identidade da enfermagem.
import { ErroHttp } from '../http/respostas.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import {
  validarId,
  texto,
  medida,
  validarChave,
  comTransacao,
  bloquearAtendimento,
  repeticao,
} from '../shared/dominio.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { validarClassificacao } from './classificacao.js';
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export function validarTriagem(dados) {
  return {
    atendimento_id: validarId(dados.atendimento_id),
    queixa: texto(dados.queixa, 'queixa principal', 2000),
    pressao: texto(dados.pressao, 'pressão arterial', 15, false),
    temperatura: medida(dados.temperatura, 'temperatura', 99.99),
    frequencia: medida(dados.frequencia, 'frequência cardíaca', 65535, true),
    saturacao: medida(dados.saturacao, 'saturação', 100),
    chave_registro: validarChave(dados.chave_registro),
    classificacao: validarClassificacao(dados.classificacao),
  };
}
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function salvarTriagem(banco, usuario, corpo) {
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  const dados = validarTriagem(corpo);
  // Informa a criação nova e devolve o identificador persistido para a próxima ação na interface.
  return comTransacao(banco, async (conexao) => {
    const atendimento = await bloquearAtendimento(conexao, dados.atendimento_id);
    // Uma repetição correta não cria outro registro, mesmo se o fluxo já avançou.
    const salvo = await repeticao(conexao, 'triagens', usuario, dados, Object.keys(dados));
    if (salvo) {
      // Reconhece a repetição como sucesso do registro existente, sem gravar outra cópia.
      return {
        // Permite distinguir uma criação nova de uma repetição reconhecida.
        criado: false,
        triagem: salvo,
      };
    }
    if (atendimento.situacao !== 'aguardando_triagem') {
      throw new ErroHttp(409, 'Este atendimento não está aguardando triagem.');
    }
    const [existentes] = await conexao.execute('SELECT id FROM triagens WHERE atendimento_id = ?', [
      dados.atendimento_id,
    ]);
    if (existentes.length) {
      throw new ErroHttp(409, 'A triagem já existe. Confira a classificação pendente.');
    }
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const [resultado] = await conexao.execute(
      'INSERT INTO triagens (atendimento_id, enfermeiro_id, queixa, pressao, temperatura, frequencia, saturacao, chave_registro , classificacao) VALUES (?, ?, ?, ?, ?, ?, ?, ? , ?)',
      [
        dados.atendimento_id,
        usuario.id,
        dados.queixa,
        dados.pressao,
        dados.temperatura,
        dados.frequencia,
        dados.saturacao,
        dados.chave_registro,
        dados.classificacao,
      ],
    );
    // Aguarda a operação do banco; consultas de formulário usam valores separados do texto SQL.
    await conexao.execute("UPDATE atendimentos SET situacao = 'aguardando_medico' WHERE id = ?", [
      dados.atendimento_id,
    ]);
    // Informa a criação nova e devolve o identificador persistido para a próxima ação na interface.
    return {
      // Permite distinguir uma criação nova de uma repetição reconhecida.
      criado: true,
      triagem: {
        // Identificador persistido usado para relacionar registros sem depender de nomes.
        id: resultado.insertId,
        ...dados,
        enfermeiro_id: usuario.id,
      },
    };
  });
}
