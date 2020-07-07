function heuristic(a,b){
  var d = dist(a.i, a.j, b.i , b.j);
  // var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

// How many columns and rows?
var cols = 50;
var rows = 50;
var w, h;
var grid = new Array(rows);
//
var openSet =  [];
var noSolution;
var closeSet = [];
var start;
var end;
var path = [];

var X = [1,-1,0,0 ,-1,1,-1,1];
var Y = [0,0,-1,1,-1,-1,1,1];

function check(i,j){
  if(i<0 || j<0 || i>=cols || j>=rows){
    return false;
  }
  return true;
}
function Spot(i,j){
  this.i=i;
  this.j=j;
  // f,g,h values for A*
  this.f = 0;
  this.h = 0;
  this.g = 0;
  this.neighbors = [];
  this.parent = undefined;
  this.addNeighbors = function(grid){

    for(var k = 0; k < 8; k++){
      if(check(i+X[k],j+Y[k])){
        this.neighbors.push(grid[i + X[k]][j + Y[k]]);
      }
    }
  }
  // this.previous = undefined;

  this.wall = false;
  if(random(1) < 0.4){
    this.wall = true;
  }

  this.show = function(col){
    fill(col);
    if(this.wall){
      fill(0);
    }
    noStroke();
    rect(this.i * w, this.j * h, w, h);
  }

}
function setup(){
  createCanvas(500, 500); // p5.library

  console.log('lauda ka sarkar hai');
  //grid size
  w = width/cols;
  h = height/rows;

  // making a Arra
  for(var i = 0; i< rows; i++){
    grid[i] = new Array(cols);
  }

  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      grid[i][j] = new Spot(i,j);
    }
  }
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[0][0];
  end   = grid[rows-1][cols-1];
  start.wall = false;
  end.wall   = false;

  openSet.push(start);
  console.log(grid);
}

function draw(){

  if(openSet.length > 0){
    var winner = 0;
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }
  current = openSet[winner];

  if(current === end){


    noLoop();
    console.log("Finish");
  }

  openSet.splice(winner,1);
  closeSet.push(current);

  var neighbors = current.neighbors;
  for(var i = 0; i <neighbors.length; i++){
    var nei = neighbors[i];
    if(!closeSet.includes(nei) && !nei.wall){
       var tempF = current.g + 1 + heuristic(nei,end) ;
       var bestF = false;
       if(openSet.includes(nei)){
         if(tempF < nei.f){
           bestF = true;
         }
       }
       else{
         openSet.push(nei);
         bestF = true;
       }
       if(bestF){
         nei.g = current.g + 1;
         nei.h = heuristic(nei,end);
         nei.f = nei.g + nei.h;
         nei.parent = current;
       }

    }
  }
  }else{
    // cannot move
    console.log("No Path Possible");
    noLoop();
    return;
  }

  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      grid[i][j].show(color(255));
    }
  }


  for(var i = 0; i < openSet.length ; i++){
    openSet[i].show(color(0,255,0));
  }

  for(var i = 0; i < closeSet.length ; i++){
    closeSet[i].show(color( 255,0,0));
  }
  path = [];
  var temp =  current;
  path.push(temp);
  while(temp.parent){
    path.push(temp.parent);
    temp = temp.parent;
  }

  for(var i = 0; i < path.length ; i++){
    path[i].show(color(0, 0, 255));
  }



//  noFill();
  // stroke(255,0,200);
  // strokeWeight(w/2);
  // beginShape();
  // for(var k = 0; k < path.length ; k++){
  //   vertex(path[i].i, path[i].j);
  // }
  // endShape();

}
