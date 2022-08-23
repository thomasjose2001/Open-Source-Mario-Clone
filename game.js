/* Mario Game Clone */
/* Thomas C / Jonathan C */

/* --------------------------------------------------------- */
/* Function Oriented Programming */
function main() {
	let camera = new Camera();  							// the active camera (what is displayed for the user to see)
	let canvas = document.getElementById("canvas");			// the whole map of the game
	let context = canvas.getContext("2d");					// 2d context used for several useful methods
	let spriteSheet = document.getElementById("sprites");   // Image that contains all the sprites in the game
	// We could add all the blocks here as a dictionary with the
	// coordinates in the spreadsheet
	// maybe go through a textfile and build the dictionary
	const tileMap = { "BrickBlockBrown":{"x":0,"y":0,"h":16,"w":16},
		                   "Empty":{"x":16,"y":0,"h":16,"w":16}
		          	//"Mario":{"x":, "y":, "h":, "w": }
					};
	let mapMatrix = new MatrixMap(50, 150);					// Map Object: should be 16 * 15 blocks like in the original mario game!! 
	let mario = new Mario(context, canvas.width, camera);
	const divWidth = 256;
	const divHeight = 240;
	const blockHeight = 16;							// Mario Object: should be updated with the sprite and watching the video
	const gravity = 1.2;
	render(); // render the whole level on the canvas
	mario.draw();
	
	//---- Game Loop ----
	let gameRun = function () {
		mario.movement();
		
		mario.setyPos(mario.getyPos() + mario.getFallingVel());
		if (mario.getyPos() + mario.getHeight() + mario.getFallingVel() <= (240 - (16*2 + 1))) {
			mario.setFallingVel(mario.getFallingVel() + mario.getGravity());
		}
		else
			mario.setFallingVel(0);
			
		mario.draw();
		
		//console.log("X coord: "+ mario.getyPos());
		//console.log("Y coord: " + mario.getxPos());
		//console.log("Falling Velocity: " + mario.getFallingVel());
		
		// falling condition
		
		/*if ( mario.getyPos() + mario.getFallingVel() + mario.getHeight() <= canvas.height ){
			mario.setyPos( mario.getyPos() + mario.setFallingVel( mario.getFallingVel() + gravity ) );
		}	
		else 
			mario.setFallingVel(0);
		
		if ( mario.getRunningVel >= 4 )
			mario.setRunningVel(4);
		console.log("looping the game"); */
		
		
		// Update the game very fast by calling the gameRun function over and over again
		requestAnimationFrame(gameRun);	
	} 

	// ---- Event Listeners ---- //
	document.addEventListener('keydown', (event) => {
		if (event.key == "w"){
			mario.moveUp();
		}
		if (event.key == "a"){
			mario.moveLeft();
		}
		if (event.key == "d"){
			mario.moveRight();
		}
	});

	document.addEventListener('keyup', (event) => {

		if (event.key == "w"){
			//mario.setFallingVel( mario.getFallingVel() + jumptAmount);
			mario.stopUp();
			//mapMatrix.updateMatrixUp(mario);
		}	
		if (event.key == "a"){
			mario.stopLeft();
			//mapMatrix.updateMatrixLeft(mario);
		}
		if (event.key == "d") {
			mario.stopRight();
			//mapMatrix.updateMatrixRight(mario);
		}
		
		mario.setRunningVel(0);
	});

	function render() {
		// Paint the background in blue
		//context.fillStyle = "rgb(4, 156, 216)";
		//context.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
	
		// fill in all sky with empty blocks and floor with Brick Blocks
		// remember: game dimensions in blocks 16 * 15
		let xblocks = 16;
		let yblocks = 15;
		// dimensions in pixels per block
		let xdim = divWidth / xblocks;
		let ydim = divHeight / yblocks;
		for (let i = 0; i < yblocks; i++){
			if ( i < (yblocks - 2) ){
				for (let j = 0; j < xblocks; j++){
					context.drawImage(spriteSheet, tileMap.Empty.x, tileMap.Empty.y, tileMap.Empty.w, tileMap.Empty.h, j * xdim, i * ydim, xdim, ydim);
				}
			} 
			else{
				for (let j = 0; j < xblocks; j++){
					context.drawImage(spriteSheet, tileMap.BrickBlockBrown.x, tileMap.BrickBlockBrown.y, tileMap.BrickBlockBrown.w, tileMap.BrickBlockBrown.h, j * xdim, i * ydim, xdim, ydim)
				}
			}
		}
		mapMatrix.createMap();
		
	}
	
	// Should we list all parameters in here?
	// we could pass all objects to update into an abstract object list and hand them to gameRun!!!
	// RUN THIS when rendering is integrated with the canvas and mario
	gameRun();
}




