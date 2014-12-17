attribute vec4 vPosition;
attribute vec4 vColor;
attribute vec4 vNormal;
varying vec4 fColor;
uniform vec3 theta;
uniform vec2 pos;
uniform float scale;
varying vec3 N, L, E;
uniform vec4 lightPosition;

void main()
{
	vec3 angles = radians(theta);
	vec3 c = cos(angles);
	vec3 s = sin(angles);
	float ctx = 1.0/tan(angles.x);
	float scaleFactor = scale/20.0;


	//it's column-major, don't forget!!
	mat4 rz = mat4( c.z, s.z,0.0, 0.0,
					-s.z, c.z, 0.0, 0.0,
					0.0, 0.0, 1.0, 0.0,
					0.0, 0.0, 0.0, 1.0 );

	mat4 ry = mat4( c.y, 0.0, s.y, 0.0,
					0.0, 1.0, 0.0, 0.0,
					-s.y, 0.0, c.y, 0.0,
					0.0, 0.0, 0.0, 1.0 );

	mat4 rx = mat4( 1.0, 0.0 ,0.0, 0.0,
					0.0, c.x, s.x, 0.0,
					0.0, -s.x, c.x, 0.0,
					0.0, 0.0, 0.0, 1.0 );

	mat4 t = mat4( 1.0, 0.0 ,0.0, 0.0,
					0.0, 1.0, 0.0, 0.0,
					0.0, 0.0, 1.0, 0.0,
					pos.x, pos.y, 0.0, 1.0 );

	mat4 toOrigin =  mat4( 1.0, 0.0 ,0.0, 0.0,
							0.0, 1.0, 0.0, 0.0,
							0.0, 0.0, 1.0, 0.0,
							-pos.x, -pos.y, 0.0, 1.0 );

	mat4 sM = mat4( scaleFactor, 0.0, 0.0, 0.0,
						0.0, scaleFactor, 0.0, 0.0,
						0.0, 0.0, scaleFactor, 0.0,
						0.0, 0.0, 0.0, 1.0 );

	mat4 tMat = t * rx * ry * sM;

    vec3 light;
    vec3 pos = (vPosition).xyz;
    if(lightPosition.z == 0.0)  L = normalize(lightPosition.xyz);
    else  L = pos - normalize(lightPosition).xyz;

    E =  -normalize(pos);
    N = normalize( (vNormal).xyz);

    mat3 normalMatrix = mat3(tMat[0][0], tMat[0][1], tMat[0][2],
    						tMat[1][0], tMat[1][1], tMat[1][2],
    						tMat[2][0], tMat[2][1], tMat[2][2]);
   	//normalMatrix = inverse(normalMatrix);

    gl_Position = tMat * vPosition;

    fColor = vColor;

}
