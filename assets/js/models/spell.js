class Spell {
    constructor(ctx, x, y, isRight, house) {
        this.ctx = ctx;

        this.x = isRight ? x : x - 100 ;
        this.y = y;

        this.vx = 10;
        // this.vy = 0;

        this.house = house;

        this.isRight = isRight;

        this.isActive = false;

        this.audio = new Audio("/assets/audio/spell.mp3");
        this.audio.volume = 0.12;

        this.sprite = new Image();
        this.sprite.src = `/assets/images/spell/spell-${house}.png`;
        
        this.sprite.frameIndex = 0;
        this.sprite.frames = 2;
        this.sprite.frameRate = 30;
        this.drawCount = 0;

        this.sprite.onload = () => {
            this.sprite.frameWidth = Math.floor(this.sprite.width / this.sprite.frames);
            this.height = this.sprite.height;
            this.width = this.sprite.frameWidth;
        }
    }
    
    updateAnimation() {
        this.drawCount++;

        if ( this.drawCount > this.sprite.frameRate ) {
            this.sprite.frameIndex++;
            this.drawCount = 0;

            if (this.sprite.frameIndex >= this.sprite.frames) {
                this.sprite.frameIndex = 0;
            }
        }
    }

    draw() {
        this.updateAnimation();

        this.ctx.save();
        
        this.ctx.drawImage(
            this.sprite,
            this.sprite.frameIndex * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        );

        this.ctx.restore();
    }

    playSound() {
        if (this.x > 0 && this.x + this.width < this.ctx.canvas.width) {
            this.audio.play();
        }
    }
    move(){
        if( this.isRight ) {
            this.x += this.vx;
        } else {
            this.x -= this.vx;
        }
    
        this.playSound();
        // this.y += this.vy;
    }

    collides(enemy) {
        const collisionX = enemy.x <= this.x + this.width && enemy.x + enemy.width >= this.x;
        const collisionY = enemy.y <= this.y + this.height && enemy.y + enemy.height >= this.y;
        
        return collisionX && collisionY && enemy.isAlive;
    }
}