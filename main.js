const canvas = document.getElementById("canvas");
canvas.style.transform = "translate3d(0,0,0)";
const ctx = canvas.getContext("2d");

//Global Variables
const bullet = []
const Entity = []
const Particles = []
const world = []


const GameSetting = {
    WorldGeneration : true,
    NumberOfObstacles : 7,
    NumberOfEnemy : 2,
    MaxEnemy : 5,
    EnemyIncreaseRate : 1,
    FramePerSecond : 160,
    ShowObjectName : false,
}

const player = {
    id: 'Player',
    x : 100, 
    y : 100, 
    w : Math.round(canvas.height*0.05), //width
    h : Math.round(canvas.height*0.05), //height
    a : 1,  // Alpha
    c : `0,198,0`,  // RGB
    s : 1,  // Speed !!! 1
    health : 4,

    r : 10, //reload time
    t : 0, //local time
    facing : 'right',
    movement : '',
    moveable : {up : true, down : true, left : true, right: true},
    score : 0,
}

// Add Key Event for moving
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

// Clear the movement when release
document.addEventListener('keyup', function(event){
    if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
        player.movement = '';
    }
})

// Create Wold Border
const border_up = {
    id : 'border_up',
    x : 0, 
    y : 0,
    w : canvas.width,
    h : 5,
    a : 1,
    c : `0,0,0`,
}

const border_down = {
    id : 'border_down',
    x : 0, 
    y : canvas.height - 5,
    w : canvas.width,
    h : 5,
    a : 1,
    c : `0,0,0`,
}

const border_left = {
    id : 'border_left',
    x : 0, 
    y : 0,
    w : 5,
    h : canvas.height,
    a : 1,
    c : `0,0,0`,
}

const border_right = {
    id : 'border_right',
    x : canvas.width - 5, 
    y : 0,
    w : 5,
    h : canvas.height,
    a : 1,
    c : `0,0,0`,
}

/** Clear Whole Canvas */
function clearCanvas(){
    ctx.beginPath()
    ctx.clearRect(0,0,canvas.width, canvas.height)
}

/** 
 * Draw Rectangle with given object
 * @param {object} object 
 * 
 * c -- Color (RGB);   
 * a -- Alpha;   
 * x -- X coordinate;   
 * y -- Y coordinate;   
 * w -- Width;   
 * h -- Height;   
 */

function drawRect(object){
    ctx.beginPath()
    ctx.fillStyle = `rgb(${object.c}, ${object.a})`;
    ctx.fillRect(object.x,object.y,object.w,object.h);
    
}

/**
 * 
 * @param {*} object Add Movement and draw the object
 */
function Movement(object) {

    // Combine all obstacles and entities
    const Allobstacle = world.concat(Entity);
    collisionDetect(object, Allobstacle);
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

/**
 * 
 * @param {Array<Number>} arr1 First Array
 * @param {Array<Number>} arr2 Second Array
 * @returns Boolean
 */
function findCommon(arr1, arr2) {
    function check(value){
        if(arr2.includes(value)){
            return value
        }
    }
    return arr1.some(check)
}

/**
 * 
 * @param {Array} array 
 * @returns Last element of the array
 */
function GetLast(array){
    let len = array.length;
    return array[len-1]
}

/**
 * @param {object} object1
 * @param {object} object2
 * @returns Boolean - If collision
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
 * Detect collision between single object and the other; Using for movement
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
        // Saperate to X and Y components
        if(findCommon(object_HB.y, obstacle.y) && GetLast(object_HB.y) != obstacle.y[0] && GetLast(obstacle.y) != object_HB.y[0]){
            if(GetLast(object_HB.x) >= obstacle.x[0] && GetLast(object_HB.x) <= GetLast(obstacle.x)){
                object.moveable.right = false;
            } else if(object_HB.x[0] <= GetLast(obstacle.x) && object_HB.x[0] >= obstacle.x[0]){
                object.moveable.left = false;
            }
        } 
        
        if(findCommon(object_HB.x, obstacle.x) && GetLast(object_HB.x) != obstacle.x[0] && GetLast(obstacle.x) != object_HB.x[0]){
            if(GetLast(object_HB.y) >= obstacle.y[0] && GetLast(object_HB.y) <= GetLast(obstacle.y)){
                object.moveable.down = false;
            } else if(object_HB.y[0] <= GetLast(obstacle.y) && object_HB.y[0] >= obstacle.y[0]){
                object.moveable.up = false;
            }
        }
    }

}

/**
 * Get the hitbox of an object
 * @param {Object} object 
 * 
 */
function getHitBox(object){

    let X = [], Y = [];
    for(let i = object.x; i <= object.x + object.w; i++){
        X.push(Math.round(i))
    }

    for(let j = object.y; j <= object.y + object.h; j++){
        Y.push(Math.round(j))
    }

    return {x : X, y : Y}
}

/**
 * Write text on canvas
 * @param {number} x 
 * @param {number} y 
 * @param {string} info 
 */
function showInfo(x,y,info){
    ctx.beginPath()
    ctx.fillStyle = 'black'
    ctx.font = `bold ${Math.round(canvas.height*0.033)}px serif`;
    ctx.fillText(String(info), x, y)
}

/**
 * World Generation;
 * @param {number} ObstacleNum 
 */
function GenerateWorld(ObstacleNum){

    function GenerateObs(n){
        const obstacle = {
            id: `Obstacle${n}`,
            x : Math.round(Math.random()*canvas.width) - Math.round(canvas.height*0.15), 
            y : Math.round(Math.random()*canvas.height) - Math.round(canvas.height*0.15),
            w : Math.round(Math.random()*Math.round(canvas.height*0.222)) + Math.round(canvas.height*0.15),
            h : Math.round(Math.random()*Math.round(canvas.height*0.222)) + Math.round(canvas.height*0.15),
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
/**
 * Use for testing; Show the x and y axes of an object
 * @param {object} object 
 */
// function drawSaparatingAxes(object){
//     //X
//     ctx.fillStyle = `rgb(${object.c}, 0.5)`;
//     ctx.fillRect(object.x, 5, object.w, 5);

//     //Y
//     ctx.fillStyle = `rgb(${object.c}, 0.5)`;
//     ctx.fillRect(390, object.y, 5, object.h);
// }


function drawDirection(object){
    let x = object.x + object.w/2;
    let y = object.y + object.h/2;

    ctx.beginPath();
    ctx.fillStyle = "black"

    switch(object.facing){
        case "up":
            ctx.fillRect(x - Math.round(canvas.height*0.0025), y, Math.round(canvas.height*0.0025), -Math.round(canvas.height*0.125))
            break
        case "down":
            ctx.fillRect(x - Math.round(canvas.height*0.0025), y, Math.round(canvas.height*0.0025), Math.round(canvas.height*0.125))
            break
        case "left":
            ctx.fillRect(x, y - Math.round(canvas.height*0.0025), -Math.round(canvas.height*0.125), Math.round(canvas.height*0.0025))
            break
        case "right":
            ctx.fillRect(x, y - Math.round(canvas.height*0.0025), Math.round(canvas.height*0.125), Math.round(canvas.height*0.0025))
            break
    }
}

/**
 * Creat a bullet
 * @param {object} Orgin Who shoot this bullet 
 * @param {list} list The Bullet list
 */
function createBullet(Orgin, list){
    const bulletObj = {
        x : Orgin.x + (Orgin.w/2) - Math.round(canvas.height*0.0125)/2,
        y : Orgin.y + (Orgin.h/2) - Math.round(canvas.height*0.0125)/2,
        w : Math.round(canvas.height*0.0125),
        h : Math.round(canvas.height*0.0125),
        s : 3,
        a : 1,
        c : `0,0,0`,
        d : Orgin.facing, // d for direction
        damage : 2,
    }
    list.push(bulletObj)
}

/**
 * Movement of the bullet
 * @param {list<object>} BulletList 
 */
function bulletUpdate(BulletList){
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

/**
 * Player Fire with timer for reload
 * @param {object} Orgin The player 
 */
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

/**
 * For testing; Creating dummy
 * @param {list} EnemyList Entity list 
 */
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

/**
 * Create Enemy
 * @param {list} EntityList Entity list
 */
function createEnemy(EntityList){
    let direction = EnemyDrection()
    const enemy = {
        x : Math.floor(Math.random()*canvas.width),
        y : Math.floor(Math.random()*canvas.height),
        w : Math.round(canvas.height*0.0625),
        h : Math.round(canvas.height*0.0625),
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

    // Check for overlaping and respawn the enemy
    function CheckOverlap(){
        for(let o of world){
            if(collision(enemy, o)){
                enemy.x = Math.floor(Math.random()*400);
                enemy.y = Math.floor(Math.random()*400);
                CheckOverlap()
                break
                
            }
        }
    }

    CheckOverlap()
    EntityList.push(enemy)
}

/**
 * @returns Random direction for enemy
 */
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

//Future Update
// function EnemyFire(Enemy){ 
// }

/**
 * HitAnimation
 * @param {object} Entity 
 * @param {number} scale 
 */
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

/**
 * Creating particles for visual effect
 * @param {number} x Center for the particle effect 
 * @param {number} y Center for the particle effect 
 */
function CreateParticles(x,y){
    
    //True Random Generate both negitive and positive number
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
            c : `${Math.random()*100},${Math.random()*100},${Math.random()*255}`,
            a : 0.7,
            count : 0,

            w : Math.random()*Math.round(canvas.height*0.02778),
            h : Math.random()*Math.round(canvas.height*0.02778),
        }
        return particle
    }

    
    for(let i = 0; i<5; i+=1){
        Particles.push(createParticles())
    }
    
}

/**
 * Update the particles
 * @param {list} particles 
 */
function particleUpdate(particles){
    for(let i = 0; i < particles.length; i+=1){
        if(particles[i].count < 50){
            particles[i].x += particles[i].vx
            particles[i].y += particles[i].vy
            particles[i].a -= 0.01
            drawRect(particles[i])
            particles[i].count += 1
        } else {
            particles.splice(i,i+1)
        }
    }
}

/**
 * Update Entity movement 
 */
function EntityUpdate(){
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

/**
 * Update Game
 * Update Damage and health
 * Executing hit animation and particle effect
 */
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

if(GameSetting.WorldGeneration){GenerateWorld(GameSetting.NumberOfObstacles)}
world.push(border_up)
world.push(border_down)
world.push(border_left)
world.push(border_right)

function draw() {
    setTimeout(function() {
        requestAnimationFrame(draw);
        clearCanvas()
    
        for(let x of world){
            drawRect(x)
            if(GameSetting.ShowObjectName){
                showInfo(x.x + x.w/2 - Math.round(canvas.height*0.09), x.y + x.h/2, `${x.id}`)
            }
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
    
        Movement(player);
        drawDirection(player)
        playerFire(player)


        showInfo(Math.round(canvas.width*0.022) , Math.round(canvas.height*0.0333) ,"This is Main Branch(default)")
        if(player.t <= 0){showInfo(Math.round(canvas.width*0.5555) ,Math.round(canvas.height*0.0333),"READY")} else {showInfo(Math.round(canvas.width*0.5555) ,Math.round(canvas.height*0.0333),"NOT READY")}
        showInfo(Math.round(canvas.width*0.7777), Math.round(canvas.height*0.0333),`Score: ${player.score}`)
        
    }, 1000 / GameSetting.FramePerSecond);
}
 
draw();