/* Mario Game Clone */
/* Thomas C / Jonathan C */

/* --------------------------------------------------------- */
/* Function Oriented Programming */
function main() {
	let canvas = document.getElementById("canvas");			// Reference to the canvas in the page
	let context = canvas.getContext("2d");					// 2d context used for several useful methods
	let spriteSheet = document.getElementById("sprites");   // Image that contains all the sprites in the game
	// We could add all the blocks here as a dictionary with the
	// coordinates in the spreadsheet
	// maybe go through a textfile and build the dictionary
	const tileMap = { "BrickBlockBrown":{"x":0,"y":0,"h":16,"w":16},
					  "Empty":{"x":16,"y":0,"h":16,"w":16}
					};
	let mapMatrix = new MatrixMap(50, 150);					// Map Object: should be 16 * 15 blocks like in the original mario game!! 
	let mario = new Mario(context, canvas.width);							// Mario Object: should be updated with the sprite and watching the video
	const gravity = 1.2;
	//---- Game Loop ----
	let gameRun = function () {
		context.clearRect( mario.getxPos(), 0, canvas.width, canvas.height );
		//mario.draw();
		//console.log("X coord: "+ mario.getyPos());
		//console.log("Y coord: " + mario.getxPos());
		//console.log("Falling Velocity: " + mario.getFallingVel());
		
		// falling condition
		/*
		if ( mario.getyPos() + mario.getFallingVel() + mario.getHeight() <= canvas.height ){
			mario.setyPos( mario.getyPos() + mario.setFallingVel( mario.getFallingVel() + gravity ) );
		}	
		else 
			mario.setFallingVel(0);
		
		if ( mario.getRunningVel >= 4 )
			mario.setRunningVel(4);
		console.log("looping the game");
		*/
		
		// Update the game very fast by calling the gameRun function over and over again
		console.log("rendering...");
		render();
		requestAnimationFrame(gameRun);	
	} 

	// ---- Event Listeners ---- //
	document.addEventListener('keydown', (event) => {
		if (event.key == "w"){
			if ( mario.movements["up"] == null)
				mario.movingUp();
			//mapMatrix.updateMatrixUp(mario);
		}
		if (event.key == "a"){
			if (mario.movements["left"] == null)
				mario.movingLeft();
			//mapMatrix.updateMatrixLeft(mario);
		}
		if (event.key == "d"){
			if (mario.movements["right"] == null)
				mario.movingRight();
			//mapMatrix.updateMatrixRight(mario);
		}
	});

	document.addEventListener('keyup', (event) => {

		if (event.key == "w"){
			//mario.setFallingVel( mario.getFallingVel() + jumptAmount);
			mario.stoppingUp();
			//mapMatrix.updateMatrixUp(mario);
		}	
		if (event.key == "a"){
			mario.stoppingLeft();
			//mapMatrix.updateMatrixLeft(mario);
		}
		if (event.key == "d") {
			mario.stoppingRight();
			//mapMatrix.updateMatrixRight(mario);
		}
		
		mario.setRunningVel(0);
	});

	function render() {
		// Paint the background in blue
		context.fillStyle = "rgb(4, 156, 216)";
		context.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
	
		// fill in all sky with empty blocks and floor with Brick Blocks
		// remember: game dimensions in blocks 16 * 15
		let xblocks = 16;
		let yblocks = 15;
		// dimensions in pixels per block
		let xdim = canvas.width / xblocks;
		let ydim = canvas.height / yblocks;
		for (let i = 0; i < yblocks; i++){
			if ( i < (yblocks - 2) ){
				for (let j = 0; j < xblocks; j++){
					context.drawImage(spriteSheet, tileMap.Empty.x, tileMap.Empty.y, tileMap.Empty.w, tileMap.Empty.h, j * xdim, i * ydim, xdim, ydim)
				}
			} 
			else{
				for (let j = 0; j < xblocks; j++){
					context.drawImage(spriteSheet, tileMap.BrickBlockBrown.x, tileMap.BrickBlockBrown.y, tileMap.BrickBlockBrown.w, tileMap.BrickBlockBrown.h, j * xdim, i * ydim, xdim, ydim)
				}
			}
		}
		
	}
	
	// Should we list all parameters in here?
	// we could pass all objects to update into an abstract object list and hand them to gameRun!!!
	// RUN THIS when rendering is integrated with the canvas and mario
	window.onload = gameRun();
}

/* --------------------------------------------------------- */
/* Object Oriented Programming */

class MatrixMap {

  constructor(mapX, mapY) {   			 	// Size of the map ( x and y )
	
	this.mapX = mapX;
	this.mapY = mapY;
	this.map = this.createMap();
  }

