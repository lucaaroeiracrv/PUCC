create pi2 folder
# Trello completo — Projeto UPA

Vou estruturar o quadro com cartões que vocês poderão criar diretamente no Trello, mantendo a divisão entre Luca, Arthur, Diego, Kauan, Cauã e Eduardo e deixando o Luca com uma participação maior na liderança e no desenvolvimento do backend.

O cronograma enviado já registra atividades como modelagem do banco MySQL, desenvolvimento dos módulos identificados pelos requisitos RF0001 a RF0011, controle de acesso, testes e documentação. Vou usar essas atividades como referência para organizar os cartões, sem presumir detalhes dos requisitos que não aparecem no cronograma.&#x20;

Cronograma_Executado.docx



Importante: os status abaixo são sugestões para montar o quadro. Como algumas tarefas constam como executadas no cronograma, movam para `Done` tudo aquilo que já estiver realmente concluído. Não é necessário refazer uma atividade apenas porque ela aparece nesta lista.

## Como ficará o quadro

Product Backlog

Todas as demais entregas planejadas

Funcionalidades de backend e frontend, integração, testes, correções e documentação. Os cartões estarão ordenados por dependência de desenvolvimento.

To Do

Primeiro bloco de trabalho

Revisão dos requisitos, arquitetura, banco de dados, ambiente de desenvolvimento e estrutura visual. Coloque aqui o que a equipe pretende iniciar primeiro.

Doing

Mova os cartões para cá somente quando o trabalho começar.

Review/Test

Código implementado, aguardando revisão, integração ou validação.

Done

Entrega concluída e validada conforme os critérios definidos no cartão.

## Padrão que usaremos em todos os cartões

Cada cartão abaixo terá título, responsável, colaboradores, descrição, checklist e critério de conclusão. O responsável principal é quem acompanha a entrega até o fim; os colaboradores ajudam nas etapas que dependem deles.

Para facilitar a identificação no quadro, sugiro estas etiquetas: `Backend`, `Frontend`, `Banco de dados`, `Integração`, `Testes`, `Documentação` e `Bug`.

# Fase 1 — Planejamento e preparação

Esses são os primeiros cartões que recomendo avaliar para a lista `To Do`. Os demais começam no `Product Backlog`, mas seguem a ordem de dependência indicada.

## Cartão 01 — Revisar e consolidar os requisitos do sistema

To Do

Planejamento

Prioridade alta

Responsável: Luca Colaboradores: Arthur, Diego, Kauan, Cauã e Eduardo

Descrição

Revisar os requisitos funcionais e não funcionais do sistema UPA, garantindo que todos os integrantes compreendam os fluxos que precisam ser implementados. Usar os identificadores RF0001 a RF0011 registrados no cronograma para organizar as funcionalidades, sem inventar correspondências individuais entre os códigos e as telas.

Checklist

- Reunir a versão atual dos requisitos funcionais.
- Conferir os requisitos não funcionais e as regras de acesso.
- Identificar quais requisitos envolvem cadastro, recepção, triagem, atendimento médico, medicações e finalização.
- Registrar dúvidas e requisitos que ainda precisam de definição.
- Identificar dependências entre banco de dados, backend e frontend.
- Compartilhar a versão revisada com os seis integrantes.

Critério de conclusão: a equipe possui uma referência única dos requisitos, com dúvidas e pendências identificadas.

## Cartão 02 — Definir a arquitetura e os padrões do backend

To Do

Backend

Liderança do Luca

Responsável: Luca Colaboradores: Arthur e Diego

Descrição

Definir a estrutura geral do backend antes que os três desenvolvedores implementem funcionalidades separadas. Luca será responsável por estabelecer padrões consistentes, de modo que os módulos de Arthur e Diego possam ser integrados sem diferenças desnecessárias de organização, validação e formato das respostas.

Checklist

- Definir a estrutura de diretórios e a separação entre rotas, regras de negócio e acesso a dados, conforme a tecnologia escolhida.
- Definir padrões de nomes para arquivos, funções, variáveis e endpoints.
- Padronizar o formato das respostas de sucesso e de erro.
- Definir como serão tratados campos inválidos, dados ausentes e falhas de persistência.
- Estabelecer o fluxo de revisão de código e integração das alterações.
- Documentar as decisões e compartilhá-las com a equipe.

Critério de conclusão: os três integrantes do backend conhecem a estrutura que deverão seguir e conseguem iniciar módulos compatíveis entre si.

## Cartão 03 — Revisar e finalizar a modelagem do banco de dados

To Do

Banco de dados

Responsável: Eduardo Colaboradores: Luca e Arthur

Descrição

Revisar o modelo entidade-relacionamento e o diagrama físico do MySQL. A modelagem deve representar os dados necessários para as funcionalidades confirmadas, evitando tabelas redundantes e relacionamentos incompatíveis com os fluxos do sistema.

Checklist

- Revisar as entidades e seus atributos.
- Verificar as chaves primárias e estrangeiras.
- Validar os relacionamentos e suas cardinalidades.
- Conferir os dados necessários para pacientes, atendimentos, triagem, medicações e usuários, conforme os requisitos existentes.
- Conferir com Luca se a estrutura atende às necessidades do backend.
- Registrar as alterações realizadas no diagrama.

Critério de conclusão: o modelo está revisado, documentado e aprovado para orientar a criação das tabelas.

## Cartão 04 — Preparar o repositório e o ambiente de desenvolvimento

To Do

Infraestrutura

