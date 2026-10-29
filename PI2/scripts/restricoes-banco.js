// Aplica a evolução de integridade sem recriar tabelas nem modificar os registros existentes.
import { readFile } from 'node:fs/promises';
// Isola esta rotina para que os demais trechos reutilizem a mesma regra.
export async function aplicarRestricoes(conexao) {
  // Versões antigas reconhecem CHECK sem aplicar a proteção; interrompemos esse caso.
  const [[{ versao }]] = await conexao.query('SELECT VERSION() AS versao');
  const [principal, secundaria, correcao] = versao
    .split('.')
    .map((parte) => Number.parseInt(parte, 10));
  if (
    /MariaDB/i.test(versao) ||
    principal < 8 ||
    (principal === 8 && secundaria === 0 && correcao < 16)
  ) {
    throw new Error('Use MySQL 8.0.16 ou superior para verificar as restrições deste projeto.');
  }
  // O arquivo pertence ao projeto; identificadores SQL nunca são recebidos de formulários.
  const conteudo = await readFile(new URL('../database/restricoes.sql', import.meta.url), 'utf8');
  // Este arquivo contém somente ALTER TABLE simples, separados por ponto e vírgula.
  const instrucoes = conteudo
    .replace(/^\s*--.*$/gm, '')
    .split(';')
    .map((sql) => sql.trim())
    .filter(Boolean);
  // Executa cada arquivo SQL previsto na ordem de dependência das tabelas e dos dados.
  for (const sql of instrucoes) {
    // Reconhece apenas o formato previsto para conferir o nome no catálogo antes da alteração.
    const nomes = /^ALTER TABLE ([a-z_]+) ADD CONSTRAINT ([a-z_]+)\s+CHECK\s*\(/.exec(sql);
    if (!nomes) {
      throw new Error('Formato inesperado em database/restricoes.sql. Revise o arquivo local.');
    }
    const [, tabela, restricao] = nomes;
    // A consulta parametrizada permite executar a preparação novamente sem duplicar restrições.
    const [existentes] = await conexao.execute(
      "SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME=? AND CONSTRAINT_NAME=? AND CONSTRAINT_TYPE='CHECK'",
      [tabela, restricao],
    );
    if (existentes.length) {
      continue;
    }
    try {
      // O MySQL também confere os registros antigos antes de aceitar a nova regra.
      await conexao.query(sql);
    } catch (erro) {
      // Não corrigimos nem excluímos dados antigos silenciosamente para fazer uma migração passar.
      throw new Error(
        `Não foi possível aplicar ${restricao}: ${erro.code || 'falha de banco'}. Confira a versão do MySQL, as permissões ALTER e os dados existentes.`,
        {
          cause: erro,
        },
      );
    }
  }
}
