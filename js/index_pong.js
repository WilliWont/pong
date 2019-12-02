console.log('index_pong.js is loaded');

//////////////////////////======== GAME PROPERTIES ========///////////////////////////////////////

// Control Properties
const checkP1=true;
var isPause = true;
const isMouse = true;
const pause_dialogue = "PAUSED";

// Player Paddle Properties
const paddleWidth_1 = 30;
const paddleHeight_1 = 125;
const paddleColor_1 = "rgba(240,240,240,1)";
const paddleSpace_1 = 75; // space between border and paddle
var l_min_react = [];
var l_max_react = [];

// Computer Paddle Properties
const paddleWidth_2 = 30;
const paddleHeight_2 = 120;
const paddleColor_2 = "rgba(240,240,240,1)";
const paddleSpace_2 = 75; // space between border and paddle
const r_max_react = [10,21];
const r_min_react = [0,10];
/*const r_max_react = [0,0];
const r_min_react = [0,0];*/

// Enviroment Properties
const bgColor = "rgba(30,30,30,1)";
const bgColor_Pause = "rgba(30,30,30,.9)";
const netWidth = 7.5;   // per net dashes width
const netHeight = 30; // per net dashes height
const netColor = "rgba(240,240,240,1)";
const netSpacing = 40;// space between net dashes (should never be below 0)
const framePerSecond = 60;
const defaultSide = true;
const CollideAngle = Math.PI/6; // 30 degree

// Ball Propterties
const ballRadius = 15;
const ballColor = "rgba(240,240,240,1)";
const ballSpeed = 15;                        // Velocity = Speed + Direction
const ballMinDeg = 135;
const ballMaxDeg = 181;                         // Max has to be 1 degree higher
const ballIncrement = 0.05;                    // Ballspeed incremention after each collision
const invisBallModifier = 1.25;                // Speed Modifier for the invisible ball
const invisBallIncrement = .1;

// Scoreboard Properties
const scoreFont = "monospace";
const scoreSize = "900 64px";
const scoreProp = scoreSize + " " + scoreFont;

// Controls
const down = 115;
const up = 119;
const down_cap = down - 32;
const up_cap = up - 32;
const move_rate = 12.5;

//Game Over Properties
const GOBG_Color = "rgba(30,30,30,.5)";

//////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////======== GAME INITIALIZATION ========//////////////////////////////////////

// Get the canvas from html
const canvas = document.getElementById('pong');

// Get the Methods and Properties for drawing on canvas
const context = canvas.getContext("2d");

// Get Background of body of page
var bg = document.getElementsByTagName('body');


// This function is for drawing rectangles
function drawRect(x, y, w, h, color){

    // assign a color for filling
    context.fillStyle = color;

    // draw a black rectangle with its starting point: 
    // x px away from its border horizontally
    // y px away from its border vertically

    // this rectangle will be:
    // w px wide and  h px high
    context.fillRect(x,y,w,h);

}

// This function is for drawing circles
function drawCircle(x, y, r, color){

    // assign a color for filling
    context.fillStyle = color;

    // starts the path for drawing a new element
    context.beginPath();

    // drawing the circle withs its starting point: 
    // 300px across and 350px down 
    // the circle raidus is 100px
    // to makes it a circle, its starting angle has to be 0 deg, and ending angle is 360 deg (Math.PI*2)
    // false direction means the circle will be drawn clockwise
    // true direction means the circle will be draw counter-clockwise 
    context.arc(x, y, r,0,Math.PI*2,false);

    // closePath draws a line to the starting point
    context.closePath();

    // draws according to the path designated above
    context.fill();

}

// This function is for drawing text
function drawText(text, x, y, color){

    // assign color to the text
    context.fillStyle = color;

    // assign font size and font family
    context.font = scoreProp;

    // draws the text with its position in xy coordinates
    context.fillText(text, x, y);
}


// This function is for drawing the net in the middle
function drawNet(){
    for (let i = 0; i <= canvas.height; i+=netSpacing){
        drawRect(net.x,net.y + i,net.width,net.height,net.color);
    }
}

// This function will return a random integer between its minmax
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

// This function will round a number to its declared decimal
function roundNumber(number, decimals) {
    var newnumber = new Number(number+'').toFixed(parseInt(decimals));
    return parseFloat(newnumber); 
}

