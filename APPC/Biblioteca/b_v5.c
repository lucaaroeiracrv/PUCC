/* Sistema de Biblioteca - Versao 5
   Conteudo em foco: ponteiros e passagem por endereco.
   Sem prototipos: cada funcao e definida ANTES de quem a utiliza. */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdbool.h>

#define MAX_LIVROS 3
#define MAX_USUARIOS 3
#define TAM_TEXTO 121



typedef struct {
    int codigo;
    char descricao[TAM_TEXTO];
    int estoque;
} Livro;

typedef struct {
    int codigo;
    char dados[TAM_TEXTO];
    int codigoLivroEmprestado;
} Usuario;


// Devolve o indice do livro, ou -1 se o codigo nao existir.
int buscarLivro(Livro livros[], int qtdLivros, int codigoBuscado) {
    int i;

    for (i = 0; i < qtdLivros; i++) {
        if (livros[i].codigo == codigoBuscado) {
            return i;
        }
    }

    return -1;
}

// Devolve o indice do usuario, ou -1 se o codigo nao existir.
int buscarUsuario(Usuario usuarios[], int qtdUsuarios, int codigoBuscado) {
    int i;

    for (i = 0; i < qtdUsuarios; i++) {
        if (usuarios[i].codigo == codigoBuscado) {
            return i;
        }
    }

    return -1;
}

