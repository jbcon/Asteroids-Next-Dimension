attribute vec4 vPosition;
attribute vec4 vColor;
varying vec4 fColor;
uniform vec3 theta;
uniform vec2 pos;

void main()
{
	vec3 angles = radians(theta);
	vec3 c = cos(angles);
	vec3 s = sin(angles);
	float ctx = 1.0/tan(angles.x);
	float scaleFactor = 1.0/20.0;


	//it's column-major, don't forget!!
	mat4 rz = mat4( c.z, s.z,0.0, 0.0,
					-s.z, c.z, 0.0, 0.0,
					0.0, 0.0, 1.0, 0.0,
					0.0, 0.0, 0.0, 2.0 );

	mat4 ry = mat4( c.y, 0.0, s.y, 0.0,
					0.0, 1.0, 0.0, 0.0,
					-s.y, 0.0, c.y, 0.0,
					0.0, 0.0, 0.0, 2.0 );

	mat4 rx = mat4( 1.0, 0.0 ,0.0, 0.0,
					0.0, c.x, s.x, 0.0,
					0.0, -s.x, c.x, 0.0,
					0.0, 0.0, 0.0, 2.0 );

	mat4 tx = mat4( 1.0, 0.0 ,0.0, 0.0,
					0.0, 1.0, 0.0, 0.0,
					0.0, 0.0, 1.0, 0.0,
					pos.x, pos.y, 0.0, 1.0 );
	
	mat4 toOrigin =  mat4( 1.0, 0.0 ,0.0, 0.0,
							0.0, 1.0, 0.0, 0.0,
							0.0, 0.0, 1.0, 0.0,
							-pos.x, -pos.y, 0.0, 1.0 );

	mat4 scale = mat4( scaleFactor, 0.0, 0.0, 0.0,
						0.0, scaleFactor, 0.0, 0.0,
						0.0, 0.0, scaleFactor, 0.0,
						0.0, 0.0, 0.0, 1.0 );

    gl_Position = scale * tx * rz * vPosition;

    fColor = vColor;

}