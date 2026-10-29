// Confere a classificação informada e o relacionamento da triagem com a visita correta.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { ambiente, dadosTriagem } from './apoio.js';

test('triagem recusa entradas inválidas e não modifica outro atendimento', async (t) => {
  const app = await ambiente(t);
  const recepcao = await app.entrar('recepcao');
  const enfermagem = await app.entrar('enfermagem');
  const primeiro = await app.novoAtendimento(recepcao);
  const segundo = await app.novoAtendimento(recepcao);
  const dados = dadosTriagem(primeiro.id);
  await t.test('classificação desconhecida não é salva', async () => {
    assert.equal(
      (await app.pedir('/api/triagens', enfermagem, { ...dados, classificacao: 'inventada' }))
        .status,
      400,
    );
    const [linhas] = await app.banco.execute(
      'SELECT COUNT(*) AS n FROM triagens WHERE atendimento_id=?',
      [primeiro.id],
    );
    assert.equal(linhas[0].n, 0);
  });
  await t.test('dados e identidade permanecem no primeiro atendimento', async () => {
    assert.equal(
      (await app.pedir('/api/triagens', enfermagem, { ...dados, enfermeiro_id: 999999 })).status,
      201,
    );
    const r = await app.pedir(`/api/atendimentos/${segundo.id}`, enfermagem);
    assert.equal(r.dados.triagem, null);
    const salvo = await app.pedir(`/api/atendimentos/${primeiro.id}`, enfermagem);
    assert.equal(salvo.dados.triagem.enfermeiro_id, enfermagem.usuario.id);
  });
  await t.test('chave reutilizada com outros dados é conflito', async () => {
    assert.equal(
      (await app.pedir('/api/triagens', enfermagem, { ...dados, queixa: 'Outro conteúdo' })).status,
      409,
    );
  });
  await t.test('triagem antiga sem classificação pode ser completada', async () => {
    await app.banco.execute(
      'INSERT INTO triagens (atendimento_id,enfermeiro_id,queixa,chave_registro) VALUES (?,?,?,?)',
      [segundo.id, enfermagem.usuario.id, 'Exemplo anterior', randomUUID()],
    );
    assert.equal(
      (
        await app.pedir('/api/triagens/classificacao', enfermagem, {
          atendimento_id: segundo.id,
          classificacao: 'azul',
        })
      ).status,
      200,
    );
    const r = await app.pedir(`/api/atendimentos/${segundo.id}`, enfermagem);
    assert.equal(r.dados.atendimento.situacao, 'aguardando_medico');
    assert.equal(r.dados.triagem.classificacao, 'azul');
  });
});

// Reproduz o conflito entre ausência de medida e o número zero numa mesma tentativa.
test('repetição distingue temperatura não informada de temperatura zero', async (t) => {
  // O ambiente usa um banco isolado e usuários fictícios com permissões reais da aplicação.
  const app = await ambiente(t);
  const recepcao = await app.entrar('recepcao');
  const enfermagem = await app.entrar('enfermagem');
  const atendimento = await app.novoAtendimento(recepcao);
  // A chave permanece a mesma: somente uma repetição com conteúdo idêntico é aceita.
  const dados = { ...dadosTriagem(atendimento.id), temperatura: null };
  assert.equal((await app.pedir('/api/triagens', enfermagem, dados)).status, 201);
  assert.equal((await app.pedir('/api/triagens', enfermagem, dados)).status, 200);
  // Zero é um valor informado; não representa o NULL salvo na primeira operação.
  assert.equal(
    (await app.pedir('/api/triagens', enfermagem, { ...dados, temperatura: 0 })).status,
    409,
  );
  // A tentativa recusada preserva a informação original no atendimento.
  const salvo = await app.pedir(`/api/atendimentos/${atendimento.id}`, enfermagem);
  assert.equal(salvo.dados.triagem.temperatura, null);
});
