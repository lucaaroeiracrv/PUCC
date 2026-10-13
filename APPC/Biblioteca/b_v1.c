/* Sistema de Biblioteca - Versao 1
   Conteudo em foco: vetores, for, while e estruturas de decisao. */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdbool.h>

#define MAX_LIVROS 3

int main() {
    int codigos[MAX_LIVROS];
    int estoques[MAX_LIVROS];
    int i, codigo, estoque, codigoBuscado, posicao, estoqueTotal;
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

        codigos[qtdLivros] = codigo;
        estoques[qtdLivros] = estoque;
        qtdLivros++;
    }

    /* LISTAGEM */
    printf("\n=== LISTAGEM DE LIVROS ===\n");
    for (i = 0; i < qtdLivros; i++) {
        printf("Codigo: %d | Estoque: %d\n", codigos[i], estoques[i]);
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
        printf("Estoque: %d\n", estoques[posicao]);

        if (estoques[posicao] > 0) {
            printf("Livro disponivel.\n");
        } else {
            printf("Livro temporariamente indisponivel.\n");
        }
    }

    return 0;
}
