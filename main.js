// Valores
const tamanhoX = 12
const tamanhoY = 16
const quantidadeBombas = 30
let bandeirinha = false
let campoMinado = false
let casasAbertas = 0
let gameOver = false

// Array do campo minado
const campoArray = []
while (campoArray.length < tamanhoY) {
	campoArray.push(Array.from(Array(tamanhoX).fill(0)))
}

function minarCampo(x,y) {
	// Colocando bombas no campo
	let contadorBombas = quantidadeBombas
	while (contadorBombas > 0) {
		const randomX = Math.floor(Math.random() * tamanhoX)
		const randomY = Math.floor(Math.random() * tamanhoY)
		if (randomX != x && randomY != y && campoArray[randomY][randomX] != 9) {
			campoArray[randomY][randomX] = 9
			contadorBombas--
		}
	}

	// Definindo o número de bombas ao redor de cada quadrado
	campoArray.forEach((row, y) => {
		row.forEach((col, x) => {
			if (campoArray[y][x] != 9) {
				for(let i = -1; i < 2; i++){
					for(let j = -1; j < 2; j++){
						if (campoArray?.[y + j]?.[x + i] === 9) {
							campoArray[y][x]++
						}
					}
				}
			}
		})
	})
}

// Construindo campo em HTML
const casas = []
const campo = document.getElementById('campo')
campo.style.width = `${tamanhoX * 30}px`
campoArray.forEach((row, y) => {
	row.forEach((col, x) => {
		const novaCasa = document.createElement('button')
		novaCasa.classList.add('casa')
		novaCasa.dataset.x = x
		novaCasa.dataset.y = y
		campo.appendChild(novaCasa)
		casas.push(novaCasa)
	})
})

// Botão de bandeirinha
const botaoBandeira = document.getElementById('botaoBandeira')
botaoBandeira.addEventListener('click', toggleBandeirinha)

// Ativar / desativar bandeirinha
function toggleBandeirinha() {
	if (!gameOver) {
		botaoBandeira.classList.toggle('ativo')
		bandeirinha ^= 1
	}
}

// Adicionar função de clique ao campo
campo.addEventListener('click', ({target}) => {
	if (!gameOver) {
		// Botar / tirar bandeirinha
		if (bandeirinha) {
			target.textContent = target.textContent === '' ? '⚑' : ''
			toggleBandeirinha()
		}

		else {
			// Ao abrir a primeira casa, definir onde estão as bombas
			if (!campoMinado) {
				minarCampo(target.dataset.x,target.dataset.y)
				campoMinado = true
			}
			// Abrir casa
			abrirCasa(parseInt(target.dataset.x), parseInt(target.dataset.y))
		}	
	}
})

// Função de abrir casa
function abrirCasa(x,y) {
	const casa = document.querySelector(`.casa[data-x="${x}"][data-y="${y}"]`)
	if (casa && !casa.disabled) {
		casa.disabled = true
		casa.textContent = campoArray[y][x]
		casa.classList.add(`cor${campoArray[y][x]}`)

		// Abriu uma bomba
		if (campoArray[y][x] === 9) {
			casa.textContent = 'x'
			gameOver = true
			casas.forEach(casa => {
				if (!casa.disabled && campoArray[casa.dataset.y][casa.dataset.x] === 9) {
					casa.disabled = true
					casa.textContent = 'x'
					casa.classList.add('aberto')
				}
			})
		}

		// Abriu uma casa sem bomba
		else {
			casasAbertas++

			// Abriu uma casa sem bombas ao redor
			if (campoArray[y][x] === 0) {
				for(let i = -1; i < 2; i++){
					for(let j = -1; j < 2; j++){
						abrirCasa(x + i, y + j)
					}
				}
			}

			// Ganhou o jogo
			if (casasAbertas >= tamanhoX * tamanhoY - quantidadeBombas) {
				gameOver = true
				casas.forEach(casa => {
					if (campoArray[casa.dataset.y][casa.dataset.x] === 9) {
						casa.textContent = '⚑'
					}
				})
			}
		}
	}
}

// Reset
const reset = document.getElementById('reset')
reset.addEventListener('click', () => {
	gameOver = false
	campoMinado = false
	bandeirinha = false
	casasAbertas = 0
	botaoBandeira.classList.remove('ativo')
	casas.forEach(casa => {
		casa.disabled = false
		casa.setAttribute('class', 'casa')
		casa.textContent = ''
		campoArray[casa.dataset.y][casa.dataset.x] = 0
	})
})
