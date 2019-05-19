
# FrameCalc

FrameCalc is a Javascript library that uses GLSL Shader programs to perform calculations in the GPU.

## Installation

Include 'framecalc.min.js' to your website.

```html
<script src="framecalc.min.js"></script>
```

## Usage
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
Unlike the other GPU based calculation libraries in Javascript, FrameCalc uses a framebuffer to store/manipulate data.

The ```PixelBuffer``` object stores the created matrices and calculations.
```javascript
//initialize pixel buffer
var pixelBuffer = new PixelBuffer();

//create a matrix with 3 rows and 2 cols
pixelBuffer.pushMatrix([0,1,
			2,3,
			4,5],3,2);
//render the matrix to the framebuffer
pixelBuffer.render();

//create a matrix with 2 rows and 3 cols
pixelBuffer.pushMatrix([5,4,3,
			2,1,0],2,3);

//multiply the first and second matrix
pixelBuffer.multiplyMatrix(0,1);

//get the result of the calculation
var result = pixelBuffer.getMatrix(pixelBuffer.getMatrixCount());
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
