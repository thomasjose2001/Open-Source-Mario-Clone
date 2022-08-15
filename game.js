/* Thomas Cinalli */

let xPos = 20;
let yPos = 500;

let fallingVelocity = 2;
let runningVelocity = 0.2;
let acceleration = 0.2;

const gravity = 1.2;

let platformX = 200;

/* Start of Game ( place character and canvas on screen ) */
/* --------------------------------------------------------- */

let canvas = document.getElementById( "wallpaper" );			
let context = canvas.getContext( "2d" );

context.fillRect( xPos, yPos, 50, 50 );
context.fillStyle = "red";	

const characterHeight = 50;
const characterWidth = 50;

const keys = { right: { pressed: false },
	        left: { pressed: false } 
	     }
	     	       		
/* --------------------------------------------------------- */

/* Control Movement of Character */
/* --------------------------------------------------------- */

/* Falling Function */
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

/* Right, left, up ( Action Listener ) */
/* --------------------------------------------------------- */

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

/* KeyUp, stop when we have released the key */
/* --------------------------------------------------------- */

document.addEventListener( 'keyup', ( event ) => {
		
	let name = event.key;	
	if ( name == "d" )
		keys.right.pressed = false;
	else if ( name == "a" ) 
		keys.left.pressed = false;
	
	runningVelocity = 0;
} );

/* Function for creating barriers */
/* --------------------------------------------------------- */

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

/* Main */
/* --------------------------------------------------------- */

gameRun( );s
