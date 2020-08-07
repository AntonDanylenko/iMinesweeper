// Anton Danylenko

//CANVAS
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

//SIZE AND SPACING
var CELL_ROWS = 10;
var CELL_COLS = 10;
var CELL_TOTAL = 100;
var CELL_SIZE = context.canvas.width/CELL_COLS;
// console.log(CELL_SIZE);
// canvas.width = CELL_SIZE * CELL_COLS;
// console.log(context.canvas.width);

//TILE ICON
var tile_path = 'static/img/tile.png';
var tile = new Image();
tile.src = tile_path;

//MINE ICON
var mine_path = 'static/img/mine.png';
var mine = new Image();
mine.src = mine_path;

//NUMBER COLORS ARRAY
var num_colors = ["#0000FF", "#008000", "#FF0000", "#00008B", "#800020", "#008080", "#000000", "#808080"];

//PLACE FIELD
function placeField(){
  init_board_temp = document.getElementById("game").innerHTML.split("/");
  init_board = new Array(0);
  for (var row=0; row<CELL_ROWS; row++){
    init_board.push(init_board_temp[row].split(","));
  }
  // console.log("init_board");
  // console.log(init_board);

  //Draw the covered field.
  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      context.drawImage(tile, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  //Draw the mines and numbers.
  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      if (init_board[row][col]=="9"){
        context.drawImage(mine, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (init_board[row][col]!="0"){
        context.font = Math.floor(CELL_SIZE*.66) + "px Arial";
        context.fillStyle = num_colors[parseInt(init_board[row][col],10)-1];
        context.fillText(init_board[row][col], (col+.3)*CELL_SIZE, (row+.75)*CELL_SIZE);
      }
    }
  }
}


//CHANGE DIFFICULTY
function difficulty(dif){
  var difs = ["10x10", "20x20", "40x40"];
  for (var x=0; x<3; x++){
    document.getElementById(difs[x]).className = "";
  }
  document.getElementById(difs[dif]).className = "active";

  CELL_ROWS = 10*Math.pow(2,dif);
  CELL_COLS = CELL_ROWS;
  CELL_TOTAL = CELL_ROWS*CELL_COLS;
  CELL_SIZE = context.canvas.width/CELL_COLS;
  // console.log("CELL INFO");
  // console.log(CELL_ROWS);
  // console.log(CELL_SIZE);
  placeField();
}
