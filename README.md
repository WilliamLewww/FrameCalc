# FrameCalc

FrameCalc is a Javascript library that uses GLSL Shader programs to perform calculations in the GPU.

## Installation

Include 'framecalc.min.js' to your webpage.

```bash
<script src="framecalc.min.js"></script>
```

## Usage

```javascript
var pixelBuffer = new PixelBuffer();
pixelBuffer.pushMatrix([0,1,2,3], 2, 2);
pixelBuffer.pushMatrix([4,5,6,7], 2, 2);
pixelBuffer.multiplyMatrix(0,1);

console.log(pixelBuffer.getMatrix(2));
```

## Description
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
