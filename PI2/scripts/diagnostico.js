// Confere o ambiente atual por leitura, sem criar tabelas, alterar senhas ou gravar pacientes.
import { readFile } from 'node:fs/promises';
import { criarPool } from '../src/config/banco.js';

// O projeto exige os recursos de módulos, env-file e testes disponíveis nesta versão mínima.
const principalNode = Number(process.versions.node.split('.')[0]);
if (principalNode < 22) {
  console.error('Use Node.js 22 ou superior antes de executar o projeto.');
  process.exitCode = 1;
} else {
  // O pool usa as opções já validadas do ambiente; credenciais não são impressas.
  const banco = criarPool();
  try {
    console.log('Node.js:', process.versions.node);
    console.log('Sistema:', process.platform, process.arch);
    // A consulta confirma a conexão e identifica se CHECK é efetivamente suportado.
    const [[{ versao }]] = await banco.query('SELECT VERSION() AS versao');
    const [principal, secundaria, correcao] = versao
      .split('.')
      .map((parte) => Number.parseInt(parte, 10));
    if (
      /MariaDB/i.test(versao) ||
      principal < 8 ||
      (principal === 8 && secundaria === 0 && correcao < 16)
    ) {
      throw new Error('Este projeto requer MySQL 8.0.16 ou superior.');
    }
    console.log('MySQL:', versao);
    // Somente as tabelas deste projeto são necessárias à demonstração documentada.
    const previstas = [
      'usuarios',
      'pacientes',
      'atendimentos',
      'triagens',
      'consultas',
      'medicacoes',
      'encerramentos',
    ];
    const [tabelas] = await banco.execute(
      'SELECT TABLE_NAME AS nome FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE()',
    );
    const ausentes = previstas.filter((nome) => !tabelas.some((tabela) => tabela.nome === nome));
    if (ausentes.length) {
      throw new Error('Tabelas ausentes: ' + ausentes.join(', ') + '. Execute npm run preparar.');
    }
    // Os nomes esperados vêm do próprio SQL para não manter uma segunda lista de restrições.
    const sql = await readFile(new URL('../database/restricoes.sql', import.meta.url), 'utf8');
    const restricoes = [...sql.matchAll(/ADD CONSTRAINT (ck_[a-z_]+)/g)].map((grupo) => grupo[1]);
    const [ativas] = await banco.execute(
      "SELECT CONSTRAINT_NAME AS nome FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND CONSTRAINT_TYPE='CHECK' AND ENFORCED='YES'",
    );
    if (restricoes.some((nome) => !ativas.some((restricao) => restricao.nome === nome))) {
      throw new Error('Há restrições de integridade ausentes. Execute npm run preparar.');
    }
    console.log('Tabelas conferidas:', previstas.length);
    console.log('Restrições CHECK ativas:', restricoes.length);
    // A leitura não testa nem redefine senhas: verifica apenas os perfis das contas fictícias.
    const [usuarios] = await banco.execute(
      "SELECT login, perfil, ativo FROM usuarios WHERE login IN ('recepcao','enfermagem','medico')",
    );
    for (const perfil of ['recepcao', 'enfermagem', 'medico']) {
      if (
        !usuarios.some(
          (usuario) => usuario.login === perfil && usuario.perfil === perfil && usuario.ativo,
        )
      ) {
        throw new Error('Confira a conta fictícia do perfil ' + perfil + ' antes da demonstração.');
      }
    }
    console.log('Contas fictícias por perfil: conferidas, sem alteração de senhas.');
    console.log(
      'Diagnóstico técnico concluído no ambiente atual. Repita o fluxo e abra os slides no computador da apresentação.',
    );
  } catch (erro) {
    // A mensagem resume o problema sem mostrar o objeto de configuração ou o conteúdo do .env.
    console.error('Falha no diagnóstico:', erro.code || erro.message);
    process.exitCode = 1;
  } finally {
    // Libera as conexões tanto em sucesso quanto em falha de uma conferência.
    await banco.end();
  }
}
