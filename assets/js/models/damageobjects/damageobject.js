class DamageObject {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = Math.floor(Math.random() * (this.ctx.width - 50));
        this.y = this.ctx.canvas.height - 50;

        // this.image = new Image();
        // this.image.src = imageUrl;

        // this.image.frameIndex = 0;
        // this.image.frames = frames;
        // this.image.frameRate = 30;

        // this.drawCount = 0;

        // this.image.onload = () => {
        //     this.width = Math.floor(this.image.width / this.image.frames);
        //     this.height = this.image.height;
        // }
    }

    draw() {
            // this.ctx.drawImage(
            //     this.image,
            //     this.x + (i * 10),
            //     this.y,
            //     this.width,
            //     this.height
            // )
            this.ctx.fillStyle="white";
            this.ctx.fillRect(this.x, this.y, 50, 50);
    }

    move() {
        this.x -= this.vx;            
    }

    // updateAnimation() {
    //     this.drawCount++;

    //     if ( this.drawCount > this.image.frameRate ) {
    //         this.image.frameIndex++;
    //         this.drawCount = 0;

    //         if (this.image.frameIndex >= this.image.frames) {
    //             this.image.frameIndex = 0;
    //         }
    //     }
    // }

}