// A camada clínica reutiliza as mesmas sessões, permissões e respostas do servidor existente.
import { responder, lerJson } from './respostas.js';
// Reutiliza a regra de perfil tanto na rota quanto nas verificações da área.
import { exigirPerfil } from '../auth/permissoes.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { salvarTriagem } from '../triagem/registro.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { listarFila } from '../atendimentos/filas.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { obterDetalhes } from '../atendimentos/detalhes.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { classificarPendente } from '../triagem/classificacao.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { salvarConsulta } from '../consultas/registro.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { salvarMedicacao } from '../medicacoes/registro.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { finalizarAtendimento } from '../atendimentos/encerramento.js';
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function responderRotasClinicas(req, res, { banco, sessao, url }) {
  // Endereço resolvido no disco; a conferência do prefixo impede sair da pasta pública.
  const caminho = url.pathname;
  // Confere o destino resolvido antes de permitir que um caminho recebido alcance arquivos do disco.
  if (req.method === 'GET' && caminho.startsWith('/api/filas/')) {
    responder(res, 200, await listarFila(banco, sessao, caminho.slice('/api/filas/'.length)));
    return true;
  }
  const detalhe = caminho.match(/^\/api\/atendimentos\/(\d+)$/);
  // Separa esta operação pelas regras de rota e método; somente esse ramo pode produzir sua resposta.
  if (req.method === 'GET' && detalhe) {
    exigirPerfil(sessao, ['enfermagem', 'medico']);
    responder(res, 200, await obterDetalhes(banco, sessao, Number(detalhe[1])));
    return true;
  }
  // Separa esta operação pelas regras de rota e método; somente esse ramo pode produzir sua resposta.
  if (req.method === 'POST' && caminho === '/api/triagens') {
    exigirPerfil(sessao, ['enfermagem']);
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const resultado = await salvarTriagem(banco, sessao.usuario, await lerJson(req));
    responder(res, resultado.criado ? 201 : 200, resultado);
    return true;
  }
  // Separa esta operação pelas regras de rota e método; somente esse ramo pode produzir sua resposta.
  if (req.method === 'POST' && caminho === '/api/triagens/classificacao') {
    exigirPerfil(sessao, ['enfermagem']);
    responder(res, 200, await classificarPendente(banco, sessao.usuario, await lerJson(req)));
    return true;
  }
  // Separa esta operação pelas regras de rota e método; somente esse ramo pode produzir sua resposta.
  if (req.method === 'POST' && caminho === '/api/consultas') {
    exigirPerfil(sessao, ['medico']);
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const resultado = await salvarConsulta(banco, sessao.usuario, await lerJson(req));
    responder(res, resultado.criado ? 201 : 200, resultado);
    return true;
  }
  // Separa esta operação pelas regras de rota e método; somente esse ramo pode produzir sua resposta.
  if (req.method === 'POST' && caminho === '/api/medicacoes') {
    exigirPerfil(sessao, ['enfermagem']);
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const resultado = await salvarMedicacao(banco, sessao.usuario, await lerJson(req));
    responder(res, resultado.criado ? 201 : 200, resultado);
    return true;
  }
  const finalizar = caminho.match(/^\/api\/atendimentos\/(\d+)\/finalizar$/);
  // Separa esta operação pelas regras de rota e método; somente esse ramo pode produzir sua resposta.
  if (req.method === 'POST' && finalizar) {
    exigirPerfil(sessao, ['medico']);
    const corpo = await lerJson(req);
    corpo.atendimento_id = Number(finalizar[1]);
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const resultado = await finalizarAtendimento(banco, sessao.usuario, corpo);
    responder(res, resultado.criado ? 201 : 200, resultado);
    return true;
  }
  return false;
}
