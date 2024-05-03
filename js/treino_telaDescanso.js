var utils = new Utils({width: innerWidth, height: innerHeight});
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
uniform float transformValue;

void main(){
gl_PointSize = 10.0;
gl_Position = vec4(aPosition + transformValue, 0.0, 1.0);

}`
});

//vai pegar as variaveis e ligar ao buffer da gpu
utils.linkBuffer();

transformValue = 0;
speed = 100;
function render1(){
    utils.linkUniformVariable({shaderName : "transformValue", value : transformValue});
    utils.drawElements({method : "TRIANGLES"});
    if (transformValue <= 0.6){
        transformValue += 0.01;

        setTimeout(
            render1, speed
        );
    }else{
        
        setTimeout(
            render2, speed
        );
    }
    
}
function render2(){
    if(transformValue === 0.6){
        transformValue = 0;
        render2();
    }else{
        utils.linkUniformVariable({shaderName : "transformValue", value : transformValue});
        utils.drawElements({method : "TRIANGLES"});
        
        if (transformValue >= -0.6){
            transformValue -= 0.01;
            setTimeout(
                render2, speed
            );
        }else{
            setTimeout(
                render1, speed
            );
        }
    }
}
render1();
