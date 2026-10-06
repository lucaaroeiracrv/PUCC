'''
Implementar a opção 2 (procurar contato) da seguinte forma:
Ficar pedindo para digitar um nome até digitar um nome que existe;
mostrar então na tela TODOS os demais dados daquela pessoa, cujo
nome foi digitado.

Implementar a opção 3 (atualizar contato) da seguinte forma:
Ficar mostrando um menu oferecendo as opções de atualizar aniversário, ou
endereco, ou telefone, ou celular, ou email, ou finalizar as
atualizações; ficar pedindo para digitar a opção até digitar uma
opção válida; realizar a atulização solicitada; até ser escolhida a
opção de finalizar as atualizações.

Implementar a opção 4 (listar contato) da seguinte forma:
Mostrar na tela os TODOS os dados de CADA um dos contatos presentes
na lista chamada agenda (eventualmente chamada de agd).

Implemenar nas novas opções, BEM COMO nas já implementadas, todas as
validações cabíveis.

Entregar em aula prática ou dia 25 ou dia 26 ou dia 27, conforme seja
seu dia de aula, na forma de demonstração para o professor.
'''
def apresenteSe ():
    print('+-------------------------------------------------------------+')
    print('|                                                             |')
    print('| AGENDA PESSOAL DE ANIVERSÁRIOS E FORMAS DE CONTATAR PESSOAS |')
    print('|                                                             |')
    print('| Prof André Luís dos Reis Gomes de Carvalho                  |')
    print('| &                                                           |')
    print('| Luca Aroeira Crivelaro                                      |')
    print('|                                                             |')
    print('| Versão 1.1 de 19/maio/2026                                  |')
    print('|                                                             |')
    print('+-------------------------------------------------------------+')

def umTexto (solicitacao, mensagem, valido):
    digitouDireito=False
    while not digitouDireito:
        txt=input(solicitacao)

        if txt not in valido:
            print(mensagem,'- Favor redigitar...')
        else:
            digitouDireito=True

    return txt

def opcaoEscolhida (mnu):
    print ()

    opcoesValidas=[]
    posicao=0
    while posicao<len(mnu):
        print (posicao+1,') ',mnu[posicao],sep='')
        opcoesValidas.append(str(posicao+1))
        posicao+=1

    print()
    return umTexto('Qual é a sua opção? ', 'Opção inválida', opcoesValidas)

'''
procura nom em agd e, se achou, retorna:
uma lista contendo True e a posicao onde achou;
MAS, se não achou, retorna:
uma lista contendo False e a posição onde inserir,
aquilo que foi buscado, mas nao foi encontrado,
mantendo a ordenação da lista.
'''
def ondeEsta (nom,agd):
    inicio=0
    final =len(agd)-1
    
    while inicio<=final:
        meio=(inicio+final)//2
        
        if nom.upper()==agd[meio][0].upper():
            return [True,meio]
        elif nom.upper()<agd[meio][0].upper():
            final=meio-1
        else: # nom.upper()>agd[meio][0].upper()
            inicio=meio+1
            
    return [False,inicio]

def cadastrar (agd):
    chave_para_digitar_ate_acertar_ligada=True
    while chave_para_digitar_ate_acertar_ligada:
        nome=input('\nNome.......: ').strip()

        # Nome do contato e obrigatorio.
        if nome=='':
            print('Nome não pode ficar vazio; tente novamente!')
            continue

        resposta=ondeEsta(nome,agd)
        achou   = resposta[0]
        posicao = resposta[1]

        if achou:
            print ('Pessoa já cadastrada; tente novamente!')
        else:
            chave_para_digitar_ate_acertar_ligada=False
            
    aniversario=input('Aniversário: ')
    endereco   =input('Endereço...: ')
    telefone   =input('Telefone...: ')
    celular    =input('Celular....: ')
    email      =input('e-mail.....: ')
    
    contato=[nome,aniversario,endereco,telefone,celular,email]
    
    agd.insert(posicao,contato)
    print('Cadastro realizado com sucesso!')

def procurar (agd):
    # Antes de procurar, verifica se ha contatos cadastrados.
    if len(agd)==0:
        print('Agenda vazia!')
    else:
        # Continua pedindo o nome ate encontrar um contato existente.
        chave_para_digitar_ate_acertar_ligada=True
        while chave_para_digitar_ate_acertar_ligada:
            nome=input('\nNome.......: ').strip()

            # Nome nao pode ser vazio.
            if nome=='':
                print('Nome não pode ficar vazio; tente novamente!')
                continue

            # Busca binaria do contato pelo nome.
            resposta=ondeEsta(nome,agd)
            achou   = resposta[0]
            posicao = resposta[1]

            if not achou:
                print('Pessoa não cadastrada; tente novamente!')
            else:
                chave_para_digitar_ate_acertar_ligada=False

        # Exibe todos os dados do contato encontrado.
        print('-----------------------------')
        print('Nome.......: ',agd[posicao][0])
        print('Aniversário: ',agd[posicao][1])
        print('Endereço...: ',agd[posicao][2])
        print('Telefone...: ',agd[posicao][3])
        print('Celular....: ',agd[posicao][4])
        print('e-mail.....: ',agd[posicao][5])
        print('-----------------------------')

