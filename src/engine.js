const SHADER_SOURCE = { "DEFAULT": 0, "BUFFER": 1 };

const MAX_DATA_VALUE = 5599.9999;
const MAX_RGB_VALUES = [255,99,99,99];
const SCREEN_WIDTH = 200;
const SCREEN_HEIGHT = 200;

var gl;
var programList = [];

function initialize() {
	var canvas = document.getElementById("glCanvas");
	gl = canvas.getContext("experimental-webgl");
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	programList.push(createProgram(VERTEX_SHADER_DEFAULT, FRAGMENT_SHADER_DEFAULT));
	programList.push(createProgram(VERTEX_SHADER_PIXEL_BUFFER, FRAGMENT_SHADER_PIXEL_BUFFER));
	
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	var pixelBuffer = new PixelBuffer();
	for (var x = 0; x < 5; x++) {
		var data = Math.floor(Math.random()*(55999999+55999999+1)-55999999)/10000;
		pixelBuffer.pushMatrix([data], 1, 1);
	}
	pixelBuffer.render();

	console.log(pixelBuffer.getData(0));
	console.log(convertPixelToData(getPixel(0,0)));
}

function convertDataToPixel(data) {
	if (data > MAX_DATA_VALUE) { return ([155,MAX_RGB_VALUES[1],MAX_RGB_VALUES[2],MAX_RGB_VALUES[3]]); }
	if (data < -MAX_DATA_VALUE) { return ([255,MAX_RGB_VALUES[1],MAX_RGB_VALUES[2],MAX_RGB_VALUES[3]]); }

	var tempData = (data < 0) ? data * -1 : data;
	var dec = (tempData % 1) * 10000;
	dec = (dec - (dec << 0) < 0.5 ? (dec << 0) : ((dec + 1) << 0));
	tempData = tempData << 0;
	var g = tempData % 100;
	var r = (tempData / 100) << 0;
	var a = dec % 100;
	var b = (dec / 100) << 0;

	if (data < 0) { return ([r + 200, g, b, a]); }
	else { return ([r + 100, g, b, a]); }
}

function convertPixelToData(pixel) {
	var tempData = (pixel[0] - (((pixel[0] / 100) << 0) * 100)) * 100;
	var roundG = (pixel[1] - (pixel[1] << 0) < 0.5 ? (pixel[1] << 0) : ((pixel[1] + 1) << 0));
	var roundB = (pixel[2] - (pixel[2] << 0) < 0.5 ? (pixel[2] << 0) : ((pixel[2] + 1) << 0));
	var roundA = (pixel[3] - (pixel[3] << 0) < 0.5 ? (pixel[3] << 0) : ((pixel[3] + 1) << 0));
	tempData += roundG + (roundB/100) + (roundA/10000);

	if (((pixel[0] / 100) << 0) == 1) { return tempData; }
	if (((pixel[0] / 100) << 0) == 2) { return -tempData; }
}

function getPixel(x, y) {
	var pixels = new Uint8Array(4);
	gl.readPixels(x, SCREEN_HEIGHT - y - 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	return pixels;
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