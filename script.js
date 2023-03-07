const pen = document.querySelectorAll('.rand'); // Pegando as divs que terao as cores atualizadas.
const tarefa = document.getElementsByClassName('color'); // Pega todas as divs que terao cores (incluindo a preta).
const black = document.getElementsByClassName('black')[0]; // Crio a cor preta dinamicamente no JS.
const genColor = document.getElementById('button-random-color'); // Botão que cria as cores aleatoriamente.
const clear = document.getElementById('clear-board'); // Botão que limpa a paleta de cores.
const btnVQV = document.getElementById('generate-board'); // Botão do VQV que cria o quadro de pixels.

// Essa funcao gera as cores aleatoriamente e está associada ao botão "Cores aleatórias", nela eu também crio a cor preta dinamicamente e armazendo dentro de uma variável que vai ser armazenada no local storage, toda a vez que essa função for chamada.
function generateColor() {
  const colors = [];
  black.style.backgroundColor = 'rgb(0, 0, 0)';
  for (let index = 0; index < pen.length; index += 1) {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    const cor = `rgb(${r}, ${g}, ${b})`;
    pen[index].style.background = cor;
    colors.push(cor);
  }
  localStorage.setItem('colorPalette', JSON.stringify(colors)); // JSON.stringfy transforma a variavel colors em string.
}

// Essa função restaura as cores toda a vez que a página é atualizada e atribui a cor preta para o primeiro quadrado da paleta, ela também chama o local storage armazenado restaurando as cores na tela.
function restoreColor() {
  black.style.backgroundColor = 'rgb(0, 0, 0)';
  const colors = JSON.parse(localStorage.getItem('colorPalette')); // chama o local storage armazenado.
  for (let index = 0; index < colors.length; index += 1) {
    pen[index].style.background = colors[index];
  }
}
// Chama todas as divs com a classe pixel criada dinamicamente e restaura as cores armazenadas no local storage ("pixelBoard"), fazendo com que o desenho na tela de pixels se mantenha, mesmo depois de atualizado. As divs foram criadas como um array, por isso usei o for.
function restoreBoard() {
  const pixels = document.querySelectorAll('.pixel'); // Usei o querySelectorAll para pegar logo todas as divs com a classe .pixel
  const pixelColors = JSON.parse(localStorage.getItem('pixelBoard'));
  for (let i = 0; i < pixels.length; i += 1) {
    pixels[i].style.backgroundColor = pixelColors[i];
  }
}

// Limpa o quadrado de pixels toda vez que eu clico no botão "limpar" e atribuo a cor branca.
function clearBoard() {
  const pixels = document.querySelectorAll('.pixel');
  for (let i = 0; i < pixels.length; i += 1) {
    pixels[i].style.backgroundColor = 'rgb(255, 255, 255)';
  }
}

// Remove o selected de todas as cores.
function removePen() {
  for (let i = 0; i < tarefa.length; i += 1) {
    tarefa[i].classList.remove('selected');
  }
}

// Adiciono o "selected" a cor que está sendo passada como parametro no addEventListener (addPen)
function addPen(parametro) {
  parametro.target.classList.add('selected');
}

// A posição do "palette" é atribuida como parametro para o addPen e o removePen
for (let i = 0; i < tarefa.length; i += 1) {
  tarefa[i].addEventListener('click', removePen);
  tarefa[i].addEventListener('click', addPen);
}

function checkSaved() {
  // Verifica se o local storage armazenou a chave "colorPalette" (as cores geradas aleatoriamente), se sim, ele chama a funcao restoreColor, que restaura as cores armazenadas, se não ele gera novas cores aleatoriamente;
  if (JSON.parse(localStorage.getItem('colorPalette')) !== null) {
    restoreColor();
  } else {
    generateColor();
  }
  // Verifica se existe cores armazenadas no pixelBoard, caso sim, restaura (F5) elas.
  if (JSON.parse(localStorage.getItem('pixelBoard')) !== null) {
    restoreBoard();
  }
}

// Pega todas as divs que eu criei dinamicamente e armazena elas em um array, com suas respectivas cores de fundo e armazena isso no meu local storage "pixelBoard".
function saveBoard() {
  const pixels = document.querySelectorAll('.pixel');
  const arrayPixel = [];
  for (let i = 0; i < pixels.length; i += 1) {
    arrayPixel.push(pixels[i].style.backgroundColor);
  }
  localStorage.setItem('pixelBoard', JSON.stringify(arrayPixel));
}

function generateTable(n, pixelBoard) {
  let num = n;
  if (n > 50) {
    num = 50;
  }
  for (let i = 0; i < num; i += 1) {
    for (let index = 0; index < num; index += 1) {
      const pixel = document.createElement('div');
      pixel.setAttribute('class', 'pixel');
      pixelBoard.appendChild(pixel);
    }
    const breakLine = document.createElement('br'); // Criei uma tag br para quebrar a linha de pixels
    pixelBoard.appendChild(breakLine);
  }
  localStorage.setItem('boardSize', JSON.stringify(num));
}

// Crio o quadro de pixels dinamicamente e atribui uma classe pixel a cada div criada, e atribui elas como filha da div 'pixel-board' criada no index.
const initialTable = () => {
  const pixelBoard = document.getElementById('pixel-board');
  pixelBoard.innerHTML = '';
  let n = 5;
  if (JSON.parse(localStorage.getItem('pixelBoard')) !== null) {
    const board = JSON.parse(localStorage.getItem('pixelBoard'));
    n = Math.floor(Math.sqrt(board.length));
  }
  generateTable(n, pixelBoard);
};

function changeTable() {
  const pixelBoard = document.getElementById('pixel-board');
  pixelBoard.innerHTML = '';
  const inputValue = document.getElementById('board-size').value;
  let n = 5;
  if (inputValue < 5) {
    window.alert('Board inválido!');
  } else {
    n = inputValue;
  }
  generateTable(n, pixelBoard);
}

// Armazena meus clicks e seus respectivos eventos
function clickButton() {
  genColor.addEventListener('click', generateColor); // botão que gera cores aleatorias
  clear.addEventListener('click', clearBoard); // botão de limpar
  btnVQV.addEventListener('click', changeTable); // botão VQV
}

// chama as funções em suas ordens após a página ser carregada (F5) ou quando da o "go live"
window.onload = () => {
  clickButton();
  initialTable();
  checkSaved();
};

function changeColor(element) {
  let cor;
  for (let i = 0; i < tarefa.length; i += 1) {
    // usei o contains para verificar a cor que contém a o 'selected'.
    if (tarefa[i].classList.contains('selected')) {
      cor = tarefa[i].style.backgroundColor;
    }
  }
  // usei o closest verifica o mais 'proximo' de cada div que tem a classe .pixel.
  const target = element.target.closest('.pixel');
  if (target) {
    target.style.backgroundColor = cor;
  }
  saveBoard();
}

document.addEventListener('click', changeColor);
