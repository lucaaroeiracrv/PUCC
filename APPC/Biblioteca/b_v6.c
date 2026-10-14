/* Sistema de Biblioteca - Versao 6
   Conteudo em foco: integracao de vetores, strings, funcoes, structs e ponteiros.
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


// Le um inteiro e descarta o resto da linha (inclusive o \n, antes de usar fgets).
// Devolve false se o que foi digitado nao for um numero.
bool lerInteiro(int *numero) {
    int letra;
    bool valido = (scanf("%d", numero) == 1);

    letra = getchar();
    while (letra != '\n' && letra != EOF) {
        letra = getchar();
    }

    return valido;
}

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


// Devolve true se o emprestimo foi feito. Todas as validacoes vem antes
// de qualquer alteracao, assim livro e usuario nunca ficam pela metade.
bool emprestarLivro(Livro *livro, Usuario *usuario) {
    if (disponibilidadeLivro(livro->estoque) == false) {
        printf("Erro: o livro nao possui exemplares disponiveis.\n");
        return false;
    }

    if (usuario->codigoLivroEmprestado != -1) {
        printf("Erro: o usuario ja possui um livro emprestado.\n");
        return false;
    }

    alterarEstoque(livro, -1);
    registrarEmprestimo(usuario, livro->codigo);

    return true;
}

// Devolve true se a devolucao foi feita. Faz o processo inverso do emprestimo.
bool devolverLivro(Livro *livro, Usuario *usuario) {
    if (usuario->codigoLivroEmprestado == -1) {
        printf("Erro: o usuario nao possui livro emprestado.\n");
        return false;
    }

    if (usuario->codigoLivroEmprestado != livro->codigo) {
        printf("Erro: esse livro nao e o que foi emprestado ao usuario.\n");
        return false;
    }

    alterarEstoque(livro, 1);
    encerrarEmprestimo(usuario);

    return true;
}


// Cadastra um livro por chamada. Devolve a nova quantidade de livros.
int cadastrarLivro(Livro livros[], int qtdLivros) {
    Livro novo;

    if (qtdLivros >= MAX_LIVROS) {
        printf("Erro: o limite de %d livros ja foi atingido.\n", MAX_LIVROS);
        return qtdLivros;
    }

    printf("\nLivro %d\n", qtdLivros + 1);

    printf("Codigo: ");
    if (lerInteiro(&novo.codigo) == false || novo.codigo <= 0) {
        printf("Erro: o codigo deve ser um inteiro positivo.\n");
        return qtdLivros;
    }

    if (buscarLivro(livros, qtdLivros, novo.codigo) != -1) {
        printf("Erro: esse codigo ja foi cadastrado.\n");
        return qtdLivros;
    }

    printf("Estoque: ");
    if (lerInteiro(&novo.estoque) == false || novo.estoque < 0) {
        printf("Erro: o estoque deve ser um inteiro nao negativo.\n");
        return qtdLivros;
    }

    printf("Descricao (titulo; autor; ano; tema): ");
    fgets(novo.descricao, TAM_TEXTO, stdin);
    novo.descricao[strcspn(novo.descricao, "\n")] = '\0';

    // So grava no vetor depois de passar por todas as validacoes
    livros[qtdLivros] = novo;
    printf("Livro cadastrado.\n");

    return qtdLivros + 1;
}

// Cadastra um usuario por chamada. Devolve a nova quantidade de usuarios.
int cadastrarUsuario(Usuario usuarios[], int qtdUsuarios) {
    Usuario novo;

    if (qtdUsuarios >= MAX_USUARIOS) {
        printf("Erro: o limite de %d usuarios ja foi atingido.\n", MAX_USUARIOS);
        return qtdUsuarios;
    }

    printf("\nUsuario %d\n", qtdUsuarios + 1);

    printf("Codigo: ");
    if (lerInteiro(&novo.codigo) == false || novo.codigo <= 0) {
        printf("Erro: o codigo deve ser um inteiro positivo.\n");
        return qtdUsuarios;
    }

    if (buscarUsuario(usuarios, qtdUsuarios, novo.codigo) != -1) {
        printf("Erro: esse codigo ja foi cadastrado.\n");
        return qtdUsuarios;
    }

    printf("Dados pessoais: ");
    fgets(novo.dados, TAM_TEXTO, stdin);
    novo.dados[strcspn(novo.dados, "\n")] = '\0';

    // -1 indica que o usuario nao esta com nenhum livro emprestado
    novo.codigoLivroEmprestado = -1;

    usuarios[qtdUsuarios] = novo;
    printf("Usuario cadastrado.\n");

    return qtdUsuarios + 1;
}

void listarLivros(Livro livros[], int qtdLivros) {
    int i;

    printf("\n LISTAGEM DE LIVROS \n");

    if (qtdLivros == 0) {
        printf("Nenhum livro cadastrado.\n");
    }

    for (i = 0; i < qtdLivros; i++) {
        printf("Codigo: %d | Estoque: %d | Descricao: %s\n", livros[i].codigo, livros[i].estoque, livros[i].descricao);
    }
}

void listarUsuarios(Usuario usuarios[], int qtdUsuarios) {
    int i;

    printf("\n LISTAGEM DE USUARIOS \n");

    if (qtdUsuarios == 0) {
        printf("Nenhum usuario cadastrado.\n");
    }

    for (i = 0; i < qtdUsuarios; i++) {
        printf("Codigo: %d | Dados: %s | Livro emprestado: %d\n", usuarios[i].codigo, usuarios[i].dados, usuarios[i].codigoLivroEmprestado);
    }
}

void consultarLivro(Livro livros[], int qtdLivros) {
    int codigoBuscado, posBusca;

    printf("\nInforme o codigo do livro: ");
    if (lerInteiro(&codigoBuscado) == false) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    posBusca = buscarLivro(livros, qtdLivros, codigoBuscado);

    if (posBusca == -1) {
        printf("Livro nao encontrado.\n");
    } else {
        printf("Livro encontrado na posicao %d.\n", posBusca);
        printf("Codigo: %d\n", livros[posBusca].codigo);
        printf("Descricao: %s\n", livros[posBusca].descricao);
        printf("Estoque: %d\n", livros[posBusca].estoque);

        if (disponibilidadeLivro(livros[posBusca].estoque) == true) {
            printf("Livro disponivel.\n");
        } else {
            printf("Livro temporariamente indisponivel.\n");
        }
    }
}

void consultarUsuario(Usuario usuarios[], int qtdUsuarios) {
    int codigoBuscado, posBusca;

    printf("\nInforme o codigo do usuario: ");
    if (lerInteiro(&codigoBuscado) == false) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    posBusca = buscarUsuario(usuarios, qtdUsuarios, codigoBuscado);

    if (posBusca == -1) {
        printf("Usuario nao encontrado.\n");
    } else {
        printf("Usuario encontrado na posicao %d.\n", posBusca);
        printf("Codigo: %d\n", usuarios[posBusca].codigo);
        printf("Dados: %s\n", usuarios[posBusca].dados);
        printf("Livro emprestado: %d\n", usuarios[posBusca].codigoLivroEmprestado);
    }
}

void solicitarEmprestimo(Livro livros[], int qtdLivros, Usuario usuarios[], int qtdUsuarios) {
    int codigoUsuario, codigoLivro, posUsuario, posLivro;

    printf("\nInforme o codigo do usuario: ");
    if (lerInteiro(&codigoUsuario) == false) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    posUsuario = buscarUsuario(usuarios, qtdUsuarios, codigoUsuario);

    if (posUsuario == -1) {
        printf("Usuario nao encontrado.\n");
        return;
    }

    printf("Informe o codigo do livro: ");
    if (lerInteiro(&codigoLivro) == false) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    posLivro = buscarLivro(livros, qtdLivros, codigoLivro);

    if (posLivro == -1) {
        printf("Livro nao encontrado.\n");
        return;
    }

    if (emprestarLivro(&livros[posLivro], &usuarios[posUsuario])) {
        printf("Emprestimo realizado.\n");
    } else {
        printf("Nao foi possivel realizar o emprestimo.\n");
    }
}

void solicitarDevolucao(Livro livros[], int qtdLivros, Usuario usuarios[], int qtdUsuarios) {
    int codigoUsuario, codigoLivro, posUsuario, posLivro;

    printf("\nInforme o codigo do usuario: ");
    if (lerInteiro(&codigoUsuario) == false) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    posUsuario = buscarUsuario(usuarios, qtdUsuarios, codigoUsuario);

    if (posUsuario == -1) {
        printf("Usuario nao encontrado.\n");
        return;
    }

    printf("Informe o codigo do livro: ");
    if (lerInteiro(&codigoLivro) == false) {
        printf("Erro: digite um numero inteiro.\n");
        return;
    }

    posLivro = buscarLivro(livros, qtdLivros, codigoLivro);

    if (posLivro == -1) {
        printf("Livro nao encontrado.\n");
        return;
    }

    if (devolverLivro(&livros[posLivro], &usuarios[posUsuario])) {
        printf("Devolucao realizada.\n");
    } else {
        printf("Nao foi possivel realizar a devolucao.\n");
    }
}

void exibirMenu() {
    printf("\n SISTEMA DE BIBLIOTECA \n");
    printf("1 - Cadastrar livro\n");
    printf("2 - Cadastrar usuario\n");
    printf("3 - Listar livros\n");
    printf("4 - Buscar livro\n");
    printf("5 - Emprestar livro\n");
    printf("6 - Devolver livro\n");
    printf("7 - Listar usuarios\n");
    printf("8 - Buscar usuario\n");
    printf("0 - Sair\n");
    printf("Opcao: ");
}

int main() {
    Livro livros[MAX_LIVROS];
    Usuario usuarios[MAX_USUARIOS];

    int qtdLivros = 0;
    int qtdUsuarios = 0;
    int opcao;


    do {
        exibirMenu();

        // Se nao for numero, vira uma opcao invalida e o menu se repete
        if (lerInteiro(&opcao) == false) {
            opcao = -1;
        }

        if (opcao == 1) {
            qtdLivros = cadastrarLivro(livros, qtdLivros);
        } else if (opcao == 2) {
            qtdUsuarios = cadastrarUsuario(usuarios, qtdUsuarios);
        } else if (opcao == 3) {
            listarLivros(livros, qtdLivros);
        } else if (opcao == 4) {
            consultarLivro(livros, qtdLivros);
        } else if (opcao == 5) {
            solicitarEmprestimo(livros, qtdLivros, usuarios, qtdUsuarios);
        } else if (opcao == 6) {
            solicitarDevolucao(livros, qtdLivros, usuarios, qtdUsuarios);
        } else if (opcao == 7) {
            listarUsuarios(usuarios, qtdUsuarios);
        } else if (opcao == 8) {
            consultarUsuario(usuarios, qtdUsuarios);
        } else if (opcao == 0) {
            printf("\nEncerrando o sistema.\n");
        } else {
            printf("\nOpcao invalida.\n");
        }
    } while (opcao != 0);

    return 0;
}