Responsável: Luca Colaboradores: Arthur, Diego, Kauan, Cauã e Eduardo

Descrição

Padronizar o ambiente utilizado pelos integrantes e deixar claro como obter o código, configurar as dependências e executar o sistema localmente. Esse cartão também deve registrar a estrutura do repositório e os procedimentos de trabalho em equipe.

Checklist

- Conferir o repositório e sua estrutura de diretórios.
- Definir convenções de branches e commits.
- Identificar arquivos de configuração necessários para frontend, backend e banco.
- Garantir que senhas e credenciais não sejam armazenadas no código versionado.
- Documentar como instalar dependências e iniciar cada parte do sistema.
- Pedir a pelo menos outro integrante que siga as instruções para validar se são suficientes.

Critério de conclusão: os integrantes conseguem preparar seus ambientes seguindo uma documentação comum.

## Cartão 05 — Padronizar os wireframes e a identidade visual

To Do

Frontend

Responsáveis: Kauan e Cauã Colaboradores: Luca, para esclarecer os fluxos disponíveis no backend

Descrição

Consolidar o desenho das telas antes de implementar todos os componentes. As telas devem manter a mesma identidade visual e apresentar os campos e as informações necessários às funções de cada perfil.

Checklist

- Revisar os wireframes existentes.
- Definir o padrão de navegação entre as telas.
- Padronizar cores, tipografia, espaçamento, botões, campos e tabelas.
- Definir o layout geral para recepção, enfermagem e médico, conforme os perfis previstos.
- Conferir os campos apresentados em cada fluxo com os requisitos.
- Registrar os componentes visuais que poderão ser reutilizados.

Critério de conclusão: as telas possuem uma estrutura visual coerente e a equipe sabe quais componentes serão reutilizados.

## Cartão 06 — Criar a estrutura física do banco MySQL

To Do

Banco de dados

Responsável: Eduardo Colaboradores: Luca

Descrição

Implementar a modelagem aprovada no MySQL, criando as tabelas e os relacionamentos necessários ao funcionamento das funcionalidades especificadas. O script deve ser reproduzível, de modo que o banco possa ser criado novamente em outro ambiente.

Checklist

- Criar as tabelas de acordo com o diagrama aprovado.
- Definir tipos de dados, chaves primárias e estrangeiras.
- Aplicar restrições de integridade que correspondam aos requisitos.
- Revisar campos obrigatórios e valores padrão.
- Organizar o script SQL de criação e atualização do esquema.
- Executar o script em uma base limpa e verificar se ele termina sem erros.

Critério de conclusão: o esquema pode ser criado no MySQL e respeita o modelo aprovado.

# Fase 2 — Banco de dados e fundação do backend

Estes cartões ficam inicialmente em `Product Backlog`, exceto aqueles que vocês decidirem puxar para `To Do` após concluir a preparação.

## Cartão 07 — Validar a integridade e as consultas do banco de dados



Product Backlog

`Banco de dados`



Responsável: Eduardo Colaboradores: Luca e Diego

Descrição

Validar se o banco está preparado para receber e recuperar os dados usados pelos módulos do sistema. O objetivo é encontrar inconsistências no esquema antes de depender dele para desenvolver todas as funcionalidades.

Checklist

- Inserir dados fictícios para os principais cenários de uso.
- Testar consultas de pacientes e respectivos atendimentos.
- Verificar se as chaves estrangeiras impedem referências inválidas.
- Testar os campos obrigatórios e as restrições de integridade.
- Verificar se consultas e relacionamentos retornam os dados esperados.
- Corrigir problemas encontrados e registrar eventuais limitações.

Critério de conclusão: o esquema e as consultas básicas foram validados com dados fictícios, sem utilizar informações reais de pacientes.

## Cartão 08 — Implementar a conexão do backend com o MySQL



Product Backlog

`Backend` `Banco de dados`



Responsáveis: Luca e Eduardo Responsável principal: Luca

Descrição

Configurar o acesso do backend ao banco de dados. A implementação deve reutilizar uma configuração centralizada e tratar falhas de conexão sem expor informações sensíveis na interface ou nas respostas da API.

Checklist

- Definir as configurações necessárias para acessar o MySQL.
- Utilizar variáveis de ambiente ou o mecanismo de configuração adotado pelo projeto.
- Implementar ou configurar o mecanismo de conexão compatível com a tecnologia utilizada.
- Testar a conexão em ambiente local.
- Testar o comportamento quando o banco estiver indisponível.
- Conferir com Eduardo se a aplicação acessa as tabelas esperadas.

Critério de conclusão: o backend consegue executar operações básicas no MySQL e trata falhas de conexão de forma controlada.

## Cartão 09 — Implementar validações e tratamento padronizado de erros na API



Product Backlog

`Backend`



Responsável: Luca Colaboradores: Arthur e Diego

Descrição

Implementar mecanismos compartilhados de validação e tratamento de erros para que os módulos não precisem tratar cada problema de uma forma diferente. O padrão deve ser definido antes que todos os endpoints sejam finalizados.

Checklist

- Definir como validar os dados recebidos nas requisições.
- Padronizar as respostas para erros de validação.
- Tratar registros não encontrados e operações não permitidas.
- Evitar retornar senhas, credenciais, detalhes internos ou informações sensíveis nas mensagens de erro.
- Documentar os formatos de resposta que o frontend deverá tratar.
- Aplicar o padrão nos módulos já desenvolvidos e orientar os demais integrantes.

Critério de conclusão: os módulos utilizam um padrão consistente de validação e resposta a erros, compatível com o contrato definido para a API.

