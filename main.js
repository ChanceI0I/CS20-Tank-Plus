const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// const dynamicObj = [];

const box1 = {
    x : 100, 
    y : 100,
    w : 20,
    h : 10,
    c : "green",
    s : 1,

    movement : '',
}

const Obstacle1 = {
    x : 200, 
    y : 200,
    w : 50,
    h : 30,
    c : "red",
}

const Obstacle2 = {
    x : 20, 
    y : 350,
    w : 30,
    h : 40,
    c : "red",
}

/** Clear Whole Canvas */
function clearCanvas(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
}

// addEventListener('keypress', function(event){
//     switch(event.key){
//         case 'w':
//             box1.y -= box1.s;
//             console.log('up');
//             break
//         case 'a':
//             box1.x -= box1.s;
//             console.log('left');
//             break
//         case 's':
//             box1.y += box1.s;
//             console.log('down');
//             break
//         case 'd':
//             box1.x += box1.s;
//             console.log('right');
//             break
//     }
// })



function addMovingEvent(object_ME){

    document.addEventListener('keypress', function(event){
        if(event.key == 'w'){
            object_ME.movement = 'up';
        } else if (event.key == 'a'){
            object_ME.movement = 'left';
        } else if (event.key == 's'){
            object_ME.movement = 'down';
        } else if (event.key == 'd'){
            object_ME.movement = 'right';
        }
    })
    
    document.addEventListener('keyup', function(){
        object_ME.movement = '';
    })

}

function drawRect(obj_DR){
    ctx.fillStyle = obj_DR.c;
    ctx.fillRect(obj_DR.x,obj_DR.y,obj_DR.w,obj_DR.h);
    
}



function playerMovement(object_PM) {

    addMovingEvent(object_PM);
    drawRect(object_PM);

    switch(object_PM.movement){
        case 'up':
            object_PM.y -= object_PM.s;
            break
        case 'left':
            object_PM.x -= object_PM.s;
            break
        case 'down':
            object_PM.y += object_PM.s;
            break
        case 'right':
            object_PM.x += object_PM.s;
            break
    }
}



function collisionDetect(object, target){
    let objectX = object.x + object.w
    console.log("checking")
    let WASD = [true, true, true, true];
    for(let i of target){
        console.log(object.x, i[0][0])
        switch(object){
            
            case (object.x >= i[0][0]) && ((object.y >= i[1][0]) && (object.y <= i[1][1])):
                console.log("NO MOVING RIGHT!!!")
                break
            case (object.x >= i[0][0]):
                console.log("object.x >= i[0][0]")
        }
    }
}

function solidTarget(object_ST){
    let targetHitBox_X = [];
    let targetHitBox_Y = [];
    
    targetHitBox_X.push(object_ST.x, object_ST.x + object_ST.w);
    targetHitBox_Y.push(object_ST.y, object_ST.y + object_ST.h);

    return [targetHitBox_X, targetHitBox_Y]
}

let world = []
world.push(solidTarget(Obstacle1))
world.push(solidTarget(Obstacle2))














function draw(){
    clearCanvas()

    collisionDetect(box1, world)

    drawRect(Obstacle1);
    drawRect(Obstacle2);
    playerMovement(box1);
    

    





    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)