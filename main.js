const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// const obj = [];
// const dynamicObj = [];

const box1 = {
    x : 100, 
    y : 100,
    w : 20,
    h : 10,
    c : "black",
    s : 1,
    // type : "dynamic",

    movement : '',
}

/** Clear Whole Canvas */
function clearCanvas(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
    // console.log("CLEAR")
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

document.addEventListener('keypress', function(event){
    if(event.key == 'w'){
        // box1.y -= box1.s;
        box1.movement = 'up';
    } else if (event.key == 'a'){
        // box1.x -= box1.s;
        box1.movement = 'left';
    } else if (event.key == 's'){
        // box1.y += box1.s;
        box1.movement = 'down';
    } else if (event.key == 'd'){
        // box1.x += box1.s;
        box1.movement = 'right';
    } else {
        // console.log("no key pressed")
        // box1.movement = '';
    }
})

document.addEventListener('keyup', function(){
    console.log('no key')
    box1.movement = '';
})


function playerMovement(object) {
    
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

function drawObj(obj){
    ctx.fillRect(obj.x,obj.y,obj.w,obj.h);
    ctx.fillStyle = obj.c;
}

function draw(){
    // console.log("draw")
    clearCanvas()

    playerMovement(box1);
    drawObj(box1);
    
    // box1.x += 1

    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)