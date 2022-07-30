class Game {
	constructor(size, complexity) {
		this.size = size;
		this.complexity = complexity;

		this.vectors = [
			createVector(1, 0),
			createVector(-1, 0),
			createVector(0, 1),
			createVector(0, -1),
		]

		this.map = new Array(this.size).fill(0).map(x => new Array(this.size).fill(0));
		this.fillMap(this.map);
		this.walls = this.generateWalls(this.map);
		// console.log(this.map[0].length);
	}

	fillMap(map) {
		let position = createVector(floor(this.size/2), floor(this.size/2))
		for (let i = 0; i < this.complexity; i++) {
			map[position.y][position.x] = 1 + (i === 0);

			let acceptable = false;

			let nextPos = position.copy();
			let giveUp = 500;
			let counter = 0;
			while (!acceptable && counter < giveUp) {
				nextPos = position.copy();
				nextPos.add(random(this.vectors));

				if (nextPos.x >= 0 && nextPos.x < this.size && nextPos.y >= 0 && nextPos.y < this.size) {
					if (map[nextPos.y][nextPos.x] === 0) {
					position = nextPos.copy();
					break;
					}
				}
				
				counter++;
			
			}
		}
		map[position.y][position.x] = 3;
	}

	drawMap(map) {
		let sideLength = min(width/this.size, height/this.size);
	
		for (let y = 0; y < this.size; y++) {
			for (let x = 0; x < this.size; x++) {
				switch(map[y][x]) {
					case 1:
						fill(54, 209, 54);
						break;
					case 3:
						fill(0, 255, 0);
						break;
					case 2:
						fill(255, 0, 255);
						break;
					default:
						fill(255, 0);
				}
				rect(x*sideLength, y*sideLength, sideLength+1, sideLength+1);
			}
		}
	}

	generateWalls(map) {
		let walls = [];
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[0].length; x++) {
				if (map[y][x] !== 0) {
					if (y+1 < this.size && !map[y+1][x]) {
						walls.push([createVector(x, y+1), createVector(x+1, y+1)]);
					}
					if (y-1 >= 0 && !map[y-1][x]) {
						walls.push([createVector(x, y), createVector(x+1, y)]);
					}
					if (x+1 < this.size && !map[y][x+1]) {
						walls.push([createVector(x+1, y), createVector(x+1, y+1)]);
					}
					if (x-1 >= 0 && !map[y][x-1]) {
						walls.push([createVector(x, y), createVector(x, y+1)]);
					}
				}
				
			}
		}
		console.log(walls[0]);
		return walls;
	}

	drawWalls(walls) {
		let sideLength = min(width/this.size, height/this.size);

		push();
		strokeWeight(6);
		stroke(255);

		for (let w = 0; w < walls.length; w++) {
			line(walls[w][0].x * sideLength, walls[w][0].y * sideLength, walls[w][1].x * sideLength, walls[w][1].y * sideLength);
		}

		pop();
	}
}