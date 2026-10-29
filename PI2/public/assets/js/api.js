// Todas as telas usam a mesma sessão, sem solicitar novamente o nome do profissional.
let tokenCsrf = null;

// Converte a resposta HTTP em dados e preserva o status para o formulário decidir o retorno.
export async function pedir(
  caminho,
  {
    // Método HTTP que separa leitura e envio de dados.
    method = 'GET',
    dados,
    sinal,
  } = {},
) {
  // O cookie fica protegido como HttpOnly; o navegador o envia apenas para a própria origem.
  const resposta = await fetch(caminho, {
    // Método HTTP que separa leitura e envio de dados.
    method,
    // Mantém o cookie apenas em pedidos destinados à mesma origem.
    credentials: 'same-origin',
    signal: sinal,
    // Cabeçalhos transportam o tipo dos dados e a proteção da sessão.
    headers: {
      // O tipo JSON é exigido pelo backend nos formulários que enviam um corpo.
      ...(dados
        ? {
            // Informa ao navegador o formato e a codificação da resposta.
            'Content-Type': 'application/json',
          }
        : {}),
      // A sessão fornece este token adicional para os pedidos que alteram dados.
      ...(tokenCsrf
        ? {
            'X-CSRF-Token': tokenCsrf,
          }
        : {}),
    },
    // Os campos ficam no corpo, nunca concatenados em uma instrução SQL pelo navegador.
    ...(dados
      ? {
          // Converte os campos em JSON para o backend conferir e processar.
          body: JSON.stringify(dados),
        }
      : {}),
  });
  // O backend padroniza as respostas, inclusive erros esperados de entrada ou permissão.
  const conteudo = await resposta.json();
  if (!resposta.ok) {
    // A tela pode distinguir sessão vencida, conflito e falha de validação pelo status.
    const erro = new Error(conteudo.erro || 'Não foi possível concluir a operação.');
    erro.status = resposta.status;
    // Mantém a falha original para que o tratamento central registre a causa e encerre a operação.
    throw erro;
  }
  // Entrega o JSON ao formulário somente depois de conferir o status HTTP.
  return conteudo;
}

// Confere a identidade antes de carregar dados de uma área reservada.
export async function exigirAcesso(perfis) {
  try {
    // Recupera o mesmo usuário autenticado no login, mesmo após trocar de página.
    const sessao = await recuperarSessao();
    // Esta restrição visual complementa a conferência obrigatória em cada rota do backend.
    if (!perfis.includes(sessao.usuario.perfil)) {
      throw new Error('Área não permitida para este perfil.');
    }
    // textContent apresenta nomes como texto e não interpreta marcação HTML digitada.
    document.querySelectorAll('[data-identidade]').forEach((elemento) => {
      // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
      elemento.textContent = sessao.usuario.nome;
    });
    return sessao.usuario;
  } catch (erro) {
    // Sem identidade válida, a pessoa volta ao login antes de consultar dados desta tela.
    window.location.replace('/');
    // Mantém a falha original para que o tratamento central registre a causa e encerre a operação.
    throw erro;
  }
}

// O início pode verificar a sessão sem redirecionar uma pessoa que ainda não entrou.
export async function recuperarSessao() {
  // Identidade autenticada e token do pedido, sem pedir que o usuário informe seu próprio nome.
  const sessao = await pedir('/api/sessao');
  tokenCsrf = sessao.csrf;
  return sessao;
}

// O modo de desenho reutiliza a mesma estrutura, mas não consulta nem grava dados reais.
export function prepararRascunho() {
  if (new URLSearchParams(window.location.search).get('modo') !== 'rascunho') {
    return false;
  }
  // Seleciona o modo de apresentação do desenho sem criar outra cópia da tela.
  document.body.classList.add('wireframe');
  // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
  document.querySelectorAll('[data-identidade]').forEach((item) => {
    // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
    item.textContent = 'Visualização de rascunho';
  });
  // Aplica o mesmo comportamento aos controles relacionados sem copiar o código para cada elemento.
  document.querySelectorAll('fieldset').forEach((item) => {
    // Libera o controle novamente, inclusive quando o pedido terminou com erro.
    item.disabled = false;
  });
  // Impede inclusive um envio por Enter, mesmo sem os manipuladores funcionais da tela.
  document
    .querySelectorAll('form')
    .forEach((form) => form.addEventListener('submit', (evento) => evento.preventDefault()));
  // Aplica o mesmo comportamento aos controles relacionados sem copiar o código para cada elemento.
  document.querySelectorAll('button').forEach((item) => {
    // Bloqueia outro envio enquanto a operação atual aguarda o backend.
    item.disabled = true;
  });
  mostrarMensagem('Rascunho da interface. Nenhum dado real é consultado ou salvo.');
  return true;
}

// Ao voltar pelo histórico, recarrega a página antes de reutilizar uma sessão antiga em memória.
window.addEventListener('pageshow', (evento) => {
  if (evento.persisted) {
    // Seleciona o modo de apresentação do desenho sem criar outra cópia da tela.
    window.location.reload();
  }
});

// Atualiza a mensagem sem esconder as informações que o usuário precisa corrigir.
export function mostrarMensagem(texto, erro = false) {
  const destino = document.querySelector('[role="status"]');
  // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
  destino.textContent = texto;
  destino.classList.toggle('erro', erro);
}

// Reutiliza o controle de espera e evita vários envios enquanto o pedido ainda está em curso.
export function aoEnviar(formulario, executar) {
  // Liga a ação do usuário a este controle; o restante da regra só roda quando o evento acontece.
  formulario.addEventListener('submit', async (evento) => {
    // Evita o envio padrão da página para que a rotina JavaScript controle o resultado do formulário.
    evento.preventDefault();
    // Controle da ação atual; fica temporariamente desativado para não reenviar durante a espera.
    const botao = formulario.querySelector('button[type="submit"], button:not([type])');
    // Bloqueia outro envio enquanto a operação atual aguarda o backend.
    botao.disabled = true;
    try {
      // FormData conserva os nomes de campo usados pelo backend existente.
      await executar(Object.fromEntries(new FormData(formulario)), formulario);
    } catch (erro) {
      mostrarMensagem(erro.message, true);
    } finally {
      // Uma falha não deve deixar o formulário bloqueado permanentemente.
      botao.disabled = false;
    }
  });
}

// Monta células com texto para que os registros nunca sejam executados como HTML.
export function celula(texto) {
  const elemento = document.createElement('td');
  // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
  elemento.textContent = texto == null || texto === '' ? 'Não informado' : String(texto);
  return elemento;
}
