// A lista médica e o registro de consulta evoluem neste mesmo módulo.
import { exigirAcesso, mostrarMensagem, aoEnviar, pedir, celula, prepararRascunho } from './api.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { mostrarResumo } from './clinica.js';
let atendimentoId = null;
// Identificador normalizado da abertura para reconhecer uma repetição do mesmo pedido.
let chave = crypto.randomUUID();
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
async function selecionar(id) {
  atendimentoId = null;
  const formulario = document.querySelector('#form-consulta');
  // Bloqueia outro envio enquanto a operação atual aguarda o backend.
  formulario.querySelector('fieldset').disabled = true;
  // Remove os valores do formulário para não reapresentar dados de uma tentativa anterior.
  formulario.reset();
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  const dados = await mostrarResumo(id);
  if (!dados) {
    return;
  }
  atendimentoId = id;
  chave = crypto.randomUUID();
  // Uma consulta já salva é apresentada para leitura, sem sobrescrever seu autor ou texto.
  formulario.elements.registro.value = dados.consulta?.registro || '';
  // Libera o controle novamente, inclusive quando o pedido terminou com erro.
  formulario.querySelector('fieldset').disabled =
    Boolean(dados.consulta) || dados.atendimento.situacao !== 'aguardando_medico';
}
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
async function atualizar() {
  // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
  const resultado = await pedir('/api/filas/medico');
  const corpo = document.querySelector('#fila-pacientes');
  // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
  corpo.replaceChildren();
  // Ajusta a área visível conforme o estado da sessão; a proteção definitiva continua no backend.
  document.querySelector('#fila-vazia').hidden = resultado.atendimentos.length > 0;
  // Processa cada elemento de forma independente para preservar a relação entre os dados da mesma iteração.
  for (const atendimento of resultado.atendimentos) {
    // Elemento de tabela criado para o paciente atual, sem montar HTML com texto digitado.
    const linha = document.createElement('tr');
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    linha.append(
      celula(atendimento.id),
      celula(atendimento.paciente_nome),
      celula(atendimento.classificacao),
      celula(atendimento.situacao),
    );
    const acao = document.createElement('td');
    // Controle da ação atual; fica temporariamente desativado para não reenviar durante a espera.
    const botao = document.createElement('button');
    botao.type = 'button';
    // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
    botao.textContent = 'Abrir consulta';
    // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
    botao.addEventListener('click', () =>
      selecionar(atendimento.id).catch((erro) => mostrarMensagem(erro.message, true)),
    );
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    acao.append(botao);
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    linha.append(acao);
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    corpo.append(linha);
  }
}
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
async function iniciar() {
  if (prepararRascunho()) {
    return;
  }
  await exigirAcesso(['medico']);
  await atualizar();
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  document
    .querySelector('#atualizar')
    .addEventListener('click', () =>
      atualizar().catch((erro) => mostrarMensagem(erro.message, true)),
    );
  const formulario = document.querySelector('#form-consulta');
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  formulario.addEventListener('input', () => {
    chave = crypto.randomUUID();
  });
  // Reutiliza o tratamento de formulário, incluindo espera, erro e liberação do botão.
  aoEnviar(formulario, async (dados) => {
    await pedir('/api/consultas', {
      // Método HTTP que separa leitura e envio de dados.
      method: 'POST',
      dados: {
        ...dados,
        atendimento_id: atendimentoId,
        chave_registro: chave,
      },
    });
    await selecionar(atendimentoId);
    await atualizar();
    mostrarMensagem('Consulta salva no atendimento.');
  });
}
iniciar().catch((erro) => mostrarMensagem(erro.message, true));
