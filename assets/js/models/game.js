class Game {
    constructor(canvasId, house) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = 1301;
        this.canvas.height = 533;
        this.ctx = this.canvas.getContext("2d");

        this.house = house;
        
        this.drawIntervalId = undefined;
        this.fps = 1000 / 60; //frames per second

        this.background = new Background(this.ctx);
        this.player = new Player( this.ctx, "Slytherin" );
        this.enemies = [new Enemy( this.ctx, "dementor" )];

        this.enemyTypes = ["dementor", "troll", "pixies"];

        this.score = 0;

        this.platform = new LevelObject(this.ctx);

        this.started = false;

        this.music = new Audio("/assets/audio/background-theme.mp3");
        this.music.volume = 0.06;
        //PONER MUTE Y PAUSE!!!
    }

    start() {
        this.started = true;

        this.music.play();

        let tick = 0;

        if (!this.drawIntervalId) {
            this.drawIntervalId = setInterval(() => {
                this.clear();
                this.move();
                this.draw();

                tick++;

                if ( tick >= 300 ) {
                    tick = 0;
                    this.addEnemy();
                }
            }, this.fps)
        }
    }

    gameOver() {
        const audio = new Audio("/assets/audio/gameover.wav");
        
        audio.volume = 0.05;

        audio.play();

        this.pause();

        this.ctx.fillText("Game Over", this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);

    }

    onKeyEvent(event) {
        this.player.onKeyEvent(event);
    }

    draw() {
        this.background.draw();
        this.player.draw();

        if ( this.player.spell && this.player.spell.isActive ) {
            const loading = new Image();
            loading.src = "/assets/images/loading.png";

            this.ctx.drawImage(
                loading, 
                this.player.x, 
                this.player.y - 70, 
                loading.width / 2, 
                loading.height / 2);
        }

        this.enemies.forEach( enemy => enemy.draw() );
        if ( this.player.spell ) {
            this.player.spell.draw();
        }

        this.platform.draw();

        this.checkCollisionsEnemy();
        
        this.ctx.font = "50px serif";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.score, this.ctx.canvas.width / 4 * 3, 50);
    }
    
    end() {

    }

    clear() {
        
    }

    move() {
        this.background.move();
        this.player.move();
        this.enemies.forEach( enemy => {
            enemy.move();
        });

        this.checkCollisionsAttack();
        this.checkCollisionsEnemy();

        //Remove dead enemies (opacity less than 1)
        this.enemies = this.enemies.filter( enemy => enemy.isAlive || enemy.opacity > 0.7 );
    }

    checkCollisionsEnemy() {
        this.enemies.forEach(enemy => {
            if ( this.player.collides(enemy) ) {
                this.gameOver();
            }
        })
    }

    checkCollisionsAttack() {
        this.enemies.forEach( enemy => {
            //If it collides with spell, it takes damage
            if ( this.player.spell && this.player.spell.collides(enemy) ) {
                    enemy.audio.pause();
                    enemy.takeDamage(); 
                    this.score++;
            }
        });
    }

    pause() {
        this.music.pause();
        this.enemies.forEach( e => e.audio.pause());
        this.started = false;
        clearInterval(this.drawIntervalId);
    }

    addEnemy() {
        const indexType = Math.floor( Math.random() * this.enemyTypes.length);
        const newEnemy = new Enemy(this.ctx, this.enemyTypes[indexType]);

        this.enemies.push(newEnemy);
    }

    
}