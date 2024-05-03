var utils = new Utils();
var xi = -0.4;
var yi = -0.4;
var xf = 0.4;
var yf = 0.4;

vertices = [
    xi, yi, xf, yf, xi, yf,
    xi, yi, xf, yf, xf, yi,
 ]

utils.initBuffer({vertices});

utils.initShader({
    vertexShader : `#version 300 es
precision mediump float;

in vec2 aPosition;

uniform float transformValue; // Valor para a rotação
uniform float translation_transformValue; // Valor para a translação
uniform float scale_transformValue; // Valor para a escala

void main() {

    float angle = transformValue;
    mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    
    vec2 translation = vec2(translation_transformValue, translation_transformValue);
    
    vec2 scale = vec2(scale_transformValue, scale_transformValue);
    
    //rotação, escala e translação
    vec2 transformedPosition = rotationMatrix * (scale * (aPosition - translation));

    gl_PointSize = 10.0;
    gl_Position = vec4(transformedPosition, 0.0, 1.0);
}
`
});

utils.linkBuffer();

transformValue = 0;
translation_transformValue = 0;
scale_transformValue = 0;
speed = 100;
function render(){
    utils.linkUniformVariable({shaderName : "transformValue", value : transformValue});
    utils.linkUniformVariable({shaderName : "scale_transformValue", value : scale_transformValue});
    utils.linkUniformVariable({shaderName : "translation_transformValue", value : translation_transformValue});
    utils.drawElements({method : "TRIANGLES"});
    transformValue += 0.01;
    scale_transformValue += 0.01;
    translation_transformValue += 0.01;
    setTimeout(
	render, speed
    );
}
render();