# Fase 3 — Desenvolvimento do backend

Aqui está a divisão que dá ao Luca uma responsabilidade maior sem fazer com que Arthur e Diego dependam dele para cada linha de código.

## Cartão 10 — Implementar o cadastro de pacientes



Product Backlog

`Backend`



Responsável: Luca Colaboradores: Eduardo e Kauan

Descrição

Implementar a lógica do cadastro de pacientes prevista nos requisitos. O backend deve receber os dados do formulário, validar as informações e persistir os registros no MySQL.

Checklist

- Conferir os campos e as regras de cadastro definidos nos requisitos.
- Criar o endpoint ou conjunto de operações de cadastro.
- Validar a presença e o formato dos dados obrigatórios.
- Persistir os dados nas tabelas correspondentes.
- Tratar falhas de validação e de persistência.
- Criar testes para cadastro válido, campos ausentes e dados inválidos.
- Confirmar com Kauan o formato de requisição e resposta que o frontend deverá utilizar.

Critério de conclusão: o paciente pode ser cadastrado com dados válidos, os dados ficam persistidos no banco e as falhas previsíveis são tratadas corretamente.

## Cartão 11 — Implementar a consulta e a atualização de pacientes



Product Backlog

`Backend`



Responsável: Luca Colaboradores: Eduardo

Descrição

Implementar as operações de consulta e, caso os requisitos permitam, atualização dos dados de pacientes. As operações devem utilizar identificadores consistentes e respeitar as regras de acesso ao registro.

Checklist

- Implementar a consulta de um paciente pelo identificador utilizado pelo sistema.
- Implementar listagem ou busca de pacientes, se prevista nos requisitos.
- Implementar atualização dos campos permitidos, quando aplicável.
- Tratar identificadores inválidos e registros inexistentes.
- Evitar a exposição de dados desnecessários.
- Testar os resultados e confirmar a persistência no MySQL.

Critério de conclusão: as operações previstas nos requisitos funcionam e não permitem alterações não autorizadas.

## Cartão 12 — Implementar o fluxo de atendimento da recepção



Product Backlog

`Backend`



Responsável: Luca Colaboradores: Arthur e Eduardo

Descrição

Implementar a lógica que permite à recepção iniciar o atendimento de um paciente, relacionando os registros de acordo com o fluxo e as regras definidos no projeto.

O cartão contempla o fluxo de recepção associado aos requisitos RF0001 a RF0005 no cronograma. A correspondência individual entre cada código e cada operação deverá ser conferida na especificação completa.

Checklist

- Conferir como um atendimento deve ser iniciado.
- Criar a operação para registrar o início do atendimento.
- Relacionar o atendimento ao paciente correto.
- Definir os estados iniciais de acordo com os requisitos.
- Impedir registros inconsistentes ou associações inválidas.
- Testar o fluxo utilizando dados fictícios.
- Confirmar com Kauan os dados que a tela da recepção deverá enviar e receber.

Critério de conclusão: é possível iniciar e persistir um atendimento de acordo com as regras definidas, mantendo a relação correta entre paciente e atendimento.

## Cartão 13 — Implementar o registro dos dados da triagem



Product Backlog

`Backend`



Responsável: Arthur Colaboradores: Luca e Eduardo

Descrição

Implementar a operação que registra os dados coletados durante a triagem. Os campos, a obrigatoriedade das informações e o vínculo com o atendimento devem seguir os requisitos definidos pela equipe.

Checklist

- Conferir os dados que precisam ser registrados na triagem.
- Definir o vínculo entre triagem, paciente e atendimento.
- Implementar o endpoint de registro da triagem.
- Validar os campos obrigatórios e os formatos permitidos.
- Persistir os dados no MySQL.
- Tratar tentativas de registrar uma triagem em atendimento inexistente ou inválido.
- Criar testes dos principais cenários.
- Documentar o contrato da API e compartilhá-lo com Kauan.

Critério de conclusão: os dados válidos da triagem são registrados no atendimento correto e podem ser recuperados conforme as regras do sistema.

## Cartão 14 — Implementar a classificação de risco



Product Backlog

`Backend`



Responsável: Arthur Colaboradores: Luca e Eduardo

Descrição

Implementar as regras de classificação de risco previstas na especificação do projeto, considerando o protocolo de Manchester pesquisado durante o planejamento. Os critérios clínicos e as regras de classificação devem vir da documentação validada pelo grupo, não de regras improvisadas durante a programação.

Checklist

- Localizar e revisar as regras de classificação aprovadas no projeto.
- Identificar os dados necessários para determinar a classificação.
- Implementar as regras documentadas no backend.
- Registrar ou disponibilizar a classificação conforme o modelo definido.
- Tratar dados incompletos ou combinações de dados inválidas.
- Preparar testes baseados nos cenários definidos na documentação.
- Validar os resultados com os critérios do projeto.
- Coordenar com Luca a integração com o fluxo geral de atendimento.

Critério de conclusão: a classificação produz os resultados especificados para os cenários de teste aprovados e não utiliza critérios clínicos inventados.

## Cartão 15 — Implementar os dados do painel de atendimentos médicos



Product Backlog

`Backend`



Responsável: Diego Colaboradores: Luca e Eduardo

Descrição

Disponibilizar os dados que a tela do médico precisa para exibir os atendimentos. O conteúdo, os filtros e os estados exibidos deverão seguir os requisitos existentes e o modelo de banco de dados.

Checklist

