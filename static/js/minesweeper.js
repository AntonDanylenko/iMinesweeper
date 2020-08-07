//Anton Danylenko

var CELL_ROWS = 10;
var CELL_COLS = 10;
var CELL_TOTAL = 100;
var MINE_MAX = CELL_TOTAL/10;
var field = new Array(0);

function generateMinesweeper(){
  document.getElementById("mines_left").innerHTML = MINE_MAX;

  for (var row=0; row<CELL_ROWS; row++){
    var temp = [];
    for (var col=0; col<CELL_COLS; col++){
      temp.push(0);
    }
    field.push(temp);
  }

  var mine = 0;
  while (mine<MINE_MAX){
    var random_cell = Math.floor(Math.random() * CELL_TOTAL);
    console.log(random_cell);
    var row = Math.floor(random_cell/CELL_ROWS);
    var col = random_cell%CELL_ROWS;
    if (field[row][col] == 0){
      field[row][col] = 9;
      mine++;
    }
  }

  console.log("FIELD");
  console.log(field);



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
  console.log(field_string);
  document.getElementById("game").innerHTML = field_string;
}
