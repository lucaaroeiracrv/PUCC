#include <stdio.h>
#include <math.h>
#include <string.h>


void calcular (float n1, float n2){
    printf("Resultado soma: %f", n1+n2);
    printf("Resultado subtracao: %f", n1-n2);
    printf("Resultado multiplicacao: %f", n1*n2);
    if(n2 == 0){
        printf("Divisor nao pode ser 0!");
        return 0;
    }else{
        printf("Resultado divisao: 0,0 %f", n1/n2);
    }
}

float lerNumero (){
    float n;

    printf("Digite um numero: ");
    scanf("%f", &n);

    return n;
}


int main(){
    float num1, num2;
    
    num1=lerNumero();
    num2=lerNumero();

    calcular(num1, num2);

    return 0;
}