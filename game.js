/* Mario Game Clone */
/* Thomas C / Jonathan C */

/* --------------------------------------------------------- */
/* Function Oriented Programming */

function gameRun(mapMatrixObject, marioObject) {

	requestAnimationFrame(gameRun);						// Update the game very fast by calling the gameRun function over and over again
} 

function main() {

	canvas = document.getElementById("canvas");				// Reference to the canvas in the page
	ctx = canvas.getContext("2d");							// 2d context used for several useful methods
	let mapMatrix = new MatrixMap(50, 150);					// Map Object
	let mario = new Mario(4, 0);							// Mario Object

	document.addEventListener('keydown', (event) => {

		if (event.key == "w")
			mapMatrix.updateMatrixUp(mario);
		else if (event.key == "a") 
			mapMatrix.updateMatrixLeft(mario);
		else if (event.key == "d") 
			mapMatrix.updateMatrixRight(mario);
	});

	document.addEventListener('keyup', (event) => {		// we need the keyup to map the falling

		if (event.key == "w")
			mapMatrix.updateMatrixUp(mario);
		else if (event.key == "a") 
			mapMatrix.updateMatrixLeft(mario);
		else if (event.key == "d") 
			mapMatrix.updateMatrixRight(mario);
	});
	
	//gameRun(mapMatrix, mario);
}

/* --------------------------------------------------------- */
/* Object Oriented Programming */

class MatrixMap {

  constructor(mapX, mapY) {   			 	// Size of the map ( x and y )
	
	this.mapX = mapX;
	this.mapY = mapY;
	this.map = createMap();
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
  }

  updateMatrixLeft(objectMove) {

	mapMatrix[objectMove.getxPos][objectMove.getyPos] = 0;
	mapMatrix[objectMove.getxPos][objectMove.getyPos + objectMove.getWidth] = 0;
	mapMatrix[objectMove.getxPos - objectMove.getWidth][objectMove.getyPos] = objectMove.getMatrixValue;
	mapMatrix[objectMove.getxPos - objectMove.getWidth][objectMove.getyPos - objectMove.getWidth] = objectMove.getMatrixValue;
  }

  updateMatrixRight(objectMove) {

	mapMatrix[objectMove.getxPos][objectMove.getyPos] = 0;
	mapMatrix[objectMove.getxPos][ objectMove.getyPos + objectMove.getWidth] = 0;
	mapMatrix[objectMove.getxPos + objectMove.getWidth][objectMove.getyPos] = objectMove.getMatrixValue;
	mapMatrix[objectMove.getxPos + objectMove.getWidth][objectMove.getyPos + objectMove.getHeight] = objectMove.getMatrixValue;
  }	
}

class Mario {
	constructor() {
				
		this.width = 2;									// Size in blocks ( not pixels )
		this.height = 4;

		this.xPos = 0;					     			// The Mario character will have a width of 1 block and a height of 2 blocks in the matrix representation
		this.yPos = this.height;
	}

	getxPos() {return this.xPos;}
	getyPos() {return this.yPos;}

	getWidth() {return this.width;}
	getHeight() {return this.height;}

	getMatrixValue() {return 1;}
}

class entityGraphic() {
	constructor() {
		// should be a generic position given by the user
		let xPos = 20;
		let yPos = 500;
		const height = 50;
		const width = 50;
		let fallingVelocity = 2;
		let runningVelocity = 0.2;
		let acceleration = 0.2;
		const gravity = 1.2;
		//draw the object
		ctx.fillRect( xPos, yPos, height, width );
		ctx.fillStyle = "red";	
	}



class Background {
	constructor() {
		this.canvas = canvas;
		this.ctx = ctx;
		this.image = document.getElementById('background');
		this.drawBackground();
	}

	// Move as mario advances
	drawBackground() {
		this.ctx.drawImage(this.image, 7, 7, 10176, 672);
	}

}

new Background();





/*
let xPos = 20;
let yPos = 500;

let fallingVelocity = 2;
let runningVelocity = 0.2;
let acceleration = 0.2;

const gravity = 1.2;

let platformX = 200;

let canvas = document.getElementById( "wallpaper" );			
let context = canvas.getContext( "2d" );

context.fillRect( xPos, yPos, 50, 50 );
context.fillStyle = "red";	

const characterHeight = 50;
const characterWidth = 50;

const keys = { right: { pressed: false },
	        left: { pressed: false } 
	     }

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
