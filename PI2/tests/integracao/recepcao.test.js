// Os testes de recepção criam somente registros fictícios no banco marcado como teste.
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { ambiente } from './apoio.js';

test('cadastro, busca e abertura preservam os dados da recepção', async (t) => {
  const app = await ambiente(t);
  const auth = await app.entrar('recepcao');
  const documento = 'QA-' + randomUUID();
  const dados = {
    nome: 'Paciente <b>Teste</b>',
    data_nascimento: '2000-01-01',
    documento,
    telefone: null,
    chave_cadastro: randomUUID(),
  };
  const criado = await app.pedir('/api/pacientes', auth, dados);
  assert.equal(criado.status, 201);
  const paciente = criado.dados.paciente;
  await t.test('repetição de cadastro e documento duplicado', async () => {
    assert.equal((await app.pedir('/api/pacientes', auth, dados)).status, 200);
    assert.equal(
      (await app.pedir('/api/pacientes', auth, { ...dados, chave_cadastro: randomUUID() })).status,
      409,
    );
  });
  await t.test('busca literal e lista vazia', async () => {
    const r = await app.pedir('/api/pacientes?busca=' + encodeURIComponent(documento), auth);
    assert.equal(r.dados.pacientes[0].id, paciente.id);
    assert.deepEqual(
      (await app.pedir('/api/pacientes?busca=' + encodeURIComponent("' OR 1=1 --"), auth)).dados
        .pacientes,
      [],
    );
  });
  await t.test('campos obrigatórios são conferidos no backend', async () => {
    assert.equal(
      (
        await app.pedir('/api/pacientes', auth, {
          ...dados,
          nome: ' ',
          chave_cadastro: randomUUID(),
        })
      ).status,
      400,
    );
  });
  await t.test('aberturas concorrentes não duplicam atendimento ativo', async () => {
    const respostas = await Promise.all(
      [1, 2].map(() =>
        app.pedir('/api/atendimentos', auth, {
          paciente_id: paciente.id,
          chave_abertura: randomUUID(),
        }),
      ),
    );
    assert.deepEqual(respostas.map((r) => r.status).sort(), [201, 409]);
  });
});

// Duas pessoas diferentes não devem disputar o intervalo vazio do índice de tentativas.
test('aberturas de pacientes diferentes não provocam bloqueio circular', async (t) => {
  const app = await ambiente(t);
  const recepcao = await app.entrar('recepcao');
  const pacientes = [];
  // Cada cadastro representa outra pessoa fictícia; somente a abertura será simultânea.
  for (let i = 0; i < 2; i += 1) {
    const resposta = await app.pedir('/api/pacientes', recepcao, {
      nome: 'Paciente Concorrência ' + randomUUID(),
      data_nascimento: '2000-01-01',
      chave_cadastro: randomUUID(),
    });
    assert.equal(resposta.status, 201);
    pacientes.push(resposta.dados.paciente.id);
  }
  // A barreira mantém as duas operações depois da leitura e antes de inserir: reproduz a disputa.
  let aguardando = 0;
  let liberar;
  const barreira = new Promise((resolve) => {
    liberar = resolve;
  });
  const observado = {
    async getConnection() {
      const conexao = await app.banco.getConnection();
      // Delega ao MySQL real, acrescentando apenas o ponto de sincronização do teste.
      return {
        beginTransaction: () => conexao.beginTransaction(),
        query: (...args) => conexao.query(...args),
        commit: () => conexao.commit(),
        rollback: () => conexao.rollback(),
        release: () => conexao.release(),
        async execute(sql, valores) {
          if (sql.startsWith('INSERT INTO atendimentos')) {
            aguardando += 1;
            if (aguardando === 2) liberar();
            await barreira;
          }
          return conexao.execute(sql, valores);
        },
      };
    },
  };
  // Chaves consecutivas acima das chaves aleatórias usam o mesmo intervalo do índice no cenário antigo.
  const instante = BigInt(Date.now());
  const { abrirAtendimento } = await import('../../src/atendimentos/abertura.js');
  const resultados = await Promise.allSettled(
    pacientes.map((id, i) =>
      abrirAtendimento(observado, recepcao.usuario, {
        paciente_id: id,
        chave_abertura:
          'ffffffff-ffff-4fff-8fff-' + (instante + BigInt(i)).toString(16).padStart(12, '0'),
      }),
    ),
  );
  // As duas visitas precisam ser criadas; erro de deadlock não é um conflito entre esses pacientes.
  assert.equal(
    resultados.filter((resultado) => resultado.status === 'fulfilled' && resultado.value.criado)
      .length,
    2,
  );
});
