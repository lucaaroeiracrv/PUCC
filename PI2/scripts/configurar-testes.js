// O ambiente de teste usa outro banco e não versiona as credenciais copiadas do .env local.
import { readFile, writeFile } from 'node:fs/promises';
// Representação da origem enviada pelo navegador para comparar host e protocolo.
const origem = await readFile(new URL('../.env', import.meta.url), 'utf8');
// O sufixo identifica explicitamente o banco em que os testes podem criar dados fictícios.
const nome = (origem.match(/^DB_NAME=(.+)$/m)?.[1]?.trim() || 'pi2_academico')
  .replace(/_teste$/, '')
  .slice(0, 55);
const destino = origem.replace(/^DB_NAME=.*$/m, `DB_NAME=${nome}_teste`);
try {
  // A criação exclusiva preserva uma configuração de teste que o grupo já tenha ajustado.
  await writeFile(new URL('../.env.teste', import.meta.url), destino, {
    flag: 'wx',
  });
  // Informa no terminal o resultado da preparação ou o endereço para testar a etapa.
  console.log('.env.teste criado. Confira a conexão e execute npm run preparar:testes.');
} catch (erro) {
  // Traduz apenas a falha prevista; um erro desconhecido continua visível no tratamento central.
  if (erro.code === 'EEXIST') {
    // Informa no terminal o resultado da preparação ou o endereço para testar a etapa.
    console.log('.env.teste já existe; os dados foram preservados.');
  } else
    // Mantém a falha original para que o tratamento central registre a causa e encerre a operação.
    throw erro;
}
