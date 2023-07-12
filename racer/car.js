class Car {
    constructor(type, x, y, isShown) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.isShown = isShown;

        this.vel = {x: 0, y: 0};
        this.acc = {x: 0, y: 0};

        this.width = images[this.type].width;
        this.height = images[this.type].height;

        this.drag = 0;
        this.accelerationStrength = 0.1;
        this.brakeStrength = 0.5;

        this.throttling = false;
        this.braking = false;
    }

    throttle() {
        this.acc.y = this.accelerationStrength;
    }

    brake() {
        this.acc.y = this.brakeStrength;
    }

    speedometer() {
        return Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y ) * speedConstant;
    }

    update() {
        if (this.throttling) {
            this.throttle();
        }
        if (this.braking) {
            this.brake();
        }

        let slowdown = (1 - friction) * (1 - this.drag);
        this.acc.x *= slowdown;
        this.acc.y *= slowdown;

        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;

        if (this.vel.y < 0) {
            this.vel.y = 0;
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }
    
    display() {
        
    }
}