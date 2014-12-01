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
	this.render = function(){
		this.theta[0]++;
		this.theta[1]++;
		this.theta[2]++;

		gl.useProgram(this.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.DYNAMIC_DRAW);
		gl.vertexAttribPointer(this.vColor, 4, gl.FLOAT, false, 0, 0)
		gl.enableVertexAttribArray(this.vColor);

		gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
	    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.DYNAMIC_DRAW );
		gl.vertexAttribPointer( this.vPosition, 3, gl.FLOAT, false, 0, 0 );
	    gl.enableVertexAttribArray(this.vPosition);

	    gl.uniform2fv(this.posLoc, this.pos);
		gl.uniform3fv(this.thetaLoc, this.theta);
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



