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
    let ObjBorder = getHitBox(object);
    let TargetBorder = getHitBox(target);
    let WASD = [true, true, true, true];
    
    for(let x in ObjBorder){
        // console.log(ObjBorder[x])
    }
}

function solidTarget(object_ST){
    let targetHitBox_X = [];
    let targetHitBox_Y = [];
    
    targetHitBox_X.push(object_ST.x, object_ST.x + object_ST.w);
    targetHitBox_Y.push(object_ST.y, object_ST.y + object_ST.h);

    return [targetHitBox_X, targetHitBox_Y]
}

function getHitBox(object){
     //[[ax,ay], [bx,by], [cx,cy], [dx,dy]]
    let A = [object.x, object.y];
    let B = [object.x + object.w, object.y];
    let C = [object.x, object.y + object.h];
    let D = [object.x + object.w, object.y + object.h];
    let border = {'A': A, 'B': B, 'C' : C, 'D' : D}
    return border
}

function showInfo(x,y,info){
    
    ctx.fillText(String(info), x, y)
}

let world = []
world.push(solidTarget(Obstacle1))
world.push(solidTarget(Obstacle2))






const array1= [1,2,3];
const array2= [4,5,6,7,8,9,33,2] 
      

function findCommon(arr1, arr2) {
    function check(value){
        if(arr2.includes(value)){
            return value
        }
    }
    // return arr1.some(item => arr2.includes(item))
    return arr1.some(check)
}
console.log(findCommon(array1, array2))






function draw(){
    clearCanvas()

    // collisionDetect(box1, world)
    collisionDetect(box1, Obstacle1)

    drawRect(Obstacle1);
    drawRect(Obstacle2);
    playerMovement(box1);
    
    
    showInfo(10,10,`Player --- ${getHitBox(box1).B}`)
    showInfo(10,20,`Obs  1 --- ${getHitBox(Obstacle1).A}`)
    showInfo(10,30,`Obs  2 --- ${getHitBox(Obstacle2)}`)


    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)