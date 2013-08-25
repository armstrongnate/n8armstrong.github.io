var playerOneTurn = true;
var _x = 'x'
var _o = 'o'
var gridSize = 3;
var tdElements = Array(Array(3), Array(3), Array(3));
var winnerCells;
var winner;

String.prototype.getY = function() {
  return Number(this.slice(-1));
}

String.prototype.getX = function() {
  return Number(this.slice(-2)[0]);
}

function getPlayer() {
  return playerOneTurn ? _x : _o
}

function playerIsAtCell(x, y) {
  if (x < 0 || x > gridSize -1 || y < 0 || y > gridSize -1) return false;
  else {
    return tdElements[x][y].innerHTML === getPlayer();
  }
}

function checkNeighbors(x, y, j, k) {
  if (playerIsAtCell(x, y) && playerIsAtCell(j, k)) {
    winner = true;
    winnerCells.push(tdElements[x][y], tdElements[j][k]);
  }
}

function checkForWinner(x, y) {
  winnerCells = Array(tdElements[x][y]);
  winner = false;
  checkNeighbors(x+1, y, x+2, y)      // right
  checkNeighbors(x+1, y+1, x+2, y+2)  // right diag down
  checkNeighbors(x, y+1, x, y+2)      // down
  checkNeighbors(x-1, y+1, x-2, y+2)  // left diag down
  checkNeighbors(x-1, y, x-2, y)      // left
  checkNeighbors(x-1, y-1, x-2, y-2)  // left diag up
  checkNeighbors(x, y-1, x, y-2)      // up
  checkNeighbors(x+1, y-1, x+2, y-2)  // right diag up
  checkNeighbors(x-1, y, x+1, y)      // left and right
  checkNeighbors(x, y-1, x, y+1)      // up and down
  checkNeighbors(x+1, y-1, x-1, y+1)  // right diag up and left diag down
  checkNeighbors(x-1, y-1, x+1, y+1)  // left diag up and right diag down

  if (winner && winnerCells.length > 2) {
    var i;
    for (i=0; i<winnerCells.length; i++) {
      winnerCells[i].className = 'winner';
    }
    alert(getPlayer() + ' won!');
    document.location.reload();
  }
  playerOneTurn = !playerOneTurn;
}

function handleCellClick() {
  if (this.innerHTML === _x || this.innerHTML === _o) return;
  else {
    var x, y;
    x = this.id.getX();
    y = this.id.getY();
    this.innerHTML = getPlayer();
    checkForWinner(x, y);
  }
}

var cells, i;
cells = document.getElementsByTagName('td');
for (i=0; i<cells.length; i++) {
  cells[i].onclick = handleCellClick;
  tdElements[i%gridSize][Math.floor(i/gridSize)] = cells[i];
}
