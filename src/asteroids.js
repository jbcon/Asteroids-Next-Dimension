
var gl;
var ship;

var obstacle;
var asteroidArray = [];
var toDestroy = [];


var normal;
var nMatrix;
var eye;
var at;
var up = vec3(0.0, 0.0 , 1.0);  //into positive z direction
var aspect
var cameraDistance;
var score = 0;
var lives = 3;
var level = 1;

var lightPosition = vec4(0.0, 0.0, 1.0, 0.0 );
var lightAmbient = vec4(0.1, 0.1, 0.1, 1.0 );
var lightDiffuse = vec4( 0.5, 0.5, 0.5, 1.0 );
var lightSpecular = vec4( 0.7, 0.7, 0.7, 1.0 );

window.onload = function init(){
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //initializes ship-related graphics and physics variables
    ship = new Ship();

    obstacle = new AsteroidModel();
    spawnAsteroids(1);

    //register user input with keyboard
    window.addEventListener("keydown", function() {
        switch(event.keyCode){
            case 87:
                ship.thrustOn = true;
                break;
            case 65:     //a
                ship.moveVec[2] = true;
                break;
            case 68:     //d
                ship.moveVec[3] = true;
                break;
            case 16:     //shift
                if (!ship.firingBullet && ship.bulletList.length < 6
                && ship.respawnTime == 0 && lives != 0 ){
                    ship.bulletList.push(new Bullet(ship.pos[0], ship.pos[1], ship.theta[2]));
                    ship.firingBullet = true;
                }
                break;
        }
    });

    window.addEventListener("keyup", function() {
        switch(event.keyCode){
            case 87:
                ship.thrustOn = false;
                break;
            case 65:     //a
                ship.moveVec[2] = false;
                break;
            case 68:     //d
                ship.moveVec[3] = false;
                break;
            case 16:     //shift
                ship.firingBullet = false;
                break;
        }
    });


    modelView = gl.getUniformLocation(ship.program,"modelView");
    projection = gl.getUniformLocation(ship.program, "projection");
    aspect = canvas.width/canvas.height;
    cameraDistance = 1

    update();
};

function checkCollisions(){
    for (var i = 0; i < asteroidArray.length; i++){
        var a = asteroidArray[i];

        for (var j = 0; j < ship.bulletList.length; j++){
            var b = ship.bulletList[j];

            /* checks if distance to center of asteroid
            is shorter than the radiii of asteroid and
            bullet combined (collision) */
            var dist = Math.sqrt(Math.pow(a.pos[0]-b.pos[0], 2) + Math.pow(a.pos[1]-b.pos[1], 2));
            if ( dist < a.radius+4.0/512.0){
                splitAsteroid(a);
                if (a.s > 1)
                    score += 50;
                else
                    score += 100;
                ship.bulletList.splice(j);

            }
        }
        var distShip = Math.sqrt(Math.pow(a.pos[0]-ship.pos[0]/20.0, 2) + Math.pow(a.pos[1]-ship.pos[1]/20.0, 2));

        if (distShip < a.radius && ship.invincibility == 0){
            ship.respawnTime = 200;
            splitAsteroid(a);
            ship.vel = vec2(0,0);
            lives--;
            ship.invincibility = 200;
        }
    }
    for (var i = 0; i < toDestroy.length; i++){
        var a = toDestroy[i];
        asteroidArray.splice(asteroidArray.indexOf(a),1);
    }
}

//handles asteroid destruction
function splitAsteroid(a){
    toDestroy.push(a);
    //if the asteroid is not the smallest size
    if (a.s > 1){
        //make two new ones going different directions and smaller
        var a1 = new Asteroid(a.pos[0], a.pos[1], 90+a.trueDirection, a.s-1, a.speed*1.5);
        var a2 = new Asteroid(a.pos[0], a.pos[1], 90-a.trueDirection, a.s-1, a.speed*1.5);
        asteroidArray.push(a1);
        asteroidArray.push(a2);
    }
}