- Identificar os campos necessários para apresentar cada atendimento.
- Implementar a consulta dos atendimentos que devem aparecer no painel.
- Incluir os dados de triagem e classificação necessários à visualização, quando previstos.
- Implementar os filtros exigidos nos requisitos.
- Definir como os estados dos atendimentos serão representados.
- Garantir que a consulta não retorne dados desnecessários para o perfil médico.
- Criar testes para lista vazia, múltiplos atendimentos e registros inválidos.
- Compartilhar com Cauã o formato esperado da resposta da API.

Critério de conclusão: a API fornece ao painel dados consistentes e suficientes para os fluxos previstos nos requisitos.

## Cartão 16 — Implementar o registro de medicações



Product Backlog

`Backend`



Responsável: Diego Colaboradores: Luca e Eduardo

Descrição

Implementar a funcionalidade de registro de medicações prevista no projeto, associando os registros ao atendimento correto e validando as informações exigidas pela especificação.

Checklist

- Conferir os campos necessários ao registro.
- Definir o relacionamento entre medicação e atendimento.
- Implementar a operação de registro.
- Validar as informações obrigatórias conforme os requisitos.
- Persistir as informações no MySQL.
- Tratar tentativas de associar um registro a atendimento inexistente ou incompatível.
- Testar o registro e a recuperação dos dados.
- Compartilhar o contrato da API com Cauã.

Critério de conclusão: os registros válidos são persistidos e associados corretamente, com falhas tratadas de acordo com os requisitos.

## Cartão 17 — Implementar a finalização do atendimento



Product Backlog

`Backend`



Responsável: Diego Colaboradores: Luca e Arthur

Descrição

Implementar a operação que finaliza um atendimento, obedecendo às condições e aos estados definidos no projeto. O backend deverá impedir transições inválidas sem perder o histórico necessário.

Checklist

- Conferir quais condições permitem finalizar o atendimento.
- Implementar a operação de finalização.
- Atualizar o estado do atendimento conforme o fluxo definido.
- Validar as condições necessárias antes de aceitar a finalização.
- Tratar tentativas de finalizar registros inexistentes ou já finalizados, conforme a regra aprovada.
- Testar o fluxo completo com os registros de medicação previstos nos requisitos.
- Verificar se o painel reflete o novo estado do atendimento.

Critério de conclusão: a finalização respeita as regras de negócio, registra o estado correto e produz resultados consistentes nas consultas posteriores.

## Cartão 18 — Implementar a autenticação dos usuários



Product Backlog

`Backend`



Responsável: Luca Colaboradores: Arthur e Eduardo

Descrição

Implementar o mecanismo de autenticação do sistema, utilizando a tecnologia escolhida pelo projeto. O backend deverá verificar as credenciais sem expor senhas e estabelecer uma sessão ou mecanismo de autenticação adequado à arquitetura adotada.

Checklist

- Conferir como usuários e credenciais estão representados no banco.
- Definir o mecanismo de autenticação compatível com o projeto.
- Implementar a operação de login.
- Tratar credenciais inválidas e usuários não autorizados.
- Garantir que senhas não sejam armazenadas ou transmitidas em texto puro indevidamente.
- Definir como o estado autenticado será validado nas próximas requisições.
- Testar login válido, inválido e os casos de falha previstos.
- Documentar como o frontend deverá enviar credenciais e manter a autenticação.

Critério de conclusão: usuários válidos podem se autenticar e as credenciais inválidas não concedem acesso.

## Cartão 19 — Implementar as permissões por perfil no backend



Product Backlog

`Backend`



Responsável: Luca Colaboradores: Arthur e Diego

Descrição

Implementar a verificação das permissões dos perfis de recepção, enfermagem e médico, citados no cronograma. A autorização deve ser aplicada no backend, não apenas pela ocultação de botões ou telas.

Checklist

- Revisar a matriz de permissões definida nos requisitos.
- Mapear as operações permitidas para cada perfil.
- Implementar as verificações de autorização nos endpoints pertinentes.
- Negar operações quando o usuário não tiver a permissão necessária.
- Tratar requisições não autenticadas e acessos proibidos.
- Criar testes de acesso permitido e negado para cada perfil relevante.
- Revisar os endpoints desenvolvidos por Arthur e Diego.
- Documentar qualquer regra de acesso ainda pendente de decisão.

Critério de conclusão: as permissões definidas são aplicadas no backend e os testes confirmam que os acessos proibidos são negados.

## Cartão 20 — Criar e executar testes automatizados do backend



Product Backlog

`Backend` `Testes`



Responsável: Luca Colaboradores: Arthur e Diego

Descrição

Consolidar os testes dos módulos de backend e verificar se mudanças em uma funcionalidade não comprometem as demais. Cada responsável deverá testar seu módulo, enquanto Luca coordena os padrões e a cobertura dos principais fluxos.

Checklist

- Definir a estratégia e a ferramenta de testes compatíveis com a tecnologia do projeto.
- Criar testes para cadastro e recepção.
- Criar testes para triagem e classificação de risco.
- Criar testes para painel, medicações e finalização.
- Criar testes para autenticação e permissões.
- Validar casos de sucesso, entrada inválida e registro inexistente.
- Executar os testes em ambiente isolado, evitando dados reais.
- Registrar e corrigir falhas detectadas.

Critério de conclusão: os testes definidos para os fluxos principais passam e as falhas remanescentes estão registradas e atribuídas.

# Fase 4 — Desenvolvimento do frontend

