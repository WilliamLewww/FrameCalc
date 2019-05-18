const SHADER_SOURCE = { "DEFAULT": 0, "BUFFER": 1, "MULTIPLY_2X2": 2 };
const MAX_DATA_VALUE = 5599.9999;
const MAX_RGB_VALUES = [255,99,99,99];
const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

var gl;
var programList = [];

function initialize(canvas = document.createElement('canvas')) {
	gl = canvas.getContext("experimental-webgl");
	gl.canvas.width = CANVAS_WIDTH;
	gl.canvas.height = CANVAS_HEIGHT;
	gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	programList.push(createProgram(VERTEX_SHADER_DEFAULT, FRAGMENT_SHADER_DEFAULT));
	programList.push(createProgram(VERTEX_SHADER_PIXEL_BUFFER, FRAGMENT_SHADER_PIXEL_BUFFER));
	programList.push(createProgram(VERTEX_SHADER_MULTIPLY_2X2, FRAGMENT_SHADER_MULTIPLY_2X2));
	
	performOperations();
}

function performOperations() {
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var pixelBuffer = new PixelBuffer();
	pixelBuffer.pushMatrix([0,1,
							2,3], 2, 2);
	pixelBuffer.pushMatrix([4,5,
							6,7], 2, 2);
	pixelBuffer.render();
	pixelBuffer.multiplyMatrix(0,1);
}

function createProgram(vertexSource, fragmentSource) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vertexShader, vertexSource);
	gl.shaderSource(fragmentShader, fragmentSource);

	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	return program;
}