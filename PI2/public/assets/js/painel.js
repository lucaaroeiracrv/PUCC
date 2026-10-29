// O início concentra o login e os links; os formulários ficam nas telas de cada função.
import { pedir, recuperarSessao, aoEnviar, mostrarMensagem } from './api.js';
// Usa a identidade devolvida pelo backend para identificar o usuário e mostrar sua área.
function mostrarSessao(sessao) {
  // O nome é recuperado da mesma identidade que as demais páginas utilizam.
  document.querySelector('#entrada').hidden = true;
  // Ajusta a área visível conforme o estado da sessão; a proteção definitiva continua no backend.
  document.querySelector('#sessao').hidden = false;
  // Exibe o conteúdo como texto para que dados digitados não se tornem marcação HTML executável.
  document.querySelector('#identidade').textContent = sessao.usuario.nome;
  // A apresentação por perfil complementa as permissões obrigatórias das APIs.
  document.querySelectorAll('[data-perfis]').forEach((link) => {
    // Ajusta a área visível conforme o estado da sessão; a proteção definitiva continua no backend.
    link.hidden = !link.dataset.perfis.split(',').includes(sessao.usuario.perfil);
  });
}

// O login existente mantém os mesmos usuários fictícios e a verificação criptográfica.
aoEnviar(document.querySelector('#form-login'), async (dados) => {
  await pedir('/api/login', {
    // Método HTTP que separa leitura e envio de dados.
    method: 'POST',
    dados,
  });
  // Remove os valores do formulário para não reapresentar dados de uma tentativa anterior.
  document.querySelector('#form-login').reset();
  // Atualiza a apresentação com o resultado que o backend autorizou para esta sessão.
  mostrarSessao(await recuperarSessao());
  mostrarMensagem('Entrada realizada. Escolha uma área.');
});

// Apaga a sessão no servidor antes de reapresentar a entrada.
document.querySelector('#sair').addEventListener('click', async () => {
  try {
    await pedir('/api/logout', {
      // Método HTTP que separa leitura e envio de dados.
      method: 'POST',
      dados: {},
    });
    // Seleciona o modo de apresentação do desenho sem criar outra cópia da tela.
    window.location.replace('/');
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
});

// Uma primeira visita sem cookie mostra o login sem criar um ciclo de redirecionamentos.
recuperarSessao()
  .then(mostrarSessao)
  .catch((erro) => {
    if (erro.status !== 401) {
      mostrarMensagem(erro.message, true);
    }
  });
