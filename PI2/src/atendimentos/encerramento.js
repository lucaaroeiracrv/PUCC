// O encerramento confirma a situação final do mesmo atendimento consultado pelo médico.
import { ErroHttp } from '../http/respostas.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import {
  validarId,
  texto,
  validarChave,
  comTransacao,
  bloquearAtendimento,
  repeticao,
} from '../shared/dominio.js';
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function finalizarAtendimento(banco, usuario, corpo) {
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  const dados = {
    atendimento_id: validarId(corpo.atendimento_id),
    observacoes: texto(corpo.observacoes, 'observações finais', 2000, false),
    chave_registro: validarChave(corpo.chave_registro),
  };
  // Informa a criação nova e devolve o identificador persistido para a próxima ação na interface.
  return comTransacao(banco, async (conexao) => {
    const atendimento = await bloquearAtendimento(conexao, dados.atendimento_id);
    const salvo = await repeticao(conexao, 'encerramentos', usuario, dados, Object.keys(dados));
    if (salvo) {
      // Reconhece a repetição como sucesso do registro existente, sem gravar outra cópia.
      return {
        // Permite distinguir uma criação nova de uma repetição reconhecida.
        criado: false,
        encerramento: salvo,
      };
    }
    if (atendimento.situacao !== 'em_atendimento') {
      throw new ErroHttp(
        409,
        'O atendimento precisa de uma consulta antes de finalizar, ou já está encerrado.',
      );
    }
    const [consultas] = await conexao.execute(
      'SELECT medico_id FROM consultas WHERE atendimento_id = ?',
      [dados.atendimento_id],
    );
    if (!consultas.length) {
      throw new ErroHttp(409, 'Registre a consulta antes do encerramento.');
    }
    // A proposta limita o encerramento ao médico que registrou a consulta.
    if (consultas[0].medico_id !== usuario.id) {
      throw new ErroHttp(
        403,
        'O encerramento deve ser feito pelo médico que registrou a consulta.',
      );
    }
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const [resultado] = await conexao.execute(
      'INSERT INTO encerramentos (atendimento_id, medico_id, observacoes, chave_registro) VALUES (?, ?, ?, ?)',
      [dados.atendimento_id, usuario.id, dados.observacoes, dados.chave_registro],
    );
    // Aguarda a operação do banco; consultas de formulário usam valores separados do texto SQL.
    await conexao.execute("UPDATE atendimentos SET situacao = 'finalizado' WHERE id = ?", [
      dados.atendimento_id,
    ]);
    // Informa a criação nova e devolve o identificador persistido para a próxima ação na interface.
    return {
      // Permite distinguir uma criação nova de uma repetição reconhecida.
      criado: true,
      encerramento: {
        // Identificador persistido usado para relacionar registros sem depender de nomes.
        id: resultado.insertId,
        ...dados,
        medico_id: usuario.id,
      },
    };
  });
}
