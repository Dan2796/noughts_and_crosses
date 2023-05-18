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
const player2Name = document.querySelector('.player2Name');
const player2Tally = document.querySelector('.player2Tally');
const winMessage = document.querySelector('.winMessage');

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
  const chooseMark = (board, row, col) => {
    if (board[row][col] === 1) { return 'X'; }
    if (board[row][col] === -1) { return 'O'; }
    return '';
  };
  const refreshPlayerText = () => {
    player1Name.textContent = player1.getName();
    player1Tally.textContent = player1.getWins();
    player2Name.textContent = player2.getName();
    player2Tally.textContent = player2.getWins();
  };
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
  const showWhoIsX = (playerWithX) => {
    winMessage.textContent = `${playerWithX.getName()} is crosses`;
  };
  const playerWins = (winner) => {
    winMessage.textContent = (`${winner.getName()} wins this round!`);
    refreshPlayerText();
  };
  const draw = () => {
    winMessage.textContent = 'It\'s a draw!';
    refreshPlayerText();
  };
  return {
    refreshBoard, refreshPlayerText, showWhoIsX, playerWins, draw,
  };
})();

displayController.refreshPlayerText();

const gameboard = (() => {
  let board;
  let xToMove;
  let playerWithX;
  let playerWithO;
  let numberOfMarks;
  const getBoard = () => board;
  const resetGame = () => {
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    xToMove = true;
    numberOfMarks = 0;
    playerWithX = Math.random() < 0.5 ? player1 : player2;
    playerWithO = player1 === playerWithX ? player2 : player1;
  };
  resetGame();
  displayController.showWhoIsX(playerWithX);
  const addMark = (row, col) => {
    const mark = xToMove ? 1 : -1;
    board[row][col] = mark;
    displayController.refreshBoard(board);
    if (numberOfMarks === 0) { displayController.showWhoIsX(playerWithX); }
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
      displayController.playerWins(winner);
      winner.addWin();
      displayController.refreshPlayerText();
      resetGame();
    }
    if (numberOfMarks === 9) {
      resetGame();
      displayController.draw();
    }
  };
  return {
    getBoard, resetGame, markAndCheck, playerWithX, playerWithO, numberOfMarks,
  };
})();

displayController.refreshBoard(gameboard.getBoard());

topleft.addEventListener('click', () => gameboard.markAndCheck(0, 0));
topmiddle.addEventListener('click', () => gameboard.markAndCheck(0, 1));
topright.addEventListener('click', () => gameboard.markAndCheck(0, 2));
middleleft.addEventListener('click', () => gameboard.markAndCheck(1, 0));
middlemiddle.addEventListener('click', () => gameboard.markAndCheck(1, 1));
middleright.addEventListener('click', () => gameboard.markAndCheck(1, 2));
bottomleft.addEventListener('click', () => gameboard.markAndCheck(2, 0));
bottommiddle.addEventListener('click', () => gameboard.markAndCheck(2, 1));
bottomright.addEventListener('click', () => gameboard.markAndCheck(2, 2));
