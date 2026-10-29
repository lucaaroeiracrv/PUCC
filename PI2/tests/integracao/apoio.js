// Os testes integrados só podem gravar em um banco explicitamente separado para testes.
import assert from 'node:assert/strict';
// Usa os recursos criptográficos do Node para gerar identificadores e conferir senhas sem guardar texto puro.
import { randomUUID } from 'node:crypto';
// Reutiliza a configuração do banco para manter scripts e servidor conectados ao mesmo ambiente.
import { criarPool } from '../../src/config/banco.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { criarServidor } from '../../src/servidor.js';
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function ambiente(t) {
  if (!process.env.DB_NAME?.endsWith('_teste')) {
    throw new Error('Use um banco com DB_NAME terminando em _teste para executar a integração.');
  }
  // Acesso compartilhado ao MySQL, usado pelas funções que consultam e gravam dados.
  const banco = criarPool();
  // Instância HTTP que só começa a receber pedidos depois de listen.
  const servidor = await criarServidor(banco);
  // Só agora ocupa a porta configurada e passa a receber os pedidos do navegador.
  await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  // O encerramento acontece mesmo se alguma asserção falhar durante o teste.
  t.after(async () => {
    await new Promise((resolve) => servidor.close(resolve));
    // Libera o recurso de conexão para não deixá-lo ocupado após a operação.
    await banco.end();
  });
  // Centraliza pedidos ao backend, enviando o cookie da sessão e o token dos envios autenticados.
  async function pedir(caminho, auth = {}, dados) {
    const resposta = await fetch(base + caminho, {
      // Método HTTP que separa leitura e envio de dados.
      method: dados ? 'POST' : 'GET',
      // Cabeçalhos transportam o tipo dos dados e a proteção da sessão.
      headers: {
        ...(auth.cookie
          ? {
              Cookie: auth.cookie,
            }
          : {}),
        ...(auth.csrf
          ? {
              'X-CSRF-Token': auth.csrf,
            }
          : {}),
        ...(dados
          ? {
              // Informa ao navegador o formato e a codificação da resposta.
              'Content-Type': 'application/json',
            }
          : {}),
      },
      ...(dados
        ? {
            // Converte os campos em JSON para o backend conferir e processar.
            body: JSON.stringify(dados),
          }
        : {}),
    });
    // Entrega o JSON ao formulário somente depois de conferir o status HTTP.
    return {
      status: resposta.status,
      // Cabeçalhos transportam o tipo dos dados e a proteção da sessão.
      headers: resposta.headers,
      dados: await resposta.json(),
    };
  }
  // Confere as credenciais no banco e cria uma identidade de sessão sem devolver o hash da senha.
  async function entrar(perfil) {
    const resposta = await pedir(
      '/api/login',
      {},
      {
        // Identificador da conta, conferido contra o banco.
        login: perfil,
        senha: 'Pi2@2026!',
      },
    );
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(resposta.status, 200);
    // Devolve os campos públicos e os dados da sessão, preservando o hash apenas no servidor.
    return {
      cookie: resposta.headers.get('set-cookie').split(';')[0],
      // Token adicional exigido em pedidos autenticados que alteram dados.
      csrf: resposta.dados.csrf,
      // Devolve somente a identidade necessária à interface, sem senha ou hash.
      usuario: resposta.dados.usuario,
    };
  }
  // Isola esta rotina para que os demais trechos reutilizem a mesma regra.
  async function novoAtendimento(recepcao) {
    const cadastro = await pedir('/api/pacientes', recepcao, {
      // Texto de apresentação; não é usado para conceder permissões.
      nome: 'Paciente Teste ' + randomUUID(),
      // Data ISO já conferida no calendário; o banco a armazena em uma coluna DATE.
      data_nascimento: '2000-01-01',
      // Valor opcional normalizado ou NULL; a unicidade só é aplicada quando há documento.
      documento: null,
      // Contato opcional guardado como texto, sem perder sinais e zeros iniciais.
      telefone: null,
      // Identifica a tentativa e não o paciente; uma edição posterior recebe outra chave.
      chave_cadastro: randomUUID(),
    });
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(cadastro.status, 201);
    const abertura = await pedir('/api/atendimentos', recepcao, {
      // Referência ao paciente existente que foi escolhido na recepção.
      paciente_id: cadastro.dados.paciente.id,
      chave_abertura: randomUUID(),
    });
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(abertura.status, 201);
    return abertura.dados.atendimento;
  }
  return {
    banco,
    base,
    pedir,
    entrar,
    novoAtendimento,
  };
}

// A classificação é informada no cenário; os testes não definem critérios clínicos.
export function dadosTriagem(id) {
  return {
    atendimento_id: id,
    queixa: 'Queixa fictícia para teste',
    pressao: '120/80',
    temperatura: '37',
    frequencia: '80',
    saturacao: '98',
    classificacao: 'verde',
    chave_registro: randomUUID(),
  };
}