int calcularQtdExemplares(Livro livros[], int qtdLivros) {
    int i;
    int qtdExemplares = 0;

    for (i = 0; i < qtdLivros; i++) {
        qtdExemplares = qtdExemplares + livros[i].estoque;
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


// Soma "valor" ao estoque do livro original (use valor negativo para diminuir).
void alterarEstoque(Livro *livro, int valor) {
    livro->estoque = livro->estoque + valor;
}

// Registra no usuario original o codigo do livro que ele pegou emprestado.
void registrarEmprestimo(Usuario *usuario, int codigoLivro) {
    usuario->codigoLivroEmprestado = codigoLivro;
}

// Libera o usuario original (-1 = nenhum livro emprestado).
void encerrarEmprestimo(Usuario *usuario) {
    usuario->codigoLivroEmprestado = -1;
}


int cadastrarLivro(Livro livros[], int qtdLivros) {
    Livro novo;
    int letra;

    printf("\nLivro %d\n", qtdLivros + 1);

    printf("Codigo: ");
    scanf("%d", &novo.codigo);

    if (novo.codigo <= 0) {
        printf("Erro: o codigo deve ser um inteiro positivo.\n");
        return qtdLivros;
    }

    if (buscarLivro(livros, qtdLivros, novo.codigo) != -1) {
        printf("Erro: esse codigo ja foi cadastrado.\n");
        return qtdLivros;
    }

    printf("Estoque: ");
    scanf("%d", &novo.estoque);

    if (novo.estoque < 0) {
        printf("Erro: o estoque nao pode ser negativo.\n");
        return qtdLivros;
    }

    // Limpa o restante da entrada antes de usar fgets 
    letra = getchar();
    while (letra != '\n' && letra != EOF) {
        letra = getchar();
    }

    printf("Descricao (titulo; autor; ano; tema): ");
    fgets(novo.descricao, TAM_TEXTO, stdin);
    novo.descricao[strcspn(novo.descricao, "\n")] = '\0';

    // So grava no vetor depois de passar por todas as validacoes
    livros[qtdLivros] = novo;

    return qtdLivros + 1;
}

int cadastrarUsuario(Usuario usuarios[], int qtdUsuarios) {
    Usuario novo;
    int letra;

    printf("\nUsuario %d\n", qtdUsuarios + 1);

    printf("Codigo: ");
    scanf("%d", &novo.codigo);

    if (novo.codigo <= 0) {
        printf("Erro: o codigo deve ser um inteiro positivo.\n");
        return qtdUsuarios;
    }

    if (buscarUsuario(usuarios, qtdUsuarios, novo.codigo) != -1) {
        printf("Erro: esse codigo ja foi cadastrado.\n");
        return qtdUsuarios;
    }

    // Limpa o restante da entrada antes de usar fgets 
    letra = getchar();
    while (letra != '\n' && letra != EOF) {
        letra = getchar();
    }

    printf("Dados pessoais: ");
    fgets(novo.dados, TAM_TEXTO, stdin);
    novo.dados[strcspn(novo.dados, "\n")] = '\0';

    // -1 indica que o usuario nao esta com nenhum livro emprestado
    novo.codigoLivroEmprestado = -1;

    usuarios[qtdUsuarios] = novo;

    return qtdUsuarios + 1;
}

void listarLivros(Livro livros[], int qtdLivros) {
    int i;

    printf("\n LISTAGEM DE LIVROS \n");

    for (i = 0; i < qtdLivros; i++) {
        printf("Codigo: %d | Estoque: %d | Descricao: %s\n", livros[i].codigo, livros[i].estoque, livros[i].descricao);
    }
}

void listarUsuarios(Usuario usuarios[], int qtdUsuarios) {
    int i;

    printf("\n LISTAGEM DE USUARIOS \n");

    for (i = 0; i < qtdUsuarios; i++) {
        printf("Codigo: %d | Dados: %s | Livro emprestado: %d\n", usuarios[i].codigo, usuarios[i].dados, usuarios[i].codigoLivroEmprestado);
    }
}

int main() {
    Livro livros[MAX_LIVROS];
    Usuario usuarios[MAX_USUARIOS];

    int qtdLivros = 0;
    int qtdUsuarios = 0;
    int codigoBuscado, posBusca, qtdExemplares;
    bool disponivel;


    printf(" CADASTRO DE LIVROS \n");

    while (qtdLivros < MAX_LIVROS) {
        qtdLivros = cadastrarLivro(livros, qtdLivros);
    }

    listarLivros(livros, qtdLivros);

    printf("\nInforme o codigo que deseja buscar: ");
    scanf("%d", &codigoBuscado);

    posBusca = buscarLivro(livros, qtdLivros, codigoBuscado);

    if (posBusca == -1) {
        printf("Livro nao encontrado.\n");
    } else {
        printf("Livro encontrado na posicao %d.\n", posBusca);
        printf("Estoque: %d\n", livros[posBusca].estoque);
        printf("Descricao: %s\n", livros[posBusca].descricao);

        disponivel = disponibilidadeLivro(livros[posBusca].estoque);

        if (disponivel == true) {
            printf("Livro disponivel.\n");
        } else {
            printf("Livro temporariamente indisponivel.\n");
        }
    }

    qtdExemplares = calcularQtdExemplares(livros, qtdLivros);
    printf("\nTotal de exemplares: %d\n", qtdExemplares);


    printf("\n CADASTRO DE USUARIOS \n");

    while (qtdUsuarios < MAX_USUARIOS) {
        qtdUsuarios = cadastrarUsuario(usuarios, qtdUsuarios);
    }

    listarUsuarios(usuarios, qtdUsuarios);


    printf("\n TESTE DE PONTEIROS \n");

    // Teste 1: a alteracao feita dentro da funcao continua depois que ela termina
    if (livros[0].estoque > 0) {
        printf("Estoque do livro %d antes: %d\n", livros[0].codigo, livros[0].estoque);
        alterarEstoque(&livros[0], -1);
        printf("Estoque do livro %d depois: %d\n", livros[0].codigo, livros[0].estoque);
    } else {
        printf("O primeiro livro esta sem estoque, nao da para diminuir.\n");
    }

    // Teste 2: registra e encerra o emprestimo do primeiro usuario
    registrarEmprestimo(&usuarios[0], livros[0].codigo);
    printf("Usuario %d com livro emprestado: %d\n", usuarios[0].codigo, usuarios[0].codigoLivroEmprestado);

    encerrarEmprestimo(&usuarios[0]);
    printf("Usuario %d apos encerrar: %d\n", usuarios[0].codigo, usuarios[0].codigoLivroEmprestado);

    // Teste 3: duas alteracoes seguidas se acumulam
    alterarEstoque(&livros[0], 1);
    alterarEstoque(&livros[0], 1);
    printf("Estoque do livro %d apos duas alteracoes: %d\n", livros[0].codigo, livros[0].estoque);

    return 0;
}