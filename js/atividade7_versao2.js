var utils = new Utils();


// Colocaremos aqui os dado que passaremos para a GPU
var vertices = []
var colors = []

// Colocaremos todas as coordenadas do cubo
var cubeVertices = [
    [-0.5, -0.5,  0.5 ], 
    [-0.5,  0.5,  0.5 ], 
    [0.5,  0.5,  0.5  ],  
    [0.5, -0.5,  0.5  ],  
    [-0.5, -0.5, -0.5 ], 
    [-0.5,  0.5, -0.5 ], 
    [0.5,  0.5, -0.5  ],  
    [0.5, -0.5, -0.5  ]
]

var cubeColors = [
    [0.0, 0.0, 0.0],   // preto
    [1.0, 0.0, 0.0],   // vermelho
    [1.0, 1.0, 0.0],   // amarelo
    [0.0, 1.0, 0.0],   // verde
    [0.0, 0.0, 1.0],   // azul
    [1.0, 0.0, 1.0],   // rosa
    [0.0, 1.0, 1.0],   // ciano
    [1.0, 1.0, 1.0]    // branco
]

var imageSize = 0.16666;
var textureCoordinates = [
    // Face frontal
    imageSize, 0.0,
    imageSize * 2, 0.0,
    imageSize * 2, 1.0,
    imageSize, 0.0,
    imageSize * 2, 1.0,
    imageSize, 1.0,

    // Face traseira
    imageSize * 2, 0.0,
    imageSize * 3, 0.0,
    imageSize * 3, 1.0,
    imageSize * 2, 0.0,
    imageSize * 3, 1.0,
    imageSize * 2, 1.0,

    // Face superior
    imageSize * 3, 0.0,
    imageSize * 4, 0.0,
    imageSize * 4, 1.0,
    imageSize * 3, 0.0,
    imageSize * 4, 1.0,
    imageSize * 3, 1.0,

    // Face inferior
    0.0, 0.0,
    imageSize, 0.0,
    imageSize, 1.0,
    0.0, 0.0,
    imageSize, 1.0,
    0.0, 1.0,

    // Face esquerda
    imageSize * 4, 0.0,
    imageSize * 5, 0.0,
    imageSize * 5, 1.0,
    imageSize * 4, 0.0,
    imageSize * 5, 1.0,
    imageSize * 4, 1.0,

    // Face direita
    imageSize * 5, 0.0,
    imageSize * 6, 0.0,
    imageSize * 6, 1.0,
    imageSize * 5, 0.0,
    imageSize * 6, 1.0,
    imageSize * 5, 1.0,
];


function makeFace(v1, v2, v3, v4) {

    // Coordenadas dos dois triângulos
    triangulos = [v1, v2, v3, v1, v3, v4]

    for ( var i = 0; i < triangulos.length; i++ ) {
    vertices.push(cubeVertices[triangulos[i]][0]);
	vertices.push(cubeVertices[triangulos[i]][1]);
	vertices.push(cubeVertices[triangulos[i]][2]);
	
    colors.push(  cubeColors  [v1][0]);
	colors.push(  cubeColors  [v1][1]);
	colors.push(  cubeColors  [v1][2]);

    }
}

// Abaixo tomamos o cuidado de sempre, gerar uma face começando com um
// dos vértices. Isso permite dar à face a cor do vértice.
makeFace(1, 0, 3, 2);
makeFace(2, 3, 7, 6);
makeFace(3, 0, 4, 7);
makeFace(6, 5, 1, 2);
makeFace(4, 5, 6, 7);
makeFace(5, 4, 0, 1);

