function normalizePixel(pixel) { return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255, pixel[3] / 255]; }
function denormalizePixel(pixel) { return [pixel[0] * 255, pixel[1] * 255, pixel[2] * 255, pixel[3] * 255]; }

function PointTest(x, y) {
	this.x = x;
	this.y = y;

	this.program = programList[SHADER_SOURCE.BUFFER];

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
			0.0, 1.0, 0.0, 1.0,

			0.0, 1.0, 0.0, 1.0,
			0.0, 0.0, 1.0, 1.0,

			0.0, 0.0, 1.0, 1.0,
			0.0, 0.0, 1.0, 1.0,
		];
	}
}

function PixelBuffer() {
	var dataArray = [];
	var positionArray = [];
	var colorArray = [];
	var currentDataCoord = [0,0];

	var program = programList[SHADER_SOURCE.BUFFER];

	var positionBuffer = gl.createBuffer();
	var colorBuffer = gl.createBuffer();
	var positionAttributeLocation = gl.getAttribLocation(program, 'position');
	var colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
	var resolutionLocation = gl.getUniformLocation(program, 'resolution');

	var pointTest = new PointTest(-3,0);

	this.render = () => {
		pointTest.draw();
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

	var pushData = (data) => {
		var pixel = normalizePixel(convertDataToPixel(data));

		if (currentDataCoord[0] >= gl.canvas.width + 1) {
			currentDataCoord[0] = 0; currentDataCoord[1] += 1;
		}

		if (currentDataCoord[0] == 0) {
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1] + 1);
			positionArray.push(currentDataCoord[0] + 1); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0] + 1); positionArray.push(currentDataCoord[1] + 1);

			colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
			colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
			colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
			colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);

			currentDataCoord[0] += 2;
		}
		else {
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1] + 1);

			colorArray.pop();colorArray.pop();colorArray.pop();colorArray.pop();
			colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
			colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
			colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);

			currentDataCoord[0] += 1;
		}
	}

	this.pushMatrix = (dataList, rows, cols) => {
		for (var x = 0; x < rows; x++) {
			for (var y = 0; y < cols; y++) {
				pushData(dataList[y + (x * cols)]);
			}
		}

		dataArray.push([[currentDataCoord[0] - 2, currentDataCoord[1]], rows, cols]);
	}

	this.getData = (index) => { return dataArray[index]; }
}