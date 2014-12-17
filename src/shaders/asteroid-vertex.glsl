attribute vec4 vPosition;
attribute vec4 vColor;
attribute vec4 vNormal;
varying vec4 fColor;
varying vec3 N, L, E;
uniform vec4 lightPosition;
uniform mat4 tMat;

void main()
{
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
