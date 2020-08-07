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

//BOARD
var board;
var working_board;

//UTENSIL
var utensil = 0;

//TILE ICON
var tile_path = 'static/img/tile.png';
var tile = new Image();
tile.src = tile_path;

//OPEN TILE ICON
var open_tile_path = 'static/img/open_tile.png';
var open_tile = new Image();
open_tile.src = open_tile_path;

//MINE ICON
var mine_path = 'static/img/mine.png';
var mine = new Image();
mine.src = mine_path;

//NUMBER COLORS ARRAY
var num_colors = ["#0000FF", "#008000", "#FF0000", "#00008B", "#800020", "#008080", "#000000", "#808080"];


//PLACE FIELD
function placeField(){
  var board_temp = document.getElementById("game").innerHTML.split("/");
  board = new Array(0);
  working_board = new Array(0);
  for (var row=0; row<CELL_ROWS; row++){
    board.push(board_temp[row].split(","));
    var temp = [];
    for (var col=0; col<CELL_COLS; col++){
      temp.push('X');
    }
    working_board.push(temp);
  }
  // console.log("board");
  // console.log(board);
  // console.log(working_board);

  //Draw the covered field.
  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      context.drawImage(tile, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  //Draw the mines and numbers.
  // for (var row=0; row<CELL_ROWS; row++){
  //   for (var col=0; col<CELL_COLS; col++){
  //     if (board[row][col]=="9"){
  //       context.drawImage(mine, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
  //     }
  //     else if (board[row][col]!="0"){
  //       context.font = Math.floor(CELL_SIZE*.66) + "px Arial";
  //       context.fillStyle = num_colors[parseInt(board[row][col],10)-1];
  //       context.fillText(board[row][col], (col+.3)*CELL_SIZE, (row+.75)*CELL_SIZE);
  //     }
  //   }
  // }
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


//CLICK EVENT LISTENER
document.addEventListener('click', function(event) {
  /* Determines what to do when user clicks inside the board */
  // console.log("CLICK EVENT");
  var rect = canvas.getBoundingClientRect(canvas, event);
  var mousePos = [event.clientX - rect.left, event.clientY - rect.top];
  // console.log(mousePos);
  if (mousePos[0]>=0 && mousePos[1]>=0 &&
      mousePos[0]<=canvas.width && mousePos[1]<=canvas.height){
    var sectorX = findSectorX(mousePos[0], canvas.width);
    var sectorY = findSectorY(mousePos[1], canvas.height);
    // console.log("selected: "+selected)
    // console.log("sectorX: " + sectorX + ", sectorY: " + sectorY);
    var col = Math.floor(sectorX/CELL_SIZE);
    var row = Math.floor(sectorY/CELL_SIZE);
    // console.log("col: " + col + ", row: " + row);
    if (utensil){
      if (working_board[row][col] == 'X'){
        if (board[row][col] != "9"){
          console.log("OPEN AREA");
          openArea(row, col);
        }
        else {
          console.log("OPEN MINES");
          // openMines(row, col);
        }
      }
    }
    else {
      if (working_board[row][col] == 'X'){
        console.log("PLACE FLAG");
        // placeFlag(row, col);
      }
      else if (working_board[row][col] == 'F'){
        console.log("REMOVE FLAG");
        // removeFlag(row, col);
      }
    }
  }
}, false);


//OPEN AREA OF BOARD
function openArea(row, col){
  if (working_board[row][col] == '_'){
    return;
  }
  working_board[row][col] = '_';
  // console.log("col: " + col + ", row: " + row);
  context.drawImage(open_tile, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
  if (board[row][col]!="0"){
    context.font = Math.floor(CELL_SIZE*.66) + "px Arial";
    context.fillStyle = num_colors[parseInt(board[row][col],10)-1];
    context.fillText(board[row][col], (col+.3)*CELL_SIZE, (row+.75)*CELL_SIZE);
  }
  else {
    if (row>0){
      if (col>0){
        openArea(row-1, col-1);
      }
      openArea(row-1, col);
      if (col<CELL_COLS-1){
        openArea(row-1, col+1);
      }
    }
    if (col>0){
      openArea(row, col-1);
    }
    if (col<CELL_COLS-1){
      openArea(row, col+1);
    }
    if (row<CELL_ROWS-1){
      if (col>0){
        openArea(row+1, col-1);
      }
      openArea(row+1, col);
      if (col<CELL_COLS-1){
        openArea(row+1, col+1);
      }
    }
  }
}


//FIND SECTOR
function findSectorX(coord, total) {
  /* Determines which square the coordinate belongs too */
  // console.log("FIND SECTOR");
  return Math.floor(coord*CELL_COLS/total)*(total/CELL_COLS);
}
function findSectorY(coord, total) {
  /* Determines which square the coordinate belongs too */
  // console.log("FIND SECTOR");
  return Math.floor(coord*CELL_ROWS/total)*(total/CELL_ROWS);
}


//SWITCH UTENSIL
function switchUtensil(button) {
  /* Swith utensil depending on what button user clicks */
  if (button==1) {
    utensil=1; // sweep
    document.getElementById("flag").className = "";
    document.getElementById("sweep").className = "active";
  }
  else {
    utensil=0; // flag
    document.getElementById("sweep").className = "";
    document.getElementById("flag").className = "active";
  }
}
