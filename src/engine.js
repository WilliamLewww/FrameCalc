var gl;
const SCREEN_WIDTH = 200;
const SCREEN_HEIGHT = 200;

var programList = [];

function initialize() {
	var canvas = document.getElementById("glCanvas");
	gl = canvas.getContext("experimental-webgl");

	programList.push(createProgram(VERTEX_SHADER_1, FRAGMENT_SHADER_1));

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	rectangle = new Rectangle(0, 0, 100, 100, [243,52,5,255]);
	rectangle.draw();

	console.log(getPixel(0,0));
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

function denormalizeColor(color) {
	return [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, color[3] / 255.0];
}

function Rectangle(x, y, width, height, color = [255,0,0,255]) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;

	this.program = programList[0];

	this.positionAttributeLocation = gl.getAttribLocation(this.program, 'position');
	this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');
	this.colorLocation = gl.getUniformLocation(this.program, 'color');

	this.positionBuffer = gl.createBuffer();

	this.draw = () => {
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.positionAttributeLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPositionArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.uniform4fv(this.colorLocation, denormalizeColor(this.color));
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	this.getPositionArray = () => {
		return [
			this.x, this.y,
			this.x + this.width, this.y,
			this.x, this.y + this.height,
			this.x, this.y + this.height,
			this.x + this.width, this.y,
			this.x + this.width, this.y + this.height,
		];
	}
}