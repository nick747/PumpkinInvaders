const grid = document.querySelector('#grid');
const resultsDisplay = document.querySelector('#result');

const DEBUG = false;
const width = 15; 
const rxc = width * width;
const squares = [];
const aliensRemoved = [];
const aliensSpeed = 200;

let  noEvents = false;
let batInterval = null;
let currentSpaceshipIndex = 217;
let results = 0;

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
];

function debugMode(square, i) {
  square.innerText = i;
  square.style.fontSize = '8px';
  square.style.backgroundColor = 'tomato';
}

// Creo la griglia
for (let i = 0; i < rxc; i++) {
  const square = document.createElement('div');
  if (DEBUG) debugMode(square, i);
  squares.push(square);
  grid.appendChild(square);
}

// Disegno gli alieni
function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if(!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('bat')
    }
  }
}

// Rimuovo gli alieni
function clear() {
  for(let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('bat');
  }
}

draw();

// MOVIMENTO ALIENI
let direction = 'forward'; // 'backward'
let step = 1;
function moveAliens() {
  
  // 1. Rimuovo dalla griglia tutti gli alieni
  clear();

  // 2. Cambio posizione manipolando gli indici

  // Check bordi griglia:
  // se il primo alieno dell'array è all'inizio della riga
  // se l'ultimo alieno dell'array è alla fine della riga
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === (width - 1);


  // Se sono al bordo destro e mi sposto verso destra
  // avanzo di una riga (index + width + 1) e inverto il senso i marcia
  if(rightEdge && direction === 'forward') {
    for(let i = 0; i < alienInvaders.length; i++) {      
      alienInvaders[i] =  alienInvaders[i] + width + 1;
      step = -1;
      direction = 'backward';
    }
  }

  // Se sono al bordo sinistrio e mi sposto verso sinistra
  // avanzo di una riga (index + width - 1) e inverto il senso i marcia
  if(leftEdge && direction === 'backward') {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] = alienInvaders[i] + (width - 1);
      step = 1;
      direction = 'forward';
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] = alienInvaders[i] + step;
    checkAlienWin(alienInvaders[i]);
  }

  // 3. Ridisegno gli alieni nella nuova posizione
  draw();
}

batInterval = setInterval(moveAliens, aliensSpeed);


// ASTRONAVE
squares[currentSpaceshipIndex].classList.add('pumpkin');

function moveSpaceship(e) {
  if (!noEvents) {
    squares[currentSpaceshipIndex].classList.remove('pumpkin');
    // console.log(currentSpaceshipIndex);

    if (e.code === 'ArrowLeft' && currentSpaceshipIndex % width !== 0) {
      currentSpaceshipIndex--;
    } else if (e.code === 'ArrowRight' && currentSpaceshipIndex % width < (width - 1)) {
        currentSpaceshipIndex++;
    }

    squares[currentSpaceshipIndex].classList.add('pumpkin');
  }
}

document.addEventListener('keydown', moveSpaceship);

// LASER
function shoot(e) {

  if(e.code !== 'Space') return;

  if (!noEvents) {
    let laserInterval = null;
    let currentLaserIndex = currentSpaceshipIndex;
  
    function moveLaser() {
      squares[currentLaserIndex].classList.remove('candy');
      currentLaserIndex = currentLaserIndex - width;

      if(currentLaserIndex < 0) {
        clearInterval(laserInterval);
        return;
      };
      
      squares[currentLaserIndex].classList.add('candy');

      if(squares[currentLaserIndex].classList.contains('bat')) {      
        boom(squares[currentLaserIndex]);
        updateScore();
        clearInterval(laserInterval);

        const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
        aliensRemoved.push(alienRemoved);
        checkHumanWin();
        
      }
    }

    laserInterval = setInterval(moveLaser, 100);
  }

}

 // Effetto Boom
function boom(square) { 
  square.classList.remove('candy', 'bat');
  square.classList.add('boom');
  setTimeout(function() {
    square.classList.remove('boom')
  }, 300);
  
}

function updateScore() {
  results++;
  resultsDisplay.innerHTML = results;
}

// Vittoria alieni: hanno raggiunto la base
// l'indice di un qualsiasi alieno è maggiore
// della lunghezza dell'array della griglia
function checkAlienWin(alien) {
  if(
    !aliensRemoved.includes(alien) &&
    alien >= currentSpaceshipIndex
  ) {
    clearInterval(batInterval);
    noEvents = true;
    showAlert('GAME OVER');
  }
}

function checkHumanWin() {
  // Vittoria umano: array alieni è uguale all'array dei rimossi
  if (aliensRemoved.length === alienInvaders.length) {
    clearInterval(batInterval);
    noEvents = true;
    showAlert('VITTORIA!');
  }
}

document.addEventListener('keydown', shoot);
