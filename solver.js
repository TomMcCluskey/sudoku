module.exports = Game;

var trial = '158.2..6.2...8..9..3..7.8.2.6.74......4.6.7......19.5.4.9.3..2..2..5...8.7..9.413';

var Game = function(initialString) {

  this.cells = [];
  this.rows = [];
  this.cols = [];
  this.blocks = [];
  this.rowSize = 9;

  var Cell = function(value, row, col, block) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.block = block;
  };

  var Group = function(cells) {
    this.members = cells;
  };

  var _rows = [],
      _cols = [],
      _blocks = [];

  for (i = 0; i < initialString.length; i++) {
    var rowNum = Math.floor(i/this.rowSize);
    var colNum = i % this.rowSize;
    var blockNum = Math.floor(colNum / 3) + 3 * (Math.floor(rowNum / 3));
    this.cells.push(new Cell(initialString[i], rowNum, colNum, blockNum));
    _rows[rowNum] = this.cells.filter( function(cell) {
      return cell.row === rowNum;
    });
    _cols[colNum] = this.cells.filter( function(cell) {
      return cell.col === colNum;
    });
    _blocks[blockNum] = this.cells.filter( function(cell) {
      return cell.block === blockNum;
    });
  }

  _rows.forEach(function(row) {
    this.rows.push(new Group(row));
  }, this);

  _cols.forEach(function(col) {
    this.cols.push(new Group(col));
  }, this);

  _blocks.forEach(function(block) {
    this.blocks.push(new Group(block));
  }, this);

console.log(this);


};
var game = new Game(trial);
