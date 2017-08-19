var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
// context.shadowBlur=100;
// context.shadowColor="black";
var enemy = new Enemy();
var game = new Game();
var firedMissile;
var reloadingMissile;
var timeOutSpeed = 6600;


// Game Constructor////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Game(){

this.width = canvas.width;
this.height = canvas.height;
this.keys = new KeyListener();
this.playerShip = new Ship(this.width /2 -79 ,690);
this.enemy = new Enemy();
this.stockedEnemies = [];
for(var m = 0;m < 30; m++){
  this.stockedEnemies[m] = new Enemy();
}
this.spawnedEnemies = [];
}

Game.prototype.draw = function()
{
    context.clearRect(0, 0, this.width, this.height);
    this.playerShip.draw(context);
    // this.enemy.draw(context);
};


Game.prototype.updateMovement = function(){

    if (this.keys.isPressed(37)) { // Left
         this.playerShip.updateLeft();
     } else if (this.keys.isPressed(39)) { // Right
         this.playerShip.updateRight();
     }
};
this.spaceIsPressed = true;

Game.prototype.updateShooting = function(){

    if (this.keys.isPressed(32)){
        if(spaceIsPressed === true){
          this.playerShip.stockedMissiles[0].update();
          spaceIsPressed = false;
        }
    }
    if (!this.keys.isPressed(32)) {
      spaceIsPressed = true;
    }
};

Game.prototype.detectCollision = function(){
  if (game.playerShip.firedMissiles[0].x < this.enemy.x + this.enemy.width &&
     game.playerShip.firedMissiles[0].x + game.playerShip.firedMissiles[0].width > this.enemy.x &&
     game.playerShip.firedMissiles[0].y < this.enemy.y + this.enemy.height &&
     game.playerShip.firedMissiles[0].height + game.playerShip.firedMissiles[0].y > this.enemy.y) {

     console.log("collision detected!");
     this.enemy.image.src = 'img/explosion.png';
  }
};

Game.prototype.spawner =function(){
  if(game.spawnedEnemies.length < 30){
    // setTimeout(function(){
      game.stockedEnemies[0].spawn();
    // }, 1000);
  }
};


// Ship Constructor//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Ship(x,y){
  this.image = new Image();
  this.image.src = 'img/ship.png';
  this.x = x;
  this.y = y;
  this.height = 130;
  this.width = 130;
  this.speed = 17;
  this.stockedMissiles = [];
  for(var m = 0;m < 30; m++){
    this.stockedMissiles[m] = new Missile();
  }
    this.firedMissiles = [];
  }

  Ship.prototype.draw = function(){
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
  };

  Ship.prototype.updateRight = function(){
    game.playerShip.x = Math.min(game.width - game.playerShip.width - 55, game.playerShip.x + game.playerShip.speed);
  };

  Ship.prototype.updateLeft = function(){
    game.playerShip.x = Math.max(0, game.playerShip.x - game.playerShip.speed);
  };


// Missile Constructor//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Missile(x,y){
  this.alive = false;
  this.image = new Image();
  this.image.src = 'img/missile.png';
  this.x = x;
  this.y = y;
  this.yv = 4;
  this.height = 100;
  this.width = 80;
}

Missile.prototype.draw = function(){
  if(this.alive === true){
    console.log("this.alive is true");
    context.drawImage(this.image,this.x, this.y, this.width, this.height);
  }

};

Missile.prototype.update = function(){
  this.alive =true;
  if(this.alive === true){
    firedMissile = game.playerShip.stockedMissiles.splice(0,1)[0];
    game.playerShip.firedMissiles.push(firedMissile);
    console.log(game.playerShip.stockedMissiles);
    this.x = game.playerShip.x + 25;
    this.y = game.playerShip.y - 55;
    var self = this;
    var x =  setInterval(function(){
      self.draw();
      game.detectCollision();
      self.y -= self.yv;
        if(self.y < -100){
          clearInterval(x);
          reloadingMissile = game.playerShip.firedMissiles.splice(0,1)[0];
          game.playerShip.stockedMissiles.push(reloadingMissile);
          self.alive = false;
        }
      },5);
    }
};

// Collision Detector////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Sprite(){
    this.x = 200;
    this.y = 200;
    this.rendersize = {width: 1152, height: 96};  //Array like { width : 50, height : 80 }
    this.framesize = {width: 96, height: 96};    //Array like { width : 50, height : 80 }
    this.image = new Image();
    this.image.src = 'img/explosion.png';
    this.chrono = new Chrono(); //Explanation below
}

function Chrono(){
    this.currentTime = 10;
    this.lastTime = 10;
    this.timeElapse = 10;
    this.duration = 1000;
}

Chrono.prototype.countTime = function(){
    this.currentTime = Date.now();

    if(this.lastTime != 0)
        this.timeElapse += this.currentTime - this.lastTime;

        this.lastTime = Date.now();

    if(this.timeElpase >= this.duration && this.lastTime != 0){
        this.timeElapse = 0;
        return TRUE;
    } else {
        return FALSE;
    }
};

Sprite.prototype.render = function(){
    if(this.x <= this.image.width && this.chrono.countTime()){
        this.x += this.framesize.x;
    } else {
        this.x = 0;
    }
    context.drawImage(this.image,
                  this.x, this.y,
                  this.framesize.width, this.framesize.height

                 );
};

var explosion = new Sprite();
explosion.render();


// Enemy Constructor//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Enemy(){
  this.image = new Image();
  this.image.src = 'img/orangeEnemyShip.png';
  this.health = 1;
  this.x = 100;
  this.y = 100;
  this.height = 110;
  this.width = 120;
  this.speed = 2;

  Enemy.prototype.draw = function(){
    context.drawImage(this.image,this.x, this.y, this.width, this.height);
  };
}


Enemy.prototype.rightDown = function(){
  self = this;
  that = this;
  var x =  setInterval(function(){
    self.draw();
    self.x += self.speed;
      if(self.x > 1300){
        currentP = self.y;
        var y =  setInterval(function(){
        that.draw();
        newP = currentP + 100;
        that.y += that.speed;
          if(that.y >= newP){
            clearInterval(y);
            }
          },10);
        clearInterval(x);
      }
    },10);
  return "default return value";
};

Enemy.prototype.leftDown = function(){
  self = this;
  that = this;
  var x =  setInterval(function(){
    self.draw();
    self.x -= self.speed;
      if(self.x < 50){
        currentP = self.y;
        var y =  setInterval(function(){
        that.draw();
        newP = currentP + 100;
        that.y += that.speed;
          if(that.y >= newP){
            clearInterval(y);
            }
          },10);
        clearInterval(x);
      }
    },10);
    return "default return value";
};


Enemy.prototype.enemyRoute = function(){
  this.rightDown();
  self = this;
  setTimeout(function(){
     self.leftDown();
   }, timeOutSpeed);
};


Enemy.prototype.fullEnemyRoute = function(){
  this.enemyRoute();
  self = this;
  setTimeout(function(){
    self.enemyRoute();
    setTimeout(function(){
      self.enemyRoute();
    }, timeOutSpeed * 2);
  }, timeOutSpeed * 2);
};

Enemy.prototype.spawn = function(){
  // this.alive =true;
  // // this.draw();
  // if(this.alive === true){
  console.log(this);
    spawnedEnemy = game.stockedEnemies.splice(0,1)[0];
    game.spawnedEnemies.push(spawnedEnemy);
    this.fullEnemyRoute();
  // }
};

// KeyListener Constructor//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function KeyListener() {
    this.pressedKeys = [];

    this.keydown = function(e) {
        this.pressedKeys[e.keyCode] = true;
    };

    this.keyup = function(e) {
        this.pressedKeys[e.keyCode] = false;
    };

    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
}

KeyListener.prototype.isPressed = function(key)
{
    return this.pressedKeys[key] ? true : false;
};

KeyListener.prototype.addKeyPressListener = function(keyCode, callback)
{
    document.addEventListener("keypress", function(e) {
        if (e.keyCode == keyCode)
            callback(e);
    });
};

// MainLoop Constructor//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function MainLoop(){
  game.draw();
  game.updateMovement();
  game.updateShooting();
  setTimeout(MainLoop, 20);
}

function CheckSpawner(){
  game.rightDown();
  setTimeout(CheckSpawner, 1000);
}




MainLoop();
CheckSpawner();