A divisão proposta mantém o Kauan mais concentrado no fluxo inicial do paciente e o Cauã mais concentrado no fluxo médico. Os dois deverão seguir o mesmo padrão visual e combinar os contratos da API com o backend antes de concluir as telas.

## Cartão 21 — Criar componentes reutilizáveis do frontend



Product Backlog

`Frontend`



Responsáveis: Kauan e Cauã

Descrição

Criar a estrutura visual compartilhada entre as telas, evitando que cada integrante implemente botões, campos e mensagens de formas diferentes. A implementação deve seguir os wireframes aprovados e a tecnologia adotada no projeto.

Checklist

- Definir a estrutura de componentes reutilizáveis.
- Padronizar campos de formulário, botões e mensagens.
- Criar padrões visuais para tabelas, listas e estados dos atendimentos.
- Definir componentes de carregamento e de apresentação de erros.
- Padronizar espaçamento, cores, tipografia e hierarquia visual.
- Verificar a consistência dos componentes nas telas dos dois integrantes.

Critério de conclusão: os componentes comuns podem ser utilizados nas diferentes telas sem reproduzir implementações visuais divergentes.

## Cartão 22 — Implementar a tela de login e a navegação por perfil



Product Backlog

`Frontend`



Responsável: Kauan Colaboradores: Luca e Cauã

Descrição

Implementar a entrada do usuário no sistema e organizar a navegação de acordo com o perfil autenticado. A interface deve trabalhar em conjunto com a autenticação do backend, sem considerar a simples ocultação de telas como mecanismo de segurança.

Checklist

- Criar a tela de login conforme o padrão visual definido.
- Validar os campos antes de enviar as credenciais.
- Integrar a tela com a API de autenticação.
- Apresentar mensagens adequadas para falhas de login.
- Tratar os estados de carregamento durante a autenticação.
- Definir a navegação visível para recepção, enfermagem e médico conforme a matriz de permissões.
- Tratar a expiração ou a ausência da autenticação conforme a arquitetura escolhida.
- Testar a navegação com diferentes perfis.

Critério de conclusão: o usuário consegue entrar conforme as regras de autenticação e visualiza a navegação prevista para seu perfil.

## Cartão 23 — Implementar a tela de cadastro de pacientes



Product Backlog

`Frontend`



Responsável: Kauan Colaboradores: Luca

Descrição

Implementar a interface utilizada para cadastrar pacientes, de acordo com os campos e as validações estabelecidos nos requisitos. O formulário deve enviar os dados ao backend e apresentar os resultados de maneira clara.

Checklist

- Criar os campos definidos na especificação.
- Indicar visualmente quais campos são obrigatórios.
- Validar formatos e campos preenchidos antes do envio, quando aplicável.
- Integrar o formulário com a API de cadastro.
- Apresentar confirmação após o cadastro bem-sucedido.
- Mostrar mensagens de erro para entradas inválidas ou falhas do servidor.
- Evitar envios repetidos causados por cliques sucessivos.
- Testar o formulário com entradas válidas e inválidas.

Critério de conclusão: o formulário cadastra pacientes pela API, informa o resultado da operação e trata erros sem perder desnecessariamente os dados preenchidos.

## Cartão 24 — Implementar a tela de atendimento da recepção



Product Backlog

`Frontend`



Responsável: Kauan Colaboradores: Luca e Eduardo

Descrição

Construir a interface de recepção para realizar as operações previstas no fluxo de atendimento inicial. Ela deverá consumir os endpoints implementados por Luca e apresentar o estado da operação de forma compreensível para o usuário.

Checklist

- Implementar os elementos de interface necessários para localizar ou selecionar um paciente, conforme os requisitos.
- Permitir iniciar o atendimento pelo fluxo definido no sistema.
- Integrar as operações com as APIs correspondentes.
- Apresentar os dados de confirmação após iniciar o atendimento.
- Tratar paciente inexistente, dados inválidos e falhas de conexão.
- Evitar a criação de registros duplicados por repetição de envio.
- Testar o fluxo do início ao fim com dados fictícios.

Critério de conclusão: a recepção consegue executar as operações previstas e o resultado exibido corresponde ao que foi persistido pelo backend.

## Cartão 25 — Implementar a tela de triagem



Product Backlog

`Frontend`



Responsável: Kauan Colaboradores: Arthur e Luca

Descrição

Construir a interface para registrar os dados necessários à triagem. A tela deve seguir os campos definidos na especificação e apresentar a classificação retornada pelo backend, sem implementar regras de classificação independentes no frontend.

Checklist

- Criar os campos definidos para o registro da triagem.
- Indicar quais dados precisam ser preenchidos.
- Integrar o formulário com a API de triagem.
- Exibir o resultado da classificação fornecido pelo backend.
- Tratar campos ausentes e respostas inválidas da API.
- Exibir mensagens claras quando houver falhas de envio.
- Testar o registro de triagem e a apresentação do resultado.
- Conferir o comportamento da tela com Arthur e Luca.

Critério de conclusão: a triagem pode ser registrada por meio da interface e os dados apresentados correspondem à resposta do backend.

## Cartão 26 — Implementar o painel de atendimentos médicos



Product Backlog

`Frontend`



Responsável: Cauã Colaboradores: Diego e Luca

Descrição

Construir o painel utilizado para visualizar os atendimentos disponíveis ao médico. O layout deve facilitar a leitura dos dados necessários ao fluxo de trabalho e respeitar as informações que a API fornece ao perfil autorizado.

Checklist

