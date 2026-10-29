// As duas telas da recepção compartilham sessão, mensagens e tratamento de formulários.
import { exigirAcesso, mostrarMensagem, aoEnviar, pedir, celula, prepararRascunho } from './api.js';
// A chave representa a tentativa de envio, evitando registros repetidos pelo mesmo clique.
let chaveCadastro = crypto.randomUUID();
// Associa cada paciente a uma tentativa de abertura, inclusive após repetir um clique.
const chavesAbertura = new Map();
// Constrói a lista com elementos DOM e textContent; nomes digitados não são interpretados como HTML.
function listar(pacientes) {
  // A nova busca substitui os resultados anteriores sem interpretar os nomes como HTML.
  const corpo = document.querySelector('#pacientes');
  // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
  corpo.replaceChildren();
  // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
  document.querySelector('#resultado-busca').textContent = pacientes.length
    ? `${pacientes.length} paciente(s). São apresentados até 50 resultados.`
    : 'Nenhum paciente encontrado.';
  // Processa cada elemento de forma independente para preservar a relação entre os dados da mesma iteração.
  for (// Cadastro validado ou registro da iteração atual; sua identificação liga as próximas operações.
  const paciente of pacientes) {
    // Elemento de tabela criado para o paciente atual, sem montar HTML com texto digitado.
    const linha = document.createElement('tr');
    // Atualiza a árvore DOM usando elementos próprios, mantendo dados separados da marcação.
    linha.append(
      celula(paciente.nome),
      celula(paciente.data_nascimento.split('-').reverse().join('/')),
      celula(paciente.documento),
    );
    const acao = document.createElement('td');
    // Controle da ação atual; fica temporariamente desativado para não reenviar durante a espera.
    const botao = document.createElement('button');
    botao.type = 'button';
    // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
    botao.textContent = 'Abrir atendimento';
    // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
    botao.addEventListener('click', async () => {
      // Enquanto o servidor processa, o controle não pode iniciar outro pedido.
      botao.disabled = true;
      // Uma repetição do clique reaproveita a mesma chave em vez de solicitar outro atendimento.
      if (!chavesAbertura.has(paciente.id)) {
        // Guarda a associação desta tentativa no estado atual para reconhecer uma repetição posterior.
        chavesAbertura.set(paciente.id, crypto.randomUUID());
      }
      try {
        // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
        const resultado = await pedir('/api/atendimentos', {
          // Método HTTP que separa leitura e envio de dados.
          method: 'POST',
          dados: {
            // Referência ao paciente existente que foi escolhido na recepção.
            paciente_id: paciente.id,
            chave_abertura: chavesAbertura.get(paciente.id),
          },
        });
        mostrarMensagem(
          `Atendimento ${resultado.atendimento.id} aberto. Situação: aguardando triagem.`,
        );
      } catch (erro) {
        mostrarMensagem(erro.message, true);
      } finally {
        // Libera o controle novamente, inclusive quando o pedido terminou com erro.
        botao.disabled = false;
      }
    });
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
  // O backend também confere o perfil; o redirecionamento da tela não é a única proteção.
  await exigirAcesso(['recepcao']);
  const cadastro = document.querySelector('#form-paciente');
  // Recusa este formato de entrada antes da gravação, evitando aceitar um dado que a interface sozinha não garante.
  if (cadastro) {
    cadastro.querySelector('[name="data_nascimento"]').max = new Date().toISOString().slice(0, 10);
    // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
    cadastro.addEventListener('input', () => {
      // Uma tentativa editada ou concluída recebe outra chave; uma repetição sem edição mantém a anterior.
      chaveCadastro = crypto.randomUUID();
    });
    // Remove os valores do formulário para não reapresentar dados de uma tentativa anterior.
    aoEnviar(cadastro, async (dados, formulario) => {
      // O identificador do autor vem da sessão; este corpo contém somente dados do paciente.
      const resultado = await pedir('/api/pacientes', {
        // Método HTTP que separa leitura e envio de dados.
        method: 'POST',
        dados: {
          ...dados,
          // Identifica a tentativa e não o paciente; uma edição posterior recebe outra chave.
          chave_cadastro: chaveCadastro,
        },
      });
      // Remove os valores do formulário para não reapresentar dados de uma tentativa anterior.
      formulario.reset();
      // Uma tentativa editada ou concluída recebe outra chave; uma repetição sem edição mantém a anterior.
      chaveCadastro = crypto.randomUUID();
      mostrarMensagem(
        `Paciente ${resultado.paciente.id} salvo. Use a busca para abrir o atendimento.`,
      );
    });
  }
  // O mesmo módulo funciona na página de busca sem exigir a presença do cadastro.
  const busca = document.querySelector('#form-busca');
  // Recusa este formato de entrada antes da gravação, evitando aceitar um dado que a interface sozinha não garante.
  if (busca) {
    // Reutiliza a apresentação dos pacientes para o cadastro e para a busca.
    aoEnviar(busca, async (dados) => {
      // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
      const resultado = await pedir(`/api/pacientes?busca=${encodeURIComponent(dados.busca)}`);
      // Reutiliza a apresentação dos pacientes para o cadastro e para a busca.
      listar(resultado.pacientes);
      mostrarMensagem(resultado.mensagem);
    });
  }
}
iniciar().catch(() => {});