// Criamos agora as variáveis aPosition e aColor para recebermos tanto
// a posição quanto as cores de cada vértice.
utils.initShader({
    vertexShader : `#version 300 es
precision mediump float;

in vec3 aPosition;
//in vec3 aColor;//POIS AGORA VOU USAR TEXTURA
in vec2 textCoords;


uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;


uniform float uPitch;
uniform float uYaw;
uniform vec3 theta;  // Ângulos de rotação para x, y, z
uniform vec3 uTranslation;  // Vetor de translação
uniform float uScale;  // Fator de escala

//out vec4 vColor;  //POIS AGORA VOU USAR TEXTURA
out vec2 textureCoords;

void main() {
    // Cálculo das matrizes de rotação baseadas em ângulos theta
    vec3 c = cos(radians(theta));
    vec3 s = sin(radians(theta));

    mat4 rx = mat4(1.0,  0.0,  0.0, 0.0,
                   0.0,  c.x,  s.x, 0.0,
                   0.0, -s.x,  c.x, 0.0,
                   0.0,  0.0,  0.0, 1.0);

    mat4 ry = mat4(c.y, 0.0, -s.y, 0.0,
                   0.0, 1.0,  0.0, 0.0,
                   s.y, 0.0,  c.y, 0.0,
                   0.0, 0.0,  0.0, 1.0);

    mat4 rz = mat4(c.z, s.z, 0.0, 0.0,
                  -s.z,  c.z, 0.0, 0.0,
                   0.0,  0.0, 1.0, 0.0,
                   0.0,  0.0, 0.0, 1.0);

    // Matriz de escala
    mat4 scaleMatrix = mat4(
        uScale, 0.0,    0.0,    0.0,
        0.0,    uScale, 0.0,    0.0,
        0.0,    0.0,    uScale, 0.0,
        0.0,    0.0,    0.0,    1.0
    );

    // Matriz de translação
    mat4 translationMatrix = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        uTranslation.x, uTranslation.y, uTranslation.z, 1.0
    );

   
    mat4 pitchMatrix = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, cos((uPitch)), -sin((uPitch)), 0.0,
        0.0, sin((uPitch)), cos((uPitch)), 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 yawMatrix = mat4(
        cos((uYaw)), 0.0, -sin((uYaw)), 0.0,
        0.0, 1.0, 0.0, 0.0,
        sin((uYaw)), 0.0, cos((uYaw)), 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    
    mat4 modelMatrix = uProjectionMatrix * yawMatrix * pitchMatrix * uViewMatrix * translationMatrix * scaleMatrix * rz * ry * rx;
    

    vec4 transformedPosition = modelMatrix * vec4(aPosition, 1.0);

    gl_Position = transformedPosition;
    textureCoords = textCoords;
}
`,
    fragmentShader : `#version 300 es
    precision highp float;
    
    in vec2 textureCoords;
    
    uniform sampler2D uSampler;
    uniform vec2 uTextureSize;
    
    uniform float uKernel[9];
    
    out vec4 fColor;
    
    void main(){
        vec2 onePixel = vec2(1.0, 1.0) / uTextureSize;
    

        vec4 pixelSupEsquerdo  = texture(uSampler, textureCoords + onePixel * vec2(-1,  1))  * uKernel[0];
        vec4 pixelSuperior     = texture(uSampler, textureCoords + onePixel * vec2( 0,  1))  * uKernel[1];
        vec4 pixelSupDireito   = texture(uSampler, textureCoords + onePixel * vec2( 1,  1))  * uKernel[2];
        vec4 pixelEsquerdo     = texture(uSampler, textureCoords + onePixel * vec2(-1,  0))  * uKernel[3];
        vec4 pixelCentro       = texture(uSampler, textureCoords + onePixel * vec2( 0,  0))  * uKernel[4];
        vec4 pixelDireito      = texture(uSampler, textureCoords + onePixel * vec2( 1,  0))  * uKernel[5];
        vec4 pixelInfEsquerdo  = texture(uSampler, textureCoords + onePixel * vec2(-1, -1))  * uKernel[6];
        vec4 pixelInferior     = texture(uSampler, textureCoords + onePixel * vec2( 0, -1))  * uKernel[7];
        vec4 pixelInfDireito   = texture(uSampler, textureCoords + onePixel * vec2( 1, -1))  * uKernel[8];
        
        
        fColor = pixelSupEsquerdo + pixelSuperior + pixelSupDireito + pixelEsquerdo + pixelCentro + pixelDireito + pixelInfEsquerdo + pixelInferior + pixelInfDireito;
        fColor.a = 1.0;
        
    }`
});

utils.initBuffer({vertices});
utils.linkBuffer({reading : 3});

utils.initBuffer({ vertices: textureCoordinates });
utils.linkBuffer({reading : 2, variable : "textCoords"});


// Agora vamos fazer o cubo rotacionar.
var theta = [0.0, 0.0, 0.0]; // Rotações nos eixos X, Y, Z

// Variações a serem aplicadas para gerar a animação
var rotation_x = 0.0;
var rotation_y = 0.0;
var rotation_z = 0.0;

