const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const bulletList = []

const box1 = {
    x : 100, 
    y : 100,
    w : 30,
    h : 20,
    a : 1,  // Alpha
    c : `0,198,0`,  // RGB

    // s : 1,  // Speed !!! Have to be 1
    // movement : '',
    // moveable : {up : true, down : true, left : true, right: true},
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

const border_up = {
    x : 0, 
    y : 0,
    w : canvas.width,
    h : 5,
    a : 1,
    c : `41, 99, 194`,
}

const border_down = {
    x : 0, 
    y : canvas.height - 5,
    w : canvas.width,
    h : 5,
    a : 1,
    c : `41, 99, 194`,
}

const border_left = {
    x : 0, 
    y : 0,
    w : 5,
    h : canvas.height,
    a : 1,
    c : `41, 99, 194`,
}

const border_right = {
    x : canvas.width - 5, 
    y : 0,
    w : 5,
    h : canvas.height,
    a : 1,
    c : `41, 99, 194`,
}


const player = {
    
    entity : box1,
    
    s : 1,  // Speed !!! Have to be 1
    movement : '',
    moveable : {up : true, down : true, left : true, right: true},
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
    
    document.addEventListener('keyup', function(event){
        if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
            object.movement = '';
        }
    })

}

function drawRect(object){
    ctx.fillStyle = `rgb(${object.c}, ${object.a})`;
    ctx.fillRect(object.x,object.y,object.w,object.h);
    
}



function playerMovement(object) {
    let entity = object.entity;
    collisionDetect(object, world)
    addMovingEvent(object);
    drawRect(object.entity);

    if(object.movement == 'up'){
        if(object.moveable.up){entity.y -= object.s}
    }else if(object.movement == 'left'){
        if(object.moveable.left){entity.x -= object.s}
    }else if(object.movement == 'down'){
        if(object.moveable.down){entity.y += object.s}
    }else if(object.movement == 'right'){
        if(object.moveable.right)(entity.x += object.s)
    }
    
}


/**
 * @param {object} object Moving object
 * @param {Array} target Obstacles object array
 */
function collisionDetect(object, obstacle_or){


    let target = [];
    for(let element of obstacle_or){
        element = getHitBox(element);
        target.push(element);
    }

    let object_HB = getHitBox(object.entity)

    object.moveable = {up : true, down : true, left : true, right: true}
    // const moveable = {up : true, down : true, left : true, right: true}; 

    function GetLast(array){
        let len = array.length;
        return array[len-1]
    }

    for(let obstacle of target){
        if(findCommon(object_HB.y, obstacle.y) && GetLast(object_HB.y) != obstacle.y[0] && GetLast(obstacle.y) != object_HB.y[0]){
            // console.log("Y axis contact") // not in corner

            if(GetLast(object_HB.x) >= obstacle.x[0] && GetLast(object_HB.x) <= GetLast(obstacle.x)){
                // console.log("left contact")
                object.moveable.right = false;
            } else if(object_HB.x[0] <= GetLast(obstacle.x) && object_HB.x[0] >= obstacle.x[0]){
                // console.log("Right contact")
                object.moveable.left = false;
            }
        } 
        
        if(findCommon(object_HB.x, obstacle.x) && GetLast(object_HB.x) != obstacle.x[0] && GetLast(obstacle.x) != object_HB.x[0]){
            // console.log("X axis contact") // not in corner

            if(GetLast(object_HB.y) >= obstacle.y[0] && GetLast(object_HB.y) <= GetLast(obstacle.y)){
                // console.log("Top contact")
                object.moveable.down = false;
            } else if(object_HB.y[0] <= GetLast(obstacle.y) && object_HB.y[0] >= obstacle.y[0]){
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
        X.push(Math.round(i))
    }

    for(let j = object.y; j <= object.y + object.h; j++){
        Y.push(Math.round(j))
    }

    // let border = [X, Y]
    // return border
    return {x : X, y : Y}
}


function showInfo(x,y,info){
    ctx.fillStyle = "black"
    ctx.fillText(String(info), x, y)
}



let world = []
world.push(Obstacle1)
world.push(Obstacle2)
world.push(Obstacle3)

world.push(border_up)
world.push(border_down)
world.push(border_left)
world.push(border_right)



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

function createBullet(Orgin, list){
    const bulletObj = {
        x : Orgin.x + (Orgin.w/2),
        y : Orgin.y + (Orgin.h/2),
        w : 10,
        h : 5,
        s : 2,
        a : 1,
        c : `0,0,0`,
        d : Orgin.movement, // d for direction
    }
    list.push(bulletObj)
}

function bulletUpdate(BulletList){
    for(let ele of BulletList){
        switch(ele.d){
            case ("down" || "up"):
                ele.y += ele.s
                // [ele.x, ele.y] = [ele.y, ele.x]
                break
            case ("left" || "right"):
                ele.x += ele.s
                break
        }
        console.log(ele)
        drawRect(ele);
    }
}

function playerFire(Orgin){
    document.addEventListener("repeat", function(event){
        if(event.key === 'j'){
            console.log("!!")
        }
    })
}

const bullet = {
    x : 115,
    y : 110,
    w : 10,
    h : 5,
    s : 2,
    a : 1,
    c : `0,0,0`,
    d : "left", // d for direction
}

// createBullet(box1, bulletList)

function draw(){
    
    clearCanvas()
    showInfo(20, 20, "This is Player-Entity Branch")

    // drawSaparatingAxes(box1);

    for(let x of world){
        // drawSaparatingAxes(x)
        drawRect(x)
    }
    
    
    // playerFire(box1)
    playerMovement(player);
    // bulletUpdate(bulletList)
    
    
    
    

    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)