- Criar a estrutura visual da listagem de atendimentos.
- Exibir os campos definidos nos requisitos.
- Mostrar os estados e a classificação de risco retornados pelo backend, quando previstos.
- Implementar filtros previstos na especificação.
- Integrar a listagem com a API de atendimentos.
- Tratar carregamento, lista vazia e falhas da API.
- Atualizar a visualização após operações que alterem os estados dos atendimentos.
- Testar o painel com diferentes quantidades de registros fictícios.

Critério de conclusão: o painel apresenta os dados corretos da API e trata adequadamente carregamento, ausência de registros e erros.

## Cartão 27 — Implementar a interface de medicações e finalização



Product Backlog

`Frontend`



Responsável: Cauã Colaboradores: Diego e Luca

Descrição

Implementar as telas utilizadas para registrar medicações e realizar a finalização do atendimento. A interface deverá respeitar as condições de negócio definidas no backend e apresentar uma confirmação adequada para cada operação.

Checklist

- Criar os campos previstos para o registro de medicações.
- Integrar o formulário com a API de registro.
- Exibir as confirmações e os erros retornados pelo backend.
- Implementar a ação de finalização do atendimento.
- Apresentar confirmação antes da operação quando isso fizer parte do fluxo definido.
- Atualizar a tela após o atendimento ser finalizado.
- Impedir interações que contrariem o estado atual apresentado pela API.
- Testar o fluxo de registro e finalização com dados fictícios.

Critério de conclusão: a interface permite registrar medicações e finalizar atendimentos de acordo com as regras e os estados retornados pelo backend.

## Cartão 28 — Padronizar validações, mensagens e responsividade das telas



Product Backlog

`Frontend`



Responsáveis: Kauan e Cauã

Descrição

Revisar as telas implementadas para garantir uma experiência coerente. O objetivo é reduzir diferenças visuais, mensagens contraditórias e problemas de uso em diferentes tamanhos de tela.

Checklist

- Revisar a consistência dos formulários.
- Padronizar mensagens de sucesso, alerta e erro.
- Conferir os estados de carregamento de cada operação.
- Verificar o comportamento das telas em diferentes resoluções.
- Corrigir elementos sobrepostos, campos cortados e problemas de navegação.
- Verificar se os formulários apresentam erros sem apagar dados válidos desnecessariamente.
- Revisar os componentes compartilhados e eliminar duplicações evitáveis.

Critério de conclusão: as telas seguem o padrão visual definido e funcionam adequadamente nos ambientes e tamanhos de tela previstos pelo projeto.

# Fase 5 — Integração entre as partes do sistema

Esses cartões são importantes porque uma tela pronta não significa que a funcionalidade inteira esteja pronta. É aqui que o trabalho dos seis integrantes converge.

## Cartão 29 — Integrar as telas do frontend com as APIs do backend



Product Backlog

`Integração`



Responsável: Luca Colaboradores: Kauan, Cauã, Arthur e Diego

Descrição

Coordenar a conexão entre o frontend e o backend para garantir que as telas utilizem os endpoints corretos, enviem os dados no formato esperado e tratem as respostas da API. Kauan e Cauã serão responsáveis pelas integrações nas telas; Luca organizará os contratos compartilhados e resolverá inconsistências entre as partes.

Checklist

- Conferir os endpoints e seus formatos de entrada e saída.
- Integrar cadastro de pacientes e recepção.
- Integrar triagem e classificação de risco.
- Integrar o painel médico.
- Integrar registro de medicações e finalização.
- Conferir o tratamento de autenticação, permissões e erros.
- Verificar se os dados enviados pelas telas são persistidos corretamente.
- Registrar inconsistências e atribuí-las aos responsáveis pelos módulos.
- Repetir os testes após as correções.

Critério de conclusão: os fluxos integrados funcionam com dados reais de teste no ambiente de desenvolvimento, sem depender de respostas simuladas onde a API já deveria estar conectada.

## Cartão 30 — Validar o fluxo completo de atendimento



Product Backlog

`Integração` `Testes`



Responsável: Luca Colaboradores: Arthur, Diego, Kauan, Cauã e Eduardo

Descrição

Testar a sequência principal do sistema, da entrada do paciente até a finalização do atendimento. Esse cartão deve validar a interação entre banco de dados, backend e frontend, e não apenas cada módulo de forma isolada.

Checklist

- Preparar dados fictícios para os cenários de teste.
- Realizar o cadastro ou a localização do paciente, conforme o fluxo definido.
- Registrar o atendimento da recepção.
- Registrar a triagem e conferir a classificação de risco.
- Verificar se o atendimento aparece corretamente no painel médico.
- Registrar as medicações previstas no cenário.
- Finalizar o atendimento conforme as regras definidas.
- Conferir os registros persistidos no banco.
- Documentar falhas e encaminhá-las aos responsáveis.

Critério de conclusão: o fluxo de ponta a ponta segue os requisitos definidos, e os dados permanecem consistentes entre as telas, APIs e banco de dados.

## Cartão 31 — Testar o controle de acesso por perfil



Product Backlog

`Testes` `Segurança`



Responsável: Luca Colaboradores: Arthur, Kauan e Cauã

Descrição

Validar o comportamento do sistema para os perfis de recepção, enfermagem e médico. O teste precisa verificar tanto o que aparece na interface quanto as operações que o backend efetivamente permite.

Checklist

