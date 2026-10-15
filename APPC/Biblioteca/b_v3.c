// Sistema de Biblioteca v3 - Conteudo em foco: funcoes, parametros, valores de retorno e escopo.

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdbool.h>

#define MAX_LIVROS 3
#define TAM_TEXTO 121



// Devolve o indice do livro, ou -1 se o codigo nao existir.
int buscarLivro(int codigos[], int qtdLivros, int codigoBuscado) {
    int i;

    for (i = 0; i < qtdLivros; i++) {
        if (codigos[i] == codigoBuscado) {
            return i;
        }
    }

    return -1;
}

int calcularQtdExemplares(int estoques[], int qtdLivros) {
    int i;
    int qtdExemplares = 0;

    for (i = 0; i < qtdLivros; i++) {
        qtdExemplares = qtdExemplares + estoques[i];
    }

    return qtdExemplares;
}

// Devolve true se o estoque for maior que zero, senao false.
bool disponibilidadeLivro(int qtdEstoque) {
    if (qtdEstoque > 0) {
        return true;
    }

    return false;
}


int cadastrarLivro(int codigos[], int estoques[], char descricao1[], char descricao2[], char descricao3[], int qtdLivros) {
    int codigo, estoque, letra;

    printf("\nLivro %d\n", qtdLivros + 1);

    printf("Codigo: ");
    scanf("%d", &codigo);

    if (codigo <= 0) {
        printf("Erro: o codigo deve ser um inteiro positivo.\n");
        return qtdLivros;
    }

    if (buscarLivro(codigos, qtdLivros, codigo) != -1) {
        printf("Erro: esse codigo ja foi cadastrado.\n");
        return qtdLivros;
    }

    printf("Estoque: ");
    scanf("%d", &estoque);

    if (estoque < 0) {
        printf("Erro: o estoque nao pode ser negativo.\n");
        return qtdLivros;
    }

    // Limpa o restante da entrada antes de usar fgets 
    letra = getchar();
    while (letra != '\n' && letra != EOF) {
        letra = getchar();
    }

    printf("Descricao (titulo; autor; ano; tema): ");

    if (qtdLivros == 0) {
        fgets(descricao1, TAM_TEXTO, stdin);
        descricao1[strcspn(descricao1, "\n")] = '\0';
    } else if (qtdLivros == 1) {
        fgets(descricao2, TAM_TEXTO, stdin);
        descricao2[strcspn(descricao2, "\n")] = '\0';
    } else {
        fgets(descricao3, TAM_TEXTO, stdin);
        descricao3[strcspn(descricao3, "\n")] = '\0';
    }

    codigos[qtdLivros] = codigo;
    estoques[qtdLivros] = estoque;

    return qtdLivros + 1;
}

void listarLivros(int codigos[], int estoques[], char descricao1[], char descricao2[], char descricao3[], int qtdLivros) {
    int i;

    printf("\n LISTAGEM DE LIVROS \n");

    for (i = 0; i < qtdLivros; i++) {
        if (i == 0) {
            printf("Codigo: %d | Estoque: %d | Descricao: %s\n", codigos[i], estoques[i], descricao1);
        } else if (i == 1) {
            printf("Codigo: %d | Estoque: %d | Descricao: %s\n", codigos[i], estoques[i], descricao2);
        } else {
            printf("Codigo: %d | Estoque: %d | Descricao: %s\n", codigos[i], estoques[i], descricao3);
        }
    }
}

int main() {
    int codigos[MAX_LIVROS];
    int estoques[MAX_LIVROS];
    char descricao1[TAM_TEXTO];
    char descricao2[TAM_TEXTO];
    char descricao3[TAM_TEXTO];

    int qtdLivros = 0;
    int codigoBuscado, posBusca, qtdExemplares;
    bool disponivel;


    printf(" CADASTRO DE LIVROS \n");

    while (qtdLivros < MAX_LIVROS) {
        qtdLivros = cadastrarLivro(codigos, estoques, descricao1, descricao2, descricao3, qtdLivros);
    }

    listarLivros(codigos, estoques, descricao1, descricao2, descricao3, qtdLivros);

    printf("\nInforme o codigo que deseja buscar: ");
    scanf("%d", &codigoBuscado);

    posBusca = buscarLivro(codigos, qtdLivros, codigoBuscado);

    if (posBusca == -1) {
        printf("Livro nao encontrado.\n");
    } else {
        printf("Livro encontrado na posicao %d.\n", posBusca);
        printf("Estoque: %d\n", estoques[posBusca]);

        if (posBusca == 0) {
            printf("Descricao: %s\n", descricao1);
        } else if (posBusca == 1) {
            printf("Descricao: %s\n", descricao2);
        } else {
            printf("Descricao: %s\n", descricao3);
        }

        disponivel = disponibilidadeLivro(estoques[posBusca]);

        if (disponivel == true) {
            printf("Livro disponivel.\n");
        } else {
            printf("Livro temporariamente indisponivel.\n");
        }
    }

    qtdExemplares = calcularQtdExemplares(estoques, qtdLivros);
    printf("\nTotal de exemplares: %d\n", qtdExemplares);

    return 0;
}
