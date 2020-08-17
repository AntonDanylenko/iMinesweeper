// Anton Danylenko

//CANVAS
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

//SIZE AND SPACING
var CELL_ROWS = 10;
var CELL_COLS = 10;
var CELL_TOTAL = 100;
var CELL_SIZE = 600/CELL_COLS;

//BOARD
var board;
var working_board;

//UNLOCKED
var unlocked = true;
var game_over = false;
var win = false;
var first_click = true;

//SHIFT AND LONG CLICK
var shift_down = false;
var click_t;
var click_time = -1;

//TIMER
var timer;
var t;
var timer_active = false;
var boardRef = document.querySelector(".board");
var pauseRef = document.querySelector(".pauseMenu");

//UTENSIL
var utensil = 1;

//MINES COUNT
var num_mines = Math.floor(CELL_TOTAL/10);

//TILE ICON
var tile_path = 'static/img/tile.png';
var tile = new Image();
tile.src = tile_path;

//OPEN TILE ICON
var open_tile_path = 'static/img/open_tile.png';
var open_tile = new Image();
open_tile.src = open_tile_path;

//RED TILE ICON
var red_tile_path = 'static/img/red_tile.png';
var red_tile = new Image();
red_tile.src = red_tile_path;

//MINE ICON
var mine_path = 'static/img/mine.png';
var mine = new Image();
mine.src = mine_path;

//FLAG ICON
var flag_path = 'static/img/flag.png';
var flag = new Image();
flag.src = flag_path;

//NUMBER COLORS ARRAY
var num_colors = ["#0000FF", "#008000", "#FF0000", "#00008B", "#800020", "#008080", "#000000", "#808080"];

//GENERATE GAME
function generateGame(row, col){
  for (var r=0; r<CELL_ROWS; r++){
    for (var c=0; c<CELL_COLS; c++){
      if (working_board[r][c]=='F'){
        removeFlag(r,c);
      }
    }
  }
  board = generateMinesweeper(CELL_COLS, CELL_ROWS, row, col);
}


