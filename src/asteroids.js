
var gl;
var ship;

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
    

    ship = new Ship();


    
    /*// Load the data into the GPU
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(ship.points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );*/


    //register user input with keyboard
    window.addEventListener("keydown", function() {
        switch(event.keyCode){
            case 87:     //w
                ship.moveVec[0] = true;
                break;
            case 83:     //s
                ship.moveVec[1] = true;
                break;
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
            case 87:     //w
                ship.moveVec[0] = false;
                break;
            case 83:     //s
                ship.moveVec[1] = false;
                break;
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