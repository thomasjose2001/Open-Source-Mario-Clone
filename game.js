/* Mario Game Clone */
/* Thomas C / Jonathan C */

/* --------------------------------------------------------- */
/* Function Oriented Programming */
function main() {
	let canvas = document.getElementById("canvas");			// Reference to the canvas in the page
	let context = canvas.getContext("2d");					// 2d context used for several useful methods
	let mapMatrix = new MatrixMap(50, 150);					// Map Object
	let mario = new Mario(context);							// Mario Object
	let background = new Background(canvas, context, mario);// Moving Background object
	const gravity = 1.2;
	const jumptAmount = 20;
	//Game Loop
	let gameRun = function () {

		// Update the game very fast by calling the gameRun function over and over again
		context.clearRect( 0, 0, background.getWidth(), background.getHeight() );
		background.draw();
		mario.draw();
		console.log(mario.getyPos());
		console.log(mario.getxPos());
		
		// falling condition
		if ( mario.getyPos() + mario.getFallingVel() + mario.getHeight() <= background.getHeight() ){
			mario.setyPos( mario.getyPos() + mario.setFallingVel( mario.getFallingVel() + gravity ) );
		}	
		else 
			mario.setFallingVel(0);
		
		if ( mario.getRunningVel >= 2 )
			mario.setRunningVel(2);
		console.log("looping the game");
		
		requestAnimationFrame(gameRun);	
	} 

	// ---- Add all event listeners before running the game loop ---- //
	document.addEventListener('keydown', (event) => {
		if (event.key == "w"){
		    mario.setFallingVel( mario.getFallingVel() - jumptAmount);
			//mapMatrix.updateMatrixUp(mario);
		}
		else if (event.key == "a"){
			// check left bound of the screen (could be a function later)
			if ( mario.getxPos() - mario.getWidth() >= 0 ) {
				mario.setxPos( mario.getxPos() - mario.setRunningVel( mario.getRunningVel() + mario.getAcceleration() ) ); // problem here!! returnin NAN
				//platformDirection = "negative"; keep track of running direction!!
			}
			//mapMatrix.updateMatrixLeft(mario);
		}
		else if (event.key == "d"){
			// check right bound of the screen
			if ( mario.getxPos() + mario.getWidth() + mario.getAcceleration() <= background.getWidth() ) {
				mario.setxPos( mario.getxPos() + mario.setRunningVel( mario.getRunningVel() + mario.getAcceleration() ) );
				//platformDirection = "positive"; here too !!
			}
			//mapMatrix.updateMatrixRight(mario);
		}
	});

	document.addEventListener('keyup', (event) => {

		if (event.key == "w"){
			mario.setFallingVel( mario.getFallingVel() + jumptAmount);
			mapMatrix.updateMatrixUp(mario);
		}	
		else if (event.key == "a") 
			mapMatrix.updateMatrixLeft(mario);
		else if (event.key == "d") 
			mapMatrix.updateMatrixRight(mario);
		
		mario.setRunningVel(0);
	});
	
	// Should we list all parameters in here?
	// we could pass all objects to update into an abstract object list and hand them to gameRun!!!
	//mario.draw();
	requestAnimationFrame( gameRun );
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
	constructor(context) {
		this.context = context;		
		this.width = 50;									// Size in blocks ( not pixels )
		this.height = 50;
		this.xPos = 100;					     			// The Mario character will have a width of 1 block and a height of 2 blocks in the matrix representation
		this.yPos = 100;
		let fallingVelocity = 2;
		let runningVelocity = 0.2;
		let acceleration = 0.2;
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

	// Draws Mario in its current position on the screen
	draw() {
		this.context.fillRect( this.xPos, this.yPos, this.height, this.width );
		this.context.fillStyle = "red";	
		return 1;
	}
}

class Background {
	constructor(canvas, context, mario) {
		this.canvas = canvas;
		this.ctx = context;
		this.mario = mario;
		this.height = 672;
		this.width = 10176;
		this.image = document.getElementById('background');
	}

	getHeight() { return this.height; }
	getWidth() { return this.width; }

	// Code the background Movement as mario advances !!
	draw() { 
		this.ctx.drawImage(this.image, 7, 7, this.width, this.height); 
		return 1;
	}
}

main();

/*
let xPos = 20;
let yPos = 500;

let fallingVelocity = 2;
let runningVelocity = 0.2;
let acceleration = 0.2;

const gravity = 1.2;

let platformX = 200;


function gameRun( ) {
	
	requestAnimationFrame( gameRun );
	
	context.clearRect( 0, 0, canvas.width, canvas.height );	 		
	context.fillRect( xPos, yPos, 50, 50 );	
	
	let platformDirection = "still";
	let platformMove = true;
				
	if ( yPos + fallingVelocity + characterHeight <= canvas.height )
		yPos += fallingVelocity += gravity;
	else 
		fallingVelocity = 0;
	
	if ( runningVelocity >= 2 )
		runningVelocity = 2;
	
	if ( keys.right.pressed == true ) {
		if ( xPos + characterWidth + acceleration <= canvas.width ) {
			xPos += runningVelocity += acceleration;
			platformDirection = "positive";
		}
	}
	else if ( keys.left.pressed == true ) {
		if ( xPos - characterWidth >= 0 ) {
			xPos -= runningVelocity += acceleration;
			platformDirection = "negative";	
		}
	}
	else
		platformMove = false;
	
	platform( platformDirection, 200, 300, 50, platformMove );		// Put withing the two if statements
}

document.addEventListener( 'keydown', ( event ) => {
	
	const jumptAmount = 20;
	//const movementAmount = 2;	

	let name = event.key;

	if ( name == "w" )
		fallingVelocity -= jumptAmount;
	else if ( name == "a" ) 
		keys.left.pressed = true;	
	else if ( name == "d" ) 
		keys.right.pressed = true;			
} );

document.addEventListener( 'keyup', ( event ) => {
		
	let name = event.key;	
	if ( name == "d" )
		keys.right.pressed = false;
	else if ( name == "a" ) 
		keys.left.pressed = false;
	
	runningVelocity = 0;
} );

function platform( characterDirection, y, w, z, move ) {

	if ( ( xPos >= canvas.width / 3 ) && ( characterDirection == "negative" ) ) {
		if ( move == true )
			platformX += 5;
	}
	else if ( xPos >= canvas.width / 3 ) { 	// Variable
		if ( move == true )
			platformX -= 5;
	}
	//else 
	//	context.fillStyle = "red";	

	context.fillRect( platformX, y, w, z );	
}

gameRun( );

*/
