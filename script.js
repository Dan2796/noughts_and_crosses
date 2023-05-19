const topleft = document.getElementById('top-left');
const topmiddle = document.getElementById('top-middle');
const topright = document.getElementById('top-right');
const middleleft = document.getElementById('middle-left');
const middlemiddle = document.getElementById('middle-middle');
const middleright = document.getElementById('middle-right');
const bottomleft = document.getElementById('bottom-left');
const bottommiddle = document.getElementById('bottom-middle');
const bottomright = document.getElementById('bottom-right');

const player1Name = document.querySelector('.player1Name');
const player1Tally = document.querySelector('.player1Tally');
const player1Crosses = document.querySelector('.player1Crosses');
const player2Name = document.querySelector('.player2Name');
const player2Tally = document.querySelector('.player2Tally');
const player2Crosses = document.querySelector('.player2Crosses');
const winMessage = document.querySelector('.winMessage');

const renameP1 = document.getElementById('renameP1');
const renameP2 = document.getElementById('renameP2');

const resetButton = document.querySelector('.resetButton');

const Player = (playerName) => {
  let name = playerName;
  const setName = (newName) => { name = newName; };
  const getName = () => name;
  let wins = 0;
  const getWins = () => wins;
  const addWin = () => { wins += 1; };
  return {
    setName, getName, getWins, addWin,
  };
};

const player1 = Player('Player 1');
const player2 = Player('Player 2');

const displayController = (() => {
  const refreshPlayerText = (playerWithX) => {
    player1Name.textContent = player1.getName();
    player1Tally.textContent = player1.getWins();
    player1Crosses.textContent = player1 === playerWithX ? 'X' : 'O';
    player2Name.textContent = player2.getName();
    player2Tally.textContent = player2.getWins();
    player2Crosses.textContent = player2 === playerWithX ? 'X' : 'O';
  };
  const chooseMark = (board, row, col) => {
    if (board[row][col] === 1) { return 'X'; }
    if (board[row][col] === -1) { return 'O'; }
    return '';
  };
  /* Could just refresh the individual marks but need refreshBoard function anyway for when hitting
     the restart button, so might as well just refresh each time a mark is made; the performance
     is unlikely to be affected for a 3x3 grid. */
  const refreshBoard = (board) => {
    topleft.textContent = chooseMark(board, 0, 0);
    topmiddle.textContent = chooseMark(board, 0, 1);
    topright.textContent = chooseMark(board, 0, 2);
    middleleft.textContent = chooseMark(board, 1, 0);
    middlemiddle.textContent = chooseMark(board, 1, 1);
    middleright.textContent = chooseMark(board, 1, 2);
    bottomleft.textContent = chooseMark(board, 2, 0);
    bottommiddle.textContent = chooseMark(board, 2, 1);
    bottomright.textContent = chooseMark(board, 2, 2);
  };
  const playerWins = (winner, playerWithX) => {
    winMessage.textContent = (`${winner.getName()} wins this round! ${playerWithX.getName()} to start the next:`);
  };
  const draw = (playerWithX) => {
    winMessage.textContent = `It's a draw! ${playerWithX.getName()} to start the next:`;
  };
  const resetWinMessage = () => {
    winMessage.textContent = '';
  };
  return {
    refreshBoard, refreshPlayerText, playerWins, draw, resetWinMessage,
  };
})();

const gameboard = (() => {
  let board;
  let xToMove;
  let playerWithX = player1;
  let playerWithO = player2;
  let numberOfMarks;
  const getBoard = () => board;
  const getPlayerWithX = () => playerWithX;
  const resetGame = () => {
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    xToMove = true;
    numberOfMarks = 0;
  };
  resetGame();
  displayController.refreshPlayerText(playerWithX);
  // not part of reset because don't want to switch X on restart button, only on win / draw
  const switchWhoIsX = () => {
    if (player1 === playerWithX) {
      playerWithX = player2;
      playerWithO = player1;
    } else {
      playerWithX = player1;
      playerWithO = player2;
    }
  };
  const addMark = (row, col) => {
    const mark = xToMove ? 1 : -1;
    board[row][col] = mark;
    displayController.refreshBoard(board);
    // reset the win message if just starting again
    if (numberOfMarks === 0) {
      displayController.resetWinMessage();
    }
    xToMove = !xToMove;
    numberOfMarks += 1;
  };
  const checkArraySumsTarget = (array, target) => {
    const arraySum = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return arraySum === target;
  };
  /* It would probably be more efficient to only check rows and cols based on the latest input.
     For example, don't check the top row if a bottom mark has just been made. But the performance
     differences are small, and this code is easier to write. */
  const checkWin = () => {
    // Only check zeros or xs depending on which player may have just won:
    const targetSum = xToMove ? -3 : 3;
    return (checkArraySumsTarget(board[0], targetSum)
            || checkArraySumsTarget(board[1], targetSum)
            || checkArraySumsTarget(board[2], targetSum)
            || checkArraySumsTarget([board[0][0], board[1][0], board[2][0]], targetSum)
            || checkArraySumsTarget([board[0][1], board[1][1], board[2][1]], targetSum)
            || checkArraySumsTarget([board[0][2], board[1][2], board[2][2]], targetSum)
            || checkArraySumsTarget([board[0][0], board[1][1], board[2][2]], targetSum)
            || checkArraySumsTarget([board[0][2], board[1][1], board[2][0]], targetSum));
  };
  const markAndCheck = (row, col) => {
    // check game running and move is valid:
    if (row < 0 || row > 2 || col < 0 || col > 2) { return; }
    if (board[row][col] !== 0) { return; }
    addMark(row, col);
    if (checkWin()) {
      // Note that if X is to move then X has just lost because O must have just moved
      const winner = xToMove ? playerWithO : playerWithX;
      switchWhoIsX();
      displayController.playerWins(winner, playerWithX);
      winner.addWin();
      resetGame();
      displayController.refreshPlayerText(playerWithX);
    }
    if (numberOfMarks === 9) {
      switchWhoIsX();
      displayController.draw(playerWithX);
      resetGame();
      displayController.refreshPlayerText(playerWithX);
    }
  };
  return {
    getBoard, resetGame, markAndCheck, getPlayerWithX,
  };
})();

topleft.addEventListener('click', () => gameboard.markAndCheck(0, 0));
topmiddle.addEventListener('click', () => gameboard.markAndCheck(0, 1));
topright.addEventListener('click', () => gameboard.markAndCheck(0, 2));
middleleft.addEventListener('click', () => gameboard.markAndCheck(1, 0));
middlemiddle.addEventListener('click', () => gameboard.markAndCheck(1, 1));
middleright.addEventListener('click', () => gameboard.markAndCheck(1, 2));
bottomleft.addEventListener('click', () => gameboard.markAndCheck(2, 0));
bottommiddle.addEventListener('click', () => gameboard.markAndCheck(2, 1));
bottomright.addEventListener('click', () => gameboard.markAndCheck(2, 2));

resetButton.addEventListener('click', () => {
  gameboard.resetGame();
  displayController.refreshBoard(gameboard.getBoard());
});

renameP1.addEventListener('click', () => {
  const newName = prompt('Rename first player:');
  if (newName != null) {
    player1.setName(newName);
  }
  displayController.refreshPlayerText(gameboard.getPlayerWithX());
});

renameP2.addEventListener('click', () => {
  const newName = prompt('Rename second player:');
  if (newName != null) {
    player2.setName(newName);
  }
  displayController.refreshPlayerText(gameboard.getPlayerWithX());
});
