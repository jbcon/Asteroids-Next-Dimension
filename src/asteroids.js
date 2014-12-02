
var gl;
var ship;

var obstacle;
var asteroidArray = [];

var modelView, projection;
var mvMatrix, pMatrix;
var eye;
var at;
var up = vec3(0.0, 0.0 , 1.0);  //into positive z direction
var aspect
var cameraDistance;

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
    for (var i = 0; i < 4; i++){
        asteroidArray.push(new Asteroid(Math.random()*2-1, Math.random()*2-1, 3, 0.005));
    }

    //register user input with keyboard
    window.addEventListener("keydown", function() {
        switch(event.keyCode){
            case 65:     //a
                ship.moveVec[2] = true;
                break;
            case 68:     //d
                ship.moveVec[3] = true;
                break;
            case 16:     //shift
                ship.thrustOn = true;
        }
    });

    window.addEventListener("keyup", function() {
        switch(event.keyCode){
            case 65:     //a
                ship.moveVec[2] = false;
                break;
            case 68:     //d
                ship.moveVec[3] = false;
                break;
            case 16:     //shift
                ship.thrustOn = false;
        }
    });

    modelView = gl.getUniformLocation(ship.program,"modelView");
    projection = gl.getUniformLocation(ship.program, "projection");
    aspect = canvas.width/canvas.height;
    cameraDistance = 1 

    render();
};


function render(){
	ship.rotate();
    ship.move();
    ship.thrust();
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    ship.render();

    for (var i = 0; i < asteroidArray.length; i++){
        asteroidArray[i].move();
        console.log(asteroidArray[i].trueDirection);
        obstacle.render(asteroidArray[i]);
    }
    updateCamera();
    window.requestAnimFrame(render);
}

function updateCamera(){
    eyex = Math.cos(radians(90-ship.theta[2]));
    eyey = Math.sin(radians(90-ship.theta[2]));
    eye = vec3(eyex*cameraDistance+ship.pos[0], eyey*cameraDistance+ship.pos[1], 0.0);
    mvMatrix = lookAt(eye, vec3(ship.pos[0], ship.pos[1], 0.0), up);
    pMatrix = perspective(10, aspect, 0, 1 );
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));
}

function toVec3(vertices){
    var points = new Array();
    for (var i = 0; i < vertices.length; i += 3){
        point = [vertices[i], vertices[i+1], vertices[i+2]];
        points.push(point);
    }
    return points;
}

function radians(num){
    return num * Math.PI / 180.0;
}