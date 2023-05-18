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
  const playerWins = (player) => {
    console.log(`${player} wins this round!`);
  };
  return { refreshBoard, playerWins };
})();

const gameboard = (() => {
  let board;
  let gameOver;
  const getBoard = () => board;
  const resetBoard = () => {
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    gameOver = false;
  };
  resetBoard();
  const addMark = (row, col, playerIsX) => {
    const mark = playerIsX ? 1 : -1;
    if (gameOver) { return; };
    if (row < 0 || row > 2 || col < 0 || col > 2) { return; };
    if (board[row][col] !== 0) { return; };
    board[row][col] = mark;
    displayController.refreshBoard(board);
  };
  const checkWin = () => {
  };
  const markAndCheck = (row, col, player) => {
    addMark(row, col, player.isX);
    if (checkWin()) {
      gameOver = true;
      player.addWin();
      displayController.playerWins(player);
    }
  };
  return { getBoard, resetBoard, addMark };
})();

displayController.refreshBoard(gameboard.getBoard());