/* --------------------------------------------------------- */
/* Object Oriented Programming */

class Camera {
	constructor(){
		this.cam = document.getElementById("cam");
	}
	// negative: move left, positive: move right
	scroll(num) { this.cam.scrollLeft += num; }
}

class MatrixMap {

  constructor(mapX, mapY) {   			 	// Size of the map ( x and y )	 
	this.mapX = mapX;
	this.mapY = mapY;
	this.map = this.createMap();
  }

  getMatrixMap() {return this.map;}			// Accessor Method to return matrix ( pass a handle to the Mario Class )
    
  createMap() {								// Private Method used to create the matrix
	
	const C = 16; 
	const R = 15;
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
	constructor(context, canvasWidth, camera) {
		this.context = context;		
		this.canvasWidth = canvasWidth;
		this.camera = camera;
		this.width = 26;									// Size in blocks ( not pixels )
		this.height = 32;
		this.xPos = 10;					     			// The Mario character will have a width of 1 block and a height of 2 blocks in the matrix representation
		this.yPos = 240 - (16 * 4 );
		this.fallingVelocity = 0;
		this.runningVelocity = 2;
		this.acceleration = 0.5;
		this.jumptAmount = 5;
		this.gravity = 0.1;
		this.keys = { up: false,
			      right: false,
			      left: false
			    };
	}

	/* Accesors */
	getxPos() {return this.xPos;}
	getyPos() {return this.yPos;}
	getWidth() {return this.width;}
	getHeight() {return this.height;}
	getMatrixValue() {return 1;}
	getRunningVel() {return this.runningVelocity;}
	getFallingVel() {return this.fallingVelocity;}
	getAcceleration() {return this.acceleration;}
	getGravity() {return this.gravity;}
	
	/* Mutators */
	setxPos( num ) {
		this.xPos = num;
	}
	setyPos( num ) {
		this.yPos = num;
	}
	setFallingVel( num ) { 
		this.fallingVelocity = num;
	}
	setRunningVel( num ) { 
		this.runningVelocity = num;
	}
	// update movement states
	moveUp() { this.keys["up"] = true; }
	stopUp() { this.keys["up"] = false; }
	moveLeft() { this.keys["left"] = true; }
	stopLeft() { this.keys["left"] = false;}
	moveRight() { this.keys["right"] = true;}
	stopRight() { this.keys["right"] = false;}

	// Actual jumping and lateral movement operations
	/*jump() {
		
	} */
	left() {
		console.log("left")
		// check left bound of the screen (could be a function later)
		if ( this.xPos - this.width >= 0 ) {
			//this.xPos -= this.runningVelocity += this.acceleration;
			this.xPos -= 0.67;
			//platformDirection = "negative"; keep track of running direction!! for later
		}
	}
	right() {
		console.log("right");
		// check right bound of the screen
		
		if ( this.xPos + this.width + this.acceleration <= this.canvasWidth ) {
			this.xPos += 0.67;
			//platformDirection = "positive"; here too !!
		}
	}
	movement() {
		if (this.keys["up"] == true){
			this.fallingVelocity -= 1;
			//this.jump();
		}
		if (this.keys["left"] == true){
			this.left();
			this.camera.scroll(-1);
		}	
		if (this.keys["right"] == true){
			this.right();
			this.camera.scroll(1);
		}	
	}
	
	//Draws Mario in its current position on the screen
	draw() {
		this.context.clearRect( 0, 0, canvas.width, canvas.height - 32 );
		this.context.fillRect( this.xPos, this.yPos, this.width, this.height );
		//this.context.stroke();
	}	
}

window.onload = main;
