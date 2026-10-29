// A conferência é somente leitura: aponta divergências e não modifica registros do grupo.
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { criarPool } from '../src/config/banco.js';

export async function conferirDados(banco) {
  const contagens = {};
  // Os nomes são constantes do código, nunca nomes de tabela recebidos por formulário.
  for (const tabela of [
    'usuarios',
    'pacientes',
    'atendimentos',
    'triagens',
    'consultas',
    'medicacoes',
    'encerramentos',
  ]) {
    const [linhas] = await banco.execute(`SELECT COUNT(*) AS quantidade FROM ${tabela}`);
    contagens[tabela] = linhas[0].quantidade;
  }
  // As etapas avançadas exigem os registros que deveriam ter sido confirmados na transação.
  const [divergencias] = await banco.execute(`
    SELECT a.id, 'triagem ou classificação ausente' AS problema FROM atendimentos a
      LEFT JOIN triagens t ON t.atendimento_id = a.id
      WHERE a.situacao <> 'aguardando_triagem' AND (t.id IS NULL OR t.classificacao IS NULL)
    UNION ALL
    SELECT a.id, 'consulta ausente' AS problema FROM atendimentos a
      LEFT JOIN consultas c ON c.atendimento_id = a.id
      WHERE a.situacao IN ('em_atendimento','finalizado') AND c.id IS NULL
    UNION ALL
    SELECT a.id, 'encerramento ausente' AS problema FROM atendimentos a
      LEFT JOIN encerramentos e ON e.atendimento_id = a.id
      WHERE a.situacao = 'finalizado' AND e.id IS NULL
    UNION ALL
    SELECT a.id, 'encerramento sem situação final' AS problema FROM atendimentos a
      JOIN encerramentos e ON e.atendimento_id = a.id WHERE a.situacao <> 'finalizado'
  `);
  return { consistente: divergencias.length === 0, contagens, divergencias };
}

// A função pode ser importada nos testes sem abrir uma conexão ou imprimir dados.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const banco = criarPool();
  try {
    const resultado = await conferirDados(banco);
    console.log(JSON.stringify(resultado, null, 2));
    if (!resultado.consistente) process.exitCode = 1;
  } finally {
    await banco.end();
  }
}
