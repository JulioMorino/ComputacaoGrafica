var utils = new Utils();

utils.initShader(
    {fragmentShader : `#version 300 es
precision highp float;
out vec4 fColor;
uniform float redColor;
void main(){
   fColor=vec4(redColor, 0.0, 0.0, 1.0);
}`}
);

function render(startX, startY, endX, endY){    
    var startCoords = utils.convertCoords({x : startX, y : startY});
    var endCoords = utils.convertCoords({x : endX, y : endY});
    
    var vertices = [
	startCoords.x, startCoords.y,
	endCoords.x, endCoords.y,
	startCoords.x, endCoords.y,
	startCoords.x, startCoords.y,
	endCoords.x, endCoords.y,
	endCoords.x, startCoords.y
    ]

    var redColor = Math.abs(startCoords.x - endCoords.x)/2;
    
    utils.initBuffer({vertices});
    utils.linkBuffer();

    utils.linkUniformVariable({shaderName : "redColor", value : redColor});
    
    utils.drawElements({method : "TRIANGLES"});
}

utils.initMouseMoveEvent(render);
