//Anton Danylenko

var CELL_ROWS = 10;
var CELL_COLS = 10;
var CELL_TOTAL = 100;
var MINE_MAX = Math.floor(CELL_TOTAL/10);

//GENERATE MINESWEEPER
function generateMinesweeper(x, y, r, c){
  CELL_COLS = x;
  CELL_ROWS = y;
  CELL_TOTAL = CELL_ROWS*CELL_COLS;
  MINE_MAX = Math.floor(CELL_TOTAL/10);
  var field = new Array(0);

  document.getElementById("mines_left").innerHTML = MINE_MAX;

  //MAKE EMPTY FIELD
  field = new Array(0);
  for (var row=0; row<CELL_ROWS; row++){
    var temp = [];
    for (var col=0; col<CELL_COLS; col++){
      temp.push(0);
    }
    field.push(temp);
  }

  //PLACE MINES
  var mine = 0;
  while (mine<MINE_MAX){
    var random_cell = Math.floor(Math.random() * CELL_TOTAL);
    var row = Math.floor(random_cell/CELL_COLS);
    var col = random_cell%CELL_COLS;
    if (field[row][col] == 0 && !(row>r-2 && row<r+2 && col>c-2 && col<c+2)){
      field[row][col] = 9;
      mine++;
    }
  }

  //PLACE NUMBERS
  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      if (field[row][col] == 0){
        field[row][col] = numBombsIn3x3Area(row, col, field);
      }
    }
  }

  return field;
}


//HELPER FUNCTIONS
function numBombsIn3x3Area(row, col, field){
  var num = 0;
  if (row>0){
    if (col>0 && field[row-1][col-1] == 9){
      num++;
    }
    if (field[row-1][col] == 9){
      num++;
    }
    if (col<CELL_COLS-1 && field[row-1][col+1] == 9){
      num++;
    }
  }
  if (col>0 && field[row][col-1] == 9){
    num++;
  }
  if (col<CELL_COLS-1 && field[row][col+1] == 9){
    num++;
  }
  if (row<CELL_ROWS-1){
    if (col>0 && field[row+1][col-1] == 9){
      num++;
    }
    if (field[row+1][col] == 9){
      num++;
    }
    if (col<CELL_COLS-1 && field[row+1][col+1] == 9){
      num++;
    }
  }
  return num;
}
