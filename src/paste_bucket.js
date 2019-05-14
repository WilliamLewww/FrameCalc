function addData(data) {
	var rgba = convertDataToPixel(data);
	console.log(data + ":" + rgba);
	pixelDataList.push(new Point(currentDataCoord[0], currentDataCoord[1], [rgba[0],rgba[1],rgba[2],rgba[3]]));

	if (currentDataCoord[0] == gl.canvas.width - 1) {
		currentDataCoord[0] = 0;
		currentDataCoord[1] += 1;
	}
	else { currentDataCoord[0] += 1; }
}