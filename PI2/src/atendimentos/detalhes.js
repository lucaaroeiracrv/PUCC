// O resumo agrega somente informações do atendimento solicitado, sem dados de senha.
import { ErroHttp } from '../http/respostas.js';
// Reutiliza este módulo para manter sua responsabilidade fora do fluxo principal do servidor.
import { validarId } from '../shared/dominio.js';
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function obterDetalhes(banco, sessao, numero) {
  const id = validarId(numero);
  const [atendimentos] = await banco.execute(
    `SELECT a.*, p.nome AS paciente_nome, p.data_nascimento
    FROM atendimentos a JOIN pacientes p ON p.id = a.paciente_id WHERE a.id = ?`,
    [id],
  );
  if (!atendimentos.length) {
    throw new ErroHttp(404, 'Atendimento não encontrado.');
  }
  const atendimento = atendimentos[0];
  // A permissão é conferida antes de continuar, mesmo se alguém ignorar os controles visuais da página.
  if (sessao.usuario.perfil === 'medico' && atendimento.situacao === 'aguardando_triagem') {
    throw new ErroHttp(403, 'O atendimento ainda aguarda a triagem.');
  }
  const [triagens] = await banco.execute(
    `SELECT t.*, u.nome AS profissional FROM triagens t
    JOIN usuarios u ON u.id = t.enfermeiro_id WHERE t.atendimento_id = ?`,
    [id],
  );
  const resumo = {
    // Dados da abertura confirmada, vinculados ao paciente correto.
    atendimento,
    triagem: triagens[0] || null,
  };
  const [consultas] = await banco.execute(
    `SELECT c.*, u.nome AS profissional FROM consultas c
    JOIN usuarios u ON u.id = c.medico_id WHERE c.atendimento_id = ?`,
    [id],
  );
  resumo.consulta = consultas[0] || null;
  const [medicacoes] = await banco.execute(
    `SELECT m.*, u.nome AS profissional FROM medicacoes m
    JOIN usuarios u ON u.id = m.enfermeiro_id WHERE m.atendimento_id = ? ORDER BY m.id`,
    [id],
  );
  resumo.medicacoes = medicacoes;
  const [encerramentos] = await banco.execute(
    `SELECT e.*, u.nome AS profissional FROM encerramentos e
    JOIN usuarios u ON u.id = e.medico_id WHERE e.atendimento_id = ?`,
    [id],
  );
  resumo.encerramento = encerramentos[0] || null;
  return resumo;
}