// Check if player is playing or not
function checkPlayer(){
    if (checkP1 != true){
         l_min_react = [0,10];
         l_max_react = [20,35];
         return false;
    } else {
        l_min_react = [0,0];
        l_max_react = [0,0];
        return true;
    }
}

// Initializing the ball launch side
// true = launch to computer side
// false = launch to player side
let side = defaultSide;

// Creating the user player object
const user = {
    isLeft: true,
    // Setting the initial coord for user
    x: paddleSpace_1,
    y: canvas.height/2 - paddleHeight_1/2,

    // Setting the user paddle height and width
    width: paddleWidth_1,
    height: paddleHeight_1,

    // Setting the paddle color
    color: paddleColor_1,

    // Setting the score
    score: 0,

    // Move Speed
    mSpeed: 0.15,

    // React Time
    min_React : l_max_react,
    max_React : l_min_react,
}

// Creating the computer opponent object
const com = {
    isLeft:false,
    // Setting the initial coord for computer
    x: canvas.width - paddleWidth_2 - paddleSpace_2,
    y: canvas.height/2 - paddleHeight_2/2,

    // Setting the user paddle height and width
    width: paddleWidth_2,
    height: paddleHeight_2,

    // Setting the paddle color
    color: paddleColor_2,
    
    // Setting the score
    score: 0,

    // Move Speed
    mSpeed: 0.15,

    // React Time
    max_React : r_max_react,
    min_React : r_min_react,
}

// Creating the net object
const net = {
    x : canvas.width/2 - netWidth/2,
    y : 0,
    width : netWidth,
    height : netHeight,
    color : netColor,
}

// Creating the ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius: ballRadius,
    speed : ballSpeed,
    velocityX : 0,
    velocityY : 0,
    color: ballColor, 
    increment: ballIncrement,
    isHitbyBot: true,
}

// Creating the Invisible Ball Obj
const invis_ball = {
    x : (canvas.width/2),
    y : (canvas.height/2),
    radius: ballRadius*5/12,
    speed : ballSpeed*invisBallModifier,
    velocityX : 0,
    velocityY : 0,
    color: "transparent", 
    increment: invisBallIncrement,
}


//////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////============ GAME CONTROL ===========//////////////////////////////////////

// Add a toggler for pausing
function togglePause(){
    isPause = !isPause;
}

// Add listener for pausing
window.addEventListener('keydown', function (e) {
    var key = e.keyCode;
    if (key === 27)// p key
    {
        togglePause();
    }
});

checkPlayer();

function movePaddle_key(dir){
    // Dir:
    // -negative is up
    //  positive is down
    //  0 is nothing
    user.y += dir;
}

// This function is for controlling the paddle
function movePaddle_mouse(evt){
    if (isPause == false){
        let rect = canvas.getBoundingClientRect();
        user.y = evt.clientY - rect.top;
    }
}

function getKey(e){
    var key = e.keyCode;
    console.log("GotKEY: " + key);
    // Check if player is wanting to move up and if its valid to do so
    if (((key===down)||(key===down_cap))&&(isPause==false)&&(user.y + user.height < canvas.height)){
        movePaddle_key(move_rate);
    }
    if (((key===up)||(key===up_cap))&&(isPause==false)&&(user.y)){
        movePaddle_key(-(move_rate));
    }
    if (isPause == true){
        movePaddle_key(0);
    }
}


