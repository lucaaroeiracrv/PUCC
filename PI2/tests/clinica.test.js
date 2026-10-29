// Regras de formato são testadas sem depender do MySQL ou de dados reais de pacientes.
import test from 'node:test';
// Compara valores e erros de forma estrita para que uma conversão automática não esconda uma falha.
import assert from 'node:assert/strict';
// Usa os recursos criptográficos do Node para gerar identificadores e conferir senhas sem guardar texto puro.
import { randomUUID } from 'node:crypto';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { validarTriagem } from '../src/triagem/registro.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { validarClassificacao } from '../src/triagem/classificacao.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { texto, medida, validarId } from '../src/shared/dominio.js';

// Cada cenário recebe uma tentativa independente com informações exclusivamente fictícias.
const exemplo = () => ({
  atendimento_id: 1,
  queixa: 'Exemplo acadêmico',
  temperatura: '37.00',
  frequencia: '80',
  saturacao: '98',
  classificacao: 'verde',
  chave_registro: randomUUID(),
});
// Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
test('normaliza os formatos da triagem sem calcular classificação', () => {
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  const dados = validarTriagem(exemplo());
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(dados.temperatura, 37);
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(dados.classificacao, 'verde');
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(dados.pressao, null);
});
// Reutiliza a mesma conferência em diferentes entradas inválidas, identificando cada cenário pelo nome.
for (const [nome, ajuste] of [
  [
    'queixa vazia',
    {
      queixa: '',
    },
  ],
  [
    'classificação desconhecida',
    {
      classificacao: 'automatica',
    },
  ],
  [
    'ID textual',
    {
      atendimento_id: '1',
    },
  ],
  [
    'saturação fora do formato percentual',
    {
      saturacao: 101,
    },
  ],
  [
    'frequência fracionada',
    {
      frequencia: '80.5',
    },
  ],
  [
    'número booleano',
    {
      temperatura: true,
    },
  ],
  [
    'chave inválida',
    {
      chave_registro: 'x',
    },
  ],
  [
    'pressão longa',
    {
      pressao: 'x'.repeat(16),
    },
  ],
]) {
  // Confere que o caso inválido é recusado com a regra esperada, e não aceito silenciosamente.
  test(`recusa ${nome}`, () => {
    // Confere que o caso inválido é recusado com a regra esperada, e não aceito silenciosamente.
    assert.throws(
      () =>
        validarTriagem({
          ...exemplo(),
          ...ajuste,
        }),
      (erro) => erro.status === 400,
    );
  });
}
// Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
test('campos opcionais vazios permanecem NULL', () => {
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(texto(' ', 'observações', 2000, false), null);
  // Confere o resultado esperado deste cenário, incluindo seu tipo para não esconder diferenças de valor.
  assert.equal(medida('', 'temperatura', 99.99), null);
});
// Confere que o caso inválido é recusado com a regra esperada, e não aceito silenciosamente.
test('IDs, textos e classificação seguem limites explícitos', () => {
  // Confere que o caso inválido é recusado com a regra esperada, e não aceito silenciosamente.
  assert.throws(() => validarId(0));
  // Confere que o caso inválido é recusado com a regra esperada, e não aceito silenciosamente.
  assert.throws(() => texto('x'.repeat(81), 'dose', 80));
  // Confere que o caso inválido é recusado com a regra esperada, e não aceito silenciosamente.
  assert.throws(() => validarClassificacao(null));
});