- Preparar usuários de teste para cada perfil previsto.
- Verificar a navegação apresentada para cada perfil.
- Testar as operações permitidas a cada perfil.
- Testar tentativas de acessar operações proibidas diretamente pela API.
- Verificar o tratamento de requisições sem autenticação.
- Confirmar que falhas de autorização não alteram registros indevidamente.
- Registrar os resultados e corrigir as permissões inconsistentes.

Critério de conclusão: as permissões respeitam a matriz aprovada e as tentativas de acesso não autorizado são bloqueadas no backend.

## Cartão 32 — Executar testes de regressão e corrigir falhas



Product Backlog

`Testes` `Bug`



Responsável: Luca Colaboradores: Arthur, Diego, Kauan, Cauã e Eduardo

Descrição

Reexecutar os testes dos módulos sempre que houver alterações relevantes e corrigir problemas detectados durante a integração. O objetivo é evitar que a correção de um defeito introduza outro em uma funcionalidade anteriormente validada.

Checklist

- Reunir as falhas registradas nos testes anteriores.
- Priorizar defeitos que impedem os fluxos principais.
- Criar um cartão separado para cada defeito que exija acompanhamento independente.
- Atribuir cada correção ao responsável pelo módulo afetado.
- Reexecutar o teste que originalmente identificou a falha.
- Reexecutar os testes de funcionalidades relacionadas.
- Registrar as correções e os resultados obtidos.
- Mover para `Done` apenas os defeitos corrigidos e verificados.

Critério de conclusão: as falhas prioritárias foram corrigidas, os testes correspondentes foram repetidos e não há defeitos críticos conhecidos sem registro ou responsável.

# Fase 6 — Documentação técnica e do projeto

Esses cartões complementam o desenvolvimento do sistema. É interessante mantê-los no quadro desde o começo, porque a documentação pode ser escrita à medida que cada módulo fica pronto.

## Cartão 33 — Documentar os endpoints e o funcionamento do backend



Product Backlog

`Documentação` `Backend`



Responsável: Luca Colaboradores: Arthur e Diego

Descrição

Documentar as APIs implementadas, facilitando o trabalho dos integrantes do frontend e a manutenção futura do sistema. A documentação deve refletir o comportamento real dos endpoints, e não apenas o comportamento inicialmente planejado.

Checklist

- Listar os endpoints implementados por módulo.
- Descrever o propósito de cada operação.
- Registrar parâmetros, campos de entrada e formatos de resposta.
- Documentar requisitos de autenticação e autorização.
- Apresentar exemplos de sucesso e de erro.
- Registrar limitações ou comportamentos específicos.
- Conferir se a documentação corresponde à implementação final.
- Compartilhar o material com a equipe.

Critério de conclusão: outro integrante consegue entender como utilizar os endpoints sem depender de explicações informais dos autores.

## Cartão 34 — Documentar a estrutura e a configuração do banco de dados



Product Backlog

`Documentação` `Banco de dados`



Responsável: Eduardo Colaboradores: Luca

Descrição

Documentar o esquema MySQL implementado, seus relacionamentos e as instruções necessárias para preparar o banco em um ambiente de desenvolvimento.

Checklist

- Registrar as tabelas implementadas e suas finalidades.
- Descrever as principais colunas e seus tipos de dados.
- Documentar as chaves primárias e estrangeiras.
- Explicar os relacionamentos relevantes.
- Incluir as instruções para criar o banco a partir dos scripts.
- Documentar as configurações necessárias para a conexão com a aplicação.
- Conferir se o documento corresponde ao esquema realmente utilizado.

Critério de conclusão: a estrutura do banco está documentada e outro integrante consegue preparar o ambiente sem depender de instruções verbais.

## Cartão 35 — Atualizar a documentação do projeto conforme o sistema implementado



Product Backlog

`Documentação`



Responsável: Eduardo Colaboradores: todos os integrantes, conforme as respectivas áreas

Descrição

Revisar a documentação do projeto e incorporar as alterações necessárias para que a descrição escrita corresponda ao sistema implementado. Esse trabalho inclui revisar os materiais existentes e registrar mudanças relevantes em funcionalidades, arquitetura e resultados.

Checklist

- Conferir a versão atual da documentação.
- Verificar se o escopo descrito corresponde às funcionalidades implementadas.
- Atualizar as descrições de funcionalidades que tenham mudado.
- Registrar limitações conhecidas do sistema.
- Confirmar com cada responsável técnico as informações sobre seu módulo.
- Conferir se diagramas e descrições ainda representam o sistema atual.
- Consolidar as alterações em uma versão revisada do documento.

Critério de conclusão: a documentação não apresenta divergências conhecidas em relação à versão do sistema que será entregue.

## Cartão 36 — Redigir a conclusão e os resultados obtidos



Product Backlog

`Documentação`



Responsável: Eduardo Colaboradores: Luca, Arthur, Diego, Kauan e Cauã

Descrição

Redigir a conclusão do trabalho, apresentando o que foi desenvolvido, quais objetivos foram alcançados, quais limitações permaneceram e quais melhorias podem ser consideradas no futuro.

Checklist

- Revisar os objetivos definidos no projeto.
- Conferir quais funcionalidades foram efetivamente implementadas.
- Registrar os resultados observados nos testes.
- Descrever limitações sem afirmar que funcionalidades incompletas foram concluídas.
- Registrar sugestões de melhorias futuras.
- Validar as informações técnicas com os responsáveis pelos módulos.
- Revisar a redação e a coerência com o restante do documento.

Critério de conclusão: a conclusão reflete os resultados reais do projeto e está alinhada aos objetivos e às limitações documentadas.

## Cartão 37 — Revisar referências e formatação acadêmica (ABNT)



