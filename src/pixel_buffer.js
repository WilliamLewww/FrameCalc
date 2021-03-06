function normalizePixel(pixel) { return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255, pixel[3] / 255]; }
function denormalizePixel(pixel) { return [pixel[0] * 255, pixel[1] * 255, pixel[2] * 255, pixel[3] * 255]; }

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

function transposeMatrix(matrix) {
	var tempMatrix = [];
	for (var x = 0; x < matrix[0].length; x++) {
		var tempRow = [];
		for (var y = 0; y < matrix.length; y++) {
			tempRow.push(matrix[y][x]);
		}
		tempMatrix.push(tempRow);
	}

	return tempMatrix;
}

function getPixel(x, y) {
	var pixels = new Uint8Array(4);
	glFC.readPixels(x, CANVAS_HEIGHT - y - 1, 1, 1, glFC.RGBA, glFC.UNSIGNED_BYTE, pixels);

	return pixels;
}

function PointTest(x, y) {
	this.x = x;
	this.y = y;

	this.program = programListFC[SHADER_SOURCE.BUFFER];

	this.positionBuffer = glFC.createBuffer();
	this.colorBuffer = glFC.createBuffer();
	this.positionAttributeLocation = glFC.getAttribLocation(this.program, 'position');
	this.colorAttributeLocation = glFC.getAttribLocation(this.program, 'a_color');
	this.resolutionLocation = glFC.getUniformLocation(this.program, 'resolution');

	this.draw = () => {
		glFC.useProgram(this.program);

		glFC.bindBuffer(glFC.ARRAY_BUFFER, this.positionBuffer);
		glFC.enableVertexAttribArray(this.positionAttributeLocation);
		glFC.bufferData(glFC.ARRAY_BUFFER, new Float32Array(this.getPositionArray()), glFC.STATIC_DRAW);
		glFC.vertexAttribPointer(this.positionAttributeLocation, 2, glFC.FLOAT, false, 0, 0);

		glFC.bindBuffer(glFC.ARRAY_BUFFER, this.colorBuffer);
		glFC.enableVertexAttribArray(this.colorAttributeLocation);
		glFC.bufferData(glFC.ARRAY_BUFFER, new Float32Array(this.getColorArray()), glFC.STATIC_DRAW);
		glFC.vertexAttribPointer(this.colorAttributeLocation, 4, glFC.FLOAT, false, 0, 0);

		glFC.uniform2f(this.resolutionLocation, CANVAS_WIDTH, CANVAS_HEIGHT);
		glFC.drawArrays(glFC.TRIANGLE_STRIP, 0, 8);
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

	var pointTest = new PointTest(-3,0);

	this.render = () => {
		pointTest.draw();

		var positionBuffer = glFC.createBuffer();
		var colorBuffer = glFC.createBuffer();
		var positionAttributeLocation = glFC.getAttribLocation(programListFC[SHADER_SOURCE.BUFFER], 'position');
		var colorAttributeLocation = glFC.getAttribLocation(programListFC[SHADER_SOURCE.BUFFER], 'a_color');
		var resolutionLocation = glFC.getUniformLocation(programListFC[SHADER_SOURCE.BUFFER], 'resolution');
		glFC.useProgram(programListFC[SHADER_SOURCE.BUFFER]);

		for (var x = 0; x <= currentDataCoord[1]; x++) {
			if (x == currentDataCoord[1]) {
				if(currentDataCoord[0] != 0) {
					glFC.bindBuffer(glFC.ARRAY_BUFFER, positionBuffer);
					glFC.enableVertexAttribArray(positionAttributeLocation);
					glFC.bufferData(glFC.ARRAY_BUFFER, new Float32Array(positionArray.slice((8+(4*(CANVAS_WIDTH-1)))*x,((8+(4*(CANVAS_WIDTH-1)))*x)+(4*currentDataCoord[0]))), glFC.STATIC_DRAW);
					glFC.vertexAttribPointer(positionAttributeLocation, 2, glFC.FLOAT, false, 0, 0);

					glFC.bindBuffer(glFC.ARRAY_BUFFER, colorBuffer);
					glFC.enableVertexAttribArray(colorAttributeLocation);
					glFC.bufferData(glFC.ARRAY_BUFFER, new Float32Array(colorArray.slice((16+(8*(CANVAS_WIDTH-1)))*x,((16+(8*(CANVAS_WIDTH-1)))*x)+(8*currentDataCoord[0]))), glFC.STATIC_DRAW);
					glFC.vertexAttribPointer(colorAttributeLocation, 4, glFC.FLOAT, false, 0, 0);

					glFC.uniform2f(resolutionLocation, CANVAS_WIDTH, CANVAS_HEIGHT);
					glFC.drawArrays(glFC.TRIANGLE_STRIP, 0, currentDataCoord[0] * 2);
				}
			}
			else {
				glFC.bindBuffer(glFC.ARRAY_BUFFER, positionBuffer);
				glFC.enableVertexAttribArray(positionAttributeLocation);
				glFC.bufferData(glFC.ARRAY_BUFFER, new Float32Array(positionArray.slice((8+(4*(CANVAS_WIDTH-1)))*x,((8+(4*(CANVAS_WIDTH-1)))*x)+(8+(4*(CANVAS_WIDTH-1)))*(x+1))), glFC.STATIC_DRAW);
				glFC.vertexAttribPointer(positionAttributeLocation, 2, glFC.FLOAT, false, 0, 0);

				glFC.bindBuffer(glFC.ARRAY_BUFFER, colorBuffer);
				glFC.enableVertexAttribArray(colorAttributeLocation);
				glFC.bufferData(glFC.ARRAY_BUFFER, new Float32Array(colorArray.slice((16+(8*(CANVAS_WIDTH-1)))*x,((16+(8*(CANVAS_WIDTH-1)))*x)+(16+(8*(CANVAS_WIDTH-1)))*(x+1))), glFC.STATIC_DRAW);
				glFC.vertexAttribPointer(colorAttributeLocation, 4, glFC.FLOAT, false, 0, 0);

				glFC.uniform2f(resolutionLocation, CANVAS_WIDTH, CANVAS_HEIGHT);
				glFC.drawArrays(glFC.TRIANGLE_STRIP, 0, (CANVAS_WIDTH*2) + 2);
			}
		}
	}

	this.multiplyMatrix = (matrixIndexA, matrixIndexB) => {
		pointTest.draw();

		var positionBuffer = glFC.createBuffer();
		var positionAttributeLocation = glFC.getAttribLocation(programListFC[SHADER_SOURCE.MULTIPLY_MATRIX], 'position');
		var resolutionLocation = glFC.getUniformLocation(programListFC[SHADER_SOURCE.MULTIPLY_MATRIX], 'resolution');
		var matrixLocationA = glFC.getUniformLocation(programListFC[SHADER_SOURCE.MULTIPLY_MATRIX], 'matrixA');
		var matrixLocationB = glFC.getUniformLocation(programListFC[SHADER_SOURCE.MULTIPLY_MATRIX], 'matrixB');
		glFC.useProgram(programListFC[SHADER_SOURCE.MULTIPLY_MATRIX]);

		var matrixA = this.getMatrix(matrixIndexA);
		var matrixB = transposeMatrix(this.getMatrix(matrixIndexB));

		var previousDataCoord = [currentDataCoord[0], currentDataCoord[1]];
		this.pushMatrix([], matrixA.length, matrixB.length);

		for (var x = 0; x < matrixB.length; x++) {
			for (var y = 0; y < matrixA.length; y++) {
				glFC.bindBuffer(glFC.ARRAY_BUFFER, positionBuffer);
				glFC.enableVertexAttribArray(positionAttributeLocation);
				glFC.bufferData(glFC.ARRAY_BUFFER, new Float32Array(positionArray.slice((previousDataCoord[0]*4)-4+(4*((matrixA.length * x) + y)),(previousDataCoord[0]*4)+4+(4*((matrixA.length * x) + y)))), glFC.STATIC_DRAW);
				glFC.vertexAttribPointer(positionAttributeLocation, 2, glFC.FLOAT, false, 0, 0);

				glFC.uniform1fv(matrixLocationA, new Float32Array(matrixA[x]));
				glFC.uniform1fv(matrixLocationB, new Float32Array(matrixB[y]));
				glFC.uniform2f(resolutionLocation, CANVAS_WIDTH, CANVAS_HEIGHT);
				glFC.drawArrays(glFC.TRIANGLE_STRIP, 0, 4);
			}
		}

		var result = this.getMatrix(this.getMatrixCount() - 1);
		for (var x = 0; x < result.length; x++) {
			for (var y = 0; y < result[x].length; y++) {
				var pixel = normalizePixel(convertDataToPixel(result[x][y]));

				if (previousDataCoord[0] + (x * result[x].length) + y == 0 || previousDataCoord[0] + (x * result[x].length) + y == CANVAS_WIDTH) {
					colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
					colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
					colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
					colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
				}
				else {
					colorArray.pop();colorArray.pop();colorArray.pop();colorArray.pop();
					colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
					colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
					colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
				}
			}
		}
	}

	var pushData = (data) => {
		var pixel = normalizePixel(convertDataToPixel(data));

		if (currentDataCoord[0] >= CANVAS_WIDTH + 1) {
			currentDataCoord[0] = 0; currentDataCoord[1] += 1;
		}

		if (currentDataCoord[0] == 0) {
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1] + 1);
			positionArray.push(currentDataCoord[0] + 1); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0] + 1); positionArray.push(currentDataCoord[1] + 1);

			if (data != undefined) {
				colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
				colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
				colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
				colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
			}

			currentDataCoord[0] += 2;
		}
		else {
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1]);
			positionArray.push(currentDataCoord[0]); positionArray.push(currentDataCoord[1] + 1);

			if (data != undefined) {
				colorArray.pop();colorArray.pop();colorArray.pop();colorArray.pop();
				colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
				colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
				colorArray.push(pixel[0],pixel[1],pixel[2],pixel[3]);
			}

			currentDataCoord[0] += 1;
		}
	}

	this.pushMatrix = (dataList, rows, cols) => {
		for (var x = 0; x < rows; x++) {
			for (var y = 0; y < cols; y++) {
				pushData(dataList[y + (x * cols)]);
			}
		}

		dataArray.push([[currentDataCoord[0] - (cols * rows) - 1, currentDataCoord[1]], rows, cols]);
	}
	
	this.getMatrixCount = () => { return dataArray.length; }
	
	this.getMatrix = (index) => {
		var tempMatrix = [];
		for (var row = 0; row < dataArray[index][1]; row++) {
			var tempRow = [];
			for (var col = 0; col < dataArray[index][2]; col++) {
				if (dataArray[index][0][0] + col + (row * dataArray[index][2]) < 0) {
					tempRow.push(convertPixelToData(getPixel(CANVAS_WIDTH + dataArray[index][0][0] + col + (row * dataArray[index][2]), (dataArray[index][0][1] - 1))));
				}
				else {
					tempRow.push(convertPixelToData(getPixel(dataArray[index][0][0] + col + (row * dataArray[index][2]), dataArray[index][0][1])));
				}
			}

			tempMatrix.push(tempRow);
		}

		return tempMatrix; 
	}
}