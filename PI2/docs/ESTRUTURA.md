# Organização contínua do PI2

O pacote anterior agrupava código por tarefa. A nova estrutura usa a responsabilidade de cada arquivo, permitindo que o Git mostre a evolução do mesmo código sem manter cópias para cada etapa.

## Estrutura atual

| Caminho                              | Responsabilidade                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `src/config/`                        | Configuração e pool MySQL.                                                           |
| `src/http/`                          | Arquivos públicos, respostas e encaminhamento das rotas clínicas.                    |
| `src/auth/`                          | Sessões, senhas e perfis.                                                            |
| `src/pacientes/`                     | Cadastro e busca.                                                                    |
| `src/atendimentos/`                  | Abertura, filas, detalhes e encerramento.                                            |
| `src/triagem/`                       | Registro e classificação informada.                                                  |
| `src/consultas/` e `src/medicacoes/` | Registros ligados à visita e à sessão.                                               |
| `src/shared/`                        | Validação, transação e repetição de tentativa.                                       |
| `src/servidor.js`                    | Entrada do backend.                                                                  |
| `public/`                            | Índice, login e navegação.                                                           |
| `public/screens/`                    | Cadastro, recepção, triagem, médico, medicações e encerramento; rascunhos e revisão. |
| `public/assets/`                     | Estilos e comportamentos.                                                            |
| `public/design/`                     | Guia visual no navegador.                                                            |
| `design/`                            | Slides editáveis.                                                                    |
| `database/`                          | Sete tabelas, dados fictícios e restrições.                                          |
| `scripts/`                           | Instalação, preparação e conferência.                                                |
| `tests/` e `tests/integracao/`       | Regras sem banco e cenários com MySQL.                                               |
| `docs/`                              | Materiais das tarefas, arquitetura, histórico, situação e verificações.              |
| Raiz                                 | README, package.json, lockfile e configurações.                                      |
| `.git/`                              | Um commit por tarefa no pacote local.                                                |

## Caminhos de código que mudaram

| Caminho anterior                                       | Caminho atual                                                                                   |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `tarefa_15_backend/configuracao.js`                    | `src/config/banco.js`                                                                           |
| `tarefa_15_backend/http.js`                            | `src/http/respostas.js`                                                                         |
| `tarefa_15_backend/criar_env.js`                       | `scripts/configurar-env.js`                                                                     |
| `tarefa_15_backend/testar_conexao.js`                  | `scripts/testar-conexao.js`                                                                     |
| `tarefa_21_login/login.js`                             | `src/auth/autenticacao.js`                                                                      |
| `tarefa_21_login/senhas.js`                            | `src/auth/senhas.js`                                                                            |
| `tarefa_21_login/usuarios_teste.js`                    | `scripts/usuarios-teste.js`                                                                     |
| `tarefa_22_perfis/permissoes.js`                       | `src/auth/permissoes.js`                                                                        |
| `tarefa_23_cadastro_paciente/cadastro.js`              | `src/pacientes/cadastro.js`                                                                     |
| `tarefa_24_busca_paciente/busca.js`                    | `src/pacientes/busca.js`                                                                        |
| `tarefa_25_abertura_atendimento/atendimento.js`        | `src/atendimentos/abertura.js`                                                                  |
| `_comum/tema.css`                                      | `public/assets/css/tema.css`                                                                    |
| `_comum/prototipos.js`                                 | `public/assets/js/prototipos.js`, `rascunhos.js` e `revisao.js`, separados por responsabilidade |
| `tarefa_15_backend/public/`                            | `public/painel.html` e os arquivos funcionais em `public/assets/`                               |
| `tarefa_16_desenho_cadastro/index.html`                | `public/screens/cadastro.html`                                                                  |
| `tarefa_17_desenho_triagem/index.html`                 | `public/screens/triagem.html`                                                                   |
| `tarefa_18_desenho_medico/index.html`                  | `public/screens/medico.html`                                                                    |
| `tarefa_19_desenho_medicacoes_encerramento/index.html` | `public/screens/medicacoes-encerramento.html`                                                   |
| `apoio_banco/estrutura_exemplo.sql`                    | `database/estrutura.sql`                                                                        |
| `tarefa_14_dados_ficticios/dados_teste.sql`            | `database/dados-teste.sql`                                                                      |
| `ABRIR_PRIMEIRO.html`                                  | `public/index.html`; o servidor redireciona o endereço antigo do índice                         |
| `COMECE_AQUI.md` e READMEs das tarefas                 | `README.md` e os materiais em `docs/`                                                           |

## O que foi consolidado

Os rascunhos deixaram de ter suas próprias cópias dos formulários. Eles carregam os mesmos arquivos de cadastro, triagem e médico com `?modo=rascunho`. As tarefas 16, 17 e 18 refinam os arquivos criados na tarefa 11.

O JavaScript comum foi separado apenas quando havia responsabilidades diferentes: os desenhos explicam os botões, a navegação muda o rascunho, a revisão exporta a avaliação e o painel conversa com o backend. Não são versões numeradas do mesmo código.

O início reúne login e navegação. Os mesmos formulários refinados nos desenhos agora salvam pelo backend. O modo de rascunho apenas apresenta esses arquivos e bloqueia os envios, sem manter outra cópia do código.

## O que foi preservado

Foram preservados os três perfis, as validações, a sessão em memória, o hash de senhas, as consultas parametrizadas, os dados fictícios e a prevenção de repetições no cadastro e na abertura de atendimento. A evolução acrescenta triagens, consultas, medicacoes e encerramentos às três tabelas anteriores, com chaves estrangeiras e restrições incrementais. As senhas reais do ambiente não fazem parte do ZIP nem do histórico.

## Commits e desenvolvimento contínuo

As 49 etapas usam os números das tarefas existentes, de 11 a 59. Cada commit modifica os arquivos necessários para aquela etapa; por exemplo, `src/servidor.js` e `public/assets/js/painel.js` continuam mudando do login até a abertura de atendimento.

O pacote original não tinha histórico Git. Estes são commits locais da reorganização atual, sem datas retroativas e sem atribuir autoria aos integrantes. A sequência e o conteúdo agrupado estão em `HISTORICO.md`. O comando `git show --stat <hash>` apresenta os arquivos de uma etapa.

Para publicar preservando o histórico, mantenha `.git`, configure o remoto escolhido e envie a branch `main` pelo Git. O envio de arquivos pela interface web não conserva os commits locais. Nenhum repositório remoto foi criado ou alterado durante este trabalho.
