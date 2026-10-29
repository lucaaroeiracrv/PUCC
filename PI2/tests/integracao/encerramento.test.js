// As verificações exercitam conflitos sem apagar registros de outros cenários.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { ambiente, dadosTriagem } from './apoio.js';

test('medicações e encerramento respeitam a etapa e a repetição', async (t) => {
  const app = await ambiente(t);
  const recepcao = await app.entrar('recepcao');
  const enfermagem = await app.entrar('enfermagem');
  const medico = await app.entrar('medico');
  const atendimento = await app.novoAtendimento(recepcao);
  const med = {
    atendimento_id: atendimento.id,
    medicacao: 'Exemplo fictício',
    dose: 'Texto de teste',
    via: 'Texto de teste',
    chave_registro: randomUUID(),
  };
  await t.test('não registra medicação antes da consulta', async () => {
    assert.equal((await app.pedir('/api/medicacoes', enfermagem, med)).status, 409);
  });
  await app.pedir('/api/triagens', enfermagem, dadosTriagem(atendimento.id));
  await app.pedir('/api/consultas', medico, {
    atendimento_id: atendimento.id,
    registro: 'Consulta fictícia',
    chave_registro: randomUUID(),
  });
  await t.test('mesma chave de medicação não aceita outra dose', async () => {
    assert.equal((await app.pedir('/api/medicacoes', enfermagem, med)).status, 201);
    assert.equal(
      (await app.pedir('/api/medicacoes', enfermagem, { ...med, dose: 'Outra dose fictícia' }))
        .status,
      409,
    );
  });
  await t.test('encerramento não pode finalizar outro atendimento por um ID no corpo', async () => {
    const outro = await app.novoAtendimento(recepcao);
    const r = await app.pedir(`/api/atendimentos/${atendimento.id}/finalizar`, medico, {
      atendimento_id: outro.id,
      chave_registro: randomUUID(),
    });
    assert.equal(r.status, 201);
    const [linhas] = await app.banco.execute('SELECT situacao FROM atendimentos WHERE id=?', [
      outro.id,
    ]);
    assert.equal(linhas[0].situacao, 'aguardando_triagem');
  });
  await t.test('novas tentativas após finalizar são recusadas', async () => {
    assert.equal(
      (await app.pedir('/api/medicacoes', enfermagem, { ...med, chave_registro: randomUUID() }))
        .status,
      409,
    );
    assert.equal(
      (
        await app.pedir(`/api/atendimentos/${atendimento.id}/finalizar`, medico, {
          chave_registro: randomUUID(),
        })
      ).status,
      409,
    );
  });
});
