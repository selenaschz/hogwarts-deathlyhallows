class LevelObject {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = Math.floor(Math.random() * this.ctx.width - 50);
        this.y = Math.floor(Math.random() * this.ctx.height - 50);

        this.image = new Image();

        this.vx = 3;
        this.vy = 3;
    }

    draw() {
        this.ctx.fillRect(this.x, this.y, 50, 20);
    }

}