class Stair extends LevelObject {
    constructor(ctx) {
        super(ctx);

        this.img =new Image();
        this.img.src ="/assets/images/levelobjects/stairs.png";

        this.img.onload = () => {
            this.width = Math.floor(this.img.width / this.frames);
            this.height = this.img.height;
        }
    }

    draw() {
        this.ctx.drawImage(
            this.img,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
}