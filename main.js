const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const bullet = []
const Entity = []
const Particles = []

const GameSetting = {
    NumberOfObstacles : 7,
    NumberOfEnemy : 2,
    MaxEnemy : 5,
    EnemyIncreaseRate : 1,
    FramePerSecond : 160,
}

const player = {
    id: 'box1',
    x : 100, 
    y : 100, 
    w : 20, //width
    h : 20, //height
    a : 1,  // Alpha
    c : `0,198,0`,  // RGB
    s : 1,  // Speed !!! Have to be 1
    health : 4,

    r : 10, //reload time
    t : 0, //local time
    facing : 'right',
    movement : '',
    moveable : {up : true, down : true, left : true, right: true},
    score : 0,
}

// const Obstacle1 = {
//     id: 'Obstacle1',
//     x : 200, 
//     y : 200,
//     w : 50,
//     h : 30,
//     a : 1,
//     c : `198,0,0`,
// }

// const Obstacle2 = {
//     id: 'Obstacle2',
//     x : 20, 
//     y : 350,
//     w : 30,
//     h : 40,
//     a : 1,
//     c : `198,0,0`,
// }

// const Obstacle3 = {
//     id: 'Obstacle3',
//     x : 50, 
//     y : 150,
//     w : 120,
//     h : 40,
//     a : 1,
//     c : `198,0,0`,
// }

const border_up = {
    id : 'border_up',
    x : 0, 
    y : 0,
    w : canvas.width,
    h : 5,
    a : 1,
    c : `41, 99, 194`,
}

const border_down = {
    id : 'border_down',
    x : 0, 
    y : canvas.height - 5,
    w : canvas.width,
    h : 5,
    a : 1,
    c : `41, 99, 194`,
}

const border_left = {
    id : 'border_left',
    x : 0, 
    y : 0,
    w : 5,
    h : canvas.height,
    a : 1,
    c : `41, 99, 194`,
}

const border_right = {
    id : 'border_right',
    x : canvas.width - 5, 
    y : 0,
    w : 5,
    h : canvas.height,
    a : 1,
    c : `41, 99, 194`,
}



/** Clear Whole Canvas */
function clearCanvas(){
    ctx.beginPath()
    ctx.clearRect(0,0,canvas.width, canvas.height)
}



// function addMovingEvent(object){

//     document.addEventListener('keypress', function(event){
        
//         if(event.key == 'w'){
//             object.movement = 'up';
//         } else if (event.key == 'a'){
//             object.movement = 'left';
//         } else if (event.key == 's'){
//             object.movement = 'down';
//         } else if (event.key == 'd'){
//             object.movement = 'right';
//         }
//     })
    
//     document.addEventListener('keyup', function(event){
//         if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
//             object.movement = '';
//         }
//     })

    
// }

document.addEventListener('keypress', function(event){
        
    if(event.key == 'w'){
        player.movement = 'up';
    } else if (event.key == 'a'){
        player.movement = 'left';
    } else if (event.key == 's'){
        player.movement = 'down';
    } else if (event.key == 'd'){
        player.movement = 'right';
    }
})

document.addEventListener('keyup', function(event){
    if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
        player.movement = '';
    }
})





function drawRect(object){
    ctx.beginPath()
    ctx.fillStyle = `rgb(${object.c}, ${object.a})`;
    ctx.fillRect(object.x,object.y,object.w,object.h);
    
}

// function drawCircle(object){
//     ctx.beginPath()
//     ctx.fillStyle = `rgb(${object.c}, ${object.a})`;
//     ctx.arc(object.x, object.y, object.r, 0, 2*Math.PI)
//     ctx.fill()
// }


