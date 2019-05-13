const MAX_DATA_VALUE = 5599.9999;
const MAX_RGB_VALUES = [255,99,99,99];
const SCREEN_WIDTH = 200;
const SCREEN_HEIGHT = 200;

var gl;
var programList = [];
var pixelDataList = [];
var currentDataCoord = [0,0];

function initialize() {
	var canvas = document.getElementById("glCanvas");
	gl = canvas.getContext("experimental-webgl");
	// gl.enable(gl.BLEND);
	// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	programList.push(createProgram(VERTEX_SHADER_1, FRAGMENT_SHADER_1));

	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	for (var x = 0; x < 1; x++) { addData(1235.5555); }

	pixelDataList.forEach(pixel => { pixel.draw(); });
	console.log(convertPixelToData(getPixel(0,0)));
}

function addData(data) {
	var rgba = convertDataToPixel(data);
	console.log(rgba);
	pixelDataList.push(new Point(currentDataCoord[0], currentDataCoord[1], [rgba[0],rgba[1],rgba[2],rgba[3]]));

	if (currentDataCoord[0] == gl.canvas.width - 1) {
		currentDataCoord[0] = 0;
		currentDataCoord[1] += 1;
	}
	else { currentDataCoord[0] += 1; }
}

function convertDataToPixel(data) {
	if (data > 5599.9999) { return ([155,99,99,99]); }
	if (data < -5599.9999) { return ([255,99,99,99]); }

	var tempData = Math.abs(data);
	var dec = Math.round((tempData % 1) * 10000);
	tempData = Math.floor(tempData);
	var g = tempData % 100;
	var r = Math.floor(tempData / 100);
	var a = dec % 100;
	var b = Math.floor(dec / 100);

	if (data < 0) { return ([r + 200, g, b, a]); }
	else { return ([r + 100, g, b, a]); }
}

function convertPixelToData(pixel) {
	var tempData = (pixel[0] - (Math.floor(pixel[0] / 100) * 100)) * 100;
	tempData += Math.floor(pixel[1]/255.0*100.0) + (Math.floor((pixel[2]/255)*100)/100) + (Math.floor((pixel[3]/255*100))/10000);

	if (Math.floor(pixel[0] / 100) == 1) { return tempData; }
	if (Math.floor(pixel[0] / 100) == 2) { return -tempData; }
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