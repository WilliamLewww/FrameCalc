function denormalizeColor(color) {
	return [color[0] / MAX_RGB_VALUES[0], color[1] / MAX_RGB_VALUES[1], color[2] / MAX_RGB_VALUES[2], color[3] / MAX_RGB_VALUES[3]];
}

function Point(x, y, color) {
	this.x = x;
	this.y = y;
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
			this.x, this.y, this.x + 1, this.y, this.x, this.y + 1,
			this.x, this.y + 1, this.x + 1, this.y, this.x + 1, this.y + 1,
		];
	}
}