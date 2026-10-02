/* Sistema de Biblioteca - Versao 2
   Conteudo em foco: strings como vetores de caracteres.
   Mantem tudo da Versao 1 e acrescenta a descricao de cada livro. */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdbool.h>

#define MAX_LIVROS 3
#define TAM_TEXTO 121   /* 120 caracteres + '\0' */

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
        printf("\nLivro %d\n", qtdLivros + 1);

        printf("Codigo: ");
        scanf("%d", &codigo);

        if (codigo <= 0) {
            printf("Erro: o codigo deve ser um inteiro positivo.\n");
            continue;
        }

            repetido = false;
        for (i = 0; i < qtdLivros; i++) {
            if (codigos[i] == codigo) {
                    repetido = true;
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

        /* limpa o '\n' que sobrou do scanf antes de usar fgets */
        letra = getchar();
        while (letra != '\n' && letra != EOF) {
            letra = getchar();
        }

        printf("Descricao (titulo; autor; ano; tema): ");

        if (qtdLivros == 0) {
            fgets(descricao1, TAM_TEXTO, stdin);
            for (i = 0; i < TAM_TEXTO; i++) {
                if (descricao1[i] == '\n') {
                    descricao1[i] = '\0';
                    break;
                }
            }
        } else if (qtdLivros == 1) {
            fgets(descricao2, TAM_TEXTO, stdin);
            for (i = 0; i < TAM_TEXTO; i++) {
                if (descricao2[i] == '\n') {
                    descricao2[i] = '\0';
                    break;
                }
            }
        } else {
            fgets(descricao3, TAM_TEXTO, stdin);
            for (i = 0; i < TAM_TEXTO; i++) {
                if (descricao3[i] == '\n') {
                    descricao3[i] = '\0';
                    break;
                }
            }
        }

        codigos[qtdLivros] = codigo;
        estoques[qtdLivros] = estoque;
        qtdLivros++;
    }

    /* LISTAGEM */
    printf("\n=== LISTAGEM DE LIVROS ===\n");
    for (i = 0; i < qtdLivros; i++) {
        printf("Codigo: %d | Estoque: %d | Descricao: ", codigos[i], estoques[i]);

        if (i == 0) {
            printf("%s\n", descricao1);
        } else if (i == 1) {
            printf("%s\n", descricao2);
        } else {
            printf("%s\n", descricao3);
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
        }
    }

    if (posicao == -1) {
        printf("Codigo nao encontrado.\n");
    } else {
        printf("Livro encontrado na posicao %d.\n", posicao);

        printf("Descricao: ");
        if (posicao == 0) {
            printf("%s\n", descricao1);
        } else if (posicao == 1) {
            printf("%s\n", descricao2);
        } else {
            printf("%s\n", descricao3);
        }

        printf("Estoque: %d\n", estoques[posicao]);

        if (estoques[posicao] > 0) {
            printf("Livro disponivel.\n");
        } else {
            printf("Livro temporariamente indisponivel.\n");
        }
    }

    return 0;
}
