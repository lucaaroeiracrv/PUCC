/* Sistema de Biblioteca - Versao 2
   Conteudo em foco: strings como vetores de caracteres. */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdbool.h>

#define MAX_LIVROS 3
#define TAM_TEXTO 121

int main() {
    int codigos[MAX_LIVROS];
    int estoques[MAX_LIVROS];
    char descricao1[TAM_TEXTO];
    char descricao2[TAM_TEXTO];
    char descricao3[TAM_TEXTO];

    int i, letra, codigo, estoque, codigoBuscado, posicao, estoqueTotal;
    int qtdLivros = 0;
    bool repetido = false;

    /* CADASTRO */
    printf("=== CADASTRO DE LIVROS ===\n");

    while (qtdLivros < MAX_LIVROS) {
        repetido = false;

        printf("\nLivro %d\n", qtdLivros + 1);

        printf("Codigo: ");
        scanf("%d", &codigo);

        if (codigo <= 0) {
            printf("Erro: o codigo deve ser um inteiro positivo.\n");
            continue;
        }

        for (i = 0; i < qtdLivros; i++) {
            if (codigos[i] == codigo) {
                repetido = true;
                break;
            }
        }

        if (repetido == true) {
            printf("Erro: esse codigo ja foi cadastrado.\n");
            continue;
        }

        printf("Estoque: ");
        scanf("%d", &estoque);

        if (estoque < 0) {
            printf("Erro: o estoque nao pode ser negativo.\n");
            continue;
        }

        /* Limpa o restante da entrada antes de usar fgets */
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
        qtdLivros++;
    }

    /* LISTAGEM */
    printf("\n=== LISTAGEM DE LIVROS ===\n");

    for (i = 0; i < qtdLivros; i++) {
        if (i == 0) {
            printf("Codigo: %d | Estoque: %d | Descricao: %s\n",
                   codigos[i], estoques[i], descricao1);
        } else if (i == 1) {
            printf("Codigo: %d | Estoque: %d | Descricao: %s\n",
                   codigos[i], estoques[i], descricao2);
        } else {
            printf("Codigo: %d | Estoque: %d | Descricao: %s\n",
                   codigos[i], estoques[i], descricao3);
        }
    }

    /* TOTAL DE EXEMPLARES */
    estoqueTotal = 0;

    for (i = 0; i < qtdLivros; i++) {
        estoqueTotal = estoqueTotal + estoques[i];
    }

    printf("\nTotal de exemplares: %d\n", estoqueTotal);

    /* BUSCA */
    printf("\nInforme o codigo que deseja buscar: ");
    scanf("%d", &codigoBuscado);

    posicao = -1;

    for (i = 0; i < qtdLivros; i++) {
        if (codigos[i] == codigoBuscado) {
            posicao = i;
            break;
        }
    }

    if (posicao == -1) {
        printf("Codigo nao encontrado.\n");
    } else {
        printf("Livro encontrado na posicao %d.\n", posicao);
        printf("Estoque: %d\n", estoques[posicao]);

        if (posicao == 0) {
            printf("Descricao: %s\n", descricao1);
        } else if (posicao == 1) {
            printf("Descricao: %s\n", descricao2);
        } else {
            printf("Descricao: %s\n", descricao3);
        }

        if (estoques[posicao] > 0) {
            printf("Livro disponivel.\n");
        } else {
            printf("Livro temporariamente indisponivel.\n");
        }
    }

    return 0;
}