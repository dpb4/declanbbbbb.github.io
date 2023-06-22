class Connection {
    constructor(restLength, k, p1, p2) {
        this.restLength = restLength;
        this.k = k;
        this.p1 = p1;
        this.p2 = p2;

        this.c = color(0);
    }

    calculateDisplacement() {
        return this.p1.pos.dist(this.p2.pos) - this.restLength;
    }

    calculateForce() {
        let kd = this.k * this.calculateDisplacement();
        if (kd > 0) {
            return this.p2.pos.copy().sub(this.p1.pos).normalize().mult(pow(kd, springExponent));
        } else {
            return this.p2.pos.copy().sub(this.p1.pos).normalize().mult(-pow(-kd, springExponent));
        }

    }

    apply() {
        let f = this.calculateForce();
    
        this.p1.applyForce(f);
        this.p2.applyForce(f.mult(-1));

        // this.p1.updatePosition();
        // this.p2.updatePosition();
    }

    display() {
        stroke(this.c);
        line(this.p1.pos.x, height - this.p1.pos.y, this.p2.pos.x, height - this.p2.pos.y);

        // if (debug) {
        //     stroke(0, 0, 255);
        //     let temp = p5.Vector.sub(this.p2.pos, this.p1.pos).normalize().mult(this.calculateDisplacement()/2);
        //     line(this.p1.pos.x + temp.x, height - (this.p1.pos.y + temp.y), this.p2.pos.x - temp.x, height - (this.p2.pos.y - temp.y));
        // }
    }
}