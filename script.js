// selectors
const cvs = document.getElementById("mycanvas");
const ctx = cvs.getContext("2d");
let frames = 0;
const degree = Math.PI/180;

// load sprite image
const sprite = new Image();
sprite.src = "assets/img/gamesprites.png";

// load sounds
const theme = new Audio();
theme.src = "assets/audio/theme.mp3";

const scoreSound = new Audio();
scoreSound.src = "assets/audio/pointsound.wav";

const boostSound = new Audio();
boostSound.src = "assets/audio/jump noise.wav";

const hit = new Audio();
hit.src = "assets/audio/crash sound.wav";

const die = new Audio();
die.src = "assets/audio/die.wav"

// game state
const state = {
  current : 0,
  getReady : 0,
  game : 1,
  over : 2
}


// start button coord
const startBtn = {
  x : 150,
  y : 263,
  w : 83,
  h : 29
}

// control the character
cvs.addEventListener("touchstart", function(evt){
  switch(state.current) {
    case state.getReady:
      state.current = state.game;
      theme.play();
      pipes.reset();
      ironman.speedReset();
      score.reset();
      break;
    case state.game:
      ironman.boost();
      break;
    case state.over:
      pipes.reset();
      let rect = cvs.getBoundingClientRect();
      let clickX = evt.clientX - rect.left;
      let clickY = evt.clientY - rect.top;

      // check if we click on the start button
      if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
        pipes.reset();
        ironman.speedReset();
        score.reset();
        state.current = state.getReady;
      }
      state.current = state.getReady;
      break;
  }
});

// background
const bg = {
  sX: 35,
  sY: 710,
  w: 700,
  h: 755,
  x: 0,
  y: 70,

  draw : function() {
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
  }

}

// foreground
const fg = {
  sX: 902,
  sY: 962,
  w: 700,
  h: 200,
  x: 0,
  y: 560,

  dx : 2,

  draw : function() {

    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
  },

  update: function() {
    if (state.current == state.game) {
      this.x = (this.x - this.dx)%(this.w/2);
    }
  }
  
}

// iron man
const ironman = {
  animation : [
    {sX: 1233, sY: 137}, 
    {sX: 1233, sY: 178},
    {sX: 1233, sY: 215},
    {sX: 1233, sY: 178}
  ],
  x : 50, 
  y : 150,
  w : 65,
  h : 37,

  radius : 1,

  frame : 0,

  gravity : 0.25,
  jump : 4.6,
  speed : 0,
  rotation : 0,

  draw : function() {
    let ironman = this.animation[this.frame]; 

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, ironman.sX, ironman.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);

    ctx.restore();
  },
  boost : function() {
    this.speed = - this.jump;
  },
  update : function() {
    //if game state is ready, iron man animates slower
    this.period = state.current == state.getReady ? 10 : 5;
    //incremement frame by 1 each period
    this.frame += frames%this.period == 0 ? 1 : 0;
    //frame goes from 0 to 4, then again to 0
    this.frame = this.frame%this.animation.length;

    if (state.current == state.getReady) {
      this.y = 150; //reset position after game over
      this.rotation = 0 * degree;
    } else {
      this.speed += this.gravity;
      this.y += this.speed;

      if (this.y + this.h/2 >= cvs.height) {
        this.y = cvs.height - this.h/2;
        if (state.current == state.game) {
          state.current = state.over;
          die.play();
        }
      }
      // if speed is greater than jump than character is falling
      if (this.speed >= this.jump) {
        this.rotation = 15 * degree;
        this.frame = 1;
      } else {
        this.rotation = -5 * degree;
      }
    }
  },
  speedReset : function() {
    this.speed = 0;
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
    if (state.current == state.getReady) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
    
  }
}

// game over message 
const gameOver = {
  sX : 1501,
  sY : 75,
  w : 225,
  h : 275,
  x : cvs.width/2 - 120,
  y : 100,

  draw : function() {
    if (state.current == state.over) {
      ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
    
  }
}

// pipes (lokis sceptor)
const pipes = {
  position : [],

  top : {
    sX : 1511,
    sY : 551,
  },
  bottom : {
    sX : 1608,
    sY : 545,
  },

  w : 80,
  h : 400,
  gap : 85,
  maxYPos : -150,
  dx : 2, 

  draw : function() {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];

      let topYPos = p.y;
      let bottomYPos = p.y + this.h + this.gap;

      // top pipe
      ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

      // bottom pipe
      ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
    }
  },

  update : function() {
    if (state.current !== state.game) return;

    if (frames%100 == 0) {
      this.position.push({
        x : cvs.width,
        y : this.maxYPos * ( Math.random() + 1)
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];


      let bottomPipeYPos = p.y + this.h + this.gap;

      // Collision detection
      //top pipe
      if (ironman.x + ironman.radius > p.x && ironman.x - ironman.radius < p.x + this.w && ironman.y + ironman.radius > p.y && ironman.y - ironman.radius < p.y + this.h) {
        state.current = state.over;
        hit.play();
      }
      //bottom pipe
      if (ironman.x + ironman.radius > p.x && ironman.x - ironman.radius < p.x + this.w && ironman.y + ironman.radius > bottomPipeYPos && ironman.y - ironman.radius < bottomPipeYPos + this.h) {
        state.current = state.over;
        hit.play();
      }

      p.x -= this.dx;

      // if the pipes go beyond canvas, we delete them from the array
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value += 1;
        boostSound.play();

        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
      }
    }
  },
  reset : function() {
    this.position = [];
  }
}

// score 
const score = {
  best: parseInt(localStorage.getItem("best")) || 0,
  value : 0,

  draw : function() {
    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";

    if (state.current == state.game) {
      ctx.lineWidth = 2;
      ctx.font = "35px Teko";
      ctx.fillText(this.value, cvs.width/2, 50);
      ctx.strokeText(this.value, cvs.width/2, 50);


    } else if (state.current == state.over) {
      // score value
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 250, 260);
      ctx.strokeText(this.value, 250, 260);
      // best score 
      ctx.fillText(this.best, 250, 302);
      ctx.strokeText(this.best, 250, 302);
    }
  },
  reset : function() {
    this.value = 0;
  }
}


// draws elements and character
function draw() {
  ctx.fillStyle = "#acadc2"; //clears canvas by filling 
  ctx.fillRect(0, 0, cvs.width, cvs.height); //sets the fill to start in top left corner and match the width and height of canvas

  // draw background
  bg.draw();
  // draw pipes after background and before foreground so the bottom is covered
  pipes.draw();
  //draw foreground
  fg.draw();
  // draw ironman
  ironman.draw();
  // draws get ready icon
  getReady.draw();
  // draw game over icon
  gameOver.draw();
  // draw score
  score.draw();
  

}

// update
function update() {
  ironman.update();
  pipes.update();
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
  