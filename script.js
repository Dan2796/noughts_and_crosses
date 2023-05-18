const Player = (name) => {
  const getName = () => name;
  let wins = 0;
  const getWins = () => wins;
  const addWin = () => { wins += 1; };
  return { getName, getWins, addWin };
};

const displayController = (() => {
  const refreshBoard = (board) => {
    for (let row = 0; row <= 2; row += 1) {
      console.log(`${board[row][0]} | ${board[row][1]} | ${board[row][2]}`);
    }
  };
  const playerWins = (xToMove) => {
    // Note that if X is to move then X has just lost because O must have just moved
    console.log(`${xToMove ? 'Player O' : 'Player X'} wins this round!`);
  };
  return { refreshBoard, playerWins };
})();

const gameboard = (() => {
  let board;
  let gameOver;
  let xToMove;
  const getBoard = () => board;
  const resetGame = () => {
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    gameOver = false;
    xToMove = true;
  };
  resetGame();
  const addMark = (row, col) => {
    const mark = xToMove ? 1 : -1;
    board[row][col] = mark;
    displayController.refreshBoard(board);
    xToMove = !xToMove;
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
    if (gameOver) { return; }
    if (row < 0 || row > 2 || col < 0 || col > 2) { return; }
    if (board[row][col] !== 0) { return; }
    addMark(row, col);
    if (checkWin()) {
      gameOver = true;
      displayController.playerWins(xToMove);
    }
  };
  return { getBoard, resetGame, markAndCheck };
})();

displayController.refreshBoard(gameboard.getBoard());