Product Backlog

`Documentação`



Responsável: Eduardo Colaborador: Diego

Descrição

Revisar as referências bibliográficas e a formatação acadêmica do documento final, seguindo as orientações adotadas pela instituição e as normas aplicáveis ao trabalho.

Checklist

- Conferir as referências citadas no corpo do texto.
- Verificar se as referências utilizadas constam na lista final.
- Corrigir inconsistências de formatação das referências.
- Conferir citações, títulos, seções e demais elementos exigidos.
- Verificar sumário, paginação e organização do documento, quando aplicável.
- Revisar ortografia, padronização e apresentação visual.
- Realizar uma leitura final antes da entrega.

Critério de conclusão: o documento foi revisado e está consistente com as orientações acadêmicas e de formatação aplicáveis.

# Fase 7 — Preparação da entrega e apresentação

## Cartão 38 — Preparar a apresentação final do projeto



Product Backlog

`Apresentação`



Responsáveis: os seis integrantes

Descrição

Preparar uma apresentação que explique o problema abordado, os objetivos do projeto, as tecnologias e a arquitetura utilizadas, as funcionalidades implementadas e os resultados dos testes.

Distribuição sugerida

- Luca: arquitetura do backend, integração e visão geral técnica.
- Arthur: triagem e classificação de risco.
- Diego: painel médico, medicações e finalização.
- Kauan: telas da recepção, cadastro e triagem.
- Cauã: painel médico e telas de atendimento.
- Eduardo: modelagem do banco de dados, documentação e resultados.

Checklist

- Definir a sequência dos tópicos.
- Dividir a apresentação entre os integrantes.
- Preparar os slides com base no sistema realmente implementado.
- Explicar a arquitetura e a divisão dos módulos.
- Selecionar os fluxos que serão demonstrados.
- Conferir se os resultados apresentados estão apoiados nos testes realizados.
- Revisar o tempo e a consistência visual da apresentação.
- Preparar respostas para possíveis perguntas técnicas.

Critério de conclusão: os slides estão revisados, todos sabem a parte que apresentarão e o conteúdo corresponde ao projeto entregue.

## Cartão 39 — Realizar a revisão final e ensaiar a demonstração



Product Backlog

`Testes` `Apresentação`



Responsável: Luca Colaboradores: Arthur, Diego, Kauan, Cauã e Eduardo

Descrição

Realizar uma última verificação conjunta da versão que será entregue e ensaiar a demonstração. Esse cartão funciona como fechamento do projeto e deve ocorrer após as principais correções e atualizações da documentação.

Checklist

- Conferir se a versão final do código está atualizada no repositório.
- Confirmar que as instruções de execução estão documentadas.
- Verificar se a aplicação inicia no ambiente de demonstração.
- Testar o fluxo principal com dados fictícios.
- Confirmar que as telas e as APIs funcionam em conjunto.
- Conferir as permissões dos perfis de usuário.
- Verificar os slides e a documentação final.
- Ensaiar a apresentação e a demonstração prática.
- Registrar qualquer falha remanescente e decidir como será tratada antes da entrega.

Critério de conclusão: o grupo está preparado para apresentar a versão final e conhece eventuais limitações ainda existentes.

# Resumo da distribuição dos 39 cartões

| Integrante | Principais responsabilidades                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Luca       | Liderança técnica, arquitetura do backend, cadastro, recepção, autenticação, permissões, integração e testes gerais |
| Arthur     | Registro da triagem, classificação de risco e testes do módulo de triagem                                           |
| Diego      | Painel médico, registro de medicações, finalização e testes dessas funcionalidades                                  |
| Kauan      | Componentes do frontend, login, cadastro, recepção e triagem                                                        |
| Cauã       | Componentes do frontend, painel médico, medicações e finalização                                                    |
| Eduardo    | Modelagem, implementação e documentação do banco de dados, além da documentação acadêmica                           |

A divisão dá ao Luca uma participação maior no backend, mas mantém módulos completos sob a responsabilidade de Arthur e Diego. Já Kauan e Cauã têm suas entregas divididas por fluxo, facilitando o desenvolvimento paralelo.

## Ordem recomendada de execução

1\. Preparação

Cartões 01–06: requisitos, arquitetura, modelo de dados, ambiente, wireframes e criação do esquema MySQL.

2\. Banco e fundação do backend

Cartões 07–09: validação do banco, conexão e padrões de erro.

3\. Funcionalidades do sistema

Cartões 10–20: implementação dos módulos de backend e testes correspondentes.

4\. Interfaces

Cartões 21–28: componentes, login, cadastro, recepção, triagem e painel médico.

5\. Integração e validação

Cartões 29–32: conexão entre as partes, fluxo completo, permissões e correção de falhas.

6\. Documentação e entrega

Cartões 33–39: documentação técnica, relatório, conclusão, ABNT e apresentação final.

Como eu colocaria no Trello inicialmente: os cartões 01 a 06 em `To Do`, caso ainda sejam necessários. Os cartões 07 a 39 ficam em `Product Backlog`, organizados nessa sequência. Conforme as dependências forem resolvidas, movam as próximas tarefas para `To Do`.

Uma regra importante para vocês: não é necessário esperar o backend inteiro ficar pronto para começar o frontend. Kauan e Cauã podem desenvolver as telas com dados simulados enquanto Luca, Arthur e Diego implementam as APIs, desde que os formatos de entrada e saída tenham sido combinados. Isso permite que os seis trabalhem em paralelo sem comprometer a integração.
