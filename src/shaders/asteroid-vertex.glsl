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

    gl_Position = tMat * vPosition;

    fColor = vColor;

}
