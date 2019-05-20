const SHADER_SOURCE = { "DEFAULT": 0, "BUFFER": 1, "MULTIPLY_MATRIX": 2 };
const MAX_DATA_VALUE = 5599.9999;
const MAX_RGB_VALUES = [255,99,99,99];
const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

var glFC;
var programListFC = [];

function initializeFC(canvas = document.createElement('canvas')) {
	glFC = canvas.getContext("experimental-webgl");
	glFC.canvas.width = CANVAS_WIDTH;
	glFC.canvas.height = CANVAS_HEIGHT;
	glFC.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	programListFC.push(createProgramFC(VERTEX_SHADER_DEFAULT, FRAGMENT_SHADER_DEFAULT));
	programListFC.push(createProgramFC(VERTEX_SHADER_PIXEL_BUFFER, FRAGMENT_SHADER_PIXEL_BUFFER));
	programListFC.push(createProgramFC(VERTEX_SHADER_MULTIPLY_MATRIX, FRAGMENT_SHADER_MULTIPLY_MATRIX));
	
	performOperationsFC();
}

function performOperationsFC() {
	glFC.clearColor(0.0, 0.0, 0.0, 0.0);
	glFC.clear(glFC.COLOR_BUFFER_BIT | glFC.DEPTH_BUFFER_BIT);
	
	var pixelBuffer = new PixelBuffer();
	pixelBuffer.pushMatrix([0,1,2,3,4,5], 2, 3);
	pixelBuffer.pushMatrix([4,5,6,7,8,9], 3, 2);
	pixelBuffer.render();
	pixelBuffer.multiplyMatrix(0,1);
	console.log(pixelBuffer.getMatrix(2));
}

function createProgramFC(vertexSource, fragmentSource) {
	var vertexShader = glFC.createShader(glFC.VERTEX_SHADER);
	var fragmentShader = glFC.createShader(glFC.FRAGMENT_SHADER);
	glFC.shaderSource(vertexShader, vertexSource);
	glFC.shaderSource(fragmentShader, fragmentSource);

	glFC.compileShader(vertexShader);
	glFC.compileShader(fragmentShader);

	var program = glFC.createProgram();
	glFC.attachShader(program, vertexShader);
	glFC.attachShader(program, fragmentShader);
	glFC.linkProgram(program);

	return program;
}