// Agora vamos mover o cubo.
var translation = [0.0, 0.0, 0.0];

var translation_x = 0.0;
var translation_y = 0.0;
var translation_z = 0.0;


// Agora vamos aumentar o tamanho do cubo.
var uScale = 1;
var scale = 0;

// Velocidade da animação
var speed = 100;

/*
CRIANDO A TEXTURA
*/
var gl = utils.gl;
var texture1 = gl.createTexture();

var facesImages = new Image();
facesImages.onload = function() {
    textureGatoPersa = utils.initTexture({image : facesImages});  
}
facesImages.src = 'texturas/textura_cada_face.jpg';

/*
ATIVANDO TEXTURA
*/ 
utils.activateTexture(texture1, 0);

document.getElementById("slider").onchange = function(event) {
    speed = 100 - event.target.value;
};

/************************************************/
// Capture os eventos do teclado e mouse
/************************************************/
document.getElementById("RotationX").onclick = function (event) {
    rotation_x = -rotation_x;
};

document.getElementById("RotationStartX").onclick = function (event) {
    rotation_x = 10;
};

document.getElementById("RotationStopX").onclick = function (event) {
    rotation_x = 0;
};

document.getElementById("RotationY").onclick = function (event) {
    rotation_y = -rotation_y;
};

document.getElementById("RotationStartY").onclick = function (event) {
    rotation_y = 10;
};

document.getElementById("RotationStopY").onclick = function (event) {
    rotation_y = 0;
};

document.getElementById("RotationZ").onclick = function (event) {
    rotation_z = -rotation_z;
};

document.getElementById("RotationStartZ").onclick = function (event) {
    rotation_z = 10;
};

document.getElementById("RotationStopZ").onclick = function (event) {
    rotation_z = 0;
};

document.getElementById("ScaleDirection").onclick = function (event) {
    scale = -scale;
};

document.getElementById("ScaleStart").onclick = function (event) {
    scale = 0.01;
};

document.getElementById("ScaleStop").onclick = function (event) {
    scale = 0;
};

document.getElementById("TranslationX").onclick = function (event) {
    translation_x = -translation_x;
};

document.getElementById("TranslationStartX").onclick = function (event) {
    translation_x = 0.01;
};

document.getElementById("TranslationStopX").onclick = function (event) {
    translation_x = 0;
};

document.getElementById("TranslationY").onclick = function (event) {
    translation_y = -translation_y;
};

document.getElementById("TranslationStartY").onclick = function (event) {
    translation_y = 0.01;
};

document.getElementById("TranslationStopY").onclick = function (event) {
    translation_y = 0;
};

document.getElementById("TranslationZ").onclick = function (event) {
    translation_z = -translation_z;
};

document.getElementById("TranslationStartZ").onclick = function (event) {
    translation_z = 0.01;
};

document.getElementById("TranslationStopZ").onclick = function (event) {
    translation_z = 0;
};

document.getElementById("suavizar").onclick = function(event){
    suavizar = true;
    realcar = false;
    agucar = false;
};

document.getElementById("realcar").onclick = function(event){
    realcar = true;
    suavizar = false;
    agucar = false;
    
};

document.getElementById("agucar").onclick = function(event){
    agucar = true;
    realcar = false;
    suavizar = false;
};

document.getElementById("remover_efeitos").onclick = function(event){
    agucar = false;
    realcar = false;
    suavizar = false;
};
var cameraPosition = { x: 0, y: 0, z: 3 };
var cameraRotation = { pitch: 0, yaw: 0 };
var spotlightOn = true;

/*
evento do movimento do mouse para controlar pitch/yaw
*/
document.getElementById("canvas").addEventListener("mousemove", function(event){
    var rSpeed = 0.01;
    
    cameraRotation.yaw -= event.movementX * rSpeed;
    cameraRotation.pitch -= - event.movementY * rSpeed;
    updateViewMatrix();
});

//click esquerdo para centralizar camera novamente
document.getElementById("canvas").addEventListener("click", function(event){

    cameraPosition = { x: 0, y: 0, z: 3 };
    cameraRotation = { pitch: 0, yaw: 0 };
    updateViewMatrix();
});

document.addEventListener('keydown', function(event) {
    var tSpeed = 0.1; // Velocidade de movimento da câmera
    var rSpeed = 0.05; // Velocidade de rotação da câmera.
    
    switch (event.key) {
	
    case 'w': 
    cameraPosition.z -= tSpeed;  
        break;
    case 's': 
    cameraPosition.z += tSpeed; 
        break;
    case 'd': 
    cameraPosition.x -= tSpeed;
        break;
    case 'a': 
    cameraPosition.x += tSpeed;
        break;
    

    case 'i': 
    cameraRotation.pitch -= rSpeed;
    console.log("clicou");
    break;
    
    case 'k': 
    cameraRotation.pitch += rSpeed;
    break;
    
    case 'j': 
    cameraRotation.yaw += rSpeed;
    break;

    case 'l': 
    cameraRotation.yaw -= rSpeed;
    break;
    }
    
    updateViewMatrix();
});

function updateViewMatrix() {
    viewMatrix = mat4.create(); // Cria uma nova matriz 4x4
    var up = vec3.fromValues(0, 1, 0); // Direção 'up' do mundo, geralmente o eixo Y
    var target = vec3.fromValues(cameraPosition.x, cameraPosition.y, cameraPosition.z - 1);
    mat4.lookAt(viewMatrix,
               [cameraPosition.x,
                cameraPosition.y,
                cameraPosition.z],
                target,
                up);

    utils.linkUniformMatrix({shaderName: "uViewMatrix", value: viewMatrix, kind: "4fv"});
    utils.linkUniformVariable({shaderName: "uPitch", value: cameraRotation.pitch, kind: "1f"});
    utils.linkUniformVariable({shaderName: "uYaw", value: cameraRotation.yaw, kind: "1f"});
}

/***************************************************
Agora vamos tratar da câmera
***************************************************/
var projectionPerspectiveMatrix = mat4.create();
mat4.perspective(
    projectionPerspectiveMatrix,
    45 * Math.PI / 8,
    1,
    0.1, //near
    100 //far
);

utils.linkUniformMatrix({shaderName:"uProjectionMatrix", value: projectionPerspectiveMatrix});

//matriz de visualização olhando
// para o centro do cubo.
var viewMatrix = mat4.create();
mat4.lookAt(
    viewMatrix,
    [0,0,3],
    [0,0,0],
    [0,1,0]
);

utils.linkUniformMatrix({shaderName: "uViewMatrix", value: viewMatrix});

/* 
PREPARANDO KERNEL
*/
var suavizar = false;
var realcar = false;
var agucar = false;

var kernelSuavizacao = [
    1/8, 1/8, 1/8,
    1/8, 0,   1/8,
    1/8, 1/8, 1/8
];

var kernelRealcaBorda = [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1
];

var kernelAgucamento = [
    0,  -1,  0,
    -1,  5, -1,
    0,  -1,  0
];

var kernelPadrao = [
    0,  0,  0,
    0,  1,  0,
    0,  0,  0
];

function render(){
    theta[0] += rotation_x;
    theta[1] += rotation_y;
    theta[2] += rotation_z; 

    translation[0] += translation_x;
    translation[1] += translation_y;
    translation[2] += translation_z; 

    uScale += scale;

    if(!suavizar && !realcar && !agucar) utils.linkUniformVariable({shaderName: "uKernel", value: kernelPadrao, kind: "1fv"});

    if  (suavizar)    utils.linkUniformVariable({shaderName: "uKernel", value: kernelSuavizacao, kind: "1fv"});
    if  (realcar)     utils.linkUniformVariable({shaderName: "uKernel", value: kernelRealcaBorda, kind: "1fv"});
    if  (agucar)      utils.linkUniformVariable({shaderName: "uKernel", value: kernelAgucamento, kind: "1fv"});

    utils.linkUniformVariable({shaderName : "theta", value : theta, kind : "3fv"});

    utils.linkUniformVariable({shaderName : "uTranslation", value : translation, kind : "3fv"});

    utils.linkUniformVariable({shaderName : "uScale", value : uScale, kind : "1f"});
    
    utils.linkUniformVariable({shaderName:"uSampler", value:0, kind:"1i"});

    utils.linkUniformVariable({shaderName: "uTextureSize", value: [facesImages.width, facesImages.height], kind: "2fv"});

    utils.drawElements({method : "TRIANGLES"});

        
    setTimeout(
	render, speed
    );
}
render();