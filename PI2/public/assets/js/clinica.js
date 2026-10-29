// Fila e resumo são compartilhados pela triagem, consulta, medicações e encerramento.
import { pedir } from './api.js';
// Cada seleção substitui o pedido anterior, que não pode reapresentar outro paciente.
let pedidoResumo = null;
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function carregarFila(tipo, seletor = document.querySelector('#atendimento')) {
  // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
  const resultado = await pedir(`/api/filas/${encodeURIComponent(tipo)}`);
  // Uma lista vazia é um estado normal e não deve parecer uma falha de conexão.
  seletor.replaceChildren(
    new Option(
      resultado.atendimentos.length ? 'Selecione um atendimento' : 'Nenhum atendimento nesta fila',
      '',
    ),
  );
  // Processa cada elemento de forma independente para preservar a relação entre os dados da mesma iteração.
  for (const atendimento of resultado.atendimentos) {
    // Option interpreta a identificação como texto, sem criar marcação com o nome do paciente.
    seletor.append(
      new Option(
        `${atendimento.id} — ${atendimento.paciente_nome} (${atendimento.situacao})`,
        String(atendimento.id),
      ),
    );
  }
  return resultado.atendimentos;
}
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function mostrarResumo(id) {
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  pedidoResumo?.abort();
  const controlador = new AbortController();
  pedidoResumo = controlador;
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  let dados;
  try {
    dados = await pedir(`/api/atendimentos/${id}`, {
      sinal: controlador.signal,
    });
  } catch (erro) {
    if (erro.name === 'AbortError') {
      return null;
    }
    // Mantém a falha original para que o tratamento central registre a causa e encerre a operação.
    throw erro;
  }
  if (pedidoResumo !== controlador) {
    return null;
  }
  const destino = document.querySelector('#resumo');
  // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
  destino.replaceChildren();
  // Os detalhes são sempre ligados ao atendimento selecionado, não ao nome digitado.
  const titulo = document.createElement('h2');
  // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
  titulo.textContent = `${dados.atendimento.paciente_nome} — Atendimento ${dados.atendimento.id}`;
  // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
  destino.append(titulo);
  const informacoes = [
    ['Situação', dados.atendimento.situacao],
    ['Queixa', dados.triagem?.queixa],
    ['Classificação informada', dados.triagem?.classificacao],
    ['Triagem registrada por', dados.triagem?.profissional],
    ['Consulta', dados.consulta?.registro],
    ['Consulta registrada por', dados.consulta?.profissional],
  ];
  // Processa cada elemento de forma independente para preservar a relação entre os dados da mesma iteração.
  for (const [rotulo, valor] of informacoes) {
    if (valor == null) {
      continue;
    }
    const paragrafo = document.createElement('p');
    const nome = document.createElement('strong');
    // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
    nome.textContent = `${rotulo}: `;
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    paragrafo.append(nome, document.createTextNode(String(valor)));
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    destino.append(paragrafo);
  }
  // Medicações e encerramento passam a aparecer quando seus módulos forem incorporados.
  for (const item of dados.medicacoes || []) {
    const paragrafo = document.createElement('p');
    // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
    paragrafo.textContent = `Medicação: ${item.medicacao}; dose informada: ${item.dose}; via: ${item.via}; registro: ${item.profissional}.`;
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    destino.append(paragrafo);
  }
  // Recusa este formato de entrada antes da gravação, evitando aceitar um dado que a interface sozinha não garante.
  if (dados.encerramento) {
    const paragrafo = document.createElement('p');
    // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
    paragrafo.textContent = `Encerrado por ${dados.encerramento.profissional}. ${dados.encerramento.observacoes || ''}`;
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    destino.append(paragrafo);
  }
  // Ajusta a área visível conforme o estado da sessão; a proteção definitiva continua no backend.
  destino.hidden = false;
  return dados;
}

// Uma seleção vazia também invalida a leitura pendente do atendimento anterior.
export function limparResumo() {
  pedidoResumo?.abort();
  pedidoResumo = null;
  const destino = document.querySelector('#resumo');
  // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
  destino.replaceChildren();
  // Ajusta a área visível conforme o estado da sessão; a proteção definitiva continua no backend.
  destino.hidden = true;
}
