var utils = new Utils();
var gl = utils.gl;
var xi = -0.9;
var yi = -0.8;
var xf = 0.9;
var yf = 0.8;

//vertices para o "corpo da fenix"
var xi2 = -0.05;
var yi2 = -0.2;
var xf2 = 0.05;
var yf2 = 0.2;

//vertices para fazer o bico
var xi3 = -0.2;
var yi3 =  0.12;
var xf3 =  0.0;
var yf3 =  0.203;

//vertices para as asas
var xi4 =  0.0;
var yi4 =  -0.1;
var xf4 =  0.38;
var yf4 =  0.07;

//vertices para o retangulo do escudo
var xi5 = -0.5;
var yi5 = -0.2;
var xf5 = 0.5;
var yf5 = 0.5;

vertices = [
   xi, yi, xf, yf, xi, yf,
   xi, yi, xf, yf, xf, yi,
]
verticeRetanguloEscudo = [
   xi5, yi5, xf5, yf5, xi5, yf5,
   xi5, yi5, xf5, yf5, xf5, yi5,
 ];

verticeRetangulo = [
   xi2, yi2, xf2, yf2, xi2, yf2,
   xi2, yi2, xf2, yf2, xf2, yi2,
 ];


 verticesBico = [
   xi3, yi3, xf3, yf3, xf3, yi3
 ]

 verticesFenix = [
   //asa da direita
   xi4, yi4, xf4, yf4, xi4, yf4,
   //asa da esquerda
   xi4, yi4, xf4 * -1, yf4, xi4, yf4,
   //detalhe na direita
   xi4, yi4 +0.05, xf4 - 0.15, yf4 * -1, xi4, yf4,
   //detalhe na esquerda
   xi4 , yi4 + 0.036, xf4 * -1 + 0.15, yf4 - 0.14, xi4, yf4 - 0.05,
   //base
   xi4, yi4 -0.15, xf4 - 0.17, yf4 - 0.2, xi4, yf4 - 0.2,
   xi4, yi4 -0.15, xf4 * -1 + 0.17, yf4 - 0.2, xi4, yf4 - 0.2,
 ]



 //formando vertices do circulo
var radius = 0.5;
var segments = 40;
var verticesCircle = [];


for (var i = 0; i < segments; i++) {
    var theta = (i / segments) * Math.PI * 2;
    var x = Math.cos(theta) * radius;
    var y = Math.sin(theta) * radius;
    verticesCircle.push(x, y-0.16);
}


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
   
   
   //asas da fenix
   utils.initBuffer({vertices: verticesFenix});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [1.0,1.0,0.0], kind: "3fv"});
   utils.drawElements({method : "TRIANGLES", clear : false});

   //parte do bico
   utils.initBuffer({vertices: verticesBico});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [1.0,1.0,0.0], kind: "3fv"});
   utils.drawElements({method : "TRIANGLES", clear : false});

   //parte amarela - corpo da fenix
   utils.initBuffer({vertices: verticeRetangulo});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [1.0,1.0,0.0], kind: "3fv"});
   utils.drawElements({method : "TRIANGLES", clear : false});
   
   //parte de cima do escudo
   utils.initBuffer({vertices: verticeRetanguloEscudo});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [0.0,0.0,1.0], kind: "3fv"})
   utils.drawElements({method : "TRIANGLES", clear : false});

   //parte baixa do escudo
   utils.initBuffer({vertices: verticesCircle});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [0.0,0.0,1.0], kind: "3fv"})
   utils.drawElements({method : "TRIANGLE_FAN", clear : false});
   
   
   //parte branca
   utils.initBuffer({vertices: vertices});
   utils.linkBuffer();
   utils.linkUniformVariable({shaderName: "uColor", value: [1.0,1.0,1.0], kind: "3fv"})
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








