//Anton Danylenko

var CELL_ROWS = 10;
var CELL_COLS = 10;
var CELL_TOTAL = 100;
var MINE_MAX = CELL_TOTAL/10;
var field = new Array(0);

//GENERATE MINESWEEPER
function generateMinesweeper(dif){
  CELL_ROWS = 10*Math.pow(2,dif);
  CELL_COLS = CELL_ROWS;
  CELL_TOTAL = CELL_ROWS*CELL_COLS;
  MINE_MAX = CELL_TOTAL/10;
  // console.log("CELL INFO");
  // console.log(CELL_ROWS);
  // console.log(CELL_COLS);

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
    // console.log(random_cell);
    var row = Math.floor(random_cell/CELL_ROWS);
    var col = random_cell%CELL_ROWS;
    if (field[row][col] == 0){
      field[row][col] = 9;
      mine++;
    }
  }

  //PLACE NUMBERS
  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      if (field[row][col] == 0){
        field[row][col] = numBombsIn3x3Area(row, col);
      }
    }
  }

  //PRINT FIELD
  // console.log("FIELD");
  // console.log(field);



  //CONVERT FIELD ARRAY TO STRING
  var field_string = "";
  for (var row=0; row<CELL_ROWS; row++){
    var temp = "";
    for (var col=0; col<CELL_COLS; col++){
      temp+=field[row][col];
      temp+=",";
    }
    field_string+=temp.slice(0,-1);
    field_string+="/";
  }
  // console.log(field_string);
  document.getElementById("game").innerHTML = field_string;
}


//HELPER FUNCTIONS
function numBombsIn3x3Area(row, col){
  // console.log("ROW: " + row);
  // console.log("COL: " + col);
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
