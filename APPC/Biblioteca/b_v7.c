// Sistema de Biblioteca v7 - ERD e fila de espera (FIFO).
// A fila de cada livro e circular: inicio aponta para o proximo atendimento
// e fim aponta para a proxima posicao de insercao.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_LIVROS 3
#define MAX_CLIENTES 3
#define MAX_FILA MAX_CLIENTES
#define TAM_TEXTO 121

typedef struct {
    int codigosClientes[MAX_FILA];
    int inicio;
    int fim;          // Proxima posicao onde um cliente sera inserido.
    int quantidade;
} FilaEspera;

typedef struct {
    int codigo;
    char dados[TAM_TEXTO];
    int codigoLivroEmprestado; // -1 significa que nao possui emprestimo.
} Cliente;

typedef struct {
    int codigo;
    char descricao[TAM_TEXTO];
    int estoque;
    FilaEspera filaEspera;
} Livro;

// Le um inteiro e descarta o restante da linha antes de uma eventual leitura
// de texto. Retorna false se a entrada nao representar um inteiro.
bool lerInteiro(int *numero) {
    int resultado = scanf("%d", numero);
    int caractere;

    while ((caractere = getchar()) != '\n' && caractere != EOF) {
        // Descarta os caracteres restantes da linha.
    }

    return resultado == 1;
}

void lerTexto(char texto[], int tamanho) {
    size_t comprimento;

    if (fgets(texto, tamanho, stdin) == NULL) {
        texto[0] = '\0';
        return;
    }

    comprimento = strlen(texto);
    if (comprimento > 0 && texto[comprimento - 1] == '\n') {
        texto[comprimento - 1] = '\0';
    } else {
        int caractere;
        while ((caractere = getchar()) != '\n' && caractere != EOF) {
            // Descarta o excesso quando o texto ultrapassa o limite do vetor.
        }
    }
}

int buscarLivro(Livro livros[], int quantidadeLivros, int codigo) {
    int i;
    for (i = 0; i < quantidadeLivros; i++) {
        if (livros[i].codigo == codigo) {
            return i;
        }
    }
    return -1;
}

int buscarCliente(Cliente clientes[], int quantidadeClientes, int codigo) {
    int i;
    for (i = 0; i < quantidadeClientes; i++) {
        if (clientes[i].codigo == codigo) {
            return i;
        }
    }
    return -1;
}

// Retorna 1 quando insere, 0 se o cliente ja esta na fila e -1 se esta cheia.
int enfileirar(FilaEspera *fila, int codigoCliente) {
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

    // A insercao sempre ocorre no fim. O modulo permite reutilizar
    // posicoes liberadas no inicio da fila (fila circular).
    fila->codigosClientes[fila->fim] = codigoCliente;
    fila->fim = (fila->fim + 1) % MAX_FILA;
    fila->quantidade++;
    return 1;
}

// Remove e devolve o primeiro codigo da fila. Retorna -1 se estiver vazia.
int desenfileirar(FilaEspera *fila) {
    int codigoCliente;

    if (fila->quantidade == 0) {
        return -1;
    }

    codigoCliente = fila->codigosClientes[fila->inicio];
    fila->inicio = (fila->inicio + 1) % MAX_FILA;
    fila->quantidade--;

    // Mantem os indices organizados quando a fila fica vazia.
    if (fila->quantidade == 0) {
        fila->inicio = 0;
        fila->fim = 0;
    }

    return codigoCliente;
}

bool clienteEstaEmAlgumaFila(Livro livros[], int quantidadeLivros, int codigoCliente) {
    int i, j;

    for (i = 0; i < quantidadeLivros; i++) {
        FilaEspera *fila = &livros[i].filaEspera;
        for (j = 0; j < fila->quantidade; j++) {
            int posicao = (fila->inicio + j) % MAX_FILA;
            if (fila->codigosClientes[posicao] == codigoCliente) {
                return true;
            }
        }
    }
    return false;
}

