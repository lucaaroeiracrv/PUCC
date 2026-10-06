dicio1={"Ana":9, "Joao":7, "Jose":5}
print(dicio1)
print(dicio1["Joao"])
lista=[["Ana", 9], ["Joao", 7], ["Jose", 5]]
dicio2=dict(lista)
print(dicio2)
lista=[("Ana", 9), ("Joao", 7), ("Jose", 5)]
dicio3=dict(lista)
print(dicio3)
tupla=(("Ana", 9), ("Joao", 7), ("Jose", 5))
dicio4=dict(tupla)
print(dicio4)
tupla=(["Ana", 9], ["Joao", 7], ["Jose", 5])
dicio5=dict(tupla)
print(dicio5)
dicio6=dict(Ana=9, Joao=7, Jose=5)
print(dicio6)
dicio7={}
dicio7=dicio7.fromkeys(["Ana", "Joao", "Jose"], 5)
print(dicio7)
dicio8={}
dicio8=dicio8.fromkeys(["Ana", "Joao", "Jose"]) 
print(dicio8)
dicio9={}
dicio9=dicio9.fromkeys(["Ana", "Joao", "Jose"], [2,3,5,7])
print(dicio9)
print(dicio9["Joao"])
print(dicio9.get("Joao"))
print("Joao" in dicio6)
print(7 in dicio6)
print(7 not in dicio6)
print(7 in dicio6.values())
print(dicio9.items())
print(dicio9.keys())
print(dicio9.values())
print(dicio2)
atualizacao={"Maria": 6, "Jose": 10}
dicio2.update(atualizacao)
print(dicio2)
print(len(dicio2))
del dicio2["Joao"]
print(dicio2)
excluido=dicio2.pop("Jose")
print(dicio2)
print(excluido)
dicio2.pop("Maria")


for pCardeal in ["norte", "sul", "leste", "oeste"]:
    print(pCardeal)
    
for ord, pCardeal in enumerate(["norte", "sul", "leste", "oeste"]):
    print(ord, pCardeal)
    
for ord, pCardeal in enumerate(["norte", "sul", "leste", "oeste"], start=1):
    print(ord, pCardeal)

for valor in range(10):
    print(valor)

for valor in range(3,7):
    print(valor)
    
for valor in range(8, -1, -2):
    print(valor)
    
    
valor=0
while valor<=15:
    valor+=1
    if valor>=5 and valor<=10:
        continue
    print(valor) 
    
valor=0
while valor<=5:
    valor+=1
    print(valor)
else:
    print("o while terminou")
valor=0


while valor<=15:
    valor+=1
    if valor>=5 and valor<=10:
        continue
    print(valor) 
    
valor=0
while valor<=5:
    valor+=1
    print(valor)
print("o while terminou")

for valor in [1, 2, 3, 4, 5]:
    print(valor)
print("for terminou")