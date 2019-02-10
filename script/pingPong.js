
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
	    ballSpeed,
	    ballAngle,
	    priviousTouch,

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

	let move = {
		up: {
			value : false},
		down: {
			value : false},
		left: {
			value : false},
		right:{
			value : false}
	};

	function randomInt(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function angleToRad(angle){
		return Math.PI * angle / 180;
	}

	function newGame(){
		isPosInit = false;
	}

	function checkCollisions(){
		let ballConst = ballSpeed + ballRadius / 2 + strokeWidth / 2;
		
		let notTouched = true;

		if(ballPosY - ballConst <= upperFlipperY + flipperHeight && ballPosX - ballConst >= upperFlipperX && ballPosX + ballConst <= upperFlipperX + flipperWidth && priviousTouch != 'upper'){
			ballAngle = - ballAngle;
			score++;
			priviousTouch = 'upper';
			touched = false;
		}

		if(ballPosY + ballConst >= lowerFlipperY && ballPosX - ballConst >= lowerFlipperX && ballPosX &&  ballConst <= lowerFlipperX + flipperWidth && priviousTouch != 'lower'){
			ballAngle = - ballAngle;
			score++;
			priviousTouch = 'lower';
			touched = false;
		}

		if(ballPosX - ballConst <= leftFlipperX + flipperHeight && ballPosY - ballConst >= leftFlipperY && ballPosY + ballConst <= leftFlipperY + flipperWidth && priviousTouch != 'left'){
			ballAngle = 180 - ballAngle;
			score++;
			priviousTouch = 'left';
			touched = false;
		}

		if(ballPosX + ballConst >= rightFlipperX && ballPosY - ballConst >= rightFlipperY && ballPosY + ballConst <= rightFlipperY + flipperWidth && priviousTouch != 'right'){
			ballAngle = 180 - ballAngle;
			score++;
			priviousTouch = 'right';
			touched = false;
		}


		if(notTouched && ballPosX - ballConst <= leftBorderX || ballPosX + ballConst >= rightBorderX  || ballPosY - ballConst <= upperBorderY || ballPosY + ballConst >= lowerBorderY){
			newGame();
		}
	}

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
		ballPosX = gameFieldWidth  / 2;
		ballPosY = topMargin +  gameFieldHeight / 2;

		ballSpeed = 0;
		ballAngle = randomInt(0, 4) * 90 + randomInt(20, 70);

		
		flipperHeight = 2 * ug;
		flipperWidth = 15 * ug;




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
		if(move.up.value){
			if(leftFlipperY - flipperSpeed > upperBorderY){
				leftFlipperY -= flipperSpeed;
				rightFlipperY -= flipperSpeed;
			}
			else{
				leftFlipperY = upperBorderY;
				rightFlipperY = upperBorderY;
			}
		}
		if(move.down.value){
			if(leftFlipperY + flipperSpeed < lowerBorderY - flipperWidth){
				leftFlipperY += flipperSpeed;
				rightFlipperY += flipperSpeed;
			}
			else{
				leftFlipperY = lowerBorderY - flipperWidth;
				rightFlipperY = lowerBorderY - flipperWidth;
			}
		}
		if(move.left.value){
			if(upperFlipperX - flipperSpeed > leftBorderX){
				upperFlipperX -= flipperSpeed;
				lowerFlipperX -= flipperSpeed;
			}
			else{
				upperFlipperX = leftBorderX;
				lowerFlipperX = leftBorderX;
			}
		}
		if(move.right.value){
			if(upperFlipperX + flipperSpeed < rightBorderX - flipperWidth){
				upperFlipperX += flipperSpeed;
				lowerFlipperX += flipperSpeed;
			}
			else{
				upperFlipperX = rightBorderX - flipperWidth;
				lowerFlipperX = rightBorderX - flipperWidth;
			}
		}


		ballPosX += ballSpeed * Math.cos(angleToRad(ballAngle)); 
		ballPosY += ballSpeed * Math.sin(angleToRad(ballAngle)); 
	}

	function calcStuff(){
		if(!isPosInit){
			initPos();
		}
		else{
			calcPos();
			checkCollisions();
		}
	}

	function draw(){

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

	function setKeyListeners(){
		let keys = [['KeyW', move.up], ['KeyS', move.down], ['KeyA', move.left], ['KeyD', move.right]];

		for(let i = 0; i < keys.length; i++){
			document.addEventListener('keydown', function(e){
				if(e.code == keys[i][0] && !keys[i][1].value){
					keys[i][1].value = true;
				}

			});
			document.addEventListener('keyup', function(e){
				if(e.code == keys[i][0] && keys[i][1].value){
					keys[i][1].value = false;
				}
			});
		}	
	}

	setKeyListeners();

	draw();
});