int cadastrarCliente(Cliente clientes[], int quantidadeClientes) {
    Cliente novo;

    if (quantidadeClientes >= MAX_CLIENTES) {
        printf("Limite de clientes atingido.\n");
        return quantidadeClientes;
    }

    printf("\nCodigo do cliente: ");
    if (!lerInteiro(&novo.codigo) || novo.codigo <= 0) {
        printf("Erro: informe um codigo inteiro positivo.\n");
        return quantidadeClientes;
    }
    if (buscarCliente(clientes, quantidadeClientes, novo.codigo) != -1) {
        printf("Erro: esse codigo de cliente ja foi cadastrado.\n");
        return quantidadeClientes;
    }

    printf("Nome e informacoes pessoais: ");
    lerTexto(novo.dados, TAM_TEXTO);
    novo.codigoLivroEmprestado = -1;
    clientes[quantidadeClientes] = novo;
    printf("Cliente cadastrado.\n");
    return quantidadeClientes + 1;
}

int cadastrarLivro(Livro livros[], int quantidadeLivros) {
    Livro novo;

    if (quantidadeLivros >= MAX_LIVROS) {
        printf("Limite de livros atingido.\n");
        return quantidadeLivros;
    }

    printf("\nCodigo do livro: ");
    if (!lerInteiro(&novo.codigo) || novo.codigo <= 0) {
        printf("Erro: informe um codigo inteiro positivo.\n");
        return quantidadeLivros;
    }
    if (buscarLivro(livros, quantidadeLivros, novo.codigo) != -1) {
        printf("Erro: esse codigo de livro ja foi cadastrado.\n");
        return quantidadeLivros;
    }

    printf("Quantidade em estoque: ");
    if (!lerInteiro(&novo.estoque) || novo.estoque < 0) {
        printf("Erro: o estoque deve ser um inteiro nao negativo.\n");
        return quantidadeLivros;
    }

    printf("Descricao do livro: ");
    lerTexto(novo.descricao, TAM_TEXTO);

    // Toda fila comeca vazia e com os indices na primeira posicao.
    novo.filaEspera.inicio = 0;
    novo.filaEspera.fim = 0;
    novo.filaEspera.quantidade = 0;

    livros[quantidadeLivros] = novo;
    printf("Livro cadastrado.\n");
    return quantidadeLivros + 1;
}

void listarClientes(Cliente clientes[], int quantidadeClientes) {
    int i;
    printf("\n LISTA DE CLIENTES \n");
    if (quantidadeClientes == 0) {
        printf("Nenhum cliente cadastrado.\n");
        return;
    }
    for (i = 0; i < quantidadeClientes; i++) {
        printf("Codigo: %d | Dados: %s | Livro emprestado: ",
               clientes[i].codigo, clientes[i].dados);
        if (clientes[i].codigoLivroEmprestado == -1) {
            printf("nenhum\n");
        } else {
            printf("%d\n", clientes[i].codigoLivroEmprestado);
        }
    }
}

void listarLivros(Livro livros[], int quantidadeLivros) {
    int i;
    printf("\n LISTA DE LIVROS \n");
    if (quantidadeLivros == 0) {
        printf("Nenhum livro cadastrado.\n");
        return;
    }
    for (i = 0; i < quantidadeLivros; i++) {
        printf("Codigo: %d | Estoque disponivel: %d | Descricao: %s | Na fila: %d\n",
               livros[i].codigo, livros[i].estoque, livros[i].descricao,
               livros[i].filaEspera.quantidade);
    }
}

