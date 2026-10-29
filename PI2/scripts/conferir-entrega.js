// Confere os arquivos técnicos do pacote sem afirmar que a entrega institucional já ocorreu.
import { access, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// A base depende deste arquivo e não do diretório onde o terminal foi aberto.
const raiz = new URL('../', import.meta.url);
// Estes arquivos identificam o programa, o banco e os materiais essenciais desta etapa.
const obrigatorios = [
  'README.md',
  'package.json',
  'package-lock.json',
  '.env.example',
  'src/servidor.js',
  'public/index.html',
  'public/screens/cadastro.html',
  'public/screens/recepcao.html',
  'public/screens/triagem.html',
  'public/screens/medico.html',
  'public/screens/medicacoes-encerramento.html',
  'database/estrutura.sql',
  'database/dados-teste.sql',
  'database/triagens.sql',
  'database/consultas.sql',
  'database/medicacoes.sql',
  'database/encerramentos.sql',
  'database/restricoes.sql',
  'docs/ARQUITETURA.md',
  'docs/VERIFICACAO.md',
  'docs/HISTORICO.md',
  'docs/STATUS_TAREFAS.md',
  'design/55 — Montar os slides da apresentação.pptx',
];
// As falhas são reunidas para permitir corrigir todos os itens de uma só vez.
const faltantes = [];
for (const arquivo of obrigatorios) {
  try {
    await access(new URL(arquivo, raiz));
  } catch {
    faltantes.push(arquivo);
  }
}
// A documentação usa a numeração das tarefas; o código continua organizado por função.
const documentos = await readdir(new URL('docs/', raiz));
for (let numero = 11; numero <= 59; numero += 1) {
  if (!documentos.some((nome) => nome.startsWith(`${numero} — `) && nome.endsWith('.md'))) {
    faltantes.push(`Documento da tarefa ${numero}`);
  }
}
// JSON é lido sem comentários, preservando a sintaxe exigida pelo npm.
const pacote = JSON.parse(await readFile(new URL('package.json', raiz), 'utf8'));
const lock = JSON.parse(await readFile(new URL('package-lock.json', raiz), 'utf8'));
if (pacote.version !== lock.version || pacote.version !== lock.packages[''].version) {
  faltantes.push('Versões diferentes entre package.json e package-lock.json');
}
// PPTX é um pacote ZIP; esta assinatura identifica arquivos trocados ou vazios por engano.
const slides = await readFile(new URL('design/55 — Montar os slides da apresentação.pptx', raiz));
if (slides.subarray(0, 4).toString('hex') !== '504b0304') {
  faltantes.push('Arquivo de apresentação sem assinatura PPTX/ZIP');
}
// A saída contém caminhos do pacote, nunca valores do .env ou senhas do banco.
console.log('Projeto:', fileURLToPath(raiz));
console.log('Arquivos técnicos ausentes ou incompatíveis:', faltantes.length);
for (const arquivo of faltantes) {
  console.error('-', arquivo);
}
// A presença dos materiais técnicos não substitui o documento original exigido pela faculdade.
console.log(
  'Documento acadêmico completo e comprovante: conferir com o grupo conforme as tarefas 54 e 59.',
);
if (faltantes.length) {
  process.exitCode = 1;
}
