
var gl;
var ship;

var asteroidArray = [];

window.onload = function init()
{
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

    //register user input with keyboard
    window.addEventListener("keydown", function() {
        switch(event.keyCode){
            /*case 87:     //w
                ship.moveVec[0] = true;
                break;
            case 83:     //s
                ship.moveVec[1] = true;
                break;
            */
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
            /*case 87:     //w
                ship.moveVec[0] = false;
                break;
            case 83:     //s
                ship.moveVec[1] = false;
                break;
            */
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
    render();
};


function render() {
	ship.rotate();
    ship.move();
    ship.thrust();

    ship.render();
    window.requestAnimFrame(render);
}


function toVec3(vertices){
    points = new Array();
    for (var i = 0; i < vertices.length; i += 3){
        point = [vertices[i], vertices[i+1], vertices[i+2]];
        points.push(point);
    }
    return points;
}

function radians(num){
    return num * Math.PI / 180.0;
}