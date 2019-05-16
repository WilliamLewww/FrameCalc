const VERTEX_SHADER_DEFAULT = [
'attribute vec2 position;								 	\n',
'uniform vec2 resolution;								 	\n',
'														 	\n',
'void main(void) {										 	\n',
'	vec2 zeroToOne = position / resolution;					\n',
'	vec2 zeroToTwo = zeroToOne * 2.0;					 	\n',
'	vec2 clipSpace = zeroToTwo - 1.0;					 	\n',
'														 	\n',
'	gl_PointSize = 1.0;										\n',
'	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);	 	\n',
'}														 	\n',
].join('');

const FRAGMENT_SHADER_DEFAULT = [
'precision mediump float;									\n',
'															\n',
'uniform vec4 color;										\n',
'															\n',
'void main(void) {											\n',
'	gl_FragColor = color;									\n',
'}															\n',
].join('');

const VERTEX_SHADER_PIXEL_BUFFER = [
'attribute vec2 position;								 	\n',
'attribute vec4 a_color; 									\n',
'															\n',
'uniform vec2 resolution;								 	\n',
'															\n',
'varying vec4 v_color;										\n',
'														 	\n',
'void main(void) {										 	\n',
'	vec2 zeroToOne = position / resolution;					\n',
'	vec2 zeroToTwo = zeroToOne * 2.0;					 	\n',
'	vec2 clipSpace = zeroToTwo - 1.0;					 	\n',
'														 	\n',
'	gl_PointSize = 1.0;										\n',
'	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);	 	\n',
'	v_color = a_color;										\n',
'}														 	\n',
].join('');

const FRAGMENT_SHADER_PIXEL_BUFFER = [
'precision mediump float;									\n',
'															\n',
'varying vec4 v_color;										\n',
'															\n',
'void main(void) {											\n',
'	gl_FragColor = v_color;									\n',
'}															\n',
].join('');