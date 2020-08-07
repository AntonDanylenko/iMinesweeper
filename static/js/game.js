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
var tilePath = 'static/img/tile.png';
var tile = new Image();
tile.src = tilePath;

//MINE ICON
var minePath = 'static/img/mine.png';
var mine = new Image();
mine.src = minePath;

function placeField(){
  init_board_temp = document.getElementById("game").innerHTML.split("/");
  init_board = new Array(0);
  for (var row=0; row<CELL_ROWS; row++){
    init_board.push(init_board_temp[row].split(","));
  }
  console.log("init_board");
  console.log(init_board);

  //Draw the covered field.
  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      context.drawImage(tile, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  //Draw the mines.
  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      if (init_board[row][col]=="9"){
        context.drawImage(mine, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}