  getMatrixMap() {return this.map;}			// Accessor Method to return matrix ( pass a handle to the Mario Class )
    
  createMap() {								// Private Method used to create the matrix
	
	const C = 3; 
	const R = 4;
	const val = 0;
	
	var arr = Array(C);

	for (var i = 0; i < C; i++)
		arr[i] = Array(R).fill(val);

	return arr;
  }

  updateMatrixUp(objectMove) {			// Dont make the change super fast ( it has to sleep ) has to coincide with the anuimation
	// For loop the amount of columns and erase the last or bottom row
	// for loop the amount of columns and add at row 0 + 1 more in the y direction
	// Sleep
	// Another row etc...
	return 0;
  }

  updateMatrixLeft(objectMove) {
	/*
	mapMatrix[objectMove.getxPos][objectMove.getyPos] = 0;
	mapMatrix[objectMove.getxPos][objectMove.getyPos + objectMove.getWidth] = 0;
	mapMatrix[objectMove.getxPos - objectMove.getWidth][objectMove.getyPos] = objectMove.getMatrixValue;
	mapMatrix[objectMove.getxPos - objectMove.getWidth][objectMove.getyPos - objectMove.getWidth] = objectMove.getMatrixValue;
	*/
  }

  updateMatrixRight(objectMove) {
	/*
	mapMatrix[objectMove.getxPos][objectMove.getyPos] = 0;
	mapMatrix[objectMove.getxPos][ objectMove.getyPos + objectMove.getWidth] = 0;
	mapMatrix[objectMove.getxPos + objectMove.getWidth][objectMove.getyPos] = objectMove.getMatrixValue;
	mapMatrix[objectMove.getxPos + objectMove.getWidth][objectMove.getyPos + objectMove.getHeight] = objectMove.getMatrixValue;
	*/
}	
}

class Mario {
	constructor(context, canvasWidth) {
		this.context = context;		
		this.canvasWidth = canvasWidth;
		this.width = 50;									// Size in blocks ( not pixels )
		this.height = 50;
		this.xPos = 0;					     			// The Mario character will have a width of 1 block and a height of 2 blocks in the matrix representation
		this.yPos = 0;
		this.fallingVelocity = 2;
		this.runningVelocity = 2;
		this.acceleration = 0.5;
		this.jumptAmount = 20;
		this.movements = {up: null,
						  right: null,
						  up: null
					     };
	}

	getxPos() {return this.xPos;}
	getyPos() {return this.yPos;}
	getWidth() {return this.width;}
	getHeight() {return this.height;}
	getMatrixValue() {return 1;}
	getRunningVel() {return this.runningVelocity;}
	getFallingVel() {return this.fallingVelocity;}
	getAcceleration() {return this.acceleration;}

	setxPos( num ) {
		this.xPos = num;
		return this.xPos;
	}
	setyPos( num ) {
		this.yPos = num;
		return this.yPos;
	}
	setFallingVel( num ) { 
		this.fallingVelocity = num;
		return this.fallingVelocity;
	}
	setRunningVel( num ) { 
		this.runningVelocity = num;
		return this.runningVelocity;
	}
	// update position while user press certain keys
	movingUp() {
		this.movements["up"] = setInterval( () => this.up(), 100);
	}
	stoppingUp() {
		clearInterval(this.movements["up"]);
		this.movements["up"] = null;
	}
	up() {
		console.log("up");
		this.fallingVelocity -= this.jumptAmount;
	}

	movingLeft() {
		this.movements["left"] = setInterval( () => this.left(), 100);
	}
	stoppingLeft() {
		clearInterval(this.movements["left"]);
		this.movements["left"] = null;
	}
	left() {
		console.log("left")
		// check left bound of the screen (could be a function later)
		if ( this.xPos - this.width >= 0 ) {
			this.xPos -= this.runningVelocity += this.acceleration ;
			//platformDirection = "negative"; keep track of running direction!! for later
		}
	}

	movingRight() {
		//this.movements["right"] = setInterval( () => this.right(), 100);
		this.movements["right"] = setInterval( () => this.right(), 100);
	}
	stoppingRight() {
		clearInterval(this.movements["right"]);
		this.movements["right"] = null;
	}
	right() {
		this.context.translate(-10,0);
		this.xPos -= 10;
	}
	/*
	right() {
		console.log("right");
		// check right bound of the screen
		if ( this.xPos + this.width + this.acceleration <= this.canvasWidth ) {
			this.xPos += this.runningVelocity += this.acceleration ;
			//platformDirection = "positive"; here too !!
		}
	}
	*/

	// Draws Mario in its current position on the screen
	draw() {
		this.context.fillRect( this.xPos, this.yPos, this.height, this.width );
		this.context.fillStyle = "red";	
		return 1;
	}
}

main();