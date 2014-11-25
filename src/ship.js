function Ship() {
	//graphics and initialization
	this.points = toVec3(e_points);
	this.colors = [];

	this.initGraphics = function(){
		for (var i = 0; i < this.points.length; i++){
	        this.colors.push(vec4(0.5, 0.5, 0.5, 1), 1.0);
	    }

		this.program = initShaders( gl, "src/shaders/ship-vertex.glsl", "src/shaders/ship-fragment.glsl" );
	    gl.useProgram( this.program );

	    this.cBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
	    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW);

	    this.vColor = gl.getAttribLocation(this.program, "vColor");
	    gl.vertexAttribPointer(this.vColor, 4, gl.FLOAT, false, 0, 0);
	    gl.enableVertexAttribArray(this.vColor);

		this.vBuffer = gl.createBuffer();
	    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
	    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.DYNAMIC_DRAW );
	    
	    this.vPosition = gl.getAttribLocation( this.program, "vPosition" );
	    gl.vertexAttribPointer( this.vPosition, 3, gl.FLOAT, false, 0, 0 );
	    gl.enableVertexAttribArray( this.vPosition );
	}

	this.initGraphics();

	//physics stuff
	this.theta = [0,0,0];
	this.thrustTheta = [0,0,0];
	this.thetaLoc = gl.getUniformLocation(this.program, "theta");
	this.pos = vec2(0,0);
	this.posLoc = gl.getUniformLocation(this.program, "pos");
	this.thrustOn = false;
	this.thrustForce = .005;
	this.rotateSpeed = 3;
	this.vel = vec2(0,0);
	this.velMax = vec2(.25,.25);
	this.deceleration = .001;
	this.moveVec = [false, false, false, false];

	this.rotate = function (){
		if (this.moveVec[2]){
	        this.theta[0] += this.rotateSpeed;
	        this.theta[1] += this.rotateSpeed
	        this.theta[2] += this.rotateSpeed;
	    }
	    if (this.moveVec[3]){
	        this.theta[0] -= this.rotateSpeed;
	        this.theta[1] -= this.rotateSpeed;
	        this.theta[2] -= this.rotateSpeed;
	    }
	    if (this.theta[0] >= 360){
	        this.theta[0] -= 360;
	    }
	    if (this.theta[1] >= 360){
	        this.theta[1] -= 360;
	    }
	    if (this.theta[2] >= 360){
	        this.theta[2] -= 360;
	    }
	}

	this.move = function(){
	    this.pos[0] -= this.vel[0];
	    this.pos[1] -= this.vel[1];

	    if (this.vel[0] > 0){
	        this.vel[0] -= this.deceleration * Math.cos(radians(90 + this.thrustTheta[2]));
	        if (this.vel[0] < 0){
	            this.vel[0] = 0;
	        }
	    }
	    else if (this.vel[0] < 0){
	        this.vel[0] -= this.deceleration * Math.cos(radians(90 + this.thrustTheta[2]));
	        if (this.vel[0] > 0){
	            this.vel[0] = 0;
	        }
	    }
	    if (this.vel[1] > 0){
	        this.vel[1] -= this.deceleration * Math.sin(radians(90 + this.thrustTheta[2]));
	        if (this.vel[1] < 0){
	            this.vel[1] = 0;
	        }
	    }
	    else if (this.vel[1] < 0){
	        this.vel[1] -= this.deceleration * Math.sin(radians(90 + this.thrustTheta[2]));
	        if (this.vel[1] > 0){
	            this.vel[1] = 0;
	        }
	    }
	    console.log(this.vel);
	}

	this.thrust = function(){
	    if (this.thrustOn){
	        /* phase shift by -90 degrees since the ship 
	        starts facing in -y direction 
	        I could use sin and -cos but that looks counterintuitive */
	        this.vel[0] += this.thrustForce * Math.cos(radians(90 + this.theta[2]));
	        this.vel[1] += this.thrustForce * Math.sin(radians(90 + this.theta[2]));
	        //clamp vel to max velocity
	        if (this.vel[0] > this.velMax[0]){
	        	this.vel[0] = this.velMax[0]
	        }
	        else if (this.vel[0] < -this.velMax[0]){
	        	this.vel[0] = -this.velMax[0]
	        }
	        if (this.vel[1] > this.velMax[1]){
	        	this.vel[1] = this.velMax[1]
	        }
	        else if (this.vel[1] < -this.velMax[1]){
	        	this.vel[1] = -this.velMax[1]
	        }

	        this.thrustTheta = this.theta.slice(0);
	    }
	}

	this.render = function(){
		gl.uniform2fv(this.posLoc, this.pos);
		gl.uniform3fv(this.thetaLoc, this.theta);
	    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
	    gl.drawArrays( gl.TRIANGLES, 0, this.points.length );
	}
}