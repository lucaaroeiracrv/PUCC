// Confere persistência, autoria, transições e repetição das operações em MySQL real.
import test from 'node:test';
// Compara valores e erros de forma estrita para que uma conversão automática não esconda uma falha.
import assert from 'node:assert/strict';
// Usa os recursos criptográficos do Node para gerar identificadores e conferir senhas sem guardar texto puro.
import { randomUUID } from 'node:crypto';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { ambiente, dadosTriagem } from './apoio.js';
// Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
test('fluxo completo permanece no mesmo paciente e atendimento', async (t) => {
  const app = await ambiente(t);
  const recepcao = await app.entrar('recepcao');
  const enfermagem = await app.entrar('enfermagem');
  const medico = await app.entrar('medico');
  const atendimento = await app.novoAtendimento(recepcao);
  const id = atendimento.id;
  const triagem = dadosTriagem(id);
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  await t.test('consulta não pode pular a triagem', async () => {
    const r = await app.pedir('/api/consultas', medico, {
      atendimento_id: id,
      registro: 'Exemplo',
      chave_registro: randomUUID(),
    });
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(r.status, 409);
  });
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  await t.test('triagem salva e repete sem duplicação', async () => {
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal((await app.pedir('/api/triagens', enfermagem, triagem)).status, 201);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal((await app.pedir('/api/triagens', enfermagem, triagem)).status, 200);
    // Linhas recuperadas no MySQL; o primeiro registro só é usado quando a consulta encontra algo.
    const [linhas] = await app.banco.execute('SELECT * FROM triagens WHERE atendimento_id=?', [id]);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(linhas.length, 1);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(linhas[0].enfermeiro_id, enfermagem.usuario.id);
  });
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  await t.test('fila médica inclui classificação e paciente correto', async () => {
    const r = await app.pedir('/api/filas/medico', medico);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.ok(r.dados.atendimentos.some((a) => a.id === id && a.classificacao === 'verde'));
  });
  const consulta = {
    atendimento_id: id,
    registro: 'Registro fictício da consulta',
    chave_registro: randomUUID(),
  };
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  await t.test('consulta grava autor e muda a etapa', async () => {
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal((await app.pedir('/api/consultas', medico, consulta)).status, 201);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal((await app.pedir('/api/consultas', medico, consulta)).status, 200);
    const r = await app.pedir(`/api/atendimentos/${id}`, medico);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(r.dados.atendimento.situacao, 'em_atendimento');
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(r.dados.consulta.medico_id, medico.usuario.id);
  });
  const medicacao = {
    atendimento_id: id,
    medicacao: 'Medicação Exemplo Fictícia',
    dose: 'Dose fictícia informada',
    via: 'Via fictícia',
    observacoes: null,
    chave_registro: randomUUID(),
  };
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  await t.test('medicação grava no atendimento e reconhece repetição', async () => {
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal((await app.pedir('/api/medicacoes', enfermagem, medicacao)).status, 201);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal((await app.pedir('/api/medicacoes', enfermagem, medicacao)).status, 200);
    // Linhas recuperadas no MySQL; o primeiro registro só é usado quando a consulta encontra algo.
    const [linhas] = await app.banco.execute('SELECT * FROM medicacoes WHERE atendimento_id=?', [
      id,
    ]);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(linhas.length, 1);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(linhas[0].enfermeiro_id, enfermagem.usuario.id);
  });
  const finalizacao = {
    observacoes: 'Fim da demonstração',
    chave_registro: randomUUID(),
  };
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  await t.test('encerramento confirma situação final e é idempotente', async () => {
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(
      (await app.pedir(`/api/atendimentos/${id}/finalizar`, medico, finalizacao)).status,
      201,
    );
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(
      (await app.pedir(`/api/atendimentos/${id}/finalizar`, medico, finalizacao)).status,
      200,
    );
    const r = await app.pedir(`/api/atendimentos/${id}`, medico);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(r.dados.atendimento.situacao, 'finalizado');
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(r.dados.encerramento.medico_id, medico.usuario.id);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(r.dados.atendimento.paciente_id, atendimento.paciente_id);
  });
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  await t.test('encerrado não recebe novos registros', async () => {
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(
      (
        await app.pedir('/api/medicacoes', enfermagem, {
          ...medicacao,
          chave_registro: randomUUID(),
        })
      ).status,
      409,
    );
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(
      (
        await app.pedir('/api/consultas', medico, {
          ...consulta,
          chave_registro: randomUUID(),
        })
      ).status,
      409,
    );
  });
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  await t.test('novas visitas mantêm os registros anteriores separados', async () => {
    const r = await app.pedir('/api/atendimentos', recepcao, {
      // Referência ao paciente existente que foi escolhido na recepção.
      paciente_id: atendimento.paciente_id,
      chave_abertura: randomUUID(),
    });
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.equal(r.status, 201);
    // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
    assert.notEqual(r.dados.atendimento.id, id);
  });
});
