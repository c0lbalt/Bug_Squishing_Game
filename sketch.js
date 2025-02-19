let GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});

let gameState = GameStates.START;
let score = 0;
let time = 30;
let highScore = 0;
let textPadding = 15;
let gameFont;
let ladybug;
let characters = [];
let ladybugCharacter;
let squishedbug;

function preload() {
  gameFont = loadFont("media/Jacquard12-Regular.ttf");
  ladybug = loadImage("media/Moving_Ladybug.png");
  squishedbug = loadImage("media/squished_bug.png");
}

function setup() {
  createCanvas(400, 400);
  textFont(gameFont);

 
  ladybugCharacter = new Character(random(80, width - 80), random(80, height - 80), ladybug);
  characters.push(ladybugCharacter);


  ladybugCharacter.addAnimation("down", new SpriteAnimation(ladybug, 0, 0, 0));
  ladybugCharacter.addAnimation("up", new SpriteAnimation(ladybug, 0, 0, 6));
  ladybugCharacter.addAnimation("stand", new SpriteAnimation(ladybug, 0, 0, 0));
  ladybugCharacter.addAnimation("left", new SpriteAnimation(ladybug, 0, 0, 0));
  ladybugCharacter.addAnimation("right", new SpriteAnimation(ladybug, 0, 0, 0));
  ladybugCharacter.currentAnimation = "stand";
}

function draw() {
  background(220);

  switch(gameState) {
    case GameStates.START:
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press Enter to Start", width / 2, height / 2);
      break;

    case GameStates.PLAY:
      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);  
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width - textPadding, textPadding);
      
      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
      }

      
      characters.forEach(character => {
        character.update();
        character.draw();
      });
      break;

    case GameStates.END:
      textAlign(CENTER, CENTER);
      textSize(20);
      text("Game Over!", width / 2, height / 2 - 20);
      text("Your score was: " + score, width / 2, height / 2);
      if (score > highScore) {
        highScore = score;
      }
      text("High Score: " + highScore, width / 2, height / 2 + 20);
      break;
  }
}

function keyPressed() {
  if (gameState === GameStates.START && keyCode === ENTER) {
    gameState = GameStates.PLAY;
  }
}

function mousePressed() {

  if (gameState === GameStates.PLAY) {
    let ladybug = characters[0];
    if (mouseX > ladybug.x && mouseX < ladybug.x + 80 && mouseY > ladybug.y && mouseY < ladybug.y + 80) {
      ladybug.currentAnimation = "squished"; 
      score++; 
      setTimeout(() => {
        ladybug.currentAnimation = "stand"; 
      }, 500);
    }
  }
}

class Character {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.currentAnimation = null;
    this.animations = {};
    this.image = image; 
    this.direction = random(['up', 'down', 'left', 'right']);
    this.speed = 2;
    this.changeDirectionTime = 0;
  }

  addAnimation(key, animation) {
    this.animations[key] = animation;
  }

  update() {
    if (millis() - this.changeDirectionTime > 1000) {
      this.direction = random(['up', 'down', 'left', 'right']);
      this.changeDirectionTime = millis();
    }

    
    switch (this.direction) {
      case "up":
        this.y -= this.speed;
        this.currentAnimation = "up";
        break;
      case "down":
        this.y += this.speed;
        this.currentAnimation = "down";
        break;
      case "left":
        this.x -= this.speed;
        this.currentAnimation = "left";
        break;
      case "right":
        this.x += this.speed;
        this.currentAnimation = "right";
        break;
    }

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  draw() {
    let animation = this.animations[this.currentAnimation];
    if (animation) {
      push();
      translate(this.x, this.y);
      animation.draw();
      pop();
    }
  }
}

class SpriteAnimation {
  constructor(spritesheet, startU, startV, duration) {
    this.spritesheet = spritesheet;
    this.u = startU;
    this.v = startV;
    this.duration = duration;
    this.startU = startU;
    this.frameCount = 0;
    this.flipped = false;
  }

  draw() {
    let s = (this.flipped) ? -1 : 1;
    scale(s, 1);
    image(this.spritesheet, 0, 0, 80, 80, this.u * 80, this.v * 80, 80, 80);

    this.frameCount++;
    if (this.frameCount % 6 === 0) {
      this.u++;
    }

    if (this.u === this.startU + this.duration) {
      this.u = this.startU;
    }
  }
}