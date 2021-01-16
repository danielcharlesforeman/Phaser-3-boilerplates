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
    gravity: 125,
    physicsDebug: true,
    startGameMenu: null,
    startGameMenuButton: null,
    playerSpeed: 7,
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
    
    this.load.audio('music', 'assets/music/music.ogg');
    this.load.audio('bounce', 'assets/sound/bounce.wav');
    
    this.load.image('backdrop', 'assets/sprites/backdrop_dark.png');
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
    player.setCollideWorldBounds(true);
    player.setBounce( 0.5, 0.5 );
    
    enemy = this.physics.add.sprite( Math.random() * settings.width, Math.random() * settings.height, 'enemy');
    enemy.x = 1000;
    enemy.y = 550;
    enemy.setOrigin(0.5);
    enemy.setVelocity( 350, 350 );
    enemy.setBounce(1.05, 1.05);
    enemy.setCollideWorldBounds(true);
    enemy.setMaxVelocity( 5000, 5000 );

}

gameScene.update = function () {
    
    emitter.setPosition(player.x, player.y);

    if ( settings.gamemode == true ) {

        if (this.cursorKeys.up.isDown) {
            player.setVelocity( player.body.velocity.x, player.body.velocity.y-=settings.playerSpeed );
        }

        if (this.cursorKeys.down.isDown) {
            player.setVelocity( player.body.velocity.x, player.body.velocity.y+=settings.playerSpeed );
        }
        
        if (this.cursorKeys.left.isDown) {
            player.setVelocity( player.body.velocity.x-=settings.playerSpeed, player.body.velocity.y );
        }

        if (this.cursorKeys.right.isDown) {
            player.setVelocity( player.body.velocity.x+=settings.playerSpeed, player.body.velocity.y );
        }
        
        this.physics.world.collide(enemy, [player]);
        
        if ( enemy.body.blocked.up || enemy.body.blocked.down || enemy.body.blocked.left || enemy.body.blocked.right) {
            bounce.play()
        };

    }
    
    

}

function startGame() {
    settings.gamemode = true;
    music.play();
    settings.startGameMenu.style.display = "none";
    enemy.setVelocity( 350, 350 );
}

function resetGame() {
    settings.gamemode = false;
    //settings.startGameMenu.style.display = "block";
}