function update(){

    //if all the asteroids were destroyed
    if (asteroidArray.length == 0){
        //start another round
        level++;
        //so it doesn't instantly die on a new level
        ship.invincibility = 200;
        spawnAsteroids();
    }

    toDestroy = [];
    if (ship.respawnTime == 0 && lives != 0){
    	ship.rotate();
        ship.move();
        ship.thrust();
    }
    else if (lives != 0){
        ship.respawnTime--;
        console.log(ship.respawnTime);
    }
    if (ship.invincibility > 0 && ship.respawnTime == 0 && lives != 0){
        console.log("INVINCIBLE!!");
        ship.invincibility--;
    }
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    var bulletPositions = [];
    for (var i = 0; i < ship.bulletList.length; i++){
        ship.bulletList[i].move();
        if (ship.bulletList[i].life > 30){
            ship.bulletList.splice(i, 1);
        }
        else{
            bulletPositions.push(ship.bulletList[i].pos);
        }
    }

    for (var i = 0; i < asteroidArray.length; i++){
        asteroidArray[i].move();
    }

    checkCollisions();

    document.getElementById("Score").innerHTML = "Score: " + score;
    if (lives > 0)
        document.getElementById("Lives").innerHTML = "Lives: " + lives;
    else
        document.getElementById("Lives").innerHTML = "GAME OVER!";
    document.getElementById("Level").innerHTML = "Level " + level;

    if (ship.respawnTime == 0 && lives != 0){
        ship.render();
    }
    drawBullets(bulletPositions);

    obstacle.bind();
    for (var i = 0; i < asteroidArray.length; i++){
        obstacle.render(asteroidArray[i]);
    }
    obstacle.unbind();
    window.requestAnimFrame(update);
}

function spawnAsteroids(){
    for (var i = 0; i < level; i++){
        /*(random-.5)/2 will make sure the asteroid starts 
            away from the center of the screen
            so player doesn't instantly die */
        var x = (Math.random()-.5)/2.0;
        var y = (Math.random()-.5)/2.0;
        if (x > 0)
            x += .5;
        else
            x -= .5;
        if (y > 0)
            y += .5;
        else
            y -= .5;
        asteroidArray.push(new Asteroid(x, y, 
            360*Math.random()*2-1,
            3, 0.005+level*0.001));
    }
}

function drawBullets(points){
    gl.useProgram(ship.bulletProgram);
    gl.bindBuffer( gl.ARRAY_BUFFER, ship.bBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.DYNAMIC_DRAW );
    gl.vertexAttribPointer( ship.bPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(this.bPosition);

    gl.drawArrays(gl.POINTS, 0, points.length);

    gl.disableVertexAttribArray(this.bPosition);
}

function toVec3(vertices){
    var points = new Array();
    for (var i = 0; i < vertices.length; i += 3){
        point = [vertices[i], vertices[i+1], vertices[i+2]];
        points.push(point);
    }
    return points;
}

function transformObject(pos, theta, scaleFactor){

    var angles = radians(theta);
    var c = [Math.cos(angles[0]), Math.cos(angles[1]), Math.cos(angles[2])];
    var s = [Math.sin(angles[0]), Math.sin(angles[1]), Math.sin(angles[2])];

    //it's column-major, don't forget!!
    var rx = rotate(theta[0], vec3(1.0, 0.0, 0.0));
    var ry = rotate(theta[1], vec3(0.0, 1.0, 0.0));
    var rz = rotate(theta[2], vec3(0.0, 0.0, 1.0));
    var t = translate(pos[0], pos[1], 0.0);
    var s = mat4(scaleFactor, 0.0, 0.0, 0.0,
                    0.0, scaleFactor, 0.0, 0.0,
                    0.0, 0.0, scaleFactor, 0.0,
                    0.0, 0.0, 0.0, 1.0);
    

    var tMat = mult(t, mult( rx, mult(ry, s)));

    /* generate inverses for the different matrices
        they each have their own heuristic for them
        so that makes it easy */
    /*
    //inverse of a rotation matrix is the transpose
    var nRx = transpose(rx);
    var nRy = transpose(ry);
    var nRz = transpose(rz);

    //inverse of translation matrix is reverse direction
    var nT = translate(-pos[0], -pos[1], 0.0);

    //inverse of scale matrix is shrinking
    var nS = mat4(1.0/scaleFactor, 0.0, 0.0, 0.0,
                    0.0, 1.0/scaleFactor, 0.0, 0.0,
                    0.0, 0.0, 1.0/scaleFactor, 0.0,
                    0.0, 0.0, 0.0, 1.0);

    //apply them in reverse order
    var nMatrix = mult(nS, mult(ry, mult(rx, t)));
    */

    return tMat;
}