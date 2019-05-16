const SHADER_SOURCE = { "DEFAULT": 0, "BUFFER": 1 };
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
	
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var pixelBuffer = new PixelBuffer();
	for (var x = 0; x < 2500; x++) {
		var data = Math.floor(Math.random()*(55999999+55999999+1)-55999999)/10000;
		pixelBuffer.pushMatrix([data,data,
								data,data,
								data,data], 3, 2);
	}

	pixelBuffer.render();

	console.log(pixelBuffer.getMatrix(0));
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