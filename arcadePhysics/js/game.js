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
settings.startGameMenuButton.addEventListener('click', startGame);

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
    game.input.gamepad.start();
    pad1 = game.input.gamepad.pad1;

    background = this.add.tileSprite(0, 0, settings.width, settings.height, 'backdrop');
    background.setPosition(settings.width / 2, settings.height / 2)

    particles = this.add.particles('particle');
    emitter = particles.createEmitter();
    emitter.setSpeed(15);
    emitter.minParticleScale = 0.15;
    emitter.maxParticleScale = 0.35;

    player = this.physics.add.sprite(50, 1125 / 2, 'player');
    player.setOrigin(0.5);
    player.setCollideWorldBounds(true);
    player.setBounce(0.5, 0.5);

    enemy = this.physics.add.sprite(Math.random() * settings.width, Math.random() * settings.height, 'enemy');
    enemy.x = 1000;
    enemy.y = 550;
    enemy.setOrigin(0.5);
    enemy.setVelocity(350, 350);
    enemy.setBounce(1.05, 1.05);
    enemy.setCollideWorldBounds(true);
    enemy.setMaxVelocity(5000, 5000);

}

gameScene.update = function () {

    emitter.setPosition(player.x, player.y);

    if (settings.gamemode == true) {

        //Keyboard Controls
        if (this.cursorKeys.up.isDown) {
            player.setVelocity(player.body.velocity.x, player.body.velocity.y -= settings.playerSpeed);
        }

        if (this.cursorKeys.down.isDown) {
            player.setVelocity(player.body.velocity.x, player.body.velocity.y += settings.playerSpeed);
        }

        if (this.cursorKeys.left.isDown) {
            player.setVelocity(player.body.velocity.x -= settings.playerSpeed, player.body.velocity.y);
        }

        if (this.cursorKeys.right.isDown) {
            player.setVelocity(player.body.velocity.x += settings.playerSpeed, player.body.velocity.y);
        }

        this.physics.world.collide(enemy, [player]);

        if (enemy.body.blocked.up || enemy.body.blocked.down || enemy.body.blocked.left || enemy.body.blocked.right) {
            bounce.play()
        };

        if (game.input.gamepad.supported && game.input.gamepad.active && pad1.connected) {
            indicator.animations.frame = 0;
        } else {
            indicator.animations.frame = 1;
        }

        //360 Gamepad Controls
        if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
            sprite.x--;
        } else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
            sprite.x++;
        }

        if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
            sprite.y--;
        } else if (pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
            sprite.y++;
        }

        if (pad1.justPressed(Phaser.Gamepad.XBOX360_A)) {
            sprite.angle += 5;
        }

        if (pad1.justReleased(Phaser.Gamepad.XBOX360_B)) {
            sprite.scale.x += 0.01;
            sprite.scale.y = sprite.scale.x;
        }

        if (pad1.connected) {
            var rightStickX = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
            var rightStickY = pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);

            if (rightStickX) {
                sprite.x += rightStickX * 10;
            }

            if (rightStickY) {
                sprite.y += rightStickY * 10;
            }
        }

    }



}

function startGame() {
    settings.gamemode = true;
    music.play();
    settings.startGameMenu.style.display = "none";
    enemy.setVelocity(350, 350);
}

function resetGame() {
    settings.gamemode = false;
    //settings.startGameMenu.style.display = "block";
}

function dump() {

    console.log(pad1._axes[0]);
    console.log(pad1._rawPad.axes[0]);

}
