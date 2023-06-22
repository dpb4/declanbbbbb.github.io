class GameStateManager {
  constructor(AIDepth) {
    this.score = 0;
    this.state = new State();
    this.AIDepth = AIDepth-1;
    // this.state.setGrid(sg);
  }
  
  displayGrid() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state.grid[j][i] !== 0) {
          push();
          translate((width - squareWidth*4)/2, (height - squareWidth*4) - (width - squareWidth*4)/2);

          // let colour = this.gf(this.state.grid[j][i]);
          let colour = tileColours[constrain(this.state.grid[j][i]-1, 0, 10)];

          fill(colour);
          stroke(red(colour) * edgeDarkness, green(colour) * edgeDarkness, blue(colour) * edgeDarkness)
          rect(i*squareWidth + edgeOffset, j*squareWidth + edgeOffset, squareWidth - edgeOffset*2, squareWidth - edgeOffset*2, edgeOffset);

          stroke(0);
          fill(255);
          text(pow(2, this.state.grid[j][i]), i*squareWidth + squareWidth/2, j*squareWidth + squareWidth/2);
          
          pop();
        }
      }
    }
  }

  displayGame() {
    push();
    translate((width - squareWidth*4)/2, (height - squareWidth*4) - (width - squareWidth*4)/2);

    stroke(128);
    // fill(255, 246, 230);
    noFill();
    rect(0, 0, squareWidth*4, squareWidth*4, edgeOffset*2);

    for (let i = 1; i < 4; i++) {
      line(squareWidth*i, 0, squareWidth*i, squareWidth*4);
      line(0, squareWidth*i, squareWidth*4, squareWidth*i);
    }
    pop();

    // line(0, (height - width)/2, width, (height - width)/2);
    // line(0, height-width, width, height-width);

    push();
    textAlign(LEFT, TOP);
    // noStroke();
    stroke(68, 113, 36);
    fill(114, 190, 61);
    textSize((height - width)/1.5);
    textStyle(BOLD)
    text("2048", (width - squareWidth*4)/2, (height - width)/5);

    // stroke(150);
    // rect((width - squareWidth*4)/2, (height - width)/4, )
    
    let h = (height-width) - (width - squareWidth*4)/2;
    textSize(h/5.3);
    let x = width - textWidth("SCORE")*1.5 - (width - squareWidth*4)/2;
    let y;
    let w = width - x - (width - squareWidth*4)/2;
    noStroke();
    fill(175);
    rect(x, (height - width)/4, w, h);
    fill(120);
    text(`SCORE:\n${this.state.score}\nBEST:\n${this.state.score}`, x + edgeOffset, (height - width)/4 + edgeOffset);

    textSize(AISwitch.h*0.75);
    text("TOGGLE AI", AISwitch.x + (AISwitch.w)*1.1, AISwitch.y + AISwitch.h*0.185);
    pop();
  }

  input(move) {
    this.state = this.state.nextState(move);
    if (this.state.isDead()) {
      console.log("dead");
    }
  }

  AIMove() {
    let states = this.state.getAllNextStates();

    // console.log(states);

    // for (let i = 3; i >= 0; i--) {
    //   if (states[i].equals(this.state)) {
    //     states.splice(i, 1);
    //   }
    // }
    
    for (let d = 0; d < this.AIDepth; d++) {
      for (let a = 0; a < states.length; a++) {
        states[a] = states[a].getAllNextStates();
      }

      states = states.flat();
    }

    let CMax = -99999999;
    let CMaxSequence = 0;

    let firstMoveAverages = [0, 0, 0, 0];
    let firstMoveNumbers = [0, 0, 0, 0];
    for (let a = 0; a < states.length; a++) {
      if (this.objective(states[a]) > CMax) {
        CMax = this.objective(states[a]);
        CMaxSequence = states[a].moveCode;
      }
      firstMoveAverages[int(states[a].moveCode[0])] += this.objective(states[a]);
      firstMoveNumbers[int(states[a].moveCode[0])]++;
    }

    let maxAvgI = 0;
    let maxAvg = -999999999;
    for (let i = 0; i < 4; i++) {
      firstMoveAverages[i] /= firstMoveNumbers[i];
    }
    for (let i = 0; i < 4; i++) {
      if (firstMoveAverages[i] > maxAvg) {
        maxAvg = firstMoveAverages[i];
        maxAvgI = i;
      }
    }

    if (CMaxSequence[0] !== undefined) {
      // console.log(int(CMaxSequence[0]));
      // this.input(int(CMaxSequence[0]));
      this.input(maxAvgI);
      // this.input(int(CMaxSequence[2]));
      return [maxAvgI, firstMoveAverages];
      // return [CMax, CMaxSequence, firstMoveAverages];

    }
    return 0;
  }

  objective(state) {
    state.evalScore();
    let s = state.score;

    if (state.isDead()) {
      return s/2;
    }

    let zeroes = state.grid.flat().filter(x => x === 0).length-1;
    return zeroes;
    // return s;
    // return s * (1 + zeroes*zeroBonus);
  }
}