function Movement(object) {

    const Allobstacle = world.concat(Entity)
    collisionDetect(object, Allobstacle)
    // collisionDetect(object, Entity)
    
    drawRect(object);

    if(object.movement == 'up'){
        if(object.moveable.up){object.y -= object.s}
    }else if(object.movement == 'left'){
        if(object.moveable.left){object.x -= object.s}
    }else if(object.movement == 'down'){
        if(object.moveable.down){object.y += object.s}
    }else if(object.movement == 'right'){
        if(object.moveable.right)(object.x += object.s)
    }

    if(object.movement != ''){object.facing = object.movement}
}

function findCommon(arr1, arr2) {
    function check(value){
        if(arr2.includes(value)){
            return value
        }
    }
    return arr1.some(check)
}

function GetLast(array){
    let len = array.length;
    return array[len-1]
}

/**
 * @param {object} object1
 * @param {object} object2
 */
function collision(object1, object2){
    let object_HB = getHitBox(object1)
    let target = getHitBox(object2)
    
    
    if(findCommon(object_HB.y, target.y) && findCommon(object_HB.x, target.x)){
        return true
    }

    return false
}

/**
 * @param {object} object Moving object
 * @param {Array} obstacle_or Obstacles object array
 */
function collisionDetect(object, obstacle_or){

    let target = [];
    for(let element of obstacle_or){
        element = getHitBox(element);
        target.push(element);
    }

    let object_HB = getHitBox(object)

    object.moveable = {up : true, down : true, left : true, right: true}

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
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.fillText(String(info), x, y)
}

function GenerateWorld(ObstacleNum){

    function GenerateObs(n){
        const obstacle = {
            id: `Obstacle${n}`,
            x : Math.round(Math.random()*350), 
            y : Math.round(Math.random()*350),
            w : Math.round(Math.random()*70) + 30,
            h : Math.round(Math.random()*70) + 30,
            a : 1,
            c : `41, 99, 194`,
        }

        if(collision(player, obstacle)){
            obstacle.x = Math.round(Math.random()*350);
            obstacle.y = Math.round(Math.random()*350);
        }

        return obstacle
    }

    for(let i = 0; i < ObstacleNum; i+=1){
        world.push(GenerateObs(i))
    }
}


const world = []

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

function drawDirection(object){

    ctx.beginPath();
    ctx.moveTo((object.x + object.w/2), (object.y + object.h/2))
    switch(object.facing){
        case "up":
            ctx.lineTo((object.x + object.w/2), (object.y + object.h/2) - 50)
            break
        case "down":
            ctx.lineTo((object.x + object.w/2), (object.y + object.h/2) + 50)
            break
        case "left":
            ctx.lineTo((object.x + object.w/2) - 50, (object.y + object.h/2))
            break
        case "right":
            ctx.lineTo((object.x + object.w/2) + 50, (object.y + object.h/2))
            break
    }
    ctx.stroke()
}

function createBullet(Orgin, list){
    const bulletObj = {
        x : Orgin.x + (Orgin.w/2) - 2.5,
        y : Orgin.y + (Orgin.h/2) - 2.5,
        w : 5,
        h : 5,
        s : 3,
        a : 1,
        c : `0,0,0`,
        d : Orgin.facing, // d for direction
        damage : 2,
    }
    list.push(bulletObj)
}

function bulletUpdate(BulletList, obstacle1, obstacle2){
    for(let i = 0; i <= BulletList.length - 1; i++){

        switch(BulletList[i].d){
            case "down":
                BulletList[i].y += BulletList[i].s
                break
            case "up":
                BulletList[i].y -= BulletList[i].s
                break
            case "left":
                BulletList[i].x -= BulletList[i].s
                break
            case "right":
                BulletList[i].x += BulletList[i].s
                break
        }

        drawRect(BulletList[i]);
    }
}

function playerFire(Orgin){
    document.addEventListener("keydown", function(event){
        if(event.key === 'j' && Orgin.t <= 0){
            Orgin.t = Orgin.r

            createBullet(Orgin, bullet)
        }
    })

    if(Orgin.t > 0){
        Orgin.t -= 1
    }
    
}

