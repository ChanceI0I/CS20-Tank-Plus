const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// const dynamicObj = [];

const box1 = {
    x : 100, 
    y : 100,
    w : 20,
    h : 10,
    a : 1,  // Alpha
    c : `0,198,0`,  // RGB
    s : 1,  // Speed 

    movement : '',
    moveable : {up : true, down : true, left : true, right: true},
}

const Obstacle1 = {
    x : 200, 
    y : 200,
    w : 50,
    h : 30,
    a : 1,
    c : `198,0,0`,
}

const Obstacle2 = {
    x : 20, 
    y : 350,
    w : 30,
    h : 40,
    a : 1,
    c : `198,0,0`,
}

const Obstacle3 = {
    x : 50, 
    y : 150,
    w : 120,
    h : 40,
    a : 1,
    c : `198,0,0`,
}



/** Clear Whole Canvas */
function clearCanvas(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
}



function addMovingEvent(object){

    document.addEventListener('keypress', function(event){
        if(event.key == 'w'){
            object.movement = 'up';
        } else if (event.key == 'a'){
            object.movement = 'left';
        } else if (event.key == 's'){
            object.movement = 'down';
        } else if (event.key == 'd'){
            object.movement = 'right';
        }
    })
    
    document.addEventListener('keyup', function(){
        object.movement = '';
    })

}

function drawRect(object){
    ctx.fillStyle = `rgb(${object.c}, ${object.a})`;
    ctx.fillRect(object.x,object.y,object.w,object.h);
    
}



function playerMovement(object) {

    addMovingEvent(object);
    drawRect(object);

    switch(object.movement){
        case 'up':
            if(object.moveable.up){object.y -= object.s}
            break
        case 'left':
            if(object.moveable.left){object.x -= object.s}
            break
        case 'down':
            if(object.moveable.down){object.y += object.s}
            break
        case 'right':
            if(object.moveable.right)(object.x += object.s)
            break
    }
}

// Change needed!!!!!  can't slide back to the edge of any obstacles

/**
 * @param {object} object Moving object
 * @param {Array} target Obstacles array
 */
function collisionDetect(object, obstacle){


    let target = [];
    for(let element of obstacle){
        element = getHitBox(element);
        target.push(element);
    }

    let object_HB = getHitBox(object)

    object.moveable = {up : true, down : true, left : true, right: true}
    // const moveable = {up : true, down : true, left : true, right: true}; 

    function GetLast(array){
        let len = array.length;
        return array[len-1]
    }

    for(let obstacle of target){
        if(findCommon(object_HB.y, obstacle.y)){
            // console.log("Y axis contact")

            if(GetLast(object_HB.x) === obstacle.x[0]){
                // console.log("left contact")
                object.moveable.right = false;
            } else if(object_HB.x[0] === GetLast(obstacle.x)){
                // console.log("Right contact")
                object.moveable.left = false;
            }
        } 
        
        if(findCommon(object_HB.x, obstacle.x)){
            // console.log("X axis contact")

            if(GetLast(object_HB.y) === obstacle.y[0]){
                // console.log("Top contact")
                object.moveable.down = false;
            } else if(object_HB.y[0] === GetLast(obstacle.y)){
                // console.log("Bottom contact")
                object.moveable.up = false;
            }
        }
    }

    return
}


function getHitBox(object){

    let X = [], Y = [];
    for(let i = object.x; i <= object.x + object.w; i++){
        X.push(i)
    }

    for(let j = object.y; j <= object.y + object.h; j++){
        Y.push(j)
    }

    // let border = [X, Y]
    // return border
    return {x : X, y : Y}
}


function showInfo(x,y,info){
    
    ctx.fillText(String(info), x, y)
}



let world = []
world.push(Obstacle1)
world.push(Obstacle2)
world.push(Obstacle3)



function drawSaparatingAxes(object){
    //ctx.fillRect(100, 5, 50, 5); y == 5 h == 5

    //X
    ctx.fillStyle = `rgb(${object.c}, 0.5)`;
    ctx.fillRect(object.x, 5, object.w, 5);

    //Y
    ctx.fillStyle = `rgb(${object.c}, 0.5)`;
    ctx.fillRect(390, object.y, 5, object.h);
}



function findCommon(arr1, arr2) {
    function check(value){
        if(arr2.includes(value)){
            return value
        }
    }
    return arr1.some(check)
}


function draw(){
    clearCanvas()

    // drawSaparatingAxes(box1);
    // drawSaparatingAxes(Obstacle1);
    // drawSaparatingAxes(Obstacle2);
    
    collisionDetect(box1, world)

    drawRect(Obstacle1);
    drawRect(Obstacle2);
    drawRect(Obstacle3);
    playerMovement(box1);
    
    

    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)