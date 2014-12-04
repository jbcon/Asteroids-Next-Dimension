attribute vec4 vPosition;

void main(){
	gl_PointSize = 4.0;
	gl_Position = vPosition;
}