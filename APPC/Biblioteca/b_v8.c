// Sistema de Biblioteca v8 - listas encadeadas, fila FIFO e pilha de historico.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define TAM_TEXTO 121
#define MAX_FILA 50

typedef struct FilaEspera {
    int codigosClientes[MAX_FILA];
    int inicio;
    int fim;
    int quantidade;
} FilaEspera;

typedef struct NoCliente {
    int codigo;
    char dados[TAM_TEXTO];
    int codigoLivroEmprestado; // -1 indica que nao possui emprestimo.
    struct NoCliente *proximo;
} Cliente;

typedef struct NoLivro {
    int codigo;
    char descricao[TAM_TEXTO];
    int estoque;
    FilaEspera filaEspera;
    struct NoLivro *proximo;
} Livro;

typedef struct NoHistorico {
    char operacao[TAM_TEXTO];
    struct NoHistorico *proximo;
} Historico;

// Le um inteiro descartando todo o restante da linha.
bool lerInteiro(int *numero) {
    bool valido;

    valido = (scanf("%d", numero) == 1);
    while (getchar() != '\n') {
        // Descarta caracteres invalidos ou restantes da linha.
    }
    return valido;
}

void lerTexto(char texto[], int tamanho) {
    int c;

    if (fgets(texto, tamanho, stdin) != NULL) {
        texto[strcspn(texto, "\n")] = '\0';
    } else {
        texto[0] = '\0';
    }

    if (!strchr(texto, '\n') && strlen(texto) == tamanho - 1) {
        while ((c = getchar()) != '\n' && c != EOF) {
            // Descarta o excesso que nao coube no vetor.
        }
    }
}

Cliente *buscarCliente(Cliente *inicio, int codigo) {
    Cliente *atual = inicio;

    while (atual != NULL) {
        if (atual->codigo == codigo) {
            return atual;
        }
        atual = atual->proximo;
    }
    return NULL;
}

Livro *buscarLivro(Livro *inicio, int codigo) {
    Livro *atual = inicio;

    while (atual != NULL) {
        if (atual->codigo == codigo) {
            return atual;
        }
        atual = atual->proximo;
    }
    return NULL;
}

void empilharHistorico(Historico **topo, const char *operacao) {
    Historico *novo = (Historico *)malloc(sizeof(Historico));

    if (novo == NULL) {
        printf("Erro: memoria insuficiente para o historico.\n");
        return;
    }

    strncpy(novo->operacao, operacao, TAM_TEXTO - 1);
    novo->operacao[TAM_TEXTO - 1] = '\0';
    novo->proximo = *topo;
    *topo = novo;
}

void mostrarHistorico(Historico *topo) {
    Historico *atual = topo;

    printf("\n HISTORICO DE OPERACOES (mais recente primeiro) \n");
    if (atual == NULL) {
        printf("Nenhuma operacao registrada.\n");
        return;
    }

    while (atual != NULL) {
        printf("- %s\n", atual->operacao);
        atual = atual->proximo;
    }
}

void cadastrarCliente(Cliente **inicio, Historico **historico) {
    Cliente *novo;
    Cliente *ultimo;
    Cliente *existente;
    int codigo;

    printf("\nCodigo do cliente: ");
    if (!lerInteiro(&codigo) || codigo <= 0) {
        printf("Erro: informe um codigo inteiro positivo.\n");
        return;
    }

    existente = buscarCliente(*inicio, codigo);
    if (existente != NULL) {
        printf("Erro: esse codigo de cliente ja foi cadastrado.\n");
        return;
    }

    novo = (Cliente *)malloc(sizeof(Cliente));
    if (novo == NULL) {
        printf("Erro: memoria insuficiente para cadastrar o cliente.\n");
        return;
    }

    novo->codigo = codigo;
    novo->codigoLivroEmprestado = -1;
    novo->proximo = NULL;

    printf("Nome e informacoes pessoais: ");
    lerTexto(novo->dados, TAM_TEXTO);

    if (*inicio == NULL) {
        *inicio = novo;
    } else {
        ultimo = *inicio;
        while (ultimo->proximo != NULL) {
            ultimo = ultimo->proximo;
        }
        ultimo->proximo = novo;
    }

    {
        char mensagem[TAM_TEXTO];
        snprintf(mensagem, TAM_TEXTO, "Cadastro de cliente - codigo %d", codigo);
        empilharHistorico(historico, mensagem);
    }
    printf("Cliente cadastrado.\n");
}

