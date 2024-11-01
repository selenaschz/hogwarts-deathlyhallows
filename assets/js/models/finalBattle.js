class FinalBattle {
    constructor( ctx, game) {
        this.ctx = ctx;
        this.game = game;
        this.player = new Player(this.ctx, this.game.player.house);
        this.player.x = this.ctx.canvas.width / 4;
        this.player.y = this.ctx.canvas.height - 200;
        this.voldemort = new Voldemort(this.ctx, this.game.voldemort.type);
        this.started = false;
        this.drawInterval = undefined;
        this.background = new Background (this.ctx, "finalBattle");

        this.spells = [
            "EXPELLIARMUS",
            "EXPECTO PATRONUM",
            "PROTEGO",
            "PROTEGO MAXIMA",
            "SECTUMSEMPRA",
            "FINITE INCANTATEM",
            "IMPEDIMENTA",
            "STUPEFY",
            "RIDDIKULUS",
            "OBSCURO",
            "INCARCEROUS",
            "LEVICORPUS",
            "REDUCTO",
            "GLACIUS",
            "REPELLO INIMICUM",
            "SALVIO HEXIA",
            "CONFRINGO",
            "AVADA KEDAVRA",
            "CRUCIO",
            "IMPERIO",
            "EBUBLIO",
            "FIENDFYRE",
            "SERPENSORTIA",
            "DIFFINDO",
            "BOMBARDA",
            "ENTOMORPHIS",
            "DEFODIO",
            "MOBILICORPUS",
          ];

        this.randomSpell = "";
        this.indexChar = 0;

        this.maxTimeToWrite = 6000;
        this.elapsedTime = 0;

        this.writeSpell = "";
        this.correctSpells = 0;
        this.spellsToWin = 6;
    }

    start() {
        this.started = true;

        this.getRandomSpell();

        this.onKeyEvent();

        //Final battle Interval:
        if (!this.drawInterval) {
            this.drawInterval = setInterval(() => {
            
                this.clear();
                this.draw();
                
            }, this.fps);
        }

    }


    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }


    draw() {
        this.background.draw();
        this.player.draw();
        this.voldemort.draw();
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "50px serif";

        //Level:
        this.ctx.fillText(`Level: ${this.game.level}`, this.ctx.canvas.width / 2, 30)

        //Time:
        this.ctx.fillText(`Time: ${this.elapsedTime}`, 10, this.ctx.canvas.height - 20)

        //Health player:
        this.ctx.fillText(`Health: ${this.player.health}`, 20, 30)

        //Score:
        this.ctx.fillText(`Score: ${this.game.score}`, this.ctx.canvas.width / 4 * 3, 30);

        //Deathly Hallows Collected:
        this.game.imgDeathlyHallows.src = `/assets/images/game/${this.game.deathlyHallowsImgStatus}Collected.png`;
        this.ctx.drawImage(
            this.game.imgDeathlyHallows,
            this.ctx.canvas.width - this.game.imgDeathlyHallows.width / 2 -10,
            10,
            this.game.imgDeathlyHallows.width / 2,
            this.game.imgDeathlyHallows.height / 2
        )

        this.ctx.textAlign = "start";
        //Spell:
        const spellWidth = this.ctx.measureText(this.randomSpell).width; //Calculate the width of a Spell
        this.ctx.fillText(this.randomSpell, this.ctx.canvas.width / 2 - spellWidth / 2, this.ctx.canvas.height / 2);

        //Change color char when it write.
        this.ctx.fillStyle = "red";
        this.ctx.fillText(this.writeSpell, this.ctx.canvas.width / 2 - spellWidth / 2, this.ctx.canvas.height / 2);

        this.gameOver();
        this.win();        
    }

    getRandomSpell() {
        //Get random index:
        const randomIndex = Math.floor( Math.random() * this.spells.length );

        this.randomSpell = this.spells[ randomIndex ];

        this.updateElapsedTime();

        //Remove that spell from the array:
        this.spells = this.spells.filter( spell => spell !== this.randomSpell );
    }

    gameOver() {
        if ( this.elapsedTime >= this.maxTimeToWrite ) {
            this.game.gameOver();
        } 
    }

    updateElapsedTime() {
        this.interval = setInterval(() => {
            this.elapsedTime++;
        }, 1000);
    }

    win() {
        if ( this.correctSpells === this.spellsToWin ) {
            this.game.win();
        }
    }

    onKeyEvent() {
        window.addEventListener("keydown", (event) => {
            const pressedLetter = event.key.toUpperCase();
            const char = this.randomSpell[this.indexChar];

                if ( pressedLetter === char ) {
                    this.writeSpell += pressedLetter;
                    this.indexChar++; //Next char


                    if ( this.indexChar === this.randomSpell.length ) {
                        this.correctSpells++; //Spell write correctly
                        this.getRandomSpell(); //New spell
                        this.writeSpell = "";
                        this.indexChar = 0;
                    }
                
            }
            
        })
    }

}