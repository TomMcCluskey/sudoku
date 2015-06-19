module.exports = Game;

var trial = '158.2..6.2...8..9..3..7.8.2.6.74......4.6.7......19.5.4.9.3..2..2..5...8.7..9.413';

var Game = function(initialString) {

  var _ = require('lodash');

  this.cells = [];
  this.rows = [];
  this.cols = [];
  this.blocks = [];
  this.rowSize = 9;

  var Cell = function(value, row, col, block, game) {
    this.value = value;
    // Nums are used in Group creation to assign properties linking to Group objects
    this.rowNum = row;
    this.colNum = col;
    this.blockNum = block;
  };

  Cell.prototype.possibleValues = function() {
    return _.intersection(this.row.missingValues(), this.col.missingValues(), this.block.missingValues());
  };

  Cell.prototype.siblings = function() {
    var rowSiblings = this.row.members.filter(function(cell) {
      return cell.colNum !== this.colNum;
    }, this);
    var colSiblings = this.col.members.filter(function(cell) {
      return cell.rowNum !== this.rowNum;
    }, this);
    var blockSiblings = this.block.members.filter(function(cell) {
      return (cell.rowNum !== this.rowNum) && (cell.colNum !== this.colNum);
    }, this);
    return _.union(rowSiblings, colSiblings, blockSiblings);
  };

  var Group = function(cells, type) {
    this.members = cells;
    this.values = this.members.map(function(item) { return item.value; } );
    var group = this;
    this.emptyCells = this.members.filter(function(cell) {
      return cell.value === '.';
    });
    this.members.forEach(function(member) {
      member[type] = group;
    });
  };

  Group.prototype.goal = ['1','2','3','4','5','6','7','8','9'];

  Group.prototype.missingValues = function() {
    return _.difference( this.goal, this.values );
  };

  Group.prototype.solvedValues = function() {
    return _.union(this.values);
  };

  var _rows = [],
      _cols = [],
      _blocks = [];

  for (i = 0; i < initialString.length; i++) {
    var rowNum = Math.floor(i/this.rowSize);
    var colNum = i % this.rowSize;
    var blockNum = Math.floor(colNum / 3) + 3 * (Math.floor(rowNum / 3));
    this.cells.push(new Cell(initialString[i], rowNum, colNum, blockNum, this));
    _rows[rowNum] = this.cells.filter( function(cell) {
      return cell.rowNum === rowNum;
    });
    _cols[colNum] = this.cells.filter( function(cell) {
      return cell.colNum === colNum;
    });
    _blocks[blockNum] = this.cells.filter( function(cell) {
      return cell.blockNum === blockNum;
    });
  }


  _rows.forEach(function(row) {
    this.rows.push(new Group(row, 'row'));
  }, this);

  _cols.forEach(function(col) {
    this.cols.push(new Group(col, 'col'));
  }, this);

  _blocks.forEach(function(block) {
    this.blocks.push(new Group(block, 'block'));
  }, this);

  this.unsolved = function() {
    return this.cells.filter(function(cell) {
      return cell.value === '.';
    });
  };


};

Game.prototype.solve = function() {
  // look in each group for unsolved squares.
  // check each unsolved square for possibilities
  // check each other square in group for that possibility
  this.unsolved().forEach(function(cell) {
    console.log(cell);
    if (cell.possibileValues().length === 1) {
      cell.value = cell.possibleValues()[0];
    } else {
      //if () {} // need a cell.siblings property
      cell.possibleValues().forEach(function(value) {
        var elsewhere = false;
        cell.siblings().forEach(function(sibling) {
          if (sibling.value === value) {
            elsewhere = true;
            return;
          }
        });         
        if(!elsewhere) { cell.value = value; }
      });
    }
  });
};

Game.prototype.print = function() {
  //
};

var game = new Game(trial);
// console.log(game.rows[0].values);
// console.log(game.rows[0].solvedValues());
// console.log(game.rows[0].missingValues());
// console.log(game.cells[11]);
// console.log(game.cells[11].row.missingValues());
// console.log(game.unsolved())
// console.log(game.cells[11].possibleValues());
// console.log(game.rows[3].emptyCells);
// game.cells.forEach(function(cell) {console.log('row: ' + cell.rowNum + '; col: ' + cell.colNum + '; block: ' + cell.blockNum);});
// game.cells[11].siblings().forEach(function(cell) { console.log('row: ' + cell.rowNum + '; col: ' + cell.colNum + '; block: ' + cell.blockNum); });
game.solve();
// game.cells.forEach(function(cell) {console.log(cell.value);});