// function createDummy(x, y ,health, movement){
//     let dummy = {
//         x : x,
//         y : y,
//         w : 20,
//         h : 20,
//         // vx : vx,
//         // vy : vy,
//         health : health, 
//         c : "0,0,250",
//         a : "1",

//         s : 1,
//         facing : '',
//         movement : '',
//         moveable : {up : true, down : true, left : true, right: true},
//     }

//     Entity.push(dummy)
// }

function createEnemy(EnemyList){
    let direction = EnemyDrection()
    const enemy = {
        x : Math.floor(Math.random()*400),
        y : Math.floor(Math.random()*400),
        w : 25,
        h : 25,
        c : `200,0,0`,  
        s : 1, 
        a : 1,

        r : 10,
        t : 0,
        wt : Math.round(Math.random()*300),
        health : Math.round(Math.random()*20) + 5,
        facing : direction,
        movement : direction,
        moveable : {up : true, down : true, left : true, right: true},

    }

    function CheckOverlap(){
        for(let o of world){
            if(collision(enemy, o)){
                // console.log(enemy.x,enemy.y)
                enemy.x = Math.floor(Math.random()*400);
                enemy.y = Math.floor(Math.random()*400);
                // console.log(enemy.x,enemy.y)
                CheckOverlap()
                break
                
            }
        }
    }

    CheckOverlap()

    // console.log(enemy.x, enemy.y, direction)
    EnemyList.push(enemy)
}

function EnemyDrection(){
    let Random = Math.random()
    let direction = ""

    if(Random < 0.25){
        direction = "left"
    }else if(Random < 0.5){
        direction = "right"
    }else if(Random < 0.75){
        direction = "up"
    }else if(Random < 1){
        direction = "down"
    }

    return direction
}

// function EnemyFire(Enemy){ //Future Update
// }


function hitAnimation(Entity, scale=2){
    
    function scaleUp(Entity){
        Entity.w += 1;
        Entity.x -= 0.5;
        Entity.h += 1;
        Entity.y -= 0.5;
    }

    function scaleDown(Entity){
        Entity.w -= 1;
        Entity.x += 0.5;
        Entity.h -= 1;
        Entity.y += 0.5;
    }

    let count = 0

    function animation(){
        // console.log("hit")
        if(count < scale){
            scaleUp(Entity);
        } else if(count >= scale){
            scaleDown(Entity);
        }
        count += 0.5

        if(count < scale*2){requestAnimationFrame(animation)}
    }
    requestAnimationFrame(animation)
}

function CreateParticles(x,y){
    
    // const Particles = []

    function Trandom(){
        if(Math.random() < 0.5){
            return -1*Math.random()
        }else{
            return Math.random()
        }
    }
    
    function createParticles(){
        const particle = {
            x : x,
            y : y,
            vx : Trandom() * 0.3,
            vy : Trandom() * 0.3,
            // r : Math.random() * 2,
            c : `${Math.random()*100},${Math.random()*100},${Math.random()*255}`,
            a : 0.7,
            count : 0,

            w : Math.random()*10,
            h : Math.random()*10,
        }
        return particle
    }

    
    for(let i = 0; i<5; i+=1){
        Particles.push(createParticles())
    }
    
}

function particleUpdate(particles){
    for(let i = 0; i < particles.length; i+=1){
        if(particles[i].count < 50){
            particles[i].x += particles[i].vx
            particles[i].y += particles[i].vy
            particles[i].a -= 0.01
            // drawCircle(particles[i])
            drawRect(particles[i])
            particles[i].count += 1
        } else {
            particles.splice(i,i+1)
        }
    }
}

