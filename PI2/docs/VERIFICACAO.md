# Verificação da versão integrada

Esta versão foi conferida com Node.js 24.22.1 e MySQL 8.0.46 em Linux, usando contas e pacientes fictícios em banco isolado. Os resultados abaixo correspondem ao código atual, incluindo as tarefas 26 a 58, e substituem os números da entrega anterior.

| Conferência                                | Resultado                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `npm test`                                 | 32 testes passaram                                                     |
| `npm run test:integracao`                  | 33 testes e subtestes passaram                                         |
| Navegação em Chromium durante a preparação | 16 verificações passaram                                               |
| Preparação do banco repetida               | Aplicada duas vezes sem apagar registros ou duplicar restrições        |
| Larguras da interface                      | 1365 e 390 pixels, sem rolagem horizontal nas páginas verificadas      |
| Fluxo pela interface                       | Cadastro, busca, abertura, triagem, consulta, medicação e encerramento |
| Erros JavaScript no fluxo testado          | Nenhum                                                                 |

## Correções reproduzidas

- Tarefa 50: o formulário de triagem ainda tinha um tratamento de desenho e passou a usar a API. Os rascunhos reutilizam as páginas sem login nem envio de dados. A troca de atendimento cancela a leitura anterior e bloqueia a consulta até receber o paciente correto.
- Tarefa 51: o teste reproduziu resposta 200 ao mudar temperatura de NULL para zero usando a mesma chave. Depois da correção, recebe 409 e mantém NULL no banco.
- Tarefa 52: uma atualização SQL direta aceitava saturação 101, embora a API recusasse o valor. O teste falhou antes da evolução do banco e passou com sete CHECKs. Também confere texto obrigatório e a rejeição de vínculo inexistente por chave estrangeira. Tentativas inválidas ficam numa transação desfeita no fim.

- Tarefa 58: a instalação limpa revelou um deadlock entre aberturas para pacientes diferentes. Um teste sincroniza duas transações antes do INSERT e reproduziu a falha. A abertura agora usa READ COMMITTED apenas nessa transação, mantendo o bloqueio da linha do paciente. O teste passou para pacientes diferentes e preservou o conflito esperado para duas visitas da mesma pessoa.

## Instalação em pasta limpa

Uma cópia sem dependências instaladas passou por `npm ci`, configuração dos ambientes, preparação de um banco novo, 32 testes unitários e 33 testes e subtestes de integração. Também passaram o diagnóstico de Node/MySQL, a conferência dos materiais e a formatação. Esse teste ocorreu em Linux no ambiente de preparação, não no computador real da apresentação.

## Como repetir as verificações incluídas

1. Execute `npm ci` e `npm test`.
2. Execute `npm run configurar:testes` e revise `.env.teste`. Use um banco exclusivo cujo nome termine em `_teste`.
3. Inicie o MySQL 8.0.16 ou superior, execute `npm run preparar:testes` duas vezes e então `npm run test:integracao`.
4. Execute `npm run verificar:formatacao`.
5. Para a conferência manual de interface, siga o fluxo do README alternando as três contas fictícias. A checagem automatizada de Chromium usada durante a preparação não integra o comando `npm test` nem exige instalação do navegador no pacote.
6. Execute `npm run conferir:dados` para consultar quantidades e divergências do banco indicado pelo `.env`, sem alterar os registros.

## Alcance e pendências

Os testes comprovam os cenários descritos, sem garantir ausência de qualquer defeito. Os checkpoints intermediários tiveram sintaxe conferida; a execução completa refere-se à versão integrada. A instalação no computador real da apresentação, a revisão em PowerPoint, o confronto com RF0001 a RF0011 e o MER original, a reunião com a orientadora, o ensaio e a entrega institucional dependem do grupo.

A fila mantém a ordem de abertura e mostra a classificação informada. O programa não calcula risco nem sugere medicamentos ou doses. Essas escolhas devem ser conferidas com os requisitos completos, que não acompanharam o material.
