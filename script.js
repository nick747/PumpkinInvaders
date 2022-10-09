const grid = document.querySelector('#grid');
const resultsDisplay = document.querySelector('#result');

const DEBUG = false;
const width = 15; 
const rxc = width * width;
const squares = [];
let batsSpeed = 200;

let noEvents = true;
let batInterval = null;
let currentPumpkinIndex = 217;
let results = 0;

const batInvaders = [
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

// Disegno i pipistrelli
function draw() {
  for (let i = 0; i < batInvaders.length; i++) {
    if (batInvaders[i] != -1) {
      squares[batInvaders[i]].classList.add('bat')
    }
  }
}

// Rimuovo i pipistrelli
function clear() {
  for(let i = 0; i < batInvaders.length; i++) {
    if (batInvaders[i] != -1) {
      squares[batInvaders[i]].classList.remove("bat");
    }
  }
}


const start = document.getElementById("start");
const speed1 = document.getElementById("speed1");
const speed2 = document.getElementById("speed2");
const speed3 = document.getElementById("speed3");



start.addEventListener("click", function(){
  noEvents = false;
  console.log(batsSpeed);
  batInterval = setInterval(moveBats, batsSpeed);
});


speed1.addEventListener("click", function(){
  if (noEvents) {
    batsSpeed = 500;
    speed2.classList.remove("selected");
    speed3.classList.remove("selected");
    speed1.classList.add('selected');
}
});


speed2.addEventListener("click", function(){
  if (noEvents) {
    speed1.classList.remove("selected");
    speed3.classList.remove("selected");
    speed2.classList.add('selected');
    batsSpeed = 200;
  }
});


speed3.addEventListener("click", function(){
  if (noEvents) {
    speed2.classList.remove("selected");
    speed1.classList.remove("selected");
    speed3.classList.add('selected');
    batsSpeed = 50;
  }
});




draw();

// MOVIMENTO PIPISTRELLI
let direction = 'forward'; // 'backward'
let step = 1;
function moveBats() {
  
  // 1. Rimuovo dalla griglia tutti i pipistrelli
  clear();

  // 2. Cambio posizione manipolando gli indici
  for (let i = 0; i < batInvaders.length; i++) {
    if (batInvaders[i] != -1) {
      batInvaders[i] = batInvaders[i] + step;
      checkBatWin(batInvaders[i]);
    }
  }

  // 3. Ridisegno i pipistrelli nella nuova posizione
  draw();

  flag = false;
  if (direction === 'forward') {
    step = 1;
    i = 9;
    // se almeno un pipistrello dell'array è alla fine della riga
    do {
      let f1 = (batInvaders[i] != -1) && (batInvaders[i] % width === (width - 1));
      let f2 = (batInvaders[i + 10] != -1) && (batInvaders[i + 10] % width === (width - 1));
      let f3 = (batInvaders[i + 20] != -1) && (batInvaders[i + 20] % width === (width - 1));
      flag = f1 | f2 | f3;
      i--;
    } while (!flag && i > 0)
    if (flag) {
      // Se sono al bordo destro e mi sposto verso destra
      // avanzo di una riga (index + width + 1) e inverto il senso i marcia
      step = width;
      direction = 'backward';
    }
  } else if (direction === 'backward') {
    step = -1;
    i = 0;
    // se almeno un pipistrello dell'array è all'inizio della riga
    do {
      let f1 = (batInvaders[i] != -1) && (batInvaders[i] % width === 0);
      let f2 = (batInvaders[i + 10] != -1) && (batInvaders[i + 10] % width === 0);
      let f3 = (batInvaders[i + 20] != -1) && (batInvaders[i + 20] % width === 0);
      flag = f1 | f2 | f3;
      i++;
    } while (!flag && i < 10)
    if (flag) {
      // Se sono al bordo sinistrio e mi sposto verso sinistra
      // avanzo di una riga (index + width - 1) e inverto il senso i marcia
      step = width;
      direction = 'forward';
    }
  }
}




// ZUCCA
squares[currentPumpkinIndex].classList.add('pumpkin');

function movePumpkin(e) {
  if (!noEvents) {
    squares[currentPumpkinIndex].classList.remove('pumpkin');

    if (e.code === 'ArrowLeft' && currentPumpkinIndex % width !== 0) {
      currentPumpkinIndex--;
    } else if (e.code === 'ArrowRight' && currentPumpkinIndex % width < (width - 1)) {
        currentPumpkinIndex++;
    }

    squares[currentPumpkinIndex].classList.add('pumpkin');
  }
}

document.addEventListener('keydown', movePumpkin);

// CARAMELLA
function shoot(e) {

  if(e.code !== 'Space') return;

  if (!noEvents) {
    let candyInterval = null;
    let currentCandyIndex = currentPumpkinIndex;
  
    function moveLaser() {
      squares[currentCandyIndex].classList.remove('candy');
      currentCandyIndex = currentCandyIndex - width;

      if(currentCandyIndex < 0) {
        clearInterval(candyInterval);
        return;
      };
      
      squares[currentCandyIndex].classList.add('candy');

      if(squares[currentCandyIndex].classList.contains('bat')) {      
        boom(squares[currentCandyIndex]);
        updateScore();
        clearInterval(candyInterval);

        const batRemoved = batInvaders.indexOf(currentCandyIndex);
        batInvaders[batRemoved] = -1;
        checkHumanWin();
        
      }
    }

    candyInterval = setInterval(moveLaser, 100);
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

// Vittoria pipistrelli: hanno raggiunto la base
// l'indice di un qualsiasi pipistrello è maggiore
// della lunghezza dell'array della griglia
function checkBatWin(bat) {
  if ((bat != 1) && bat >= currentPumpkinIndex) {
    clearInterval(batInterval);
    noEvents = true;
    showAlert('GAME OVER');
  }
}

function checkHumanWin() {
  // Vittoria umano: il numero dei pipistrelli rimossi è uguale al numero dei totali
  if (results >= batInvaders.length) {
    clearInterval(batInterval);
    noEvents = true;
    showAlert('VITTORIA!');
  }
}

document.addEventListener('keydown', shoot);
