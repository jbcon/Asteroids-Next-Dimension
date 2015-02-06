/* TODO: NORMALIZE SHIP COORDINATES */


function Bullet(xpos, ypos, theta){
	this.pos = vec2(xpos/20.0+.15*-Math.cos(radians(90+theta)), ypos/20.0+.15*-Math.sin(radians(90+theta)));
	this.bulletSpeed = .05;
	this.vel = vec2(this.bulletSpeed * -Math.cos(radians(90+theta)),this.bulletSpeed * -Math.sin(radians(90+theta)));
	//to delete bullet after time has passed
	this.life = 0;

	this.move = function(){
	    this.pos = add(this.pos,this.vel);

	    //wrap around screen edges
	    if (this.pos[0] > 1 || this.pos[0] < -1){
			this.pos[0] *= -1;
		}
		if (this.pos[1] > 1 || this.pos[1] < -1){
			this.pos[1] *= -1;
		}

		//avoid being stuck outside boundaries
		if (this.pos[0] < -1){
			this.pos[0] = -1;
		}
		if (this.pos[0] > 1){
			this.pos[0] = 1;
		}
		if (this.pos[1] < -1){
			this.pos[1] = -1;
		}
		if (this.pos[1] > 1){
			this.pos[1] = 1;
		}
		this.life++;
	}

}

function Ship() {
	//graphics and initialization
	this.points = toVec3(e_points);
	this.normals = [];
    this.materialAmbient = vec4( 0.5, 0.5, 0.5, 1.0 );
    this.materialDiffuse = vec4( 0.5, 0.5, 0.5, 1.0 );
    this.flickerDiffuse = vec4(0.5, 0.5, 0.0, 1.0);
    this.materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
    this.materialShininess = 1000.0;
    this.ambientProduct = mult(lightAmbient, this.materialAmbient);
    this.diffuseProduct = mult(lightDiffuse, this.materialDiffuse);
    this.flickerDiffuseProduct = mult(lightDiffuse, this.flickerDiffuse);
    this.specularProduct = mult(lightSpecular, this.materialSpecular);

	this.initGraphics = function(){
		/*for (var i = 0; i < this.points.length; i++){
	        this.colors.push(vec4(0.5, 0.5, 0.5, 1));
	        this.flickerColors.push(vec4(0.5, 0.5, 0, 1));
	    }*/

	    for (var i = 0; i < this.points.length; i+=3){
            var t1 = subtract(this.points[i+1], this.points[i]);
            var t2 = subtract(this.points[i+2], this.points[i]);
            var normal = normalize(cross(t2, t1));
            normal = vec4(normal);
            normal[3]  = 0.0;

            this.normals.push(normal);
            this.normals.push(normal);
            this.normals.push(normal);
	    }

		this.program = initShaders( gl, "src/shaders/ship-vertex.glsl", "src/shaders/ship-fragment.glsl" );

        this.nBuffer = gl.createBuffer();
        this.vNormal = gl.getAttribLocation( this.program, "vNormal" );

		this.vBuffer = gl.createBuffer();
	    this.vPosition = gl.getAttribLocation( this.program, "vPosition" );

	    this.bulletProgram = initShaders(gl, "src/shaders/bullet-vertex.glsl", "src/shaders/bullet-fragment.glsl")
		this.bBuffer = gl.createBuffer();
		this.bPosition = gl.getAttribLocation(this.bulletProgram, "vPosition");
	}

	this.initGraphics();

	//physics stuff
	this.theta = vec3(0,0,0);
	this.thrustTheta = vec3(0,0,0);
	this.thetaLoc = gl.getUniformLocation(this.program, "theta");
	this.pos = vec2(0,0);
	this.posLoc = gl.getUniformLocation(this.program, "pos");
	this.thrustOn = false;
	this.thrustForce = .01;
	this.rotateSpeed = 5;
	this.vel = vec2(0,0);
	this.velMax = vec2(.25,.25);
	this.deceleration = .005;
	this.moveVec = [false, false, false, false];
	this.bulletList = [];
	this.firingBullet;
	this.respawnTime = 0;
	this.invincibility = 0;
	this.flicker = 0;

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
	    this.pos = subtract(this.pos,this.vel);

	    if (this.vel[0] > 0){
	        this.vel[0] -= this.deceleration * this.vel[0];
	        if (this.vel[0] < 0){
	            this.vel[0] = 0;
	        }
	    }
	    else if (this.vel[0] < 0){
	        this.vel[0] -= this.deceleration * this.vel[0];
	        if (this.vel[0] > 0){
	            this.vel[0] = 0;
	        }
	    }
	    if (this.vel[1] > 0){
	        this.vel[1] -= this.deceleration * this.vel[1];
	        if (this.vel[1] < 0){
	            this.vel[1] = 0;
	        }
	    }
	    else if (this.vel[1] < 0){
	        this.vel[1] -= this.deceleration * this.vel[1];
	        if (this.vel[1] > 0){
	            this.vel[1] = 0;
	        }
	    }


	    //wrap around screen edges
	    if (this.pos[0]-3 > 20 || this.pos[0]+3 < -20){
			this.pos[0] *= -1;
		}
		if (this.pos[1]-3 > 20 || this.pos[1]+3 < -20){
			this.pos[1] *= -1;
		}

		if (this.pos[0]+3 < -20){
			this.pos[0] = -20-3;
		}
		if (this.pos[0]-3 > 20){
			this.pos[0] = 20+3;
		}
		if (this.pos[1]+3 < -20){
			this.pos[1] = -20-3;
		}
		if (this.pos[1]-3 > 20){
			this.pos[1] = 20+3;
		}
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

		if (this.invincibility > 0){
			flicker++;
			if (flicker > 8)
				flicker = 0;
		}
		else{
			flicker = 0;
		}

		gl.useProgram(this.program);

		gl.uniform4fv( gl.getUniformLocation(this.program,
            "ambientProduct"),flatten(this.ambientProduct) );
		if (flicker > 4){
			gl.uniform4fv( gl.getUniformLocation(this.program,
            	"diffuseProduct"),flatten(this.flickerDiffuseProduct) );
		}
		else{
			gl.uniform4fv( gl.getUniformLocation(this.program,
            	"diffuseProduct"),flatten(this.diffuseProduct) );
		}
        
        gl.uniform4fv( gl.getUniformLocation(this.program,
            "specularProduct"),flatten(this.specularProduct) );
        gl.uniform4fv( gl.getUniformLocation(this.program,
            "lightPosition"),flatten(lightPosition) );
        gl.uniform1f( gl.getUniformLocation(this.program,
            "shininess"),this.materialShininess );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normals), gl.DYNAMIC_DRAW );
        gl.vertexAttribPointer( this.vNormal, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vNormal);

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
}
