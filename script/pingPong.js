
document.addEventListener("DOMContentLoaded", function () {
	let canvas = document.getElementById('gameCanvas');

	let ctx = canvas.getContext('2d');

	let
	    canvasWidth,
	    canvasHeight,

	    uw, // unit width
	    uh, // unit height
	    ug, // general unit

	    ballPosX,
	    ballPosY,
	    ballColor,
	    ballRadius,

	    flipperWidth,
	    flipperHeight,
	    flipperX,
	    flipperY,
	    flipperColor;

	let isPosInit = false;

	function initPos(){
		ballPosX = canvasWidth / 2;
		ballPosY = canvasHeight / 2;
		flipperX = canvasWidth / 2 - flipperWidth / 2;
		flipperY = canvasHeight / 2 - flipperWidth / 2;
		isPosInit = true;
	}

	function calcStuff(){
		canvasWidth = window.innerWidth * .7;
		canvasHeight = window.innerHeight * .7;
		uw = canvasWidth / 100;
		uh = canvasHeight / 100;
		ug = (uh < uw) ? uh : uw;

		
		ballColor = 'red';
		ballRadius = 3 * ug;

		
		flipperHeight = 2 * ug;
		flipperWidth = 15 * ug;
		flipperColor = 'Blue';

		if(!isPosInit){
			initPos();
		}
	}

	function draw(){

		calcStuff();

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// draw border
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'Black';
		ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

		// draw ball
		ctx.fillStyle = ballColor;
		ctx.arc(ballPosX, ballPosY, ballRadius , 0, 2 * Math.PI);
		ctx.fill();

		//draw flippers
		ctx.fillStyle = flipperColor;

		ctx.fillRect(flipperX, 0, flipperWidth, flipperHeight);
		ctx.fillRect(flipperX, canvasHeight - flipperHeight, flipperWidth, flipperHeight);
		ctx.fillRect(0, flipperY, flipperHeight,  flipperWidth);
		ctx.fillRect(canvasWidth - flipperHeight, flipperY, flipperHeight, flipperWidth);

		requestAnimationFrame(draw);
	}

	draw();
});