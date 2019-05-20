<img src="https://raw.githubusercontent.com/WilliamLewww/FrameCalc/master/res/logo.png" width="500" height="78">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/WilliamLewww/FrameCalc) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/WilliamLewww/FrameCalc) [![commits](https://img.shields.io/github/commit-activity/m/WilliamLewww/FrameCalc.svg)](https://github.com/WilliamLewww/FrameCalc)

FrameCalc is a Javascript library that uses GLSL Shader programs to perform calculations in the GPU.

## Installation

Include ```framecalc.min.js``` to your website.

```html
<script src="framecalc.min.js"></script>
```

## Usage
Make sure to initialize FrameCalc!

```html
<!-- index.html -->
<body onload="initializeFC(document.getElementById('glCanvas'))">
	<canvas id="glCanvas" width="200" height="200">
	        Your browser doesn't appear to support the HTML5 <code>&lt;canvas&gt;</code> element.
	</canvas>
</body>
```
Simple demonstration of 2x2 matrix multiplication.
```javascript
var pixelBuffer = new PixelBuffer();

//each data point is stored like a vertex attribute
pixelBuffer.pushMatrix([0,1,2,3], 2, 2);
pixelBuffer.pushMatrix([4,5,6,7], 2, 2);
pixelBuffer.multiplyMatrix(0,1);

//output is stored on newly created matrix
console.log(pixelBuffer.getMatrix(2));
```

## Description
FrameCalc uses a framebuffer to store/manipulate data as pixels. The data is fed through the OpenGL pipeline and the GPU outputs the data to the framebuffer. ```Vertex Calculations``` are done on the ```Vertex Shader``` and ```Matrix Calculations``` are done on the ```Fragment Shader```.

The ```PixelBuffer``` object stores the created matrices and calculations.
```javascript
//initialize pixel buffer
var pixelBuffer = new PixelBuffer();

//create a matrix with 3 rows and 2 cols
pixelBuffer.pushMatrix([0,1,
			2,3,
			4,5],3,2);

//create a matrix with 2 rows and 3 cols
pixelBuffer.pushMatrix([5,4,3,
			2,1,0],2,3);

//render the two matrices to the framebuffer
pixelBuffer.render();

//multiply the first and second matrix
pixelBuffer.multiplyMatrix(0,1);

//get the result of the calculation
var result = pixelBuffer.getMatrix(pixelBuffer.getMatrixCount() - 1);
```

## Contributors
**William Lew** - SFSU Computer Science Undergraduate
