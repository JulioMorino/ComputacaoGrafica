var utils = new Utils();
var gl = utils.gl;
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

var verticesFaixa = [
    -0.2, 0,
    0.2, 0.03,

    -0.2, -0.01,
    0.2, 0.04,

    -0.2, 0,
    0.2, 0.02,

    -0.2, 0,
    0.2, 0.01
]
/////////////
//Primeira execução
/////////////
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
    
    //rotacao, escala e translação
    vec2 transformedPosition = rotationMatrix * (scale * (aPosition - translation));

    gl_PointSize = 10.0;
    gl_Position = vec4(transformedPosition, 0.0, 1.0);
}`,fragmentShader : `#version 300 es
precision highp float;
uniform vec3 uColor;
out vec4 fColor;
void main(){
  fColor = vec4(uColor, 1.0);
}`});


transformValue = 0.0;
translation_transformValue = 0.0;
scale_transformValue = 1;
speed = 100;
document.getElementById("speed").value = 100;

//////////////////////////////
//////////////////////////////

/*
FUNCOES
*/
function criarBandeira(){
   //apenas para não apagar o fundo do canvas
   gl.clearColor(0.1, 0.8, 0.3, 0.4);

	gl.enable(this.gl.DEPTH_TEST);
	
	gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
   
   //faixa branca
   utils.initBuffer({vertices: verticesFaixa});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [1.0,1.0,1.0], kind: "3fv"})
   utils.drawElements({method : "LINES", clear : false});
   //parte azul
   utils.initBuffer({vertices: verticesCircle});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [0.0,0.0,1.0], kind: "3fv"})
   utils.drawElements({method : "TRIANGLE_FAN", clear : false});
   
   
   //parte amarela
   utils.initBuffer({vertices: verticeLosangulo});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [1.0,1.0,0.0], kind: "3fv"});
   utils.drawElements({method : "TRIANGLES", clear : false});
   
   
   
   
   //parte verde
   utils.initBuffer({vertices: vertices});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [0.0,0.65,0.20], kind: "3fv"})
   utils.drawElements({method : "TRIANGLES", clear : false});
   
       
}
function render(){

   criarBandeira();
//chamando linkUniform para os valores não ficarem com lixo de memoria lá no glsl
utils.linkUniformVariable({shaderName : "transformValue", value : transformValue});
utils.linkUniformVariable({shaderName : "scale_transformValue", value : scale_transformValue});
utils.linkUniformVariable({shaderName : "translation_transformValue", value : translation_transformValue});

   if(rotationPressed){
      if(rotation_directionPositive){
         transformValue += 0.01;
         document.getElementById("muda_rotacao").style = "background-color:lightgreen;";
      } else{ 
            transformValue -= 0.01;
            document.getElementById("muda_rotacao").style = "background-color:red;";
         }
   }

   if(scalePressed){
      if(scale_directionPositive){
         scale_transformValue += 0.01;
         document.getElementById("muda_escala").style = "background-color:lightgreen;";
      }else {
         scale_transformValue -= 0.01;
         document.getElementById("muda_escala").style = "background-color:red;";
         }
   }

   if(translationPressed){
      if(translation_directionPositive){
         translation_transformValue += 0.01;
         document.getElementById("muda_translacao").style = "background-color:red;";
         console.log(translation_transformValue);
      }else{ 
            translation_transformValue -= 0.01;
            document.getElementById("muda_translacao").style = "background-color:lightgreen;";
            console.log(translation_transformValue);
         }
   }
speed = document.getElementById("speed").value;
document.getElementById("valor_velocidade").textContent = speed;
setTimeout(render, speed);
}
render();
/////////////////////////////////
////////////////////////////////
var rotationPressed = false;
var rotation_directionPositive = true;

var translationPressed = false;
var translation_directionPositive = true;

var scalePressed = false;
var scale_directionPositive = true;

/*
CHAMADA DAS FUNCOES
*/
document.getElementById("rotacao").addEventListener("click", function() {
   rotationPressed = true;
   console.log("O botão de rotação foi clicado!");
});
document.getElementById("muda_rotacao").addEventListener("click", function(){
   if(rotation_directionPositive)
      rotation_directionPositive = false;
   else rotation_directionPositive = true;
});
document.getElementById("para_rotacao").addEventListener("click", function(){
   rotationPressed = false;
   document.getElementById("muda_rotacao").style = "background-color:none;";
});



document.getElementById("translacao").addEventListener("click", function(){
   
   translationPressed = true;
    console.log("O botão de transladar foi clicado!");
});
document.getElementById("muda_translacao").addEventListener("click", function(){
   if(translation_directionPositive)
      translation_directionPositive = false;
   else translation_directionPositive = true;
});
document.getElementById("para_translacao").addEventListener("click", function(){

   translationPressed = false;
   document.getElementById("muda_translacao").style = "background-color:none;";
});



document.getElementById("escala").addEventListener("click", function(){
   
   scalePressed = true;
    
});
document.getElementById("muda_escala").addEventListener("click", function(){
   if(scale_directionPositive)
      scale_directionPositive = false;
   else scale_directionPositive = true;
});
document.getElementById("para_escala").addEventListener("click", function(){

   scalePressed = false;
   document.getElementById("muda_escala").style = "background-color:none;";
});








