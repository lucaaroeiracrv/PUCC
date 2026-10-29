// A mesma tela apresenta o formulário e o resultado recuperado do MySQL.
import { exigirAcesso, mostrarMensagem, aoEnviar, pedir, prepararRascunho } from './api.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { carregarFila, mostrarResumo, limparResumo } from './clinica.js';
// Identificador normalizado da abertura para reconhecer uma repetição do mesmo pedido.
let chave = crypto.randomUUID();
let resumoAtual = null;
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
async function selecionar() {
  const id = Number(document.querySelector('#atendimento').value);
  const formulario = document.querySelector('#form-triagem');
  // Remove os valores do formulário para não reapresentar dados de uma tentativa anterior.
  formulario.reset();
  // Bloqueia outro envio enquanto a operação atual aguarda o backend.
  formulario.querySelector('fieldset').disabled = true;
  chave = crypto.randomUUID();
  if (!id) {
    resumoAtual = null;
    limparResumo();
    return;
  }
  const recebido = await mostrarResumo(id);
  if (!recebido || Number(document.querySelector('#atendimento').value) !== id) {
    return;
  }
  resumoAtual = recebido;
  // Uma triagem ainda sem classificação mantém seus dados e permite completar só essa etapa.
  const salvo = resumoAtual.triagem;
  // Processa cada elemento de forma independente para preservar a relação entre os dados da mesma iteração.
  for (const controle of formulario.querySelectorAll('[name]')) {
    controle.value = salvo?.[controle.name] ?? '';
    // Libera o controle novamente, inclusive quando o pedido terminou com erro.
    controle.disabled = Boolean(salvo) && controle.name !== 'classificacao';
  }
  // Libera o controle novamente, inclusive quando o pedido terminou com erro.
  formulario.querySelector('fieldset').disabled = Boolean(salvo?.classificacao);
}
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
async function iniciar() {
  if (prepararRascunho()) {
    return;
  }
  await exigirAcesso(['enfermagem']);
  await carregarFila('triagem');
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  document
    .querySelector('#atendimento')
    .addEventListener('change', () =>
      selecionar().catch((erro) => mostrarMensagem(erro.message, true)),
    );
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  document.querySelector('#atualizar').addEventListener('click', async () => {
    try {
      await carregarFila('triagem');
      await selecionar();
    } catch (erro) {
      mostrarMensagem(erro.message, true);
    }
  });
  const formulario = document.querySelector('#form-triagem');
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  formulario.addEventListener('input', () => {
    chave = crypto.randomUUID();
  });
  // Reutiliza o tratamento de formulário, incluindo espera, erro e liberação do botão.
  aoEnviar(formulario, async (dados) => {
    const id = Number(document.querySelector('#atendimento').value);
    // O endpoint separado conserva as triagens criadas na etapa anterior à classificação.
    if (resumoAtual?.triagem && !resumoAtual.triagem.classificacao) {
      await pedir('/api/triagens/classificacao', {
        // Método HTTP que separa leitura e envio de dados.
        method: 'POST',
        dados: {
          atendimento_id: id,
          classificacao: dados.classificacao,
        },
      });
    } else {
      await pedir('/api/triagens', {
        // Método HTTP que separa leitura e envio de dados.
        method: 'POST',
        dados: {
          ...dados,
          atendimento_id: id,
          chave_registro: chave,
        },
      });
    }
    // A confirmação usa dados relidos do banco, não apenas os valores que estavam no formulário.
    await selecionar();
    mostrarMensagem('Triagem salva. Atendimento disponível para a consulta médica.');
  });
}
iniciar().catch((erro) => mostrarMensagem(erro.message, true));
