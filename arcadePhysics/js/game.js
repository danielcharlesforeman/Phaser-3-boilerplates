var gameScene = new Phaser.Scene('game');
var music, bounce;

var settings = {
    gamemode: false,
    width: 2000,
    height: 1125,
    lives: 3,
    livesId: null,
    score: 0,
    scoreId: null,
    highscore: null,
    highscoreId: null,
    gravity: 150,
    physicsDebug: true,
    startGameMenu: null,
    startGameMenuButton: null
}

settings.startGameMenu = document.getElementById('startMenu');
settings.startGameMenuButton = document.querySelector('#startMenu button');
settings.startGameMenuButton.addEventListener('click', startGame );

var config = {
    type: Phaser.CANVAS,
    width: settings.width,
    height: settings.height,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: settings.gravity
            },
            debug: settings.physicsDebug
        }
    },
}

var game = new Phaser.Game(config);

gameScene.init = function () {

}

gameScene.preload = function () {
    
    this.load.audio('music', 'assets/music/Symphony.mp3');
    this.load.audio('bounce', 'assets/sound/bounce.wav');
    
    this.load.image('backdrop', 'assets/sprites/backdrop.png');
    this.load.image('particle', 'assets/sprites/particle.png');
    this.load.image('player', 'assets/sprites/player.png');
    this.load.image('enemy', 'assets/sprites/enemy.png');
    
}

gameScene.create = function () {
    
    music = this.sound.add('music');
    bounce = this.sound.add('bounce');
    
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    background = this.add.tileSprite(0, 0, settings.width, settings.height, 'backdrop');
    background.setPosition( settings.width / 2, settings.height / 2)
    
    particles = this.add.particles('particle');
    emitter = particles.createEmitter();
    emitter.setSpeed(15);
    emitter.minParticleScale = 0.15;
    emitter.maxParticleScale = 0.35;

    player = this.physics.add.sprite(50, 1125 / 2, 'player');
    player.setOrigin(0.5);
    player.body.collideWorldBounds=true;
    player.body.body.bounce.setTo(0.9, 0.9);
    
    enemy = this.physics.add.sprite( Math.random() * settings.width, Math.random() * settings.height, 'enemy');
    enemy.setOrigin(0.5);
    enemy.body.collideWorldBounds=true;
    enemy.body.bounce.setTo(0.9, 0.9);

}

gameScene.update = function () {
    
    emitter.setPosition(player.x, player.y);

    if ( settings.gamemode == true ) {

        if (this.cursorKeys.up.isDown) {
            player.y -= 7;
        }

        if (this.cursorKeys.down.isDown) {
            player.y += 7;
        }
        
        if (this.cursorKeys.left.isDown) {
            player.x -= 7;
        }

        if (this.cursorKeys.right.isDown) {
            player.x += 7;
        }

    }

}

function startGame() {
    settings.gamemode = true;
    //music.play();
    settings.startGameMenu.style.display = "none";
}

function resetGame() {
    settings.gamemode = false;
    //settings.startGameMenu.style.display = "block";
}

