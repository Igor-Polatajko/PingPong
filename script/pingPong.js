
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
	    timeElapsed,

	    inGame,

	    stopGameStates = {
	    	pause : false,
	    	gameOver : false
	    }

		isPosInit = false,

		touchSound = new Audio('resources/touch.mp3'),
		gameOverSound = new Audio('resources/gameOver.mp3'),

	    move = {
		up: {value : false},
		down: {value : false},
		left: {value : false},
		right:{value : false}
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

	function levelUp(){
		if(ballSpeed <= 9){
			ballSpeed += 0.1;
		}

		if(flipperWidth > 8 * ug){
			flipperWidth -= .25 * ug;
		}


		if(flipperSpeed < ballSpeed * 2){
			flipperSpeed = ballSpeed * 2;
		}
	}

	function checkCollisions(){
		let ballConst = ballSpeed + ballRadius / 2 + strokeWidth / 2;
		
		let touched = false;

		if(ballPosY - ballConst <= upperFlipperY + flipperHeight && ballPosX + ballConst >= upperFlipperX && ballPosX - ballConst <= upperFlipperX + flipperWidth && priviousTouch != 'upper'){
			ballAngle = - ballAngle;
			priviousTouch = 'upper';
			touched = true;
		}

		if(ballPosY + ballConst >= lowerFlipperY && ballPosX + ballConst >= lowerFlipperX && ballPosX - ballConst <= lowerFlipperX + flipperWidth && priviousTouch != 'lower'){
			ballAngle = - ballAngle;
			priviousTouch = 'lower';
			touched = true;
		}

		if(ballPosX - ballConst <= leftFlipperX + flipperHeight && ballPosY + ballConst >= leftFlipperY && ballPosY - ballConst <= leftFlipperY + flipperWidth && priviousTouch != 'left'){
			ballAngle = 180 - ballAngle;
			priviousTouch = 'left';
			touched = true;
		}

		if(ballPosX + ballConst >= rightFlipperX && ballPosY + ballConst >= rightFlipperY && ballPosY - ballConst <= rightFlipperY + flipperWidth && priviousTouch != 'right'){
			ballAngle = 180 - ballAngle;
			priviousTouch = 'right';
			touched = true;
		}

		if(touched){
			touchSound.play();
			score++;
			levelUp();
		}
		else if(ballPosX - ballConst <= leftBorderX || ballPosX + ballConst >= rightBorderX  || ballPosY - ballConst <= upperBorderY || ballPosY + ballConst >= lowerBorderY){
			gameOverSound.play();
			stopGameStates.gameOver = true;
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

		ballSpeed = 3;
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
		timeElapsedString = '00:00:00';
		ballColor = 'red';
		flipperColor = 'Blue';

		isPosInit = true;
		inGame = true;
	}

	function calcPos(){
		if(inGame){
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
	}

	function calcStuff(){
		if(!isPosInit){
			initPos();
		}
		else{
			if(!stopGameStates.gameOver && !stopGameStates.pause){
				calcPos();
				checkCollisions();
			}
		}
	}

	
	function checkInGame(){
		if(stopGameStates.pause || stopGameStates.gameOver){
			inGame = false;
		}
		else{
			inGame = true;
		}

		if(stopGameStates.gameOver){
			stopGameStates.pause = false;
		}
	}
	

	function draw(){

		checkInGame();
		
		calcStuff();


		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// draw border
		ctx.lineWidth = strokeWidth;
		ctx.strokeStyle = 'Black';
		ctx.strokeRect(leftBorderX - strokeWidth / 2, upperBorderY - strokeWidth / 2, gameFieldWidth, gameFieldHeight + strokeWidth);


		ctx.textBaseline = "top";
		ctx.font = '3vh Comic Sans MS';


		// draw Score and timer
		ctx.textAlign = 'left';
		ctx.fillText("Score: " + score, 25 * ug, 3 * ug);

		ctx.textAlign = 'right';
		ctx.fillText("Time elapsed: " + timeElapsedString, gameFieldWidth - 25 * ug , 3 * ug);

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

		
		// draw pause			
		if(stopGameStates.pause){
			ctx.font = '5vh Comic Sans MS';
			ctx.fillStyle = 'Black';
			ctx.textAlign = 'center';
			ctx.fillText("Pause", gameFieldWidth / 2, topMargin + gameFieldHeight / 2);
		}


		// draw gameover
		if(stopGameStates.gameOver){
			ctx.font = '5vh Comic Sans MS';
			ctx.fillStyle = 'Red';
			ctx.textAlign = 'center';		
			ctx.fillText("Game over", gameFieldWidth / 2, topMargin + gameFieldHeight / 2 - 5 * ug);
			ctx.font = '2vh Comic Sans MS';
			ctx.fillText("Press enter to play again!", gameFieldWidth / 2, topMargin + gameFieldHeight / 2  + 5 * ug);
		}
		

		requestAnimationFrame(draw);
	}

	function setKeyListeners(){
		let keys = [['KeyW ArrowUp', move.up], ['KeyS ArrowDown', move.down], ['KeyA ArrowLeft', move.left], ['KeyD ArrowRight', move.right]];

		for(let i = 0; i < keys.length; i++){
			document.addEventListener('keydown', function(e){
				let keysCode = keys[i][0].split(' ');
				for(let k = 0; k < keysCode.length; k++){
					if(e.code == keysCode[k] && !keys[i][1].value){
						keys[i][1].value = true;
						break;
					}
				}
			});
			document.addEventListener('keyup', function(e){
				let keysCode = keys[i][0].split(' ');
				for(let k = 0; k < keysCode.length; k++){
					if(e.code == keysCode[k] && keys[i][1].value){
						keys[i][1].value = false;
						break;
					}
				}
			});
		}	
	}

	function setWindowListeners(){
		window.onfocus = function(){
			if(!stopGameStates.gameOver){
					stopGameStates.pause = false;
			}
		}
		window.onblur = function(){
			stopGameStates.pause = true;
		}
	}

	function setKeyPressListener(){
		let keys = [['Space', pressSpaceEvent],['Enter', pressEnterEvent]];

		for(let i = 0; i < keys.length; i++){
			document.addEventListener('keypress', function(e){
				if(keys[i][0] == e.code){
					keys[i][1]();
				}
			});
		}

		function pressSpaceEvent(){
			if(!stopGameStates.gameOver){
				stopGameStates.pause = !stopGameStates.pause;
			}
		}

		function pressEnterEvent(){
			if(stopGameStates.gameOver){
				stopGameStates.gameOver = false;
				newGame();
			}
		}
	}

	function setTimerUpdate(){
		setInterval(function(){
			if(inGame){
				timeElapsed++;

				let seconds = timeElapsed;

				let hours = Math.floor(seconds / 3600);
				seconds %= 3600;
				let minutes = Math.floor(seconds / 60);
				seconds %= 60;

				timeElapsedString = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' +  ('0' + seconds).slice(-2);
			}
		}, 1000);
	}

	setKeyListeners();

	setKeyPressListener();

	setWindowListeners();

	setTimerUpdate();

	draw();
});
