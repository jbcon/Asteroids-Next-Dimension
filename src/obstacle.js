
// a single asteroid instance
// x and y can be used as parameters for breaking apart asteroids
// theta and omega are random
var Asteroid = function(xpos, ypos, size, speed){
	this.size = size;
	this.pos = vec2(xpos, ypos);
	this.theta = vec3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
	this.omega = vec3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);

	//direction for velocity calculation
	this.trueDirection = vec2(Math.random()*2-1, Math.random()*2-1);
	this.speed = speed;

	this.move = function(){
		this.pos[0] += speed * Math.cos(2 * Math.PI * this.trueDirection[0]);
		this.pos[1] += speed * Math.sin(2 * Math.PI * this.trueDirection[0]);

	}
}

//singleton asteroid model that asteroid instances can reference
var AsteroidModel = function(){
	this.points = [];
	this.program = initShaders( gl, "src/shaders/asteroid-vertex.glsl", "src/shaders/asteroid-fragment.glsl" );
    this.colors = [];

	//creates a sphere with slightly perturbed surface
	this.createModel =	function(){
		var a = vec3(0.0, 0.0, -1.0);
		var b = vec3(0.0, 0.942809, 0.333333);
		var c = vec3(-0.816497, -0.471405, 0.333333);
		var d = vec3(0.816497, -0.471405, 0.333333);

		this.divideTriangle(a, b, c, 1);
		this.divideTriangle(a, c, d, 1);
		this.divideTriangle(a, d, b, 1);
		this.divideTriangle(d, c, b, 1);
	}
	this.divideTriangle = function(a, b, c, count) {
	    if ( count > 0 ) {
	        
	        var indent = Math.random()/4.0;        

	        var ab = mix( a, b, 0.5 + indent);
	        var ac = mix( a, c, 0.5 + indent);
	        var bc = mix( b, c, 0.5 + indent);
	                
	        ab = normalize(ab, false);
	        ac = normalize(ac, false);
	        bc = normalize(bc, false);
	                                
	        this.divideTriangle( a, ab, ac, count - 1 );
	        this.divideTriangle( ab, b, bc, count - 1 );
	        this.divideTriangle( bc, c, ac, count - 1 );
	        this.divideTriangle( ab, bc, ac, count - 1 );
	    }
	    else { 
	        this.points.push(a);
	        this.points.push(b);
	        this.points.push(c);
	        this.colors.push(vec4(.5, .5, .3, 1));
	        this.colors.push(vec4(.5, .5, .3, 1));
	        this.colors.push(vec4(.5, .5, .3, 1));
	    }
	}
	this.render = function(asteroid){
		//to do: use element array

		asteroid.theta[0] += asteroid.omega[0];
		asteroid.theta[1] += asteroid.omega[1];
		asteroid.theta[2] += asteroid.omega[2];

		gl.useProgram(this.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(this.vColor, 4, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(this.vColor);

		gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
	    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.DYNAMIC_DRAW );
		gl.vertexAttribPointer( this.vPosition, 3, gl.FLOAT, false, 0, 0 );
	    gl.enableVertexAttribArray(this.vPosition);

	    gl.uniform2fv(this.posLoc, asteroid.pos);
		gl.uniform3fv(this.thetaLoc, asteroid.theta);
	    gl.drawArrays( gl.TRIANGLES, 0, this.points.length );
		gl.disableVertexAttribArray(this.vColor);
	    gl.disableVertexAttribArray( this.vPosition );
	}

	this.createModel();
	this.cBuffer = gl.createBuffer();
    this.vColor = gl.getAttribLocation(this.program, "vColor");
	this.vBuffer = gl.createBuffer();
    this.vPosition = gl.getAttribLocation( this.program, "vPosition" );
    this.theta = vec3(0,0,0);
	this.thetaLoc = gl.getUniformLocation(this.program, "theta");
	this.pos = vec2(-.5,-.5);
	this.posLoc = gl.getUniformLocation(this.program, "pos");

}



