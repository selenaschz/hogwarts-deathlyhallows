class Enemy {
    constructor(ctx, type) {
        this.ctx = ctx;

        this.type = type;

        this.x = (this.type !== "troll") ? this.ctx.canvas.width : 0;
        this.y = (this.type === "dementor") ? 270 : 350;

        this.vx = -3;

        this.audio = new Audio(`/assets/audio/enemies/${type}.mp3`);
        this.audio.volume = 0.1;

        this.sprite = new Image();
        this.sprite.src = `/assets/images/enemies/${type}.png`
        
        this.sprite.frameIndex = 0;
        this.sprite.frames = 2;
        this.sprite.frameRate = 30;
        this.drawCount = 0;

        this.isAlive = true;

        this.opacity = 1;

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

        if( !this.isAlive ) {
            this.fadeOut();
        }
        this.ctx.save();

        this.ctx.globalAlpha = this.opacity;
        
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
        if (this.x + this.width > 0) {  
            this.audio.play(); }
    }

    move() {

        if( this.type !== "troll" ) {
            this.x += this.vx;
        } else {
            this.x -= this.vx;
        }
        
        this.playSound();
    }

    takeDamage() {
        this.fadeOut(); //Frame decreases the opacity
        this.isAlive = false;
        this.audio.pause();     
    }

    fadeOut() {
        this.opacity = Math.max(0, this.opacity - 0.05); //Decrease opacity
    }

}