// Importa o módulo readline, usado para ler informações digitadas no terminal.
const readline = require('readline');

// Cria a conexão entre o programa e o teclado/tela do terminal.
const entrada = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Cria uma lista vazia para guardar as cinco notas.
const notas = [];

// Cria a função responsável por pedir e verificar cada nota.
function lerNota() {
	if (notas.length === 5) {
		const soma = notas[0] + notas[1] + notas[2] + notas[3] + notas[4];
		const media = soma / 5;
		console.log(`\nMédia: ${media.toFixed(2)}`);

		if (media >= 6) {
			console.log('Situação: Aprovado');
		} else {
			console.log('Situação: Reprovado');
		}

		entrada.close();
		return;
	}

	entrada.question(`Digite a ${notas.length + 1}ª nota (0 a 10): `, (resposta) => {
		
		const texto = resposta.trim().replace(',', '.');// Remove espaços, troca vírgula por ponto e prepara o texto da nota.
		const nota = Number(texto); // Converte o texto digitado para um número.

		if (texto === '' || Number.isNaN(nota) || nota < 0 || nota > 10) {
			console.log('Nota inválida. Digite um número entre 0 e 10.');

			lerNota();
			return;
		}

		notas.push(nota);
		lerNota();
	});
}

lerNota();
