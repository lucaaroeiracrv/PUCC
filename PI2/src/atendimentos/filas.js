// A fila usa consultas fixas: nenhum filtro recebido se torna parte livre do SQL.
import { ErroHttp } from '../http/respostas.js';
// Reutiliza a regra de perfil tanto na rota quanto nas verificações da área.
import { exigirPerfil } from '../auth/permissoes.js';
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function listarFila(banco, sessao, tipo) {
  // A ordenação por abertura é explícita e deve ser confrontada com os requisitos do grupo.
  let filtro;
  // A permissão é conferida antes de continuar, mesmo se alguém ignorar os controles visuais da página.
  if (tipo === 'triagem') {
    exigirPerfil(sessao, ['enfermagem']);
    filtro = "a.situacao = 'aguardando_triagem'";
  } else // A permissão é conferida antes de continuar, mesmo se alguém ignorar os controles visuais da página.
  if (tipo === 'medico') {
    exigirPerfil(sessao, ['medico']);
    filtro = "a.situacao IN ('aguardando_medico', 'em_atendimento')";
  } else // A permissão é conferida antes de continuar, mesmo se alguém ignorar os controles visuais da página.
  if (tipo === 'medicacoes') {
    exigirPerfil(sessao, ['enfermagem']);
    filtro = "a.situacao = 'em_atendimento'";
  } else // A permissão é conferida antes de continuar, mesmo se alguém ignorar os controles visuais da página.
  if (tipo === 'encerramento') {
    exigirPerfil(sessao, ['medico']);
    filtro = "a.situacao = 'em_atendimento'";
  } else {
    throw new ErroHttp(404, 'Fila não encontrada.');
  }
  const [atendimentos] =
    await banco.execute(`SELECT a.id, a.paciente_id, a.situacao, a.aberto_em, p.nome AS paciente_nome,
      t.classificacao FROM atendimentos a JOIN pacientes p ON p.id = a.paciente_id
      LEFT JOIN triagens t ON t.atendimento_id = a.id
      WHERE ${filtro} ORDER BY a.aberto_em, a.id LIMIT 100`);
  return {
    atendimentos,
    limite: 100,
    ordem: 'abertura',
  };
}
