var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var Brick = {
    offsetx: 25,
    offsety: 25,
    margin: 25,
    width: 68,
    height: 15,
    row: 3,
    col: 5

}

var BrickList = []
for(var i = 0; i<Brick.row; i ++){
    for(var j = 0; j < Brick.col; j ++){
        BrickList.push({
           x: Brick.offsetx + j * (Brick.width + Brick.margin),
           y: Brick.offsety + i * (Brick.height + Brick.margin),
           isBroken: false
        })
    }
}



var ball = {
    x: 20,
    y: 20,
    dx: 5, 
    dy: 2,
    radius: 20
}
var paddle = {
    width: 70,
    height: 10,
    x: 0,
    y: canvas.height-10,
    speed: 15,

    isMovingLeft: false,
    isMovingRight: false,
};

var isGameOver = false;
var isGameWin =  false;
var Score = 0;
var MaxScore = Brick.col * Brick.row
document.addEventListener('keyup',function(event){
    console.log('keyup', event);

    if(event.keyCode == 37){
        paddle.isMovingLeft = false;
    } else if (event.keyCode == 39) {
        paddle.isMovingRight= false;
    }

});

document.addEventListener('keydown',function(event){
    console.log('keydown', event);

    if(event.keyCode == 37){
        paddle.isMovingLeft = true;
    } else if (event.keyCode == 39) {
        paddle.isMovingRight= true;
    }

});

function drawPaddle(){
    context.beginPath();
    context.rect( paddle.x, paddle.y, paddle.width, paddle.height,);
    context.fillStyle='black';
    context.fill();
    context.closePath();

}

function drawBall(){
context.beginPath();
context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true );
context.fillStyle='black';
context.fill();
context.closePath();
}

// 2 * offset + 5* margin + 4* margin = 490
// offset =  margin = 25
// with = 68
// row 3
// col 5

function drawBrick(){
    BrickList.forEach( function(b)  {
        if(!b.isBroken){
            context.beginPath();
            context.rect( b.x, b.y, Brick.width, Brick.height
            )
            context.fill();
            context.closePath(); }
});


}

function handleballwithbounds() {
    if(ball.x<ball.radius || ball.x >canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if(ball.y<ball.radius)  {
        ball.dy = -ball.dy;
    }
}

function handleballwithpaddle(){
    if (ball.x + ball.radius >= paddle.x && ball.x+ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - paddle.height){
            ball.dy = -ball.dy;
        }

}

function handleballwithbrick(){
    BrickList.forEach(function(b){
        if(!b.isBroken){
            if(ball.x >= b.x && ball.x <= b.x + Brick.width &&
                ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + Brick.height){
                ball.dy = -ball.dy;
                b.isBroken = true;
                Score += 1;
                if(Score >= MaxScore ){
                    isGameOver = true;
                    isGameWin = true
                }
            }
        }
    })
}

function updateball() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function updatePaddlePosision(){
    if(paddle.isMovingLeft){
        paddle.x -= paddle.speed;
    } else if (paddle.isMovingRight){
        paddle.x += paddle.speed;
    }

    if(paddle.x < 0) {
        paddle.x = 0;
    }else if(paddle.x > canvas.width - paddle.width){
        paddle.x = canvas.width - paddle.width  
    }
}

function checkGameOver() {
    if(ball.y > canvas.height - ball.radius){
        isGameOver = true;
    }
}

function handleGameOver(){
        if(isGameWin){
            alert('YOU WIN');
        } else {
            alert('GAME OVER');
        }
        
}

function draw(){
    if(!isGameOver){
        context.clearRect(0, 0, canvas.width,canvas.height);
        drawBall();
        drawPaddle();
        drawBrick();

        updatePaddlePosision()

        handleballwithbounds();
        handleballwithpaddle();
        handleballwithbrick();
        updateball();

        checkGameOver()

        requestAnimationFrame(draw);
    } else{
        handleGameOver()
    }
}

draw()



