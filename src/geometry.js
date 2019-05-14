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
			this.x, this.y, 
			this.x + 1, this.y, 
			this.x, this.y + 1,
			this.x, this.y + 1, 
			this.x + 1, this.y, 
			this.x + 1, this.y + 1,
		];
	}
}

function PointTest(x, y) {
	this.x = x;
	this.y = y;

	this.program = programList[1];

	this.positionBuffer = gl.createBuffer();
	this.colorBuffer = gl.createBuffer();
	this.positionAttributeLocation = gl.getAttribLocation(this.program, 'position');
	this.colorAttributeLocation = gl.getAttribLocation(this.program, 'a_color');
	this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');

	this.draw = () => {
		gl.useProgram(this.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.enableVertexAttribArray(this.positionAttributeLocation);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPositionArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		gl.enableVertexAttribArray(this.colorAttributeLocation);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getColorArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 8);
	}

	this.getPositionArray = () => {
		return [
			this.x, this.y, 
			this.x, this.y + 1,
			this.x + 1, this.y,
			this.x + 1, this.y + 1,

			this.x + 2, this.y,
			this.x + 2, this.y + 1,

			this.x + 3, this.y,
			this.x + 3, this.y + 1,
		];
	}

	this.getColorArray = () => {
		return [
			1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0,
			1.0, 0.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 1.0,

			0.0, 0.0, 1.0, 1.0,
			0.0, 1.0, 0.0, 1.0,

			0.0, 1.0, 0.0, 1.0,
			0.0, 1.0, 0.0, 1.0,
		];
	}
}

//positionArray.slice((8+(4*(gl.canvas.width-1)))*x,(8+(4*(gl.canvas.width-1)))*(x+1));
// .slice((8+(4*(gl.canvas.width-1)))*x,((8+(4*(gl.canvas.width-1)))*x)+(4*currentDataCoord[0]))
// .slice((4+(2*(gl.canvas.width-1)))*x,((4+(2*(gl.canvas.width-1)))*x)+(8*currentDataCoord[0]))
function PixelBuffer() {
	var positionArray = [];
	var colorArray = [];
	var currentDataCoord = [0,0];

	var program = programList[1];

	var positionBuffer = gl.createBuffer();
	var colorBuffer = gl.createBuffer();
	var positionAttributeLocation = gl.getAttribLocation(program, 'position');
	var colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
	var resolutionLocation = gl.getUniformLocation(program, 'resolution');

	this.render = () => {
		gl.useProgram(program);

		for (var x = 0; x <= currentDataCoord[1]; x++) {
			if (x == currentDataCoord[1]) {
				if(currentDataCoord[0] != 0) {
					gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
					gl.enableVertexAttribArray(positionAttributeLocation);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray.slice((8+(4*(gl.canvas.width-1)))*x,((8+(4*(gl.canvas.width-1)))*x)+(4*currentDataCoord[0]))), gl.STATIC_DRAW);
					gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

					gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
					gl.enableVertexAttribArray(colorAttributeLocation);
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray.slice((16+(8*(gl.canvas.width-1)))*x,((16+(8*(gl.canvas.width-1)))*x)+(8*currentDataCoord[0]))), gl.STATIC_DRAW);
					gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

					gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
					gl.drawArrays(gl.TRIANGLE_STRIP, 0, currentDataCoord[0] * 2);
				}
			}
			else {
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				gl.enableVertexAttribArray(positionAttributeLocation);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionArray.slice((8+(4*(gl.canvas.width-1)))*x,((8+(4*(gl.canvas.width-1)))*x)+(8+(4*(gl.canvas.width-1)))*(x+1))), gl.STATIC_DRAW);
				gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

				gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
				gl.enableVertexAttribArray(colorAttributeLocation);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray.slice((16+(8*(gl.canvas.width-1)))*x,((16+(8*(gl.canvas.width-1)))*x)+(16+(8*(gl.canvas.width-1)))*(x+1))), gl.STATIC_DRAW);
				gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

				gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
				gl.drawArrays(gl.TRIANGLE_STRIP, 0, (gl.canvas.width*2) + 2);
			}
		}
	}

	this.pushData = (data) => {
		if (currentDataCoord[0] >= gl.canvas.width + 1) {
			currentDataCoord[0] = 0; currentDataCoord[1] += 1;
		}

		if (currentDataCoord[0] == 0) {
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1] + 1);
			positionArray.push(currentDataCoord[0] + 1); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0] + 1); positionArray.push(currentDataCoord[1] + 1);

			colorArray.push(1.0,0.0,0.0,1.0);
			colorArray.push(1.0,0.0,0.0,1.0);
			colorArray.push(1.0,0.0,0.0,1.0);
			colorArray.push(1.0,0.0,0.0,1.0);		//needs to match currentDataCoord[0 + 1]

			currentDataCoord[0] += 2;
		}
		else {
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1] + 1);

			colorArray.push(1.0,0.0,0.0,1.0);
			colorArray.push(1.0,0.0,0.0,1.0);		//needs to match currentDataCoord[0 + 1]

			currentDataCoord[0] += 1;
		}
	}
}