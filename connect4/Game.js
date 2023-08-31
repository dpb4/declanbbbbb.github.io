class Game {
    constructor() {
        this.currentState = new State();
        this.turn = 1;
    }

    makeHumanMove() {
        let c = this.getSelectedColumn();
        if (c !== -1) {
            this.currentState = this.currentState.applyMove(this.turn, c);
            this.switchCurrentTurn();
        }
    }

    switchCurrentTurn() {
        if (this.turn === 1) {
            this.turn = 2;
        } else {
            this.turn = 1;
        }
    }

    display() {
        push();

        noStroke();
        fill(boardColour);
        translate(translation.x, translation.y);
        rect(-(piecePadding/2) - LREdgePadding, -(piecePadding/2), boardWidthPixels+(piecePadding) + LREdgePadding*2, boardHeightPixels+(piecePadding), 2);

        fill(backgroundColour);

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                if (this.currentState.grid[j][i] === 1) {
                    fill(ATeamColour);
                } else if (this.currentState.grid[j][i] === 2) {
                    fill(BTeamColour);
                } else {
                    fill(backgroundColour);
                    ellipse((i+0.5)*boardWidthPixels/7, (j+0.5)*boardHeightPixels/6, pieceRadius, pieceRadius);

                    let c = this.getSelectedColumn();
                    if (c !== -1 && i === c) {
                        if (this.turn === 1) {
                            fill(red(ATeamColour), green(ATeamColour), blue(ATeamColour), 128);
                        } else {
                            fill(red(BTeamColour), green(BTeamColour), blue(BTeamColour), 128);
                        }

                    }
                }
                ellipse((i+0.5)*boardWidthPixels/7, (j+0.5)*boardHeightPixels/6, pieceRadius, pieceRadius);
            }
        }

        pop();
    }

    getSelectedColumn() {
        if (mouseX > translation.x && mouseX < translation.x + boardWidthPixels && mouseY < translation.y + boardHeightPixels) {
            return floor((mouseX - translation.x) / (boardWidthPixels/7));
        } else {
            return -1;
        }
    }
}