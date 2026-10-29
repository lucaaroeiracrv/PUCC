// A classificação é informada pela enfermagem; o programa não cria critérios clínicos.
import { ErroHttp } from '../http/respostas.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { validarId, comTransacao, bloquearAtendimento } from '../shared/dominio.js';

// O conjunto de opções é a proposta já presente no desenho da triagem.
export const classificacoes = ['vermelho', 'laranja', 'amarelo', 'verde', 'azul'];
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export function validarClassificacao(valor) {
  if (typeof valor !== 'string' || !classificacoes.includes(valor)) {
    throw new ErroHttp(400, 'Selecione uma classificação de risco válida.');
  }
  return valor;
}

// Permite completar uma triagem registrada antes da etapa de classificação, sem regravá-la.
export async function classificarPendente(banco, usuario, corpo) {
  const id = validarId(corpo.atendimento_id);
  const classificacao = validarClassificacao(corpo.classificacao);
  return comTransacao(banco, async (conexao) => {
    const atendimento = await bloquearAtendimento(conexao, id);
    // Linhas recuperadas no MySQL; o primeiro registro só é usado quando a consulta encontra algo.
    const [linhas] = await conexao.execute('SELECT * FROM triagens WHERE atendimento_id = ?', [id]);
    // Só reaproveita um registro depois de conferir que o banco encontrou a tentativa correspondente.
    if (!linhas.length) {
      throw new ErroHttp(404, 'Registre a triagem antes de classificá-la.');
    }
    const triagem = linhas[0];
    if (triagem.enfermeiro_id !== usuario.id) {
      throw new ErroHttp(403, 'Somente o autor pode completar esta triagem.');
    }
    if (triagem.classificacao) {
      if (triagem.classificacao !== classificacao) {
        throw new ErroHttp(409, 'A classificação já está registrada.');
      }
      return {
        triagem,
      };
    }
    if (atendimento.situacao !== 'aguardando_triagem') {
      throw new ErroHttp(409, 'A etapa deste atendimento mudou.');
    }
    // Aguarda a operação do banco; consultas de formulário usam valores separados do texto SQL.
    await conexao.execute('UPDATE triagens SET classificacao = ? WHERE id = ?', [
      classificacao,
      triagem.id,
    ]);
    // Aguarda a operação do banco; consultas de formulário usam valores separados do texto SQL.
    await conexao.execute("UPDATE atendimentos SET situacao = 'aguardando_medico' WHERE id = ?", [
      id,
    ]);
    return {
      triagem: {
        ...triagem,
        classificacao,
      },
    };
  });
}