void realizarEmprestimo(Livro livros[], int quantidadeLivros,
                        Cliente clientes[], int quantidadeClientes) {
    int codigoCliente, codigoLivro, posCliente, posLivro, resultadoFila;
    char resposta[16];

    printf("\nCodigo do cliente: ");
    if (!lerInteiro(&codigoCliente)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    posCliente = buscarCliente(clientes, quantidadeClientes, codigoCliente);
    if (posCliente == -1) {
        printf("Cliente nao encontrado.\n");
        return;
    }
    if (clientes[posCliente].codigoLivroEmprestado != -1) {
        printf("Erro: o cliente ja possui um livro emprestado.\n");
        return;
    }
    if (clienteEstaEmAlgumaFila(livros, quantidadeLivros, codigoCliente)) {
        printf("Erro: o cliente ja esta aguardando um livro em uma fila.\n");
        return;
    }

    printf("Codigo do livro: ");
    if (!lerInteiro(&codigoLivro)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    posLivro = buscarLivro(livros, quantidadeLivros, codigoLivro);
    if (posLivro == -1) {
        printf("Livro nao encontrado.\n");
        return;
    }

    if (livros[posLivro].estoque > 0) {
        livros[posLivro].estoque--;
        clientes[posCliente].codigoLivroEmprestado = codigoLivro;
        printf("Emprestimo realizado.\n");
        return;
    }

    printf("Nao ha exemplares disponiveis. Deseja entrar na fila de espera? (s/n): ");
    lerTexto(resposta, sizeof(resposta));
    if (resposta[0] != 's' && resposta[0] != 'S') {
        printf("Solicitacao de reserva cancelada.\n");
        return;
    }

    resultadoFila = enfileirar(&livros[posLivro].filaEspera, codigoCliente);
    if (resultadoFila == 1) {
        printf("Cliente inserido no final da fila de espera.\n");
    } else if (resultadoFila == 0) {
        printf("Erro: esse cliente ja esta na fila deste livro.\n");
    } else {
        printf("Erro: a fila de espera esta cheia.\n");
    }
}

void realizarDevolucao(Livro livros[], int quantidadeLivros,
                       Cliente clientes[], int quantidadeClientes) {
    int codigoCliente, codigoLivro, posCliente, posLivro;
    int proximoCodigo, posProximo;
    FilaEspera *fila;

    printf("\nCodigo do cliente que esta devolvendo: ");
    if (!lerInteiro(&codigoCliente)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    posCliente = buscarCliente(clientes, quantidadeClientes, codigoCliente);
    if (posCliente == -1) {
        printf("Cliente nao encontrado.\n");
        return;
    }

    printf("Codigo do livro: ");
    if (!lerInteiro(&codigoLivro)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    posLivro = buscarLivro(livros, quantidadeLivros, codigoLivro);
    if (posLivro == -1) {
        printf("Livro nao encontrado.\n");
        return;
    }
    if (clientes[posCliente].codigoLivroEmprestado != codigoLivro) {
        printf("Erro: esse cliente nao possui este livro emprestado.\n");
        return;
    }

    clientes[posCliente].codigoLivroEmprestado = -1;
    livros[posLivro].estoque++;
    printf("Devolucao registrada.\n");

    fila = &livros[posLivro].filaEspera;
    if (fila->quantidade == 0) {
        printf("Nao ha clientes aguardando este livro. Estoque atualizado.\n");
        return;
    }

    // A devolucao atende automaticamente o primeiro da fila (FIFO).
    proximoCodigo = desenfileirar(fila);
    posProximo = buscarCliente(clientes, quantidadeClientes, proximoCodigo);
    if (posProximo != -1) {
        clientes[posProximo].codigoLivroEmprestado = codigoLivro;
        livros[posLivro].estoque--;
        printf("Proximo cliente da fila: %s (codigo %d). Emprestimo realizado.\n",
               clientes[posProximo].dados, clientes[posProximo].codigo);
    } else {
        printf("O proximo codigo da fila nao corresponde a um cliente cadastrado.\n");
    }
}

void consultarEmprestimos(Livro livros[], int quantidadeLivros,
                          Cliente clientes[], int quantidadeClientes) {
    int i, posLivro, encontrados = 0;
    printf("\n LIVROS EMPRESTADOS \n");
    for (i = 0; i < quantidadeClientes; i++) {
        if (clientes[i].codigoLivroEmprestado != -1) {
            posLivro = buscarLivro(livros, quantidadeLivros,
                                  clientes[i].codigoLivroEmprestado);
            printf("Cliente: %s (codigo %d) | Livro: ",
                   clientes[i].dados, clientes[i].codigo);
            if (posLivro == -1) {
                printf("codigo %d\n", clientes[i].codigoLivroEmprestado);
            } else {
                printf("%s (codigo %d)\n", livros[posLivro].descricao,
                       livros[posLivro].codigo);
            }
            encontrados++;
        }
    }
    if (encontrados == 0) {
        printf("Nenhum livro emprestado.\n");
    }
}

void consultarFilaEspera(Livro livros[], int quantidadeLivros,
                         Cliente clientes[], int quantidadeClientes) {
    int codigoLivro, posLivro, i, posicao, codigoCliente, posCliente;
    FilaEspera *fila;

    printf("\nCodigo do livro para consultar a fila: ");
    if (!lerInteiro(&codigoLivro)) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }
    posLivro = buscarLivro(livros, quantidadeLivros, codigoLivro);
    if (posLivro == -1) {
        printf("Livro nao encontrado.\n");
        return;
    }

    fila = &livros[posLivro].filaEspera;
    printf("Fila de espera do livro %d, do inicio ao fim:\n", codigoLivro);
    if (fila->quantidade == 0) {
        printf("Fila vazia.\n");
        return;
    }

    for (i = 0; i < fila->quantidade; i++) {
        posicao = (fila->inicio + i) % MAX_FILA;
        codigoCliente = fila->codigosClientes[posicao];
        posCliente = buscarCliente(clientes, quantidadeClientes, codigoCliente);
        if (posCliente != -1) {
            printf("%d. %s (codigo %d)\n", i + 1,
                   clientes[posCliente].dados, clientes[posCliente].codigo);
        }
    }
}

void exibirMenu(void) {
    printf("\n SISTEMA DE BIBLIOTECA - RESERVAS FIFO \n");
    printf("1 - Cadastrar cliente\n");
    printf("2 - Cadastrar livro\n");
    printf("3 - Listar clientes\n");
    printf("4 - Listar livros\n");
    printf("5 - Realizar emprestimo / solicitar reserva\n");
    printf("6 - Realizar devolucao\n");
    printf("7 - Consultar emprestimos\n");
    printf("8 - Consultar fila de espera\n");
    printf("0 - Sair\n");
    printf("Opcao: ");
}

int main(void) {
    Livro livros[MAX_LIVROS];
    Cliente clientes[MAX_CLIENTES];
    int quantidadeLivros = 0;
    int quantidadeClientes = 0;
    int opcao;

    do {
        exibirMenu();
        if (!lerInteiro(&opcao)) {
            if (feof(stdin)) {
                break;
            }
            printf("Opcao invalida: digite um numero inteiro.\n");
            continue;
        }

        switch (opcao) {
            case 1:
                quantidadeClientes = cadastrarCliente(clientes, quantidadeClientes);
                break;
            case 2:
                quantidadeLivros = cadastrarLivro(livros, quantidadeLivros);
                break;
            case 3:
                listarClientes(clientes, quantidadeClientes);
                break;
            case 4:
                listarLivros(livros, quantidadeLivros);
                break;
            case 5:
                realizarEmprestimo(livros, quantidadeLivros,
                                   clientes, quantidadeClientes);
                break;
            case 6:
                realizarDevolucao(livros, quantidadeLivros,
                                  clientes, quantidadeClientes);
                break;
            case 7:
                consultarEmprestimos(livros, quantidadeLivros,
                                     clientes, quantidadeClientes);
                break;
            case 8:
                consultarFilaEspera(livros, quantidadeLivros,
                                    clientes, quantidadeClientes);
                break;
            case 0:
                printf("Encerrando o sistema.\n");
                break;
            default:
                printf("Opcao invalida. Escolha uma opcao do menu.\n");
        }
    } while (opcao != 0);

    return 0;
}
