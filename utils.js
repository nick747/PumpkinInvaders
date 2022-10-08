function showAlert(message) {
  if(!message) return;

  const game = document.getElementById('game');  
  const gameAlert = `
    <div class="game-alert">
      <div class="game-alert-message">${message}</div>
    </div>
  `;
  
  game.insertAdjacentHTML('afterbegin', gameAlert);
}
