class Sand extends Particle {
    constructor(x, y) {
        super(x, y);
        this.type = "sand";
        this.col = color(242, 191, 73);

        this.r = red(this.col);
        this.g = green(this.col);
        this.b = blue(this.col);
    }

    update() {
        if (this.y < numCellsY-1) {
            if (grid[this.y+1][this.x] !== 0) {
                let leftCandidate = false;
                let rightCandidate = false;
                if (this.x > 0) {
                    leftCandidate = grid[this.y+1][this.x-1] === 0;
                }
                if (this.x < numCellsX) {
                    rightCandidate = grid[this.y+1][this.x+1] === 0;
                }

                if (leftCandidate && rightCandidate) {
                    if (random() > 0.5) {
                        grid[this.y+1][this.x+1] = this.copy();
                        grid[this.y+1][this.x+1].y++;
                        grid[this.y+1][this.x+1].x++;
                    } else {
                        grid[this.y+1][this.x-1] = this.copy();
                        grid[this.y+1][this.x-1].y++;
                        grid[this.y+1][this.x-1].x--;
                    }
                    grid[this.y][this.x] = 0;
                } else if (leftCandidate) {
                    grid[this.y+1][this.x-1] = this.copy();
                    grid[this.y+1][this.x-1].y++;
                    grid[this.y+1][this.x-1].x--;
                    grid[this.y][this.x] = 0;
                } else if (rightCandidate) {
                    grid[this.y+1][this.x+1] = this.copy();
                    grid[this.y+1][this.x+1].y++;
                    grid[this.y+1][this.x+1].x++;
                    grid[this.y][this.x] = 0; 
                }
            } else {
                grid[this.y+1][this.x] = this.copy();
                grid[this.y+1][this.x].y++;
                grid[this.y][this.x] = 0; 
            }
        }
    }

    copy() {
        return new Sand(this.x, this.y);
    }
}