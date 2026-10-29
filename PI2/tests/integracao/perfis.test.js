// Os mesmos pedidos são enviados diretamente às APIs para não depender de botões escondidos.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { ambiente } from './apoio.js';

test('as permissões são aplicadas no servidor', async (t) => {
  const app = await ambiente(t);
  const recepcao = await app.entrar('recepcao');
  const enfermagem = await app.entrar('enfermagem');
  const medico = await app.entrar('medico');
  await t.test('sem sessão não consulta fila ou dados', async () => {
    assert.equal((await app.pedir('/api/filas/triagem')).status, 401);
    assert.equal((await app.pedir('/api/atendimentos/1')).status, 401);
  });
  await t.test('cada perfil acessa somente sua fila', async () => {
    assert.equal((await app.pedir('/api/filas/medico', enfermagem)).status, 403);
    assert.equal((await app.pedir('/api/filas/triagem', medico)).status, 403);
    assert.equal((await app.pedir('/api/filas/triagem', recepcao)).status, 403);
  });
  await t.test('perfil diferente não grava nas rotas clínicas', async () => {
    for (const [auth, rota] of [
      [recepcao, '/api/triagens'],
      [recepcao, '/api/consultas'],
      [medico, '/api/medicacoes'],
      [enfermagem, '/api/consultas'],
      [enfermagem, '/api/atendimentos/1/finalizar'],
    ]) {
      assert.equal((await app.pedir(rota, auth, { chave_registro: randomUUID() })).status, 403);
    }
  });
  await t.test('cookie sem token de envio não autoriza gravação', async () => {
    assert.equal(
      (await app.pedir('/api/triagens', { cookie: enfermagem.cookie }, { atendimento_id: 1 }))
        .status,
      403,
    );
  });
  await t.test('senha inválida e saída são tratadas', async () => {
    assert.equal(
      (await app.pedir('/api/login', {}, { login: 'recepcao', senha: 'incorreta' })).status,
      401,
    );
    assert.equal((await app.pedir('/api/logout', recepcao, {})).status, 200);
    assert.equal((await app.pedir('/api/sessao', recepcao)).status, 401);
  });
});
