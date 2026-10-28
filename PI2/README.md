# PI2 Sistema de atendimento

Projeto acadêmico em Node.js, MySQL, HTML, CSS e JavaScript. Esta entrega continua as tarefas 11 a 25 com as tarefas 26 a 59 do quadro. O código evolui nos mesmos arquivos, com comentários didáticos em português e indentação de dois espaços. O ZIP inclui 49 commits locais, um por tarefa, seguindo Conventional Commits.

## Executar

Requisitos: Node.js 22 ou superior, npm e MySQL 8.0.16 ou superior em execução. O servidor MySQL precisa ser instalado separadamente. Na raiz `PI2/` extraída:

1. Executar `npm ci` para instalar as versões do package-lock.json. A primeira instalação pode precisar de internet.
2. Executar `npm run configurar` e preencher o `.env` com host, porta, usuário e senha do seu MySQL.
3. Executar `npm run preparar`. O comando cria o banco de exemplo, carrega dados fictícios e acrescenta tabelas e restrições ausentes. Precisa de permissão para criar o banco e alterar sua estrutura.
4. Executar `npm run testar:conexao` e `npm run diagnostico`.
5. Executar `npm start` e abrir http://127.0.0.1:3000.

O banco padrão é `pi2_academico`. O esquema é uma proposta para testar os cartões; comparar com o MER original antes de adaptar o banco do grupo. A preparação preserva registros e contas existentes. Se um registro antigo violar uma nova restrição, a alteração correspondente para e exige revisão, sem apagar dados automaticamente. O `.env` local e as dependências instaladas não acompanham o ZIP nem são versionados.

## Contas e permissões

Contas fictícias novas: `recepcao`, `enfermagem` e `medico`. Senha inicial: `Pi2@2026!`. Contas que já existiam conservam sua senha. A identidade do profissional vem da sessão; não é digitada como autor do registro. As senhas usam hash scrypt com salt. Sessões ficam em memória e vencem após oito horas ou ao reiniciar o servidor.

| Perfil     | Ações                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Recepção   | Cadastrar e buscar paciente; abrir atendimento.                                                                                  |
| Enfermagem | Consultar fila e resumo, salvar triagem e classificação informada, registrar medicações após a consulta e antes do encerramento. |
| Médico     | Consultar fila e resumo após a triagem, salvar consulta e encerrar o atendimento da própria consulta.                            |

O servidor confere as permissões e a proteção de envio nas APIs. A interface também apresenta apenas as ações autorizadas para a área. A classificação é informada manualmente, a fila usa ordem de abertura e medicamentos, dose e via são textos digitados. O programa não calcula risco nem recomenda tratamento. Essas escolhas precisam ser confrontadas com os requisitos completos.

## Percorrer o fluxo

Cadastrar um paciente fictício na recepção, buscar seu documento e abrir um atendimento. Anotar o número da visita. Entrar como enfermagem, selecionar a visita e salvar triagem com classificação informada. Entrar como médico e salvar a consulta. A enfermagem pode registrar a medicação informada. Por fim, o médico autor confirma o encerramento. O resumo mantém os registros da mesma visita e novas gravações são recusadas depois da finalização.

`DEMO-001` começa com uma visita aberta para testar conflitos. `DEMO-002` e `DEMO-003` são exemplos para busca. Para repetir a demonstração, cadastrar um paciente novo ou iniciar outra visita somente depois de finalizar a anterior. O roteiro detalhado está no documento da tarefa 56.

## Organização

| Pasta             | Conteúdo                                                                         |
| ----------------- | -------------------------------------------------------------------------------- |
| `src/`            | Backend por responsabilidade: configuração, HTTP, autenticação e domínio.        |
| `public/screens/` | Telas funcionais e materiais de revisão que evoluem nos mesmos arquivos.         |
| `public/assets/`  | CSS e JavaScript compartilhados.                                                 |
| `public/design/`  | Guia visual que pode ser aberto pelo navegador.                                  |
| `design/`         | Apresentação editável da tarefa 55.                                              |
| `database/`       | Estrutura, dados fictícios e restrições incrementais.                            |
| `scripts/`        | Configuração, preparação e conferências do ambiente e do pacote.                 |
| `tests/`          | Testes unitários e `integracao/` com MySQL real.                                 |
| `docs/`           | Materiais numerados por tarefa, arquitetura, situação, histórico e verificações. |
| `.git/`           | Histórico local preservado no ZIP.                                               |

O número e o título aparecem nos materiais das tarefas e nas mensagens dos commits. Os arquivos de código usam nomes funcionais. JSON não recebe comentários porque o formato não permite; suas opções são explicadas nos documentos. Para conferir apenas os rascunhos, abrir `public/index.html` e escolher Rascunhos. Eles reutilizam os formulários em modo de visualização, sem gravar dados.

## Verificar

- `npm test`: validações, senhas, permissões e proteção de arquivos, sem exigir banco.
- `npm run configurar:testes`: cria `.env.teste` sem sobrescrever um arquivo existente.
- `npm run preparar:testes`: prepara o banco de testes. Conferir antes as opções do `.env.teste`.
- `npm run test:integracao`: executa os testes com MySQL; o nome do banco deve terminar com `_teste` e ser exclusivo dos testes.
- `npm run conferir:dados`: consulta contagens e divergências sem alterar registros.
- `npm run diagnostico`: confere ambiente, tabelas, restrições e contas fictícias.
- `npm run conferir:entrega`: confere os materiais técnicos do pacote.
- `npm run verificar:formatacao`: verifica o padrão; `npm run formatar` o aplica.

Passaram 32 testes unitários, 33 testes e subtestes de integração e 16 verificações em Chromium. A instalação em pasta limpa também foi conferida. Ambiente e alcance estão em `docs/VERIFICACAO.md`.

## Atualizar a entrega anterior

Preservar o `.env` local, atualizar os arquivos do projeto, executar `npm ci` e `npm run preparar`. As tabelas adicionais e as restrições são aplicadas sem recriar as tabelas anteriores. Não copiar uma pasta de projeto por tarefa.

## Commits e GitHub

`git log --reverse --oneline` mostra as 49 etapas. Os quinze commits anteriores foram preservados e as tarefas 26 a 59 acrescentam 34 commits. A sequência e as alterações agrupadas estão em `docs/HISTORICO.md`. São registros locais da preparação dos materiais, sem datas retroativas ou atribuição de autoria aos integrantes. Nada foi publicado no GitHub.

A pasta `.git/` conserva a sequência. Upload de arquivos pelo navegador cria o histórico dos próprios uploads e não transporta os commits locais. O documento da tarefa 59 explica as duas opções e a estrutura que deve ficar na raiz do repositório.

## Materiais e ações pendentes

`docs/STATUS_TAREFAS.md` distingue materiais preparados de atividades que dependem do grupo. A reunião com a orientadora, as horas reais do cronograma, o ensaio, o teste no computador da apresentação e o envio institucional não foram simulados. O documento acadêmico completo, o MER e o texto dos requisitos não foram fornecidos; os textos de apoio e os diagramas entregues devem ser incorporados e comparados com esses materiais.

Slides: `design/55 — Montar os slides da apresentação.pptx`. O grupo deve completar sua identificação e conferir o arquivo no aplicativo de apresentação escolhido. O roteiro de envio e o registro do comprovante estão no documento da tarefa 59.
