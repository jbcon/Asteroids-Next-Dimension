window.onload = function(){
    var canvas = document.getElementById( "gl-canvas" );
	var gl;
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
}