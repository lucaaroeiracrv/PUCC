#include <stdio.h>
#include <stdlib.h>
#include <string.h>

 
typedef struct {
    char nome[20];
    int idade;

} pessoa;

 

int dT(){
    int t;
    do {
        printf("Digite quantas pessoas quer cadastrar: ");
        scanf("%d", &t);
        getchar();

        if (t <= 0) {
            printf("Quantidade invalida!\n");
        }
    } while (t <= 0);

    return t;
}

 

void cadastrar(pessoa *p){
    printf("Digite nome: ");
    fgets(p->nome, sizeof(p->nome), stdin);
    p->nome[strcspn(p->nome, "\n")] = '\0';
    printf("Digite idade: ");
    scanf("%d", &p->idade);
    getchar();
}

 

void mostrar(pessoa *p, int i){
    printf("\nCadastro %d:\n", i + 1);
    printf("Nome: %s\n", p->nome);
    printf("Idade: %d\n", p->idade);
    printf("--------------------\n");
}

 

int procurar(pessoa *p, int t){
    char objetivo[30];
    printf("\nDigite o nome de quem voce quer procurar: ");
    fgets(objetivo, sizeof(objetivo), stdin);
    objetivo[strcspn(objetivo, "\n")] = '\0';
    for (int i = 0; i < t; i++) {
        if (strcmp(p[i].nome, objetivo) == 0) {
            printf("\nPessoa encontrada!\n");
            printf("Nome: %s\n", p[i].nome);
            printf("Idade: %d\n", p[i].idade);
            printf("Posicao: %d\n", i + 1);

            return i;
        }

    }

    printf("\n%s nao esta cadastrado!\n", objetivo);
        return -1;

}

 

int main(){
    int t = dT();
    pessoa *pe = malloc(t * sizeof(pessoa));
    if (pe == NULL) {
        printf("Erro ao alocar memoria.\n");
    
        return 1;
    }

 

    // Cadastro

    for (int i = 0; i < t; i++) {
        printf("\n--- Cadastro %d ---\n", i + 1);
        cadastrar(&pe[i]);
    }

 

    // Mostrar todos

    printf("\n\n===== CADASTROS =====\n");
    for (int i = 0; i < t; i++) {
        mostrar(&pe[i], i);
    }

 

    // Procurar pessoa

    int posicao = procurar(pe, t);
    if (posicao != -1) {
        printf("\nA posicao dessa pessoa é:  %d\n", posicao+1);
    }

    free(pe);

    return 0;
}