if (checkP1){
    if (isMouse == true){
        window.addEventListener("mousemove",movePaddle_mouse);
    } else {
        window.addEventListener('keypress',getKey);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////======== RUN GAME ========/////////////////////////////////////////////

var target = com.height/2;

function getBallDeg(){

    // Gets random degree with which the ball will launch out of
    var deg = getRandomInt(ballMinDeg,ballMaxDeg);
    
    // Convert the degree into radian
    deg = deg * Math.PI/180;

    // Calculate X and Y velocities
    ball.velocityX = Math.cos(deg) * ballSpeed;
    ball.velocityY = Math.sin(deg) * ballSpeed;
    invis_ball.velocityX = Math.cos(deg) * invis_ball.speed;
    invis_ball.velocityY = Math.sin(deg) * invis_ball.speed;

    // Get ball Side
    if (side == true){
        ball.velocityX = Math.abs(ball.velocityX);
        invis_ball.velocityX = Math.abs(ball.velocityX);
    } else {
        ball.velocityX = - Math.abs(ball.velocityX);
        invis_ball.velocityX = -Math.abs(invis_ball.velocityX);
    }

    // Switch ball direction randomly
    if (getRandomInt(0,2)==0){
        ball.velocityY = -ball.velocityY;
        invis_ball.velocityY = -invis_ball.velocityY;
    }
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = ballSpeed;
    invis_ball.x = ball.x;
    invis_ball.y = ball.y;
    invis_ball.speed = ballSpeed*invisBallModifier;
    getBallDeg();
    getTarget(com);
}

getBallDeg();

// This function is for rendering the canvas
function render(){

    // draw game environment
    drawRect(0,0,canvas.width,canvas.height,bgColor);
    drawNet();
    drawText(user.score, canvas.width/4, canvas.height/5, user.color);
    drawText(com.score,3*canvas.width/4-context.measureText(com.score).width, canvas.height/5, com.color);

    // draw game entities
    drawRect(com.x,com.y,com.width,com.height,com.color); 
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
    drawCircle(invis_ball.x,invis_ball.y,invis_ball.radius,invis_ball.color);

    // draw pause overlay
    if (isPause == true){
        drawRect(0,0,canvas.width,canvas.height,bgColor_Pause);
        drawText(pause_dialogue,canvas.width/2 - context.measureText(pause_dialogue).width/2,canvas.height/2, user.color);
    }
}

// This function is for checking collision between ball and paddle
function paddleCollision(b, p){
    
    // Get the positioning of the player 
    p.top = p.y;
    p.left = p.x;
    p.bottom = p.y + p.height;
    p.right = p.x + p.width;

    // Get the positioning of the ball
    b.top = b.y - b.radius;
    b.left = b.x - b.radius;
    b.bottom = b.y + b.radius;
    b.right = b.x + b.radius;

    // If all is true, it means there is a collision
    return b.right > p.left && b.top < p.bottom && b.left < p.right && b.bottom > p.top;
}

function getTarget(ai){
    // Get random spot of the paddle for aiming
    // 0 is upper half
    // 10 is lower half

    if (user.y > ai.y){
        console.log("--User Lower--");
        target = getRandomInt(ai.height/10,ai.height/2);
    } else {
        console.log("--User Higher");
        target = getRandomInt(ai.height/2,(9*ai.height)/10);
    }
    console.log("Target: " + target);
}

function AI(ai){
    // if AI is on user side, please swap min_reaction and max_reaction
    if (ball.x < canvas.width/2){
        ai.mSpeed = getRandomInt(ai.min_React[0],ai.min_React[1])/100;
 //       console.log("---Left Side---");
 //       console.log(ai.mSpeed);
    } else {
        if ((ball.velocityX < 0)&&(ai.isLeft == false)){
            ai.mSpeed = getRandomInt(ai.min_React[0],ai.min_React[1])/100;
        } else {
            ai.mSpeed = getRandomInt(ai.max_React[0],ai.max_React[1])/100;
        }

        if ((ball.velocityX > 0)&&(ai.isLeft == true)){
            ai.mSpeed = getRandomInt(ai.min_React[0],ai.min_React[1])/100;
        } else {
            ai.mSpeed = getRandomInt(ai.max_React[0],ai.max_React[1])/100;
        }
//        console.log("---Right Side---");
//        console.log(ai.mSpeed);
    }

    ai.y += ((invis_ball.y - (ai.y + target)))*ai.mSpeed;
}

function BorderBounce(entity){
    // Detects if the ball will collide the bottom or top of the screen
    // Reverse its Y velocity if it collides
    if (entity.y + entity.radius > canvas.height){
        entity.y = canvas.height - entity.radius;
        entity.velocityY = -entity.velocityY;
    }

    if (entity.y - entity.radius < 0){
        entity.y = 0 + entity.radius;
        entity.velocityY = -entity.velocityY;
    }

    var ModifierX = 0.45;
    var ModifierY = 0.6;
    if ((entity.x+entity.radius > canvas.width) && (entity.color == invis_ball.color)){
        entity.velocityX *= ModifierX;
        entity.velocityY *= ModifierY;
    }
    
    if ((entity.x-entity.radius < 0) && (entity.color == invis_ball.color)){
        entity.velocityX *= ModifierX;
        entity.velocityY *= ModifierY;
    }
}

function switchBG(){
    if (user.score > com.score){
        bg[0].classList.add('left');
        bg[0].classList.remove('right');
    } else {
        if (user.score < com.score){
            bg[0].classList.add('right');
            bg[0].classList.remove('left');
        }
        else {
            bg[0].classList.remove('left');
            bg[0].classList.remove('right');
        }
    }
}

function checkScore(){
    // Scoring
    if (ball.x - ball.radius < 0){
        // Computer scores, launch ball on left (user) side
        com.score++;
        side = false;
        if (com.score == 10){
            GAMEOVER();
        } else {
            resetBall();
        }
    } else if(ball.x + ball.radius > canvas.width){
        // User scores, launch ball on right (com) side
        user.score++;
        side = true;
        if (user.score == 10){
            GAMEOVER();
        } else {
            resetBall();
        }
    }
}

// Move ball in the canvas
function moveBall(entity){
    // Move entity depending on their velocities
    entity.x += entity.velocityX;
    entity.y += entity.velocityY;
}

// Calculate Ball bounce angle
function paddleBounce(player,entity){
    // See where the ball hits the paddle
    // if collidePoint is:
    // 0: the ball hit the upper half of paddle
    // 1: the ball hit the lower half of paddle
    // 0.5: the ball hit the center of paddle
    let collidePoint = (entity.y - (player.y - player.height/2))/player.height/2;
    //console.log("----------------\ncP: " + collidePoint);

    // Check ball direction
    // if ball is on player side --> return 1
    // if ball is on computer side-> return -1
    let direction = (entity.x < canvas.width/2) ? 1 : -1;

    // Get angle in radian from collide point
    let angleRad = collidePoint * CollideAngle;

    if (collidePoint < 0.5){
        angleRad = - angleRad;
    }
        
    //  Bounces the ball
    entity.velocityX = direction * entity.speed * Math.cos(angleRad);
    entity.velocityY = entity.speed * Math.sin(angleRad);
}

// Speedup ball after every paddle hit
function speedUp(entity){
    entity.speed += entity.increment;
    entity.speed = roundNumber(entity.speed,2);
}

// This function is for movements, collision detection, score, etc
function update(){
    paddleCollision(ball, user);

    // Move ball
    moveBall(ball);
    moveBall(invis_ball);

    // Computer AI
//    console.log("======COM======");
    AI(com);
//    console.log("======USER======");
    if (checkP1 == false){
        AI(user);
    }

    // Bounce ball from top and bottom border
    BorderBounce(ball);
    BorderBounce(invis_ball);

    // Switch BG Color
    switchBG();

    // See if the ball is on the user side or the computer side
    let player = (ball.x < canvas.width / 2) ? user : com;

    // Check for collision
    if (paddleCollision(ball,player)){
        if (player.isLeft == true){
            ball.isHitbyBot = false;
        } else {
            ball.isHitbyBot = true;
            getTarget(player);
        }
        paddleBounce(player,ball);
        invis_ball.x = ball.x;
        invis_ball.y = ball.y;
        paddleBounce(player,invis_ball);

        // Increment ball speed
        speedUp(ball);
        speedUp(invis_ball);
        //console.log("Ball-Speed: " + ball.speed);
    }

    checkScore();
}

// This function is for running the game
function game(){
    if (isPause == false){
        update();
    }
    render();
}

var game_state = setInterval(game,1000/framePerSecond);

function gameover_overlay(){
    render();
    drawRect(0,0,canvas.width,canvas.height,GOBG_Color);
    drawText(dialogue,canvas.width/2 - context.measureText(dialogue).width/2,canvas.height/2, user.color);
}

var dialogue;

function getGameOverScreen(){
    bg[0].classList.remove('left');
    bg[0].classList.remove('right');
    dialogue = "COMPUTER WON";
    if (user.score > com.score){
        playerWon = true;
        bg[0].classList.add('left-win');
        dialogue = "PLAYER WON";
    } else {
        playerWon = false;
        bg[0].classList.add('right-win');
    }
}

function GAMEOVER(){
    clearInterval(game_state);
    getGameOverScreen();
    setInterval(gameover_overlay,1000/framePerSecond);
}


