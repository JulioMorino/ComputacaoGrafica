var utils = new Utils();
var xi = -0.9;
var yi = -0.8;
var xf = 0.9;
var yf = 0.8;

var xi2 = -0.3;
var yi2 = -0.3;
var xf2 = 0.3;
var yf2 = 0.3;




vertices = [
   xi, yi, xf, yf, xi, yf,
   xi, yi, xf, yf, xf, yi,
]




verticeLosangulo = [
   0.0,
   -0.5,
   0.0,
   0.5,
   0.7,
   0.0,
   0.0,
   0.5,
   0.0,
   -0.5,
   -0.7,
   0.0,
 ];


 //formando vertices do circulo
var radius = 0.2;
var segments = 40;
var verticesCircle = [];


for (var i = 0; i < segments; i++) {
    var theta = (i / segments) * Math.PI * 2;
    var x = Math.cos(theta) * radius;
    var y = Math.sin(theta) * radius;
    verticesCircle.push(x, y);
}

/////////////
//Primeira execução
/////////////
utils.initShader({
   vertexShader : `#version 300 es
precision mediump float;


in vec2 aPosition;
uniform float transformValue;


void main(){
   float angle = transformValue;
   mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
   vec2 center = vec2(0.0, 0.0);
   vec2 rotatedPosition = rotationMatrix * (aPosition - center);


   gl_PointSize = 10.0;
   gl_Position = vec4(rotatedPosition, 0.0, 1.0);
}`,fragmentShader : `#version 300 es
precision highp float;
uniform vec3 uColor;
out vec4 fColor;
void main(){
  fColor = vec4(uColor, 1.0);
}`});




transformValue = 0;
speed = 100;
function criarBandeira(){

    
}
//parte azul
utils.initBuffer({vertices: verticesCircle});
utils.linkBuffer();
utils.linkUniformVariable({shaderName: "uColor", value: [0.0,0.0,1.0], kind: "3fv"})
utils.drawElements({method : "TRIANGLE_FAN", clear : false});


//parte amarela
utils.initBuffer({vertices: verticeLosangulo});
utils.linkBuffer();
utils.linkUniformVariable({shaderName: "uColor", value: [1.0,1.0,0.0], kind: "3fv"});
utils.linkUniformVariable({shaderName : "transformValue", value : transformValue});
utils.drawElements({method : "TRIANGLES", clear : false});




//parte verde
utils.initBuffer({vertices: vertices});
utils.linkBuffer();
utils.linkUniformVariable({shaderName: "uColor", value: [0.0,0.65,0.20], kind: "3fv"})
utils.drawElements({method : "TRIANGLES", clear : false});
//////////////////////////////
//////////////////////////////

/*
FUNCOES
*/
function renderRotacao(){
   //parte azul
utils.initBuffer({vertices: verticesCircle});
utils.linkBuffer();
utils.linkUniformVariable({shaderName: "uColor", value: [0.0,0.0,1.0], kind: "3fv"})
utils.drawElements({method : "TRIANGLE_FAN", clear : false});


//parte amarela
utils.initBuffer({vertices: verticeLosangulo});
utils.linkBuffer();
utils.linkUniformVariable({shaderName: "uColor", value: [1.0,1.0,0.0], kind: "3fv"});
utils.linkUniformVariable({shaderName : "transformValue", value : transformValue});
utils.drawElements({method : "TRIANGLES", clear : false});




//parte verde
utils.initBuffer({vertices: vertices});
utils.linkBuffer();
utils.linkUniformVariable({shaderName: "uColor", value: [0.0,0.65,0.20], kind: "3fv"})
utils.drawElements({method : "TRIANGLES", clear : false});
   transformValue += 0.1;
   setTimeout(renderRotacao, speed);
}

function renderTranslacao(){
    
}
/////////////////////////////////
////////////////////////////////



/*
CHAMADA DAS FUNCOES
*/
document.getElementById("rotacao").addEventListener("click", function() {
    renderRotacao();
    console.log("O botão de rotação foi clicado!");
    
});

document.getElementById("translacao").addEventListener("click", function(){


    console.log("O botão de transladar foi clicado!");
});