//PLACE FIELD
function placeField(){
  CELL_TOTAL = CELL_ROWS*CELL_COLS;
  var threshold = 600;
  if (window.innerWidth>1200 && window.innerHeight>1400){
    threshold = window.innerWidth/2;
    if (window.innerWidth>window.innerHeight-200){
      threshold = window.innerHeight/2;
    }
  }
  if (window.innerWidth>threshold && window.innerHeight>800){
    if (CELL_COLS>CELL_ROWS){
      CELL_SIZE = Math.floor(threshold/CELL_COLS);
    }
    else {
      CELL_SIZE = Math.floor(threshold/CELL_ROWS);
    }
  }
  else {
    if (window.innerWidth<window.innerHeight-200){
      CELL_SIZE = Math.floor(window.innerWidth/CELL_COLS);
    }
    else {
      CELL_SIZE = Math.floor((window.innerHeight-200)/CELL_ROWS);
    }
  }
  canvas.width = CELL_COLS*CELL_SIZE;
  canvas.height = CELL_ROWS*CELL_SIZE;
  document.getElementById("board").style.width = CELL_COLS*CELL_SIZE + 'px';
  document.getElementById("board").style.height = CELL_ROWS*CELL_SIZE + 'px';
  num_mines = Math.floor(CELL_TOTAL/10);
  document.getElementById("mines_left").innerHTML = num_mines;

  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      context.drawImage(tile, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  timer = 0;
  clearTimeout(t);
  timer_active = true;
  startTimer();
  closeModal();
  unlocked = true;
  game_over = false;
  boardRef.style.display = "block";
  document.querySelector(".pauseMenu").style.display = "none";

  working_board = new Array(0);
  for (var row=0; row<CELL_ROWS; row++){
    var temp = [];
    for (var col=0; col<CELL_COLS; col++){
      temp.push('X');
    }
    working_board.push(temp);
  }
}


//CHANGE DIFFICULTY
function difficulty(x, y){
  CELL_COLS = Math.floor(x);
  CELL_ROWS = Math.floor(y);
  var difs = ["ten", "twenty", "custom"];
  for (var i=0; i<3; i++){
    document.getElementById(difs[i]).className = "";
  }
  if (x<10 || y<10 || x>50 || y>50){
    alert("Board sizes should be between 10 and 50");
    document.getElementById("ten").className = "active";
    CELL_COLS = 10;
    CELL_ROWS = 10;
  }
  else if (x==10 && y==10){
    document.getElementById("ten").className = "active";
  }
  else if (x==20 && y==20){
    document.getElementById("twenty").className = "active";
  }
  else {
    document.getElementById("custom").className = "active";
  }

  placeField();
  first_click = true;
}


//KEY PRESS EVENT LISTENER
document.addEventListener('keydown', function(event) {
  key = event.keyCode;
  if (key==32){
    switchUtensil(!utensil);
  }
  else if (key==27){
    checkPause();
  }
  else if (key==16){
    shift_down = true;
  }
}, false);

//SHIFT LIFTED LISTENER
document.addEventListener('keyup', function(event) {
  key = event.keyCode;
  if (key==16){
    shift_down = false;
  }
}, false);

//MOUSE UP EVENT LISTENER
document.addEventListener('mouseup', function(event) {
  /* Determines what to do when user clicks inside the board */
  clearTimeout(click_t);
  var rect = canvas.getBoundingClientRect(canvas, event);
  var mousePos = [event.clientX - rect.left, event.clientY - rect.top];
  if (mousePos[0]>=0 && mousePos[1]>=0 &&
      mousePos[0]<=canvas.width && mousePos[1]<=canvas.height &&
      unlocked && !game_over){
    var sectorX = findSectorX(mousePos[0], canvas.width);
    var sectorY = findSectorY(mousePos[1], canvas.height);
    var col = Math.floor(sectorX/CELL_SIZE);
    var row = Math.floor(sectorY/CELL_SIZE);
    if ((shift_down || click_time) && working_board[row][col] == '_' && board[row][col]!="0"){
      openNumbers(row, col);
    }
    else {
      if (utensil){
        if (first_click){
          generateGame(row, col);
          first_click = false;
        }
        if (working_board[row][col] == 'X'){
          if (board[row][col] != "9"){
            openArea(row, col);
          }
          else {
            openMines(row, col);
          }
        }
      }
      else {
        if (working_board[row][col] == 'X'){
          placeFlag(row, col);
        }
        else if (working_board[row][col] == 'F'){
          removeFlag(row, col);
        }
      }
    }
  }
  click_time = -1;
}, false);

//START CLICK TIMER
document.addEventListener('mousedown', function(event) {
  changeClickTimer();
}, false);


//OPEN AREA OF BOARD
function openArea(row, col){
  if (working_board[row][col] == '_'){
    return;
  }
  working_board[row][col] = '_';
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

//OPEN AREA FOR KNOWN NUMBER
function openNumbers(row, col){
  if (board[row][col] == numFlaggedBombsIn3x3Area(row, col)){
    if (row>0){
      if (col>0 && board[row-1][col-1]!="9"){
        openArea(row-1, col-1);
      }
      if (board[row-1][col]!="9"){
        openArea(row-1, col);
      }
      if (col<CELL_COLS-1 && board[row-1][col+1]!="9"){
        openArea(row-1, col+1);
      }
    }
    if (col>0 && board[row][col-1]!="9"){
      openArea(row, col-1);
    }
    if (col<CELL_COLS-1 && board[row][col+1]!="9"){
      openArea(row, col+1);
    }
    if (row<CELL_ROWS-1){
      if (col>0 && board[row+1][col-1]!="9"){
        openArea(row+1, col-1);
      }
      if (board[row+1][col]!="9"){
        openArea(row+1, col);
      }
      if (col<CELL_COLS-1 && board[row+1][col+1]!="9"){
        openArea(row+1, col+1);
      }
    }
  }
}


//OPEN ALL MINES, GAME OVER
function openMines(r, c){
  for (var row=0; row<CELL_ROWS; row++){
    for (var col=0; col<CELL_COLS; col++){
      if (board[row][col] == "9"){
        context.drawImage(open_tile, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        if (row == r && col == c){
          context.drawImage(red_tile, c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        context.drawImage(mine, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
  win = false;
  gameOver();
}


//PLACE FLAG
function placeFlag(r, c){
  working_board[r][c] = 'F';
  context.drawImage(flag, c*CELL_SIZE, r*CELL_SIZE, CELL_SIZE, CELL_SIZE);
  num_mines--;
  document.getElementById("mines_left").innerHTML = num_mines;

  if (num_mines == 0){
    win = true;
    for (var row=0; row<CELL_ROWS; row++){
      for (var col=0; col<CELL_COLS; col++){
        if (board[row][col] == "9" && working_board[row][col] != 'F'){
          win = false;
        }
      }
    }
    if (win){
      gameOver();
    }
  }
}

//REMOVE FLAG
function removeFlag(row, col){
  working_board[row][col] = 'X';
  context.drawImage(tile, col*CELL_SIZE, row*CELL_SIZE, CELL_SIZE, CELL_SIZE);
  num_mines++;
  document.getElementById("mines_left").innerHTML = num_mines;
}


//FIND SECTOR
function findSectorX(coord, total) {
  /* Determines which square the coordinate belongs too */
  return Math.floor(coord*CELL_COLS/total)*(total/CELL_COLS);
}
function findSectorY(coord, total) {
  /* Determines which square the coordinate belongs too */
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


//GAME OVER
function gameOver(){
  unlocked = false;
  game_over = true;
  pauseTimer();
  openModal();
}


//INCREMENT CLICK TIME
function changeClickTimer(){
  click_t = setTimeout(function(){ changeClickTimer() }, 300);
  click_time = click_time + 1;
}

//INCREMENT TIME
function changeTimer(){
  document.getElementById("time").innerHTML = displayTime(timer);
  t = setTimeout(function(){ changeTimer() }, 1000);
  timer = timer + 1;
}

//DISPLAY TIME
function displayTime(calcTime){
  var hours = Math.floor(calcTime / 3600);
  calcTime = calcTime % 3600;
  var minutes = Math.floor(calcTime / 60);
  calcTime = calcTime % 60;
  var seconds = Math.floor(calcTime);

  if(seconds < 10){
    seconds = "0" + seconds;
  }
  if(minutes < 10){
    minutes = "0" + minutes;
  }

  return `${hours}:${minutes}:${seconds}`
}

//START TIMER
function startTimer(){
  timer_active = true;
  changeTimer();
}

//PAUSE TIMER
function pauseTimer(){
  clearTimeout(t);
  timer_active = false;
}

//OPEN PAUSE MENU
function checkPause(){
  if (!game_over){
    if(timer_active){
      unlocked = false;
      pauseTimer();
      boardRef.style.display = "none";
      document.querySelector(".pauseMenu").style.display = "block";
    }
    else {
      unlocked = true;
      startTimer();
      boardRef.style.display = "block";
      document.querySelector(".pauseMenu").style.display = "none";
    }
  }
  else {
    if (document.getElementById("winAlert").style.display == "block"){
      closeModal();
    }
    else {
      openModal();
    }
  }
}


//OPEN MODAL
function openModal(){
  // console.log("OPEN MODAL");
  // console.log(unlocked);
  document.getElementById("winAlert").style.display = "block";
  if (!win){
    document.getElementById("heading").innerHTML = "Better luck next time!";
  }
  else {
    document.getElementById("heading").innerHTML = "YOU WON!!!";
  }
  document.getElementById("finalTime").innerHTML = "Time: " + displayTime(timer-1);
  document.getElementById("finalDifficulty").innerHTML = "Difficulty: " + CELL_COLS + "x" + CELL_ROWS;
}

//CLOSE MODAL
function closeModal(){
  // console.log("CLOSE MODAL");
  document.getElementById("winAlert").style.display = "none";
}


//NEW GAME
function newGame(){
  // console.log("NEW GAME");
  // console.log(unlocked);
  difficulty(CELL_COLS, CELL_ROWS);
  switchUtensil(1);
  checkPause();
}


//HOW TO PLAY BUTTON
function toggle_how_to(){
  var how = document.getElementById("how_to");
  if (how.style.display == "none") {
    how.style.display = "block";
  } else {
    how.style.display = "none";
  }
}


//COUNT NUMBER OF FLAGGED BOMBS
function numFlaggedBombsIn3x3Area(row, col){
  // console.log("ROW: " + row);
  // console.log("COL: " + col);
  var num = 0;
  if (row>0){
    if (col>0 && board[row-1][col-1] == "9" && working_board[row-1][col-1] == 'F'){
      num++;
    }
    if (board[row-1][col] == "9" && working_board[row-1][col] == 'F'){
      num++;
    }
    if (col<CELL_COLS-1 && board[row-1][col+1] == "9" && working_board[row-1][col+1] == 'F'){
      num++;
    }
  }
  if (col>0 && board[row][col-1] == "9" && working_board[row][col-1] == 'F'){
    num++;
  }
  if (col<CELL_COLS-1 && board[row][col+1] == "9" && working_board[row][col+1] == 'F'){
    num++;
  }
  if (row<CELL_ROWS-1){
    if (col>0 && board[row+1][col-1] == "9" && working_board[row+1][col-1] == 'F'){
      num++;
    }
    if (board[row+1][col] == "9" && working_board[row+1][col] == 'F'){
      num++;
    }
    if (col<CELL_COLS-1 && board[row+1][col+1] == "9" && working_board[row+1][col+1] == 'F'){
      num++;
    }
  }
  return num;
}
