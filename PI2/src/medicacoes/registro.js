// O sistema registra dados informados pelo profissional, sem sugerir medicamento ou dose.
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
export async function salvarMedicacao(banco, usuario, corpo) {
  // Dados de entrada ou resposta, cujo formato será conferido antes do uso.
  const dados = {
    atendimento_id: validarId(corpo.atendimento_id),
    medicacao: texto(corpo.medicacao, 'medicação', 120),
    dose: texto(corpo.dose, 'dose informada', 80),
    via: texto(corpo.via, 'via informada', 60),
    observacoes: texto(corpo.observacoes, 'observações', 2000, false),
    chave_registro: validarChave(corpo.chave_registro),
  };
  // Informa a criação nova e devolve o identificador persistido para a próxima ação na interface.
  return comTransacao(banco, async (conexao) => {
    const atendimento = await bloquearAtendimento(conexao, dados.atendimento_id);
    const salvo = await repeticao(conexao, 'medicacoes', usuario, dados, Object.keys(dados));
    if (salvo) {
      // Reconhece a repetição como sucesso do registro existente, sem gravar outra cópia.
      return {
        // Permite distinguir uma criação nova de uma repetição reconhecida.
        criado: false,
        medicacao: salvo,
      };
    }
    // O bloqueio impede registrar uma medicação ao mesmo tempo que o atendimento é encerrado.
    if (atendimento.situacao !== 'em_atendimento') {
      throw new ErroHttp(
        409,
        'Registre medicações somente após a consulta e antes do encerramento.',
      );
    }
    const [consultas] = await conexao.execute('SELECT id FROM consultas WHERE atendimento_id = ?', [
      dados.atendimento_id,
    ]);
    if (!consultas.length) {
      throw new ErroHttp(409, 'Este atendimento ainda não possui consulta.');
    }
    // Resultado da operação ou da conferência; o chamador decide a resposta a partir dele.
    const [resultado] = await conexao.execute(
      'INSERT INTO medicacoes (atendimento_id, enfermeiro_id, medicacao, dose, via, observacoes, chave_registro) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        dados.atendimento_id,
        usuario.id,
        dados.medicacao,
        dados.dose,
        dados.via,
        dados.observacoes,
        dados.chave_registro,
      ],
    );
    // Informa a criação nova e devolve o identificador persistido para a próxima ação na interface.
    return {
      // Permite distinguir uma criação nova de uma repetição reconhecida.
      criado: true,
      medicacao: {
        // Identificador persistido usado para relacionar registros sem depender de nomes.
        id: resultado.insertId,
        ...dados,
        enfermeiro_id: usuario.id,
      },
    };
  });
}
