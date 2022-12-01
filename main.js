const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// const dynamicObj = [];

const box1 = {
    x : 100, 
    y : 100,
    w : 20,
    h : 10,
    a : 1,
    c : `0,198,0`,
    s : 1,

    movement : '',
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
            object.y -= object.s;
            break
        case 'left':
            object.x -= object.s;
            break
        case 'down':
            object.y += object.s;
            break
        case 'right':
            object.x += object.s;
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

function solidTarget(object){
    let targetHitBox_X = [];
    let targetHitBox_Y = [];
    
    targetHitBox_X.push(object.x, object.x + object.w);
    targetHitBox_Y.push(object.y, object.y + object.h);

    return [targetHitBox_X, targetHitBox_Y]
}

function getHitBox(object){
    //  //[[ax,ay], [bx,by], [cx,cy], [dx,dy]]
    // let A = [object.x, object.y];
    // let B = [object.x + object.w, object.y];
    // let C = [object.x, object.y + object.h];
    // let D = [object.x + object.w, object.y + object.h];
    // let border = {'A': A, 'B': B, 'C' : C, 'D' : D}

    // [[obj.x, obj.w] [obj.y, obj.h]]

    let X = [], Y = [];
    for(let i = object.x; i <= object.x + object.w; i++){
        X.push(i)
    }

    for(let j = object.y; j <= object.y + object.h; j++){
        Y.push(j)
    }

    let border = [X, Y]
    return border
}


function showInfo(x,y,info){
    
    ctx.fillText(String(info), x, y)
}


let world = []
world.push(solidTarget(Obstacle1))
world.push(solidTarget(Obstacle2))



function drawSaparatingAxes(object){
    //ctx.fillRect(100, 5, 50, 5); y == 5 h == 5

    //X
    ctx.fillStyle = `rgb(${object.c}, 0.5)`;
    ctx.fillRect(object.x, 5, object.w, 5);

    //Y
    ctx.fillStyle = `rgb(${object.c}, 0.5)`;
    ctx.fillRect(390, object.y, 5, object.h);
}




// const array1= [1,2,3];
// const array2= [4,5,6,7,8,9,33,2] 
      

function findCommon(arr1, arr2) {
    function check(value){
        if(arr2.includes(value)){
            return value
        }
    }
    return arr1.some(check)
}
// console.log(findCommon(array1, array2))



console.log(getHitBox(box1))


function draw(){
    clearCanvas()

    drawSaparatingAxes(box1);
    drawSaparatingAxes(Obstacle1);
    drawSaparatingAxes(Obstacle2);
    
    // collisionDetect(box1, world)
    collisionDetect(box1, Obstacle1)

    drawRect(Obstacle1);
    drawRect(Obstacle2);
    playerMovement(box1);
    
    
    // showInfo(10,10,`Player --- ${getHitBox(box1).B}`)
    // showInfo(10,20,`Obs  1 --- ${getHitBox(Obstacle1).A}`)
    // showInfo(10,30,`Obs  2 --- ${getHitBox(Obstacle2)}`)


    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)