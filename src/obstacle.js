
// an asteroid instance
// x and y can be used as parameters for breaking apart asteroids
// theta and omega are random
function Asteroid(xpos, ypos, angle, size, speed){
	this.s = size;
	this.startSize = size;
	this.pos = vec2(xpos, ypos);
	this.theta = vec3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
	this.omega = vec3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);

	//direction for velocity calculation
	//between 0 and 1
	this.trueDirection = angle;
	this.speed = speed;
	this.radius = this.s/20.0;

	this.move = function(){
		this.pos[0] += speed * Math.cos(radians(this.trueDirection));
		this.pos[1] += speed * Math.sin(radians(this.trueDirection));

		//wraps around edges of screen
		if (this.pos[0]-this.radius > 1 || this.pos[0]+this.radius < -1){
			this.pos[0] *= -1;
		}
		if (this.pos[1]-this.radius > 1 || this.pos[1]+this.radius < -1){
			this.pos[1] *= -1;
		}
	}
}

//singleton asteroid model that asteroid instances can reference
function AsteroidModel(){
	this.points = [];
	this.program = initShaders( gl, "src/shaders/asteroid-vertex.glsl", "src/shaders/asteroid-fragment.glsl" );
    this.colors = [];
    //holds mappings for perturbing shared points
    this.pointMapping = {}

	//creates a sphere with slightly perturbed surface
	this.createModel =	function(){
		var a = vec3(0.0, 0.0, -1.0);
		var b = vec3(0.0, 0.942809, 0.333333);
		var c = vec3(-0.816497, -0.471405, 0.333333);
		var d = vec3(0.816497, -0.471405, 0.333333);

		this.divideTriangle(a, b, c, 2);
		this.divideTriangle(a, c, d, 2);
		this.divideTriangle(a, d, b, 2);
		this.divideTriangle(d, c, b, 2);
	}
	this.divideTriangle = function(a, b, c, count) {
	    if ( count > 0 ) {
	        var ab = mix( a, b, 0.5 );
	        var ac = mix( a, c, 0.5 );
	        var bc = mix( b, c, 0.5 );
	                
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
		/*
	        //adds mapping of point to random perturbation
	        this.pointMapping[a.toString()] = [Math.random()/4.0, Math.random()/4.0, Math.random()/4.0];
   	        this.pointMapping[b.toString()] = [Math.random()/4.0, Math.random()/4.0, Math.random()/4.0];
	        this.pointMapping[c.toString()] = [Math.random()/4.0, Math.random()/4.0, Math.random()/4.0];
		*/
	    }
	    /*
	    for (var i = 0; i < this.verts.length; i++){
   	   		console.log(this.verts[i], this.pointMapping[this.verts[i].toString()]);
    		this.points.push(add(this.pointMapping[this.verts[i].toString()], this.verts[i]));
	    
	    }*/
	}
	this.render = function(asteroid){
		//to do: use element array

		asteroid.theta = add(asteroid.theta, asteroid.omega);

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
		gl.uniform1f(this.scaleLoc, asteroid.s);
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
	this.pos = vec2(0,0);
	this.posLoc = gl.getUniformLocation(this.program, "pos");
	this.scaleLoc = gl.getUniformLocation(this.program, "scale");

}



