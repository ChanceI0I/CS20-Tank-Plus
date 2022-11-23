function setup() {
    createCanvas(500,500);
}

let ball1 = {
    r : 50,
    x : 30,
    y : 30,
    xA : 1,
    yA : 1,
    a : 0,
}

let g = 0.01;

function draw() {
    background(220);
    
    
    ellipse(ball1.x,ball1.y,ball1.r,ball1.r)

    ball1.y += ball1.yA;
    ball1.yA = ball1.yA + g;

    if (ball1.y + ball1.r >= height){
        ball1.yA = -0.95 * ball1.yA
    }
    
}