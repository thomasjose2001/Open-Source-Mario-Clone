/* Mario Game Clone */
/* Thomas C / Jonathan C */

/* --------------------------------------------------------- */
/* Function Oriented Programming */
async function main() {
	let input = new InputHandler();  						
	let canvas = document.getElementById("canvas");	
	/* We need to define a way to make the dimensions to scale up to make the screen size bigger */		
	canvas.width = 3376; 
	canvas.height= 240; 
	const mapWidth = 3376;		
	const mapHeight = 240;
	const blockSize = 16;
	let context = canvas.getContext("2d");					// 2d context used for several useful methods
	context.fillStyle = 'rgba(0, 0, 0, 0)'; // could be run at the beginning?
	let spriteSheet = document.getElementById("sprites");   // Image that contains all the sprites in the game
	const GlobalSpriteMap = {};
	await setData(GlobalSpriteMap); // had to make main asynchronous ( allows for the await keywoard to wait for js promises in asynchronous functions )
	let mapMatrix = new MatrixMap(mapWidth / blockSize, mapHeight / blockSize);			// Create map matirx object
	let player = new Player(canvas.width, canvas.height, spriteSheet, getSpriteMap("Mario", GlobalSpriteMap), mapMatrix);
	let camera = new Camera(256, 240, player);
	let staggerFrames = 8; // For animation purposes, helps make animations slower by doing them every n number of frames
	let gameFrame = 0; // frame counter
	mapMatrix.createInitialMap();
	//---- Game Loop ----
	let gameRun = function () {
		context.clearRect( 0, 0, canvas.width, canvas.height);
		//render(); // draws background (may not be needed if we put the background static in the canvas with css)
		player.draw(context, gameFrame, staggerFrames); // draws player with animations
		player.update(input);  // update position of character
		camera.scroll();      // scrolls camera depending on its focus
		gameFrame++;
		requestAnimationFrame(gameRun);	
	} 

	function render() {
		// Paint the background in blue
		//context.fillStyle = "rgb(4, 156, 216)";
		//context.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
	
		// fill in all sky with empty blocks and floor with Brick Blocks
		// remember: game dimensions in blocks 16 * 15
		let xblocks = 16;
		let yblocks = 15;
		// dimensions in pixels per block
		let xdim = camera.width / xblocks;
		let ydim = camera.height / yblocks;
		for (let i = 0; i < yblocks; i++){
			if ( i < (yblocks - 2) ){
				for (let j = 0; j < xblocks; j++){
					//context.drawImage(spriteSheet, spriteMap.Empty.x, spriteMap.Empty.y, spriteMap.Empty.w, spriteMap.Empty.h, j * xdim, i * ydim, xdim, ydim);
				}
			} 
			else{
				for (let j = 0; j < xblocks; j++){
					context.drawImage(spriteSheet, GlobalSpriteMap.BrickBlockBrown.x, GlobalSpriteMap.BrickBlockBrown.y, GlobalSpriteMap.BrickBlockBrown.w, GlobalSpriteMap.BrickBlockBrown.h, j * xdim, i * ydim, xdim, ydim)	
				}
			}
		}	
		
	}

	async function setData( spriteMap ) {
		try{
			const response = await fetch('./spritesheet.json')
		
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}

			const jsonObject = await response.json();
			
			let spriteCount = jsonObject["frames"]["length"];
			for (let i = 0; i < spriteCount; i++){
				let spriteName = jsonObject["frames"][i]["filename"]; // image.png
				spriteName = spriteName.substr(0, spriteName.indexOf(".")); // image
				spriteMap[ spriteName ] = jsonObject["frames"][i]["frame"]; // key = image & value = position and dimensions
			}
			console.log(spriteMap);
			console.log("Sprite Map loaded");
		}
		catch(error) {
			console.error(`Error loading sprite map: ${error}`);
		}
	}

	// gathers the spriteMap of a specific character by left and right (for constant time animation access)
	function getSpriteMap( characterName, GlobalSpriteMap){
		characterSpriteMap = { R:{}, // Right
							   L:{}, // Left
							   N:{}  // No direction
		}; 

		entriesList = Object.entries( GlobalSpriteMap );
		for(let i = 0; i < entriesList.length; i++ ){
			let spriteName = entriesList[i][0];   // Sprite's name
			let dirIndex = spriteName.length - 1; // index of sprite's direction in name
			let animIndex = dirIndex - 1; // index of the animation sequence number

			// if the sprite is part of the character sprite map
			if ( spriteName.includes(characterName) ){
				// check to create an empty list to store animations per sprite definition
				if (characterSpriteMap[ spriteName.charAt( dirIndex )][ spriteName.substring(0, animIndex)] === undefined)
					characterSpriteMap[ spriteName.charAt( dirIndex )][ spriteName.substring(0, animIndex)]  = [];
				
				// characterSpriteMap[direction][spriteName][animation sequence number]
				characterSpriteMap[ spriteName.charAt( dirIndex )][ spriteName.substring(0, animIndex)].push(entriesList[i][1]);
			}
		}

		console.log(characterSpriteMap);
		return characterSpriteMap;
	}
	
	gameRun();
}

/* --------------------------------------------------------- */
/* Object Oriented Programming */

// Handles all input events
class InputHandler{
	constructor(){
		this.keys = { up: false,
			  right: false,
			  left: false
  			};
		
		window.addEventListener('keydown', (event) => {
			if (event.key == "w")
				this.keys["up"] = true;
			if (event.key == "a")
				this.keys["left"] = true;
			if (event.key == "d")
				this.keys["right"] = true;
		});

		window.addEventListener('keyup', (event) => {
			if (event.key == "w")
				this.keys["up"] = false;
			if (event.key == "a")
				this.keys["left"] = false;
			if (event.key == "d")
				this.keys["right"] = false;
		});
	}
}

class Camera {
	constructor(width, height, focus){
		this.cam = document.getElementById("camera");
		this.width = width;
		this.height = height;
		this.focus = focus;
		this.speed = 0;
	}
	// negative: move left, positive: move right
	scroll() { 
		//console.log("Camera position: "+this.cam.scrollLeft);
		this.cam.scrollLeft = this.focus.x - 115; // 256/2 - mario's width/2
	}
}

class MatrixMap {

 constructor(mapWidth, mapHeight) {   			 	// Size of the map ( x and y )	 
	this.mapWidth = mapWidth;
	this.mapHeight = mapHeight;
	this.sky = 0;
	this.tile = 1;
	this.platform = 2;
	this.matrix = [];
  }
  
  getMatrixMap() {return this.matrix;}					// Accessor Method to return matrix ( pass a handle to the Mario Class )
  getMatrixTile() {return this.tile;}					 
  getMatrixPlatform() {return this.platform;}				// Accessor Method to return platform tile number
  
  // Use mouse listener to create map
  createInitialMap() {								// Private Method used to create the matrix
	for (let i = 0; i < (this.mapHeight - 2); i++)
		this.matrix[i] = Array(this.mapWidth).fill(this.sky);
		
	for (let i = (this.mapHeight - 2); i < this.mapHeight; i++)
		this.matrix[i] = Array(this.mapWidth).fill(this.tile);
		
	//this.matrix[11][0] = 2;
	//this.matrix[12][0] = 2;
	console.log(this.matrix);
	return this.matrix;
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

class Player {
	constructor(gameWidth, gameHeight, spriteSheet, spriteMap, mapMatrix) {	
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight; 
		this.spriteSheet = spriteSheet;   // all the spritesheets in the game
		this.spriteMap = spriteMap;		  // the object to know sprites positions in the spritesheet
		//this.sprite = this.spriteMap.MarioRight;
		this.mapMatrix = mapMatrix;
		this.sprite = "Mario";
		this.width = 26; // pixels	
		this.height = 32; // pixels
		this.x = 0;					     			// The Mario character will have a width of 1 block and a height of 2 blocks in the matrix representation
		this.y = this.gameHeight - this.height - 64; 				// Four blocks in the sky
		this.direction = "R";   // Mario's Direction
		this.animation = 0;    // animation sequence number
		this.speed = 0;
		this.jumpSpeed = 0;
		this.weight = 1;
		this.blockSize = 16; 
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
	update(input) {
		if (input.keys["right"] == true && this.x < this.gameWidth) {
			this.speed = 5;
			this.direction = "R";
			this.sprite = "MarioWalk";
			//console.log("RIGHT");
		}
		else if (input.keys["left"] == true && this.x >= 0) {
			this.speed = -5;
			this.direction = "L";
			this.sprite = "MarioWalk";
		}
		else {
			this.speed = 0;
			this.sprite = "Mario";
			this.animation = 0;
		}

		/* you can only jump if key up is pressed and you are on the ground */
		if (input.keys["up"] == true && this.onGround() ) this.jumpSpeed -= 15; // negative to move up

		/* update horizontal: both player and background */
		if (this.collisionHorizontal() == false)
			this.x += this.speed; 
		//else
		//	this.x -= this.speed;

		/* check horizontal bounds */
		if (this.x < 0) this.x = 0;
		else if (this.x > this.gameWidth - this.width ) this.x = this.gameWidth - this.width;
		
		/* update vertical */
		if (this.collisionVertical() == false)
			this.y += this.jumpSpeed;
		//else
		//	this.y -= this.jumpSpeed;

		/* apply weight when mario is not on the ground & change to jumping sprite */
		if ( !this.onGround() ){
			this.jumpSpeed += this.weight;
			this.sprite = "MarioJump";
			this.animation = 0;
		}
		else {
			this.jumpSpeed = 0;
		}

		if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
	}
	
	collisionHorizontal() {
		// Check if horizontal movement is colliding
		return (this.mapMatrix.getMatrixMap()[Math.round(((this.y + this.height) / this.blockSize))][Math.round((this.x) / this.blockSize)] == this.mapMatrix.getMatrixTile())
	}
	
	collisionVertical() {
		// Check if horizontal movement is colliding
		return (this.mapMatrix.getMatrixMap()[Math.round(((this.y + this.height) / this.blockSize))][Math.round((this.x) / this.blockSize)] == this.mapMatrix.getMatrixPlatform())
	}

	// we can modify this method later to check for solid structures
	onGround(){
		//console.log( this.mapMatrix.getMatrixMap()[Math.round(((this.y + this.height) / this.blockSize))][Math.round((this.x) / this.blockSize)] == this.mapMatrix.getMatrixTile() )
		return (this.mapMatrix.getMatrixMap()[Math.round(((this.y + this.height + this.blockSize) / this.blockSize))][Math.round((this.x) / this.blockSize)] == this.mapMatrix.getMatrixTile());
	}
	
	//Draws Mario in its current position on the screen
	draw(context, gameFrame, staggerFrames) {
		// Change Animation correspondingly
		if (gameFrame % staggerFrames == 0){
			this.animation = (this.animation + 1) % this.spriteMap[this.direction][this.sprite].length; //must test!
		}
		// direction, sprite selected, animation number
		let selected = this.spriteMap[this.direction][this.sprite][this.animation];
		context.fillRect( this.x, this.y, this.width, this.height );
		context.drawImage(this.spriteSheet, selected.x, selected.y, selected.w, selected.h, this.x, this.y, selected.w, selected.h);
		//this.context.stroke();
	}
}
window.onload = main;
// -- Testing zone --
