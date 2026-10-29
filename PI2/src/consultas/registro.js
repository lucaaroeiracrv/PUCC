// O registro médico é gravado uma vez, com o autor obtido da sessão do sistema.
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
export async function salvarConsulta(banco, usuario, corpo) {
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  const dados = {
    atendimento_id: validarId(corpo.atendimento_id),
    registro: texto(corpo.registro, 'registro da consulta', 4000),
    chave_registro: validarChave(corpo.chave_registro),
  };
  // Informa a criação nova e devolve o identificador persistido para a próxima ação na interface.
  return comTransacao(banco, async (conexao) => {
    const atendimento = await bloquearAtendimento(conexao, dados.atendimento_id);
    const salvo = await repeticao(conexao, 'consultas', usuario, dados, Object.keys(dados));
    if (salvo) {
      // Reconhece a repetição como sucesso do registro existente, sem gravar outra cópia.
      return {
        // Permite distinguir uma criação nova de uma repetição reconhecida.
        criado: false,
        consulta: salvo,
      };
    }
    // A consulta não pode pular a triagem nem reabrir um atendimento finalizado.
    if (atendimento.situacao !== 'aguardando_medico') {
      throw new ErroHttp(409, 'Este atendimento não aguarda consulta médica.');
    }
    const [triagens] = await conexao.execute(
      'SELECT classificacao FROM triagens WHERE atendimento_id = ?',
      [dados.atendimento_id],
    );
    if (!triagens[0]?.classificacao) {
      throw new ErroHttp(409, 'Complete a triagem e a classificação antes da consulta.');
    }
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const [resultado] = await conexao.execute(
      'INSERT INTO consultas (atendimento_id, medico_id, registro, chave_registro) VALUES (?, ?, ?, ?)',
      [dados.atendimento_id, usuario.id, dados.registro, dados.chave_registro],
    );
    // A mudança de etapa é confirmada junto com o texto da consulta, na mesma transação.
    await conexao.execute("UPDATE atendimentos SET situacao = 'em_atendimento' WHERE id = ?", [
      dados.atendimento_id,
    ]);
    // Informa a criação nova e devolve o identificador persistido para a próxima ação na interface.
    return {
      // Permite distinguir uma criação nova de uma repetição reconhecida.
      criado: true,
      consulta: {
        // Identificador persistido usado para relacionar registros sem depender de nomes.
        id: resultado.insertId,
        ...dados,
        medico_id: usuario.id,
      },
    };
  });
}