def atualizar (agd):
    # Nao ha como atualizar sem contatos na agenda.
    if len(agd)==0:
        print('Agenda vazia!')
    else:
        # Primeiro, obriga a escolha de um contato existente.
        chave_para_digitar_ate_acertar_ligada=True
        while chave_para_digitar_ate_acertar_ligada:
            nome=input('\nNome.......: ').strip()

            # Nome nao pode ser vazio.
            if nome=='':
                print('Nome não pode ficar vazio; tente novamente!')
                continue

            # Localiza o contato pelo nome.
            resposta=ondeEsta(nome,agd)
            achou   = resposta[0]
            posicao = resposta[1]

            if not achou:
                print('Pessoa não cadastrada; tente novamente!')
            else:
                chave_para_digitar_ate_acertar_ligada=False

        # Submenu de atualizacao.
        submenu=['Atualizar Aniversário',\
                 'Atualizar Endereço',\
                 'Atualizar Telefone',\
                 'Atualizar Celular',\
                 'Atualizar e-mail',\
                 'Finalizar Atualizações']

        chave_para_atualizar_ligada=True
        while chave_para_atualizar_ligada:
            opcao = int(opcaoEscolhida(submenu))

            if opcao==1:
                # Informa o valor atual (ou vazio) e atualiza o aniversario.
                if agd[posicao][1]=='':
                    print('Aniversário atual está vazio.')
                else:
                    print('Aniversário atual: ',agd[posicao][1])
                agd[posicao][1]=input('Novo aniversário: ')
                print('Aniversário atualizado com sucesso!')
            elif opcao==2:
                # Informa o valor atual (ou vazio) e atualiza o endereco.
                if agd[posicao][2]=='':
                    print('Endereço atual está vazio.')
                else:
                    print('Endereço atual...: ',agd[posicao][2])
                agd[posicao][2]=input('Novo endereço...: ')
                print('Endereço atualizado com sucesso!')
            elif opcao==3:
                # Informa o valor atual (ou vazio) e atualiza o telefone.
                if agd[posicao][3]=='':
                    print('Telefone atual está vazio.')
                else:
                    print('Telefone atual...: ',agd[posicao][3])
                agd[posicao][3]=input('Novo telefone...: ')
                print('Telefone atualizado com sucesso!')
            elif opcao==4:
                # Informa o valor atual (ou vazio) e atualiza o celular.
                if agd[posicao][4]=='':
                    print('Celular atual está vazio.')
                else:
                    print('Celular atual....: ',agd[posicao][4])
                agd[posicao][4]=input('Novo celular....: ')
                print('Celular atualizado com sucesso!')
            elif opcao==5:
                # Informa o valor atual (ou vazio) e atualiza o e-mail.
                if agd[posicao][5]=='':
                    print('e-mail atual está vazio.')
                else:
                    print('e-mail atual.....: ',agd[posicao][5])
                agd[posicao][5]=input('Novo e-mail.....: ')
                print('e-mail atualizado com sucesso!')
            else: # opcao==6
                # Encerra o submenu de atualizacoes.
                chave_para_atualizar_ligada=False

def listar (agd):
    if len(agd)==0:
        print("Agenda vazia!")
    else:
        posicao=0
        while posicao<len(agd):
            print('-----------------------------')
            print('Nome.......: ',agd[posicao][0])
            print('Aniversário: ',agd[posicao][1])
            print('Endereço...: ',agd[posicao][2])
            print('Telefone...: ',agd[posicao][3])
            print('Celular....: ',agd[posicao][4])
            print('e-mail.....: ',agd[posicao][5])
            posicao+=1
        print('-----------------------------')

def excluir (agd):
    # Excluir tambem depende de haver contatos cadastrados.
    if len(agd)==0:
        print('Agenda vazia!')
    else:
        nome=input('\nNome.......: ').strip()

        # Nome nao pode ser vazio.
        if nome=='':
            print('Nome não pode ficar vazio!')
        else:
            # Procura o contato para excluir.
            resposta=ondeEsta(nome,agd)
            achou   = resposta[0]
            posicao = resposta[1]

            if not achou:
                print('Pessoa não cadastrada!')
            else:
                # So aceita confirmacao valida: S ou N.
                confirmacao_valida=False
                while not confirmacao_valida:
                    confirmacao=input('Confirma exclusão (S/N)? ').strip().upper()

                    if confirmacao!='S' and confirmacao!='N':
                        print('Confirmação inválida - Favor redigitar...')
                    else:
                        confirmacao_valida=True

                # Se confirmar com S, remove; com N, mantem.
                if confirmacao=='S':
                    agd.pop(posicao)
                    print('Exclusão realizada com sucesso!')
                else: # confirmacao=='N'
                    print('Exclusão não realizada!')

# daqui para cima, definimos subprogramas (ou módulos, é a mesma coisa)
# daqui para baixo, implementamos o programa (nosso CRUD, C=create(cadastrar), R=read(recuperar), U=update(atualizar), D=delete(remover,apagar)

apresenteSe()

agenda=[]

menu=['Cadastrar Contato',\
      'Procurar Contato',\
      'Atualizar Contato',\
      'Listar Contatos',\
      'Excluir Contato',\
      'Sair do Programa']

chave_para_executar_opcoes_ate_escolher_sair_ligada=True
while chave_para_executar_opcoes_ate_escolher_sair_ligada:
    opcao = int(opcaoEscolhida(menu))

    if opcao==1:
        cadastrar(agenda)
    elif opcao==2:
        procurar(agenda)
    elif opcao==3:
        atualizar(agenda)
    elif opcao==4:
        listar(agenda)
    elif opcao==5:
        excluir(agenda)
    else: # opcao==6
        chave_para_executar_opcoes_ate_escolher_sair_ligada=False
        
print('PROGRAMA ENCERRADO COM SUCESSO!')
