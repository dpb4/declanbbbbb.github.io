class State {
    constructor() {
        this.grid = new Array(6).fill(0).map(x=>new Array(7).fill(0));
        this.isFinal = false;
    }

    copy() {
        let c = new State();
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                c.grid[y][x] = this.grid[y][x];
            }
        }
        return c;
    }

    applyMove(team, position) {

        let applied = this.copy();

        for (let i = 0; i < 6; i++) {
            if (this.grid[i][position] !== 0) {
                applied.grid[i-1][position] = team;
                return applied;
            }
        }
        applied.grid[5][position] = team;
        return applied;
    }

    checkFinal() {
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (this.grid[y][x] !== 0) {
                    for (let i = 0; i < 8; i++) {
                        if (this.checkCells(this.grid[y][x], {x: x, y: y}, directions[i], 1)) {
                            this.isFinal = true;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    checkCells(val, pos, dir, length) {
        if (length === 4) {
            return true;
        }
        if (this.isCheckValid(pos, dir)) {
            // if pattern continues, keep checking
            if (this.grid[pos.y+dir.y][pos.x+dir.x] === val) {
                let nextPos = {x: pos.x+dir.x, y: pos.y+dir.y};
                return this.checkCells(val, nextPos, dir, length+1);
            }
            else {
                return false;
            }
        }
        return false;
    }

    isCheckValid(pos, dir) {
        let tvec = {x: pos.x+dir.x, y: pos.y+dir.y};
        return !(tvec.x < 0 || tvec.x > 6 || tvec.y < 0 || tvec.y > 5);
    }
}