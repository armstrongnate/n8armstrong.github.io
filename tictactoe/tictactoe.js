
String.prototype.getY = function() {
  return Number(this.slice(-1));
}

String.prototype.getX = function() {
  return Number(this.slice(-2)[0]);
}

var tictactoe = function() {

  var _this = this;
  this.initialize = function() {
    _this.playerOneTurn = true,
    _this._x = 'x',
    _this._o = 'o',
    _this.gridSize = 3,
    _this.tdElements = Array(Array(3), Array(3), Array(3)),
    _this.winnerCells = Array(),
    _this.winner = false;
    var cells, i;
    cells = document.getElementsByTagName('td');
    for (i=0; i<cells.length; i++) {
      cells[i].onclick = _this.handleCellClick;
      _this.tdElements[i%_this.gridSize][Math.floor(i/_this.gridSize)] = cells[i];
    }
  };

  this.getPlayer = function() {
    return this.playerOneTurn ? _this._x : _this._o;
  };

  this.playerIsAtCell = function(x, y) {
    if (x < 0 || x > this.gridSize -1 || y < 0 || y > this.gridSize -1) return false;
    else {
      return this.tdElements[x][y].innerHTML === this.getPlayer();
    }
  };

  this.checkNeighbors = function(x, y, j, k) {
    if (this.playerIsAtCell(x, y) && this.playerIsAtCell(j, k)) {
      this.winner = true;
      this.winnerCells.push(this.tdElements[x][y], this.tdElements[j][k]);
    }
  };

  this.checkForWinner = function(x, y) {
    var _this = this;
    _this.winnerCells = Array(_this.tdElements[x][y]);
    _this.winner = false;
    _this.checkNeighbors(x+1, y, x+2, y)      // right
    _this.checkNeighbors(x+1, y+1, x+2, y+2)  // right diag down
    _this.checkNeighbors(x, y+1, x, y+2)      // down
    _this.checkNeighbors(x-1, y+1, x-2, y+2)  // left diag down
    _this.checkNeighbors(x-1, y, x-2, y)      // left
    _this.checkNeighbors(x-1, y-1, x-2, y-2)  // left diag up
    _this.checkNeighbors(x, y-1, x, y-2)      // up
    _this.checkNeighbors(x+1, y-1, x+2, y-2)  // right diag up
    _this.checkNeighbors(x-1, y, x+1, y)      // left and right
    _this.checkNeighbors(x, y-1, x, y+1)      // up and down
    _this.checkNeighbors(x+1, y-1, x-1, y+1)  // right diag up and left diag down
    _this.checkNeighbors(x-1, y-1, x+1, y+1)  // left diag up and right diag down

    if (_this.winner && _this.winnerCells.length > 2) {
      var i;
      for (i=0; i<_this.winnerCells.length; i++) {
        _this.winnerCells[i].className = 'winner';
      }
      alert(_this.getPlayer() + ' won!');
      document.location.reload();
    }
    _this.playerOneTurn = !_this.playerOneTurn;
  };

  this.handleCellClick = function() {
    if (this.innerHTML === _this._x || this.innerHTML === _this._o) return;
    else {
      var x, y;
      x = this.id.getX();
      y = this.id.getY();
      this.innerHTML = _this.getPlayer();
      _this.checkForWinner(x, y);
    }
  };
}

var ttt = new tictactoe();
ttt.initialize();