void cadastrarLivro(Livro **inicio, Historico **historico) {
    Livro *novo;
    Livro *ultimo;
    Livro *existente;
    int codigo;
    int estoque;

    printf("\nCodigo do livro: ");
    if (!lerInteiro(&codigo) || codigo <= 0) {
        printf("Erro: informe um codigo inteiro positivo.\n");
        return;
    }

    existente = buscarLivro(*inicio, codigo);
    if (existente != NULL) {
        printf("Erro: esse codigo de livro ja foi cadastrado.\n");
        return;
    }

    printf("Quantidade em estoque: ");
    if (!lerInteiro(&estoque) || estoque < 0) {
        printf("Erro: o estoque deve ser um inteiro nao negativo.\n");
        return;
    }

    novo = (Livro *)malloc(sizeof(Livro));
    if (novo == NULL) {
        printf("Erro: memoria insuficiente para cadastrar o livro.\n");
        return;
    }

    novo->codigo = codigo;
    novo->estoque = estoque;
    novo->proximo = NULL;
    novo->filaEspera.inicio = 0;
    novo->filaEspera.fim = 0;
    novo->filaEspera.quantidade = 0;

    printf("Descricao do livro: ");
    lerTexto(novo->descricao, TAM_TEXTO);

    if (*inicio == NULL) {
        *inicio = novo;
    } else {
        ultimo = *inicio;
        while (ultimo->proximo != NULL) {
            ultimo = ultimo->proximo;
        }
        ultimo->proximo = novo;
    }

    {
        char mensagem[TAM_TEXTO];
        snprintf(mensagem, TAM_TEXTO, "Cadastro de livro - codigo %d", codigo);
        empilharHistorico(historico, mensagem);
    }
    printf("Livro cadastrado.\n");
}

void listarClientes(Cliente *inicio) {
    Cliente *atual = inicio;

    printf("\n LISTA DE CLIENTES \n");
    if (atual == NULL) {
        printf("Nenhum cliente cadastrado.\n");
        return;
    }

    while (atual != NULL) {
        printf("Codigo: %d | Dados: %s | Livro emprestado: ", atual->codigo, atual->dados);
        if (atual->codigoLivroEmprestado == -1) {
            printf("nenhum\n");
        } else {
            printf("%d\n", atual->codigoLivroEmprestado);
        }
        atual = atual->proximo;
    }
}

void listarLivros(Livro *inicio) {
    Livro *atual = inicio;

    printf("\n LISTA DE LIVROS \n");
    if (atual == NULL) {
        printf("Nenhum livro cadastrado.\n");
        return;
    }

    while (atual != NULL) {
        printf("Codigo: %d | Estoque disponivel: %d | Descricao: %s | Na fila: %d\n",
               atual->codigo, atual->estoque, atual->descricao,
               atual->filaEspera.quantidade);
        atual = atual->proximo;
    }
}

