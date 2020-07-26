// selectors
const cvs = document.getElementById("mycanvas");
const ctx = cvs.getContext("2d");

let frames = 0;

// load sprite image
const sprite = new Image();
sprite.src = "assets/img/gamesprites.png";

// background

const bg = {
  sX: 35,
  sY: 710,
  w: 600,
  h: 490,
  x: 0,
  y: 0,

  draw : function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
  }

}

const fg = {
  sX: 243,
  sY: 1147,
  w: 400,
  h: 100,
  x: 0,
  y: 450,

  draw : function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
  }
  
}

// iron man
const ironman = {
  animation : [
    {sX: 1236, sY: 136}, 
    {sX: 1236, sY: 179},
    {sX: 1236, sY: 224},
    {sX: 1236, sY: 179}
  ],
  x : 50, 
  y : 150,
  w : 60,
  h : 35,

  frame : 0,

  draw : function() {
    let ironman = this.animation[this.frame];
    ctx.drawImage(sprite, ironman.sX, ironman.sY, this.w, this.h, this.x - this.w/2, this.y - this.h/2, this.w, this.h);
  }
}

// get ready message
const getReady = {
  sX : 1260,
  sY : 433,
  w : 205,
  h : 146,
  x : cvs.width/2 - 205/2,
  y :160,

  draw : function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
  }
}

// game over message 
const gameOver = {
  sX : 1478,
  sY : 215,
  w : 265,
  h : 185,
  x : cvs.width/2 - 265/2,
  y :170,

  draw : function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
  }
}






// draws elements and character
function draw() {
  ctx.fillStyle = "#8eb4ff"; //clears canvas by filling 
  ctx.fillRect(0, 0, cvs.width, cvs.height); //sets the fill to start in top left corner and match the width and height of canvas

  // draw background
  bg.draw();
  //draw foreground
  fg.draw();
  // draw ironman
  ironman.draw();
  // draws get ready icon
  getReady.draw();
  // draw game over icon
  gameOver.draw();
  

}

function update() {

}

// updates game every second
function loop(){
  //update function changes position of elements
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}
loop();
  