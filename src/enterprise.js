
var gl;
var points;
var colors = [];
var theta = [0,0,0];
var thetaLoc;

var pos = vec2(0,0);
var posLoc;
var thrustOn = false;


//up, down, left, right
var moveVec = [false, false, false, false];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = e_points;


    points = toVec3(vertices);

    for (var i = 0; i < points.length; i++){
        for (var j = 0; j < points[i].length; j++){
            points[i][j] /= 5;
        }
        colors.push(vec4(Math.abs(points[i][0]), Math.abs(points[i][1]), Math.abs(points[i][2]), 1.0));
    }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    
    // Load the data into the GPU
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    //register user input with keyboard
    window.addEventListener("keydown", function() {
        switch(event.keyCode){
            case 87:     //w
                moveVec[0] = true;
                break;
            case 83:     //s
                moveVec[1] = true;
                break;
            case 65:     //a
                moveVec[2] = true;
                break;
            case 68:     //d
                moveVec[3] = true;
                break;
            case 16:     //shift
                thrustOn = true;
        }
    });

    window.addEventListener("keyup", function() {
        switch(event.keyCode){
            case 87:     //w
                moveVec[0] = false;
                break;
            case 83:     //s
                moveVec[1] = false;
                break;
            case 65:     //a
                moveVec[2] = false;
                break;
            case 68:     //d
                moveVec[3] = false;
                break;
            case 16:     //shift
                thrustOn = false;
        }
    });

    
    thetaLoc = gl.getUniformLocation(program, "theta");
    posLoc = gl.getUniformLocation(program, "pos");

    render();
};


function render() {
	rotateShip();
    moveShip();
    thrust();

    gl.uniform2fv(posLoc, pos);
	gl.uniform3fv(thetaLoc, theta);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    window.requestAnimFrame(render);
}

function rotateShip(){
	if (moveVec[2]){
        theta[2]++;
        console.log("LEFT!!");
    }
    if (moveVec[3]){
        theta[2]--;
        console.log("RIGHT!!"); 
    }
    if (theta[2] >= 360){
        theta[2] -= 360;
    }
}

function moveShip(){

}

function thrust(){
    if (thrustOn){
        pos[1] -= .01;
        console.log("THRUST!!");
    }
}

function toVec3(vertices){
    points = new Array();
    for (var i = 0; i < vertices.length; i += 3){
        point = [vertices[i], vertices[i+1], vertices[i+2]];
        points.push(point);
    }
    return points;
}
