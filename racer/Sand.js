class Sand extends Particle {
    constructor(x, y) {
        super(x, y);
        this.type = "sand";
        // this.col = color(242, 191, 73);

        this.r = 242 + Math.random()*70;
        this.g = 191 + Math.random()*70;
        this.b = 73 + Math.random()*70;
    }

    update() {
        if (this.y < numCellsY-1) {
            if (grid[this.y+1][this.x] !== 0) {
                // console.log("cant go down");
                let leftCandidate = false;
                let rightCandidate = false;
                if (this.x > 0) {
                    leftCandidate = grid[this.y+1][this.x-1] === 0;
                }
                if (this.x < numCellsX) {
                    rightCandidate = grid[this.y+1][this.x+1] === 0;
                }

                if (leftCandidate && rightCandidate) {
                    if (Math.random() > 0.5) {
                        this.move(1, 1);
                        // console.log("down right");
                    } else {
                        this.move(-1, 1);
                        // console.log("down left");
                    }
                } else if (leftCandidate) {
                    this.move(-1, 1);
                    // console.log("down left");
                } else if (rightCandidate) {
                    this.move(1, 1);
                    // console.log("down right");
                }
                
            } else {
                // console.log("down", this.x, this.y);
                this.move(0, 1);
            }
        }
    }

    move(dx, dy) {
        let c = this.copy();
        c.x += dx;
        c.y += dy;
        grid[this.y+dy][this.x+dx] = c;
        grid[this.y][this.x] = 0
    }

    copy() {
        let s = new Sand(this.x, this.y);
        s.r = this.r;
        s.g = this.g;
        s.b = this.b;
        return s;
    }
}