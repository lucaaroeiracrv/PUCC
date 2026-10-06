# Teste: 
lista=[0,1,2,3,4,5,6,7]

print(lista)
print(lista[2:7])
print(lista[2:5:2])
print(lista[-2:-7:-1])
print(lista[-2:-5:])
print(lista[-2])
print(lista[2:])
print(lista[-2::-1])
print(lista[::-1])
print(lista)
print(lista[:])
print(lista[::])
print(lista[::2])


falsaNovaLista = lista
verdadeiraNovaLista = lista[::]

print(falsaNovaLista)
print(verdadeiraNovaLista)

lista[3]=77
print(lista)
print(falsaNovaLista)
print(verdadeiraNovaLista)

del falsaNovaLista[5]
print(falsaNovaLista)
print(lista)
print(verdadeiraNovaLista)


fatia = verdadeiraNovaLista[-5:-2]
print(fatia)
fatia[0]=77
print(fatia)
print(verdadeiraNovaLista)

outraVerdadeiraNovaLista=verdadeiraNovaLista.copy()
print(outraVerdadeiraNovaLista)

outraVerdadeiraNovaLista[2]=55
print(outraVerdadeiraNovaLista)
print(verdadeiraNovaLista)

listona=[[2,3], [5,7,11], [13,17,19]]
falsaNovaListona=listona
verdadeiraNovaListona=listona[:]
listona[1]=[6,8,9]
print(listona)  
print(falsaNovaListona)
print(verdadeiraNovaListona)
listona=[0][1]=33
print(listona)
print(falsaNovaListona)
print(verdadeiraNovaListona)
#explique sobre shallow copy, not so deep copy e deep copy

print(lista)
lista.remove(77)
print(lista)
del lista[3]
print(lista)
lista.insert(3, 6)
print(lista)
lista.pop(4)
print(lista)
removido=lista.pop(2)
print(f"Elemento removido: {removido}")
print(lista)
lista.clear()
print(lista)
umaLista=[2,3,5]
duasLista=[1,4,6]
listaTotal=umaLista+duasLista
print(listaTotal)
listaTotal.extend("PUC")
print(listaTotal)
print(umaLista)
print(3*umaLista)
print(umaLista.index(3))
lista3VezesUmaLista=3*umaLista
print(lista3VezesUmaLista)
print(lista3VezesUmaLista.index(5))
print(lista3VezesUmaLista.index(5, 3))
print(lista3VezesUmaLista.index(5, 6))
print(lista3VezesUmaLista.index(5,11))
print(lista3VezesUmaLista.index(5,3,9))
print(lista3VezesUmaLista.index(5,3,5))
print(lista3VezesUmaLista.count(5))
print(umaLista)
umaLista.reverse()
print(umaLista)
#explique sobre sort tambem
#explique sobre in range tambem


# Organizadas:
# Anotações organizadas - Listas em Python
# Objetivo: deixar seus exemplos mais fáceis de revisar depois.

# ============================================================
# 1) LISTA BASE E FATIAMENTO (SLICING)
# ============================================================

lista = [0, 1, 2, 3, 4, 5, 6, 7]

print("Lista original:", lista)
print("lista[2:7] -> pega do índice 2 até antes do 7:", lista[2:7])
print("lista[2:5:2] -> de 2 até antes de 5, pulando de 2 em 2:", lista[2:5:2])
print("lista[-2:-7:-1] -> começa do penúltimo e volta:", lista[-2:-7:-1])
print("lista[-2:-5:] -> do penúltimo até antes do -5:", lista[-2:-5:])
print("lista[-2] -> penúltimo elemento:", lista[-2])
print("lista[2:] -> do índice 2 até o fim:", lista[2:])
print("lista[-2::-1] -> do penúltimo voltando até o começo:", lista[-2::-1])
print("lista[::-1] -> lista invertida:", lista[::-1])
print("lista[:] -> cópia por fatiamento:", lista[:])
print("lista[::] -> cópia por fatiamento (mesma ideia):", lista[::])
print("lista[::2] -> do começo ao fim, pulando de 2 em 2:", lista[::2])


# ============================================================
# 2) CÓPIA FALSA X CÓPIA VERDADEIRA (LISTA SIMPLES)
# ============================================================

# falsaNovaLista aponta para a MESMA lista (mesmo objeto na memória)
falsaNovaLista = lista

# verdadeiraNovaLista cria OUTRA lista com os mesmos valores (cópia rasa para lista simples)
verdadeiraNovaLista = lista[::]

print("\nCópias iniciais:")
print("falsaNovaLista:", falsaNovaLista)
print("verdadeiraNovaLista:", verdadeiraNovaLista)

# Mudando a lista original
lista[3] = 77
print("\nDepois de lista[3] = 77:")
print("lista:", lista)
print("falsaNovaLista (mudou junto):", falsaNovaLista)
print("verdadeiraNovaLista (não mudou):", verdadeiraNovaLista)

# Deletando item pela referência falsa
# Como falsaNovaLista e lista são o mesmo objeto, apagar em uma afeta a outra.
del falsaNovaLista[5]
print("\nDepois de del falsaNovaLista[5]:")
print("falsaNovaLista:", falsaNovaLista)
print("lista:", lista)
print("verdadeiraNovaLista:", verdadeiraNovaLista)


# ============================================================
# 3) FATIA TAMBÉM GERA NOVA LISTA
# ============================================================

fatia = verdadeiraNovaLista[-5:-2]
print("\nFatia criada de verdadeiraNovaLista[-5:-2]:", fatia)

fatia[0] = 77
print("Depois de fatia[0] = 77:")
print("fatia:", fatia)
print("verdadeiraNovaLista (não muda aqui):", verdadeiraNovaLista)


# ============================================================
# 4) copy() EM LISTA SIMPLES
# ============================================================

outraVerdadeiraNovaLista = verdadeiraNovaLista.copy()
print("\nCópia com copy():", outraVerdadeiraNovaLista)

outraVerdadeiraNovaLista[2] = 55
print("Depois de outraVerdadeiraNovaLista[2] = 55:")
print("outraVerdadeiraNovaLista:", outraVerdadeiraNovaLista)
print("verdadeiraNovaLista:", verdadeiraNovaLista)


# ============================================================
# 5) SHALLOW COPY, NOT SO DEEP COPY E DEEP COPY (LISTA DE LISTAS)
# ============================================================

listona = [[2, 3], [5, 7, 11], [13, 17, 19]]

# Referência do mesmo objeto (não é cópia)
falsaNovaListona = listona

# Cópia rasa (shallow copy): copia só a lista de fora.
# As listas de dentro continuam sendo compartilhadas.
verdadeiraNovaListona = listona[:]

# Troca uma lista interna inteira no original.
# Isso afeta falsaNovaListona (mesmo objeto), mas não afeta verdadeiraNovaListona
# porque verdadeiraNovaListona aponta para outra "lista de fora".
listona[1] = [6, 8, 9]
print("\nDepois de listona[1] = [6, 8, 9]:")
print("listona:", listona)
print("falsaNovaListona:", falsaNovaListona)
print("verdadeiraNovaListona:", verdadeiraNovaListona)

# Agora alterando um elemento DENTRO de uma lista interna.
# Como a cópia rasa compartilha listas internas, isso aparece em verdadeiraNovaListona também.
listona[0][1] = 33
print("\nDepois de listona[0][1] = 33:")
print("listona:", listona)
print("falsaNovaListona:", falsaNovaListona)
print("verdadeiraNovaListona:", verdadeiraNovaListona)

# RESUMO:
# - Shallow copy (cópia rasa): copia só o 1º nível. Ex.: listona[:] e listona.copy()
# - "Not so deep copy": jeito informal de dizer que copiou parte da estrutura,
#   mas não copiou tudo recursivamente.
# - Deep copy (cópia profunda): copiaria todos os níveis internos também,
#   então mudanças nas sublistas não se espalhariam. (Aqui só explicação teórica.)


# ============================================================
# 6) MÉTODOS DE LISTA: REMOVER, INSERIR, POP, CLEAR
# ============================================================

print("\nTrabalhando com lista:", lista)
lista.remove(77)
print("Depois de remove(77):", lista)

del lista[3]
print("Depois de del lista[3]:", lista)

lista.insert(3, 6)
print("Depois de insert(3, 6):", lista)

lista.pop(4)
print("Depois de pop(4):", lista)

removido = lista.pop(2)
print(f"Elemento removido com pop(2): {removido}")
print("Lista após pop(2):", lista)

lista.clear()
print("Depois de clear():", lista)


# ============================================================
# 7) CONCATENAÇÃO, EXTEND, REPETIÇÃO, INDEX, COUNT, REVERSE
# ============================================================

umaLista = [2, 3, 5]
duasLista = [1, 4, 6]

listaTotal = umaLista + duasLista
print("\numaLista + duasLista:", listaTotal)

listaTotal.extend("PUC")
print("Depois de extend('PUC'):", listaTotal)

print("umaLista:", umaLista)
print("3 * umaLista:", 3 * umaLista)
print("índice do valor 3 em umaLista:", umaLista.index(3))

lista3VezesUmaLista = 3 * umaLista
print("lista3VezesUmaLista:", lista3VezesUmaLista)
print("index(5):", lista3VezesUmaLista.index(5))
print("index(5, 3):", lista3VezesUmaLista.index(5, 3))
print("index(5, 6):", lista3VezesUmaLista.index(5, 6))
print("index(5, 3, 9):", lista3VezesUmaLista.index(5, 3, 9))
print("index(5, 3, 5):", lista3VezesUmaLista.index(5, 3, 5))
print("count(5):", lista3VezesUmaLista.count(5))

print("umaLista antes do reverse():", umaLista)
umaLista.reverse()
print("umaLista depois do reverse():", umaLista)


# ============================================================
# 8) EXPLICAÇÃO: sort E in range (TEORIA PARA ESTUDO)
# ============================================================

# sort:
# - Serve para ordenar a própria lista.
# - Exemplo conceitual: umaLista.sort() ordena crescente.
# - Diferença importante:
#   - reverse() só inverte a ordem atual.
#   - sort() coloca em ordem (numérica ou alfabética).

# in range:
# - Muito usado em repetição para percorrer índices.
# - Exemplo conceitual: verificar se um número está em um intervalo.
# - Ideia: x in range(inicio, fim, passo)
# - O fim NÃO entra no intervalo.

# Observação final:
# Você já praticou bem slicing, cópia, remoção e busca em listas.
# Este arquivo está organizado para revisão por blocos, do básico ao mais avançado.