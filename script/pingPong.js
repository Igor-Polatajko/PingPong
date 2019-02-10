
document.addEventListener("DOMContentLoaded", function () {
	let canvas = document.getElementById('gameCanvas');

	let ctx = canvas.getContext('2d');

	let
	    canvasWidth,
	    canvasHeight,

	    gameFieldWidth,
	    gameFieldHeight,

	    topMargin,

	    uw, // unit width
	    uh, // unit height
	    ug, // general unit

	    strokeWidth,

	    ballPosX,
	    ballPosY,
	    ballColor,
	    ballRadius,

	    flipperWidth,
	    flipperHeight,
	    upperFlipperX,
	    upperFlipperY,
	    lowerFlipperX,
	    lowerFlipperY,
	    leftFlipperX,
	    leftFlipperY,
	    rightFlipperX,
	    rightFlipperY,
	    flipperColor,
	    flipperSpeed,

	    leftBorderX,
	    rightBorderX,
	    upperBorderY,
	    lowerBorderY,


	    score,
	    timeElapsed;

	let isPosInit = false;

	let buttonsPressed = [];

	let move = {
		up: false,
		down: false,
		left: false,
		right: false
	};

	function initPos(){


		strokeWidth = 10;
		canvasWidth = window.innerWidth * .7;
		canvasHeight = window.innerHeight * .7;
		uw = canvasWidth / 100;
		uh = canvasHeight / 100;
		ug = (uh < uw) ? uh : uw;

		topMargin = 12 * ug;

		gameFieldHeight = canvasHeight - topMargin  -  strokeWidth;
		gameFieldWidth = canvasWidth -  2 * strokeWidth;

		
		
		ballRadius = 3 * ug;

		
		flipperHeight = 2 * ug;
		flipperWidth = 15 * ug;


		ballPosX = gameFieldWidth  / 2;
		ballPosY = topMargin +  gameFieldHeight / 2;


		upperFlipperX = gameFieldWidth / 2 - flipperWidth / 2;
		upperFlipperY = topMargin;

		lowerFlipperX = upperFlipperX;
		lowerFlipperY = topMargin + gameFieldHeight - flipperHeight;
		
		leftFlipperX = strokeWidth;
		leftFlipperY = topMargin +  gameFieldHeight / 2 - flipperWidth / 2;

		rightFlipperX = gameFieldWidth - flipperHeight;
		rightFlipperY = leftFlipperY;

		flipperSpeed = 10;

		leftBorderX = strokeWidth;
		rightBorderX = canvasWidth - leftBorderX - strokeWidth;
		upperBorderY = topMargin;
		lowerBorderY = topMargin + gameFieldHeight;


		
		score = 0;
		timeElapsed = 0;
		ballColor = 'red';
		flipperColor = 'Blue';

		isPosInit = true;
		}

	function calcPos(){
		if(move.up){
			if(leftFlipperY - flipperSpeed > upperBorderY){
				leftFlipperY -= flipperSpeed;
				rightFlipperY -= flipperSpeed;
			}
			else{
				leftFlipperY = upperBorderY;
				rightFlipperY = upperBorderY;
			}
		}
		

		if(move.down){
			if(leftFlipperY + flipperSpeed < lowerBorderY - flipperWidth){
				leftFlipperY += flipperSpeed;
				rightFlipperY += flipperSpeed;
			}
			else{
				leftFlipperY = lowerBorderY - flipperWidth;
				rightFlipperY = lowerBorderY - flipperWidth;
			}
		}
		if(move.left){
			if(upperFlipperX - flipperSpeed > leftBorderX){
				upperFlipperX -= flipperSpeed;
				lowerFlipperX -= flipperSpeed;
			}
			else{
				upperFlipperX = leftBorderX;
				lowerFlipperX = leftBorderX;
			}
		}
		if(move.right){
			if(upperFlipperX + flipperSpeed < rightBorderX - flipperWidth){
				upperFlipperX += flipperSpeed;
				lowerFlipperX += flipperSpeed;
			}
			else{
				upperFlipperX = rightBorderX - flipperWidth;
				lowerFlipperX = rightBorderX - flipperWidth;
			}
		}
	}

	function calcStuff(){
		if(!isPosInit){
			initPos();
		}
		else{
			calcPos();
		}
	}

	function draw(){

		handleKeyPressed();

		calcStuff();



		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// draw border
		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = 'Black';
		ctx.strokeRect(leftBorderX - strokeWidth / 2, upperBorderY - strokeWidth / 2, gameFieldWidth, gameFieldHeight + strokeWidth);

		// draw Score and timer

		
		ctx.textBaseline = "top";
		ctx.font = '3vh Comic Sans MS';

		ctx.textAlign = 'left';
		ctx.fillText("Score: " + score, 25 * ug, 3 * ug);

		ctx.textAlign = 'right';
		ctx.fillText("Time elapsed: " + timeElapsed, gameFieldWidth - 25 * ug , 3 * ug);

		// draw ball
		ctx.fillStyle = ballColor;
		ctx.arc(ballPosX, ballPosY, ballRadius , 0, 2 * Math.PI);
		ctx.fill();

		// draw flippers
		ctx.fillStyle = flipperColor;

		// horizontal
		ctx.fillRect(upperFlipperX, upperFlipperY, flipperWidth, flipperHeight);
		ctx.fillRect(lowerFlipperX, lowerFlipperY, flipperWidth, flipperHeight);
		
		// vertical
		ctx.fillRect(leftFlipperX, leftFlipperY, flipperHeight,  flipperWidth);
		ctx.fillRect(rightFlipperX, rightFlipperY, flipperHeight, flipperWidth);

		requestAnimationFrame(draw);
	}

	function handleKeyPressed(){
		move.up = false;
		move.down = false;
		move.left = false;
		move.right = false;


		for(let i = 0; i < buttonsPressed.length; i++){
			switch(buttonsPressed[i]){
				case 'KeyW':
					move.up = true;
					break;
				case 'KeyS':
					move.down = true;
					break;
				case 'KeyA':
					move.left = true;
					break;
				case 'KeyD':
					move.right = true;
					break;	
			}
		}
	}

	document.addEventListener('keydown', function(e){
		if(!buttonsPressed.includes(e.code)){
			buttonsPressed.push(e.code);
		}
	});

	document.addEventListener('keyup', function(e){
		if(buttonsPressed.includes(e.code)){
			buttonsPressed.pop(e.code);
		}
	});

	draw();
});
