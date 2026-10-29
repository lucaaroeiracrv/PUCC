// O mesmo resumo serve à enfermagem e ao médico; cada formulário aparece só para seu perfil.
import { exigirAcesso, mostrarMensagem, aoEnviar, pedir, prepararRascunho } from './api.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { carregarFila, mostrarResumo, limparResumo } from './clinica.js';
// Usuário encontrado na base; somente os campos públicos seguem para o navegador.
let usuario;
// Identificador normalizado da abertura para reconhecer uma repetição do mesmo pedido.
let chave = crypto.randomUUID();
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
async function selecionar() {
  const id = Number(document.querySelector('#atendimento').value);
  // Aplica o mesmo comportamento aos controles relacionados sem copiar o código para cada elemento.
  document.querySelectorAll('fieldset').forEach((item) => {
    // Bloqueia outro envio enquanto a operação atual aguarda o backend.
    item.disabled = true;
  });
  if (!id) {
    limparResumo();
    return;
  }
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  const dados = await mostrarResumo(id);
  if (!dados) {
    return;
  }
  chave = crypto.randomUUID();
  // Uma finalização lida do banco bloqueia novos registros na interface e no backend.
  document.querySelectorAll('fieldset').forEach((item) => {
    // Libera o controle novamente, inclusive quando o pedido terminou com erro.
    item.disabled = dados.atendimento.situacao !== 'em_atendimento';
  });
}
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
async function iniciar() {
  if (prepararRascunho()) {
    return;
  }
  usuario = await exigirAcesso(['enfermagem', 'medico']);
  const enfermagem = usuario.perfil === 'enfermagem';
  // Ajusta a área visível conforme o estado da sessão; a proteção definitiva continua no backend.
  document.querySelector('#medicacoes').hidden = !enfermagem;
  // Ajusta a área visível conforme o estado da sessão; a proteção definitiva continua no backend.
  document.querySelector('#encerramento').hidden = enfermagem;
  const fila = enfermagem ? 'medicacoes' : 'encerramento';
  await carregarFila(fila);
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  document
    .querySelector('#atendimento')
    .addEventListener('change', () =>
      selecionar().catch((erro) => mostrarMensagem(erro.message, true)),
    );
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  document.querySelector('#atualizar').addEventListener('click', async () => {
    try {
      await carregarFila(fila);
      await selecionar();
    } catch (erro) {
      mostrarMensagem(erro.message, true);
    }
  });
  const formulario = document.querySelector(enfermagem ? '#form-medicacao' : '#form-encerramento');
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  formulario.addEventListener('input', () => {
    chave = crypto.randomUUID();
  });
  // Remove os valores do formulário para não reapresentar dados de uma tentativa anterior.
  aoEnviar(formulario, async (dados, form) => {
    const id = Number(document.querySelector('#atendimento').value);
    // Endereço resolvido no disco; a conferência do prefixo impede sair da pasta pública.
    const caminho = enfermagem ? '/api/medicacoes' : `/api/atendimentos/${id}/finalizar`;
    await pedir(caminho, {
      // Método HTTP que separa leitura e envio de dados.
      method: 'POST',
      dados: {
        ...dados,
        atendimento_id: id,
        chave_registro: chave,
      },
    });
    // O resumo recarrega a lista de medicações ou o registro final persistido.
    form.reset();
    await selecionar();
    mostrarMensagem(
      enfermagem ? 'Medicação registrada no atendimento.' : 'Atendimento finalizado.',
    );
  });
}
iniciar().catch((erro) => mostrarMensagem(erro.message, true));