void buscarExibirCliente(Cliente *inicio) {
    int codigo;
    Cliente *cliente;

    printf("\nInforme o codigo do cliente: ");
    if (!lerInteiro(&codigo)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    cliente = buscarCliente(inicio, codigo);
    if (cliente == NULL) {
        printf("Cliente nao encontrado.\n");
    } else {
        printf("Cliente encontrado.\n");
        printf("Codigo: %d\nDados: %s\nLivro emprestado: %d\n",
               cliente->codigo, cliente->dados, cliente->codigoLivroEmprestado);
    }
}

void buscarExibirLivro(Livro *inicio) {
    int codigo;
    Livro *livro;

    printf("\nInforme o codigo do livro: ");
    if (!lerInteiro(&codigo)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    livro = buscarLivro(inicio, codigo);
    if (livro == NULL) {
        printf("Livro nao encontrado.\n");
    } else {
        printf("Livro encontrado.\n");
        printf("Codigo: %d\nDescricao: %s\nEstoque disponivel: %d\n",
               livro->codigo, livro->descricao, livro->estoque);
    }
}

// Verifica se o cliente aparece em qualquer fila de espera.
bool clienteEstaEmAlgumaFila(Livro *inicioLivros, int codigoCliente) {
    Livro *livro = inicioLivros;

    while (livro != NULL) {
        FilaEspera *fila = &livro->filaEspera;
        int i;
        for (i = 0; i < fila->quantidade; i++) {
            int posicao = (fila->inicio + i) % MAX_FILA;
            if (fila->codigosClientes[posicao] == codigoCliente) {
                return true;
            }
        }
        livro = livro->proximo;
    }
    return false;
}

// Insere no fim da fila circular. Retorna 1=ok, 0=duplicado, -1=cheia.
int inserirNaFila(FilaEspera *fila, int codigoCliente) {
    int i;

    for (i = 0; i < fila->quantidade; i++) {
        int posicao = (fila->inicio + i) % MAX_FILA;
        if (fila->codigosClientes[posicao] == codigoCliente) {
            return 0;
        }
    }

    if (fila->quantidade == MAX_FILA) {
        return -1;
    }

    fila->codigosClientes[fila->fim] = codigoCliente;
    fila->fim = (fila->fim + 1) % MAX_FILA;
    fila->quantidade++;
    return 1;
}

// Remove o cliente do inicio da fila, preservando FIFO.
int retirarDaFila(FilaEspera *fila) {
    int codigo;

    if (fila->quantidade == 0) {
        return -1;
    }

    codigo = fila->codigosClientes[fila->inicio];
    fila->inicio = (fila->inicio + 1) % MAX_FILA;
    fila->quantidade--;

    if (fila->quantidade == 0) {
        fila->inicio = 0;
        fila->fim = 0;
    }
    return codigo;
}

void realizarEmprestimo(Cliente *inicioClientes, Livro *inicioLivros,
                        Historico **historico) {
    int codigoCliente, codigoLivro;
    Cliente *cliente;
    Livro *livro;
    char resposta[16];

    printf("\nCodigo do cliente: ");
    if (!lerInteiro(&codigoCliente)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    cliente = buscarCliente(inicioClientes, codigoCliente);
    if (cliente == NULL) {
        printf("Cliente nao encontrado.\n");
        return;
    }

    if (cliente->codigoLivroEmprestado != -1) {
        printf("Erro: o cliente ja possui um livro emprestado.\n");
        return;
    }

    printf("Codigo do livro: ");
    if (!lerInteiro(&codigoLivro)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    livro = buscarLivro(inicioLivros, codigoLivro);
    if (livro == NULL) {
        printf("Livro nao encontrado.\n");
        return;
    }

    if (livro->estoque > 0) {
        livro->estoque--;
        cliente->codigoLivroEmprestado = codigoLivro;
        {
            char mensagem[TAM_TEXTO];
            snprintf(mensagem, TAM_TEXTO,
                     "Emprestimo - cliente %d - livro %d",
                     codigoCliente, codigoLivro);
            empilharHistorico(historico, mensagem);
        }
        printf("Emprestimo realizado.\n");
        return;
    }

    printf("Nao ha exemplares disponiveis. Deseja entrar na fila de espera? (s/n): ");
    lerTexto(resposta, sizeof(resposta));

    if (resposta[0] != 's' && resposta[0] != 'S') {
        printf("Solicitacao de reserva cancelada.\n");
        return;
    }

    if (clienteEstaEmAlgumaFila(inicioLivros, codigoCliente)) {
        printf("Erro: o cliente ja esta aguardando em uma fila.\n");
        return;
    }

    {
        int resultado = inserirNaFila(&livro->filaEspera, codigoCliente);
        if (resultado == 1) {
            char mensagem[TAM_TEXTO];
            snprintf(mensagem, TAM_TEXTO,
                     "Reserva - cliente %d - livro %d",
                     codigoCliente, codigoLivro);
            empilharHistorico(historico, mensagem);
            printf("Cliente inserido no final da fila de espera.\n");
        } else if (resultado == 0) {
            printf("Erro: esse cliente ja esta na fila deste livro.\n");
        } else {
            printf("Erro: a fila de espera esta cheia.\n");
        }
    }
}

void realizarDevolucao(Cliente *inicioClientes, Livro *inicioLivros,
                       Historico **historico) {
    int codigoCliente, codigoLivro;
    Cliente *cliente;
    Livro *livro;

    printf("\nCodigo do cliente que esta devolvendo: ");
    if (!lerInteiro(&codigoCliente)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    cliente = buscarCliente(inicioClientes, codigoCliente);
    if (cliente == NULL) {
        printf("Cliente nao encontrado.\n");
        return;
    }

    printf("Codigo do livro: ");
    if (!lerInteiro(&codigoLivro)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    livro = buscarLivro(inicioLivros, codigoLivro);
    if (livro == NULL) {
        printf("Livro nao encontrado.\n");
        return;
    }

    if (cliente->codigoLivroEmprestado != codigoLivro) {
        printf("Erro: esse cliente nao possui este livro emprestado.\n");
        return;
    }

    cliente->codigoLivroEmprestado = -1;
    livro->estoque++;

    {
        char mensagem[TAM_TEXTO];
        snprintf(mensagem, TAM_TEXTO,
                 "Devolucao - cliente %d - livro %d",
                 codigoCliente, codigoLivro);
        empilharHistorico(historico, mensagem);
    }
    printf("Devolucao registrada. Estoque atualizado: %d.\n", livro->estoque);

    if (livro->filaEspera.quantidade == 0) {
        printf("Nao ha clientes aguardando este livro.\n");
        return;
    }

    {
        int proximoCodigo = retirarDaFila(&livro->filaEspera);
        Cliente *proximo = buscarCliente(inicioClientes, proximoCodigo);

        if (proximo != NULL) {
            if (livro->estoque > 0 && proximo->codigoLivroEmprestado == -1) {
                livro->estoque--;
                proximo->codigoLivroEmprestado = codigoLivro;
                printf("Proximo cliente atendido: %s (codigo %d).\n",
                       proximo->dados, proximo->codigo);
                {
                    char mensagem[TAM_TEXTO];
                    snprintf(mensagem, TAM_TEXTO,
                             "Emprestimo por devolucao - cliente %d - livro %d",
                             proximo->codigo, codigoLivro);
                    empilharHistorico(historico, mensagem);
                }
            } else {
                printf("Proximo da fila: %s (codigo %d), aguardando disponibilidade.\n",
                       proximo->dados, proximo->codigo);
            }
        }
    }
}

void consultarEmprestimos(Cliente *inicioClientes, Livro *inicioLivros) {
    Cliente *cliente = inicioClientes;
    bool encontrou = false;

    printf("\n SITUACAO DOS EMPRESTIMOS \n");
    while (cliente != NULL) {
        if (cliente->codigoLivroEmprestado != -1) {
            Livro *livro = buscarLivro(inicioLivros, cliente->codigoLivroEmprestado);
            printf("Cliente %d (%s) - Livro %d",
                   cliente->codigo, cliente->dados, cliente->codigoLivroEmprestado);
            if (livro != NULL) {
                printf(" (%s)", livro->descricao);
            }
            printf("\n");
            encontrou = true;
        }
        cliente = cliente->proximo;
    }

    if (!encontrou) {
        printf("Nenhum livro emprestado.\n");
    }
}

void consultarFila(Livro *inicioLivros, Cliente *inicioClientes) {
    int codigo;
    Livro *livro;

    printf("\nInforme o codigo do livro: ");
    if (!lerInteiro(&codigo)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    livro = buscarLivro(inicioLivros, codigo);
    if (livro == NULL) {
        printf("Livro nao encontrado.\n");
        return;
    }

    printf("Fila de espera do livro %d, do inicio ao fim:\n", codigo);
    if (livro->filaEspera.quantidade == 0) {
        printf("Fila vazia.\n");
        return;
    }

    {
        FilaEspera *fila = &livro->filaEspera;
        int i;
        for (i = 0; i < fila->quantidade; i++) {
            int posicao = (fila->inicio + i) % MAX_FILA;
            int codigoCliente = fila->codigosClientes[posicao];
            Cliente *cliente = buscarCliente(inicioClientes, codigoCliente);

            printf("%d. ", i + 1);
            if (cliente != NULL) {
                printf("%s (codigo %d)\n", cliente->dados, cliente->codigo);
            } else {
                printf("Cliente inexistente (codigo %d)\n", codigoCliente);
            }
        }
    }
}

void exibirMenu(void) {
    printf("\n SISTEMA DE BIBLIOTECA - V8 \n");
    printf("1 - Cadastrar cliente\n");
    printf("2 - Cadastrar livro\n");
    printf("3 - Listar clientes\n");
    printf("4 - Listar livros\n");
    printf("5 - Buscar cliente\n");
    printf("6 - Buscar livro\n");
    printf("7 - Realizar emprestimo\n");
    printf("8 - Realizar devolucao\n");
    printf("9 - Consultar emprestimos\n");
    printf("10 - Exibir historico de operacoes\n");
    printf("11 - Consultar fila de espera\n");
    printf("0 - Sair\n");
    printf("Opcao: ");
}

void liberarClientes(Cliente **inicio) {
    Cliente *atual = *inicio;
    while (atual != NULL) {
        Cliente *proximo = atual->proximo;
        free(atual);
        atual = proximo;
    }
    *inicio = NULL;
}

void liberarLivros(Livro **inicio) {
    Livro *atual = *inicio;
    while (atual != NULL) {
        Livro *proximo = atual->proximo;
        free(atual);
        atual = proximo;
    }
    *inicio = NULL;
}

void liberarHistorico(Historico **topo) {
    Historico *atual = *topo;
    while (atual != NULL) {
        Historico *proximo = atual->proximo;
        free(atual);
        atual = proximo;
    }
    *topo = NULL;
}

int main(void) {
    Cliente *inicioClientes = NULL;
    Livro *inicioLivros = NULL;
    Historico *historico = NULL;
    int opcao;

    do {
        exibirMenu();

        if (!lerInteiro(&opcao)) {
            printf("Opcao invalida: digite um numero inteiro.\n");
            continue;
        }

        switch (opcao) {
            case 1:
                cadastrarCliente(&inicioClientes, &historico);
                break;
            case 2:
                cadastrarLivro(&inicioLivros, &historico);
                break;
            case 3:
                listarClientes(inicioClientes);
                break;
            case 4:
                listarLivros(inicioLivros);
                break;
            case 5:
                buscarExibirCliente(inicioClientes);
                break;
            case 6:
                buscarExibirLivro(inicioLivros);
                break;
            case 7:
                realizarEmprestimo(inicioClientes, inicioLivros, &historico);
                break;
            case 8:
                realizarDevolucao(inicioClientes, inicioLivros, &historico);
                break;
            case 9:
                consultarEmprestimos(inicioClientes, inicioLivros);
                break;
            case 10:
                mostrarHistorico(historico);
                break;
            case 11:
                consultarFila(inicioLivros, inicioClientes);
                break;
            case 0:
                printf("Encerrando o sistema.\n");
                break;
            default:
                printf("Opcao invalida. Escolha uma opcao do menu.\n");
        }
    } while (opcao != 0);

    liberarClientes(&inicioClientes);
    liberarLivros(&inicioLivros);
    liberarHistorico(&historico);
    return 0;
}
