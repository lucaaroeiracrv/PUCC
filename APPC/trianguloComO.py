# ============================================================
#  Triângulo com "O" - apenas o contorno externo
# ============================================================

def obterLinhas():
    while True:
        n = int(input("Digite o número de linhas (mínimo 2): "))
        if n >= 2:
            return n
        print("Erro: mínimo 2 linhas. Tente novamente.")


def exibirInformacoes(n):
    print(f"\nPrimeira linha: {2*n-1} 'O'")
    print(f"Última linha: 1 'O'")
    print(f"Linhas intermediárias: apenas o contorno (2 O + meio)")
    print(f"EspacoComeco na 2ª linha: 1 espaço, aumenta 1 por linha")
    print(f"O's na 2ª linha: {2*n-3} (diminui 2 por linha)\n")


def desenharTriangulo(n):
    for linha in range(n):  # Percorre da linha 0 até a última
        EspacoComeco = " " * linha  # A cada linha, anda 1 espaço para a direita
        largura = 2 * (n - linha) - 1  # Tamanho horizontal da linha (ex.: 7, 5, 3, 1)
        if linha == 0 or linha == n - 1:  # Primeira e última linha
            print(EspacoComeco + "O" * largura)  # Imprime tudo preenchido com O
        else:
            print(EspacoComeco + "O" + " " * (largura - 2) + "O")  # Meio: O nas pontas e espaço no centro


def main():
    n = obterLinhas()  # Lê um número válido (mínimo 2)
    exibirInformacoes(n)  # Mostra como o triângulo é montado
    desenharTriangulo(n)  # Desenha o triângulo na tela


if __name__ == "__main__":
    main()