function EntityUpdate(){
    // const Obs = world.concat(Entity)
    // const Obs = []
    // Obs.push(player)

    for(let e = 0; e<Entity.length; e+=1){
        let en = Entity.slice(0,e).concat(world)
        let Obs = en.concat(Entity.slice(e+1, Entity.length))
        Obs.push(player)
        

        for(let o of Obs){
            if(collision(Entity[e],o)){
                
                if(Entity[e].moveable.up == false){
                    Entity[e].movement = "down"
                }else if(Entity[e].moveable.right == false){
                    Entity[e].movement = "left"
                }else if(Entity[e].moveable.left == false){
                    Entity[e].movement = "right"
                }else if(Entity[e].moveable.down == false){
                    Entity[e].movement = "up"
                }

                // console.log(Entity[e].movement, Entity[e].facing)
            }

        }
        
        if(Entity[e].wt > 0){
            Entity[e].wt -= 1
        } else if(Entity[e].wt <= 0){
            Entity[e].facing = Entity[e].movement = EnemyDrection()
            Entity[e].wt = Math.round(Math.random()*300)
        }

        
        collisionDetect(Entity[e], Obs)
        
        if(Entity[e].movement == 'up'){
            if(Entity[e].moveable.up){Entity[e].y -= Entity[e].s}
        }else if(Entity[e].movement == 'left'){
            if(Entity[e].moveable.left){Entity[e].x -= Entity[e].s}
        }else if(Entity[e].movement == 'down'){
            if(Entity[e].moveable.down){Entity[e].y += Entity[e].s}
        }else if(Entity[e].movement == 'right'){
            if(Entity[e].moveable.right)(Entity[e].x += Entity[e].s)
        }
    
        if(Entity[e].movement != ''){Entity[e].facing = Entity[e].movement}
        
    }
}

function GameUpdate(){
    for(let w = 0; w < world.length; w+=1){
        for(let b = 0; b < bullet.length; b+=1){
            if(collision(world[w], bullet[b])){
                CreateParticles((bullet[b].x + bullet[b].w/2),(bullet[b].y + bullet[b].h/2))
                bullet.splice(b,b+1)
            }
        }
    }

    for(let e = 0; e < Entity.length; e+=1){
        showInfo(Entity[e].x - 5, Entity[e].y - 5, `${Entity[e].health}`)
        for(let b = 0; b < bullet.length; b+=1){
            if(Entity[e] != undefined && collision(Entity[e], bullet[b])){
                
                hitAnimation(Entity[e])
                CreateParticles((bullet[b].x + bullet[b].w/2),(bullet[b].y + bullet[b].h/2))

                if(Entity[e].health <= bullet[b].damage){
                    // console.log(e, Entity[e])
                    Entity.splice(e,1)

                    player.score += 5

                } else {
                    Entity[e].health -= bullet[b].damage
                }

                bullet.splice(b,1)
            }
        }
    }
}

GenerateWorld(GameSetting.NumberOfObstacles)

function SpawnEnemy(){
    if(Entity.length == 0){
        for(let i = 0; i < GameSetting.NumberOfEnemy; i+=1){
            createEnemy(Entity)
        }

        if(GameSetting.NumberOfEnemy < GameSetting.MaxEnemy){
            GameSetting.NumberOfEnemy += 1
        }
        
    }
}
 
function draw() {
    setTimeout(function() {
        requestAnimationFrame(draw);
 
        clearCanvas()
    
        showInfo(20,20,"This is Main Branch(default)")
        if(player.t <= 0){showInfo(200,20,"READY")} else {showInfo(200,20,"NOT READY")}
        showInfo(300,20,`Score: ${player.score}`)
        
    
        for(let x of world){
            drawRect(x)
        }
    
        for(let e of Entity){
            drawRect(e)
            drawDirection(e)
        }
    
        GameUpdate()
        SpawnEnemy()
        EntityUpdate()
        bulletUpdate(bullet, world, Entity)
        particleUpdate(Particles)
    
        // addMovingEvent(player);
        Movement(player);
        drawDirection(player)
        playerFire(player)
        
 
    }, 1000 / GameSetting.FramePerSecond);
}
 
draw();