// Confere as proteções do próprio MySQL, inclusive quando uma escrita não passa pela API.
import test from 'node:test';
// Compara valores e erros de forma estrita para que uma conversão automática não esconda uma falha.
import assert from 'node:assert/strict';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { ambiente, dadosTriagem } from './apoio.js';
// Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
test('banco recusa medidas e textos inválidos e vínculos inexistentes', async (t) => {
  // Prepara um atendimento fictício válido antes de tentar violar cada regra do armazenamento.
  const app = await ambiente(t);
  const recepcao = await app.entrar('recepcao');
  const enfermagem = await app.entrar('enfermagem');
  const medico = await app.entrar('medico');
  const atendimento = await app.novoAtendimento(recepcao);
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(
    (await app.pedir('/api/triagens', enfermagem, dadosTriagem(atendimento.id))).status,
    201,
  );
  const { randomUUID } = await import('node:crypto');
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(
    (
      await app.pedir('/api/consultas', medico, {
        atendimento_id: atendimento.id,
        registro: 'Registro fictício de verificação',
        chave_registro: randomUUID(),
      })
    ).status,
    201,
  );
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(
    (
      await app.pedir('/api/medicacoes', enfermagem, {
        atendimento_id: atendimento.id,
        medicacao: 'Exemplo fictício',
        dose: 'Texto fictício',
        via: 'Texto fictício',
        chave_registro: randomUUID(),
      })
    ).status,
    201,
  );
  // A conexão fica reservada para garantir que todas as tentativas pertençam à mesma transação.
  const conexao = await app.banco.getConnection();
  try {
    // Inicia a transação para que conferências e abertura sejam confirmadas como uma única operação.
    await conexao.beginTransaction();
    // Cada instrução viola uma regra diferente; o erro deve vir da restrição CHECK do MySQL.
    for (const sql of [
      'UPDATE triagens SET saturacao=101 WHERE atendimento_id=?',
      'UPDATE triagens SET temperatura=-1 WHERE atendimento_id=?',
      "UPDATE triagens SET queixa=' ' WHERE atendimento_id=?",
      "UPDATE consultas SET registro=' ' WHERE atendimento_id=?",
      "UPDATE medicacoes SET medicacao=' ' WHERE atendimento_id=?",
      "UPDATE medicacoes SET dose=' ' WHERE atendimento_id=?",
      "UPDATE medicacoes SET via=' ' WHERE atendimento_id=?",
    ]) {
      // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
      await assert.rejects(
        () => conexao.execute(sql, [atendimento.id]),
        (erro) => erro.code === 'ER_CHECK_CONSTRAINT_VIOLATED',
      );
    }
    // Uma referência sem registro correspondente também precisa falhar, por chave estrangeira.
    await assert.rejects(
      () =>
        conexao.execute(
          'UPDATE triagens SET enfermeiro_id=9007199254740990 WHERE atendimento_id=?',
          [atendimento.id],
        ),
      (erro) => erro.code === 'ER_NO_REFERENCED_ROW_2',
    );
  } finally {
    // Mesmo se uma asserção falhar, não deixamos alterações inválidas ou parciais no banco de teste.
    await conexao.rollback();
    // Libera o recurso de conexão para não deixá-lo ocupado após a operação.
    conexao.release();
  }
  // A consulta depois do rollback confirma que o atendimento continua íntegro.
  const salvo = await app.pedir(`/api/atendimentos/${atendimento.id}`, enfermagem);
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(Number(salvo.dados.triagem.saturacao), 98);
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(salvo.dados.consulta.registro, 'Registro fictício de verificação');
});
