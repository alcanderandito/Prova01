/* ===== Mini-JS per il carousel ===== */
const imgs=document.querySelectorAll('.carousel-img');
let idx=0;
document.getElementById('prev').onclick=()=>change(-1);
document.getElementById('next').onclick=()=>change(1);
function change(step){
  imgs[idx].classList.remove('active');
  idx=(idx+step+imgs.length)%imgs.length;
  imgs[idx].classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {

    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'game-container',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 600
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    const game = new Phaser.Game(config);
    let player;
    let stars;
    let bombs;
    let platforms;
    let cursors;
    let score = 0;
    let gameOver = false;
    let scoreText;

    function preload() {
        this.load.image('sky', '../assets/fabiobros_assets/sky.png');
        this.load.image('ground', '../assets/fabiobros_assets/platform.png');
        this.load.image('star', '../assets/fabiobros_assets/star.png');
        this.load.image('bomb', '../assets/fabiobros_assets/bomb.png');
        this.load.spritesheet('dude', '../assets/fabiobros_assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create() {
        this.add.image(400, 300, 'sky');
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        bombs = this.physics.add.group();
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.collider(player, bombs, hitBomb, null, this);
    }

    function update() {
        if (gameOver) return;
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }

    function collectStar(player, star) {
        star.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            let bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    }

    function hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
    }

    // Evoca Don Alfred
    setTimeout(() => {
        fetch('/api/get-alfred-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageContext: 'Gioco Super Fabio Bros' })
        })
        .then(response => response.json())
        .then(data => {
            if (data.comment && typeof showAlfredPopup === 'function') {
                showAlfredPopup(data.comment);
            }
        })
        .catch(error => console.error("SPIRIT: Errore durante l'evocazione di Don Alfred:", error));
    }, 2000);
}); 