var utils = new Utils();


// Colocaremos aqui os dado que passaremos para a GPU
var vertices = []
var colors = []
var normals = [] // Precisamos agora do vetor normal de cada face para começar a computar.

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

/*
  A função recebe três pontos assumidamente distintos.  Como esses
  pontos são distintos, eles representam um plano. Para computar a
  direção do vetor normal que intuitivamente conhecemos como regra da
  mão direita, precisamos seguir alguns passos.

  Primeiro, você precisa de dois vetores que estão no plano formado
  pelos três pontos. Esses vetores podem ser encontrados subtraindo as
  coordenadas de um ponto pelas coordenadas de outro ponto. Por
  exemplo, dados três pontos A, B e C, podemos definir dois vetores AB
  e AC.

  AB = B - A; AC = C - A;
  
  Segundo, vetor normal ao plano pode ser encontrado usando o produto
  vetorial dos dois vetores no plano. O produto vetorial de dois
  vetores resultará em um terceiro vetor perpendicular a ambos, e,
  portanto, normal ao plano.

  Nx = ABy * ACz − ABz * ACy
  Ny = ABz * ACx − ABx * ACz
  Nz = ABx * ACy − ABy * ACx

*/
function computeProdutoVetorial(A, B, C) {
    // Extrair coordenadas dos pontos
    const Ax = A[0], Ay = A[1], Az = A[2];
    const Bx = B[0], By = B[1], Bz = B[2];
    const Cx = C[0], Cy = C[1], Cz = C[2];

    // Formar vetores AB e AC
    const ABx = Bx - Ax;
    const ABy = By - Ay;
    const ABz = Bz - Az;
    const ACx = Cx - Ax;
    const ACy = Cy - Ay;
    const ACz = Cz - Az;

    // Calcular o produto vetorial de AB e AC
    const i = ABy * ACz - ABz * ACy;
    const j = ABz * ACx - ABx * ACz;
    const k = ABx * ACy - ABy * ACx;

    // Retornar o vetor resultante
    return [i, j, k];
}


// Esta função irá criar as faces dos cubos.
// Cada face do cubo é na verdade um quadrado.
// Cada quadrado será desenhado com dois triângulos.
// Cada quadrado terá uma mesma cor.
// A função recebe as coordenadas dos quadrados.
function makeFace(v1, v2, v3, v4) {

    // Produto vetorial.Usando a regra da mão direita para
    // definir o vetor normal desta face.
    var normal = computeProdutoVetorial(
	cubeVertices[v1],
	cubeVertices[v2],
	cubeVertices[v3]
    )
        
    // Coordenadas dos dois triângulos
    triangulos = [v1, v2, v3, v1, v3, v4]

    for ( var i = 0; i < triangulos.length; i++ ) {
        vertices.push(cubeVertices[triangulos[i]][0]);
	vertices.push(cubeVertices[triangulos[i]][1]);
	vertices.push(cubeVertices[triangulos[i]][2]);
	
        colors.push(  cubeColors  [v1][0]);
	colors.push(  cubeColors  [v1][1]);
	colors.push(  cubeColors  [v1][2]);

	normals.push( normal[0] )
	normals.push( normal[1] )
	normals.push( normal[2] )
    }
}

// Abaixo tomamos o cuidade de sempre gerar uma face começando com um
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
in vec3 aNormal;
//in vec3 aColor;//POIS AGORA VOU USAR TEXTURA
in vec2 textCoords;

/*
 ToDo: Coloque aqui variáveis uniformes para a
  câmera, como o uViewMatrix e uProjectionMatrix
 vistos em aulas anteriores
*/
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

/*
 ToDo: Coloque aqui variáveis uniformes para os ângulos
 de rotação. Como uPitch e uYaw
*/
uniform float uPitch;
uniform float uYaw;

uniform vec3 theta;  // Ângulos de rotação para x, y, z
uniform vec3 uTranslation;  // Vetor de translação
uniform float uScale;  // Fator de escala
uniform vec3 uLightPosition;  // Posição da fonte de luz Spotlight
uniform vec3 uLightDirection;  // Direção da luz Spotlight
uniform float uCutOff;  // Ângulo de corte do cone de luz
uniform float uOuterCutOff;  // Ângulo externo do cone de luz para suavizar as bordas
uniform vec3 uAmbientLight;  // Luz ambiente
uniform vec3 uLightColor;  // Cor da luz

out vec3 vNormal;  // Normal para cálculo no fragment shader
out vec3 vLightDir;  // Direção da luz para cálculo no fragment shader
out vec3 vViewPosition;  // Posição do ponto de vista para cálculo no fragment shader
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

   // Todo: Crie as matrizes de rotação da câmera com o uPitch e uYaw
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

    // Todo: Adicione as matrizes relacionadas à câmera à esquerda da
    // da translação do objeto. 
    mat4 modelMatrix = uProjectionMatrix * yawMatrix * pitchMatrix * uViewMatrix * translationMatrix * scaleMatrix * rz * ry * rx;
    

    vec4 transformedPosition = modelMatrix * vec4(aPosition, 1.0);

    gl_Position = transformedPosition;

    // Passa as normais transformadas e outros dados para o fragment shader
    vNormal = normalize(mat3(transpose(inverse(modelMatrix))) * aNormal);
    vLightDir = normalize(uLightPosition - vec3(transformedPosition));
    vViewPosition = vec3(transformedPosition);
    textureCoords = textCoords;
}
`,
    fragmentShader : `#version 300 es
precision mediump float;

//in vec4 vColor;  //POIS AGORA VOU USAR TEXTURA
in vec3 vNormal; // Normal transformada vinda do vertex shader
in vec3 vLightDir; // Direção da luz vinda do vertex shader
in vec3 vViewPosition; // Posição do vértice vinda do vertex shader

out vec4 fColor;
in vec2 textureCoords;
uniform sampler2D uSampler;

uniform vec3 uLightPosition; // Posição da fonte de luz Spotlight
uniform vec3 uLightDirection; // Direção da luz Spotlight
uniform vec3 uLightColor; // Cor da luz
uniform vec3 uAmbientLight; // Luz ambiente
uniform float uCutOff; // Ângulo de corte do cone de luz
uniform float uOuterCutOff; // Ângulo externo para suavização na borda do cone

void main() {
    vec4 texColor = texture(uSampler, textureCoords);
    // Calcula componente ambiente
    vec3 ambient = uAmbientLight * texColor.rgb; //antes, havia vColor, agora usarei meu texColor

    // Calcula componente difusa
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(vLightDir);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = uLightColor * diff * texColor.rgb;

    // Calcula componente especular (não implementado aqui para simplificação)

    // Calcula a atenuação do Spotlight
    float theta = dot(lightDir, normalize(-uLightDirection));
    float epsilon = uCutOff - uOuterCutOff;
    float intensity = clamp((theta - uOuterCutOff) / epsilon, 0.0, 1.0);
    if (theta > uCutOff)
        intensity = 0.0;

    // Combina os componentes de iluminação
    vec3 lighting = (ambient + diffuse * intensity);
    fColor = vec4(lighting, texColor.a);
}
`
});



// Mandaremos o vértice, lembrando agora que leremos o vetor de três em três.
utils.initBuffer({vertices});
utils.linkBuffer({reading : 3});

/*
// Mandaremos as cores, também leremos de três em três, dado que
// estamos enviando RGB.
utils.initBuffer({vertices : colors});
utils.linkBuffer({variable : "aColor", reading : 3});
*/

utils.initBuffer({ vertices: textureCoordinates });
//utils.linkBuffer({ variable: "aColor", reading: 3 });
utils.linkBuffer({reading : 2, variable : "textCoords"});
// Mandaremos as cores, também leremos de três em três, dado que
// estamos enviando RGB.
utils.initBuffer({vertices : colors});
utils.linkBuffer({variable : "aColor", reading : 3});

// Mandaremos agora os vetores normais, também leremos de três em três.
utils.initBuffer({vertices : normals});
utils.linkBuffer({variable : "aNormal", reading : 3});






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

    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D,  0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,facesImages);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);      
}
facesImages.src = 'texturas/textura_cada_face.jpg';

/*
ATIVANDO TEXTURA
*/ 
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture1);

document.getElementById("slider").onchange = function(event) {
    speed = 100 - event.target.value;
};

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

/************************************************/

document.getElementById("RotationY").onclick = function (event) {
    rotation_y = -rotation_y;
};

document.getElementById("RotationStartY").onclick = function (event) {
    rotation_y = 10;
};

document.getElementById("RotationStopY").onclick = function (event) {
    rotation_y = 0;
};

/************************************************/

document.getElementById("RotationZ").onclick = function (event) {
    rotation_z = -rotation_z;
};

document.getElementById("RotationStartZ").onclick = function (event) {
    rotation_z = 10;
};

document.getElementById("RotationStopZ").onclick = function (event) {
    rotation_z = 0;
};

/************************************************/
document.getElementById("ScaleDirection").onclick = function (event) {
    scale = -scale;
};

document.getElementById("ScaleStart").onclick = function (event) {
    scale = 0.01;
};

document.getElementById("ScaleStop").onclick = function (event) {
    scale = 0;
};


/************************************************/
document.getElementById("TranslationX").onclick = function (event) {
    translation_x = -translation_x;
};

document.getElementById("TranslationStartX").onclick = function (event) {
    translation_x = 0.01;
};

document.getElementById("TranslationStopX").onclick = function (event) {
    translation_x = 0;
};

/************************************************/

document.getElementById("TranslationY").onclick = function (event) {
    translation_y = -translation_y;
};

document.getElementById("TranslationStartY").onclick = function (event) {
    translation_y = 0.01;
};

document.getElementById("TranslationStopY").onclick = function (event) {
    translation_y = 0;
};

/************************************************/

document.getElementById("TranslationZ").onclick = function (event) {
    translation_z = -translation_z;
};

document.getElementById("TranslationStartZ").onclick = function (event) {
    translation_z = 0.01;
};

document.getElementById("TranslationStopZ").onclick = function (event) {
    translation_z = 0;
};

/************************************************/



/***************************************************
Agora vamos tratar da luz
***************************************************/
var uAmbientLight = [0.2, 0.2, 0.2]; // Luz ambiente fraca
var uLightColor = [1.0, 1.0, 1.0]; // Luz  branca
var uLightPosition = [-0.5, 0.5, -2.0]; // Posição da luz

//Cálculo da Direção do Spotlight: A direção do Spotlight é
//simplesmente a direção do vetor que aponta do ponto de origem da luz
//para o ponto de destino (0,0,0). A direção pode ser calculada
//subtraindo a posição da luz das coordenadas do ponto de
//destino. Como o ponto de destino é (0,0,0), o vetor direção será o
//negativo da posição da luz:

var uLightDirection = [-uLightPosition[0], -uLightPosition[1], -uLightPosition[2]];

// Precisaremos tratar a direção da luz para que esteja normalizada
// com magnitudo 1. Isso é padrão em muitos cálculos de iluminação
// para garantir que a intensidade da luz seja consistente e não
// dependa da distância.
function normalizeVector(vec) {
    var len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    vec[0] /= len;
    vec[1] /= len;
    vec[2] /= len;
}
normalizeVector(uLightDirection);  // Normalizar o vetor de direção


// Configuração dos CutOffs: O cutOff é um ângulo em que a luz começa
// a diminuir, enquanto o outerCutOff é onde a luz termina
// completamente. Estes são valores em radianos. você precisa aplicar
// o cosseno destes valores ao passá-los para o shader, pois os
// cálculos no shader usam o cosseno dos ângulos para eficiência.
var uCutOff = Math.cos(0);
var uOuterCutOff = Math.cos(Math.PI/20);




utils.linkUniformVariable({shaderName : "uAmbientLight", value : uAmbientLight, kind : "3fv"});
utils.linkUniformVariable({shaderName : "uLightColor", value : uLightColor, kind : "3fv"});
utils.linkUniformVariable({shaderName : "uLightPosition", value : uLightPosition, kind : "3fv"});

utils.linkUniformVariable({shaderName : "uLightDirection", value : uLightDirection, kind : "3fv"});
utils.linkUniformVariable({shaderName : "uCutOff", value : uCutOff, kind : "1f"});
utils.linkUniformVariable({shaderName : "uOuterCutOff", value : uOuterCutOff, kind : "1f"});






/************************************************/
// Capture os eventos do teclado e mouse
/************************************************/
var cameraPosition = { x: 0, y: 0, z: 3 };
var cameraRotation = { pitch: 0, yaw: 0 };
var spotlightOn = true;

/*
TODO: Atividade 7 - criar evento do movimento do mouse para controlar pitch/yaw
*/
document.getElementById("canvas").addEventListener("mousemove", function(event){
    var rSpeed = 0.01;
    
    cameraRotation.yaw -= event.movementX * rSpeed;
    cameraRotation.pitch -= - event.movementY * rSpeed;
    updateViewMatrix();
});

//click esquerdo para centralizar camera novamente, clique direito apaga/acende spotlight
document.getElementById("canvas").addEventListener("click", function(event){

    cameraPosition = { x: 0, y: 0, z: 3 };
    cameraRotation = { pitch: 0, yaw: 0 };
    updateViewMatrix();
});

document.addEventListener('keydown', function(event) {
    var tSpeed = 0.1; // Velocidade de movimento da câmera
    var rSpeed = 0.05; // Velocidade de rotação da câmera.
    
    switch (event.key) {
	// ToDo: Escolha teclas do teclado para movimentar a câmera.
    case 'w': 
	// ToDo: Movimente algo na câmera (rotação ou posição)
    cameraPosition.z -= tSpeed;  
        break;
    case 's': 
	// ToDo: Movimente algo na câmera (rotação ou posição)
    cameraPosition.z += tSpeed; 
        break;
    case 'd': 
	// ToDo: Movimente algo na câmera (rotação ou posição)
    cameraPosition.x -= tSpeed;
        break;
    case 'a': 
	// ToDo: Movimente algo na câmera (rotação ou posição)
    cameraPosition.x += tSpeed;
        break;
    

    case 'i': 
	// ToDo: Movimente algo na câmera (rotação ou posição)
    cameraRotation.pitch -= rSpeed;
    console.log("clicou");
    break;
    
    case 'k': 
	// ToDo: Movimente algo na câmera (rotação ou posição)
    cameraRotation.pitch += rSpeed;
    break;
    
    case 'j': 
	// ToDo: Movimente algo na câmera (rotação ou posição)
    cameraRotation.yaw += rSpeed;
    break;

    case 'l': 
	// ToDo: Movimente algo na câmera (rotação ou posição)
    cameraRotation.yaw -= rSpeed;
    break;
    
    case 'f':
    if(spotlightOn){
        uLightColor = [0.0, 0.0, 0.0];
        spotlightOn = false;
    } else{ uLightColor = [1.0, 1.0, 1.0]; spotlightOn = true}

    utils.linkUniformVariable({shaderName : "uLightColor", value : uLightColor, kind : "3fv"});
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


    // ToDo: Envie a nova matriz viewMatrix, cameraRotation.pitch e
    //  cameraRotation.yaw para o shader. Provavelmente nas variáveis
    // uViewMatrix, uPitch e uYaw

    utils.linkUniformMatrix({shaderName: "uViewMatrix", value: viewMatrix, kind: "4fv"});
    utils.linkUniformVariable({shaderName: "uPitch", value: cameraRotation.pitch, kind: "1f"});
    utils.linkUniformVariable({shaderName: "uYaw", value: cameraRotation.yaw, kind: "1f"});
}

/************************************************/

/***************************************************
Agora vamos tratar da câmera
***************************************************/

// ToDo: Crie uma projeção em perspectiva
var projectionPerspectiveMatrix = mat4.create();
mat4.perspective(
    projectionPerspectiveMatrix,
    45 * Math.PI / 8,
    1,
    0.1, //near
    100 //far
);

// ToDo: Ligue a matriz de projeção com o shader. Use
// provavelmente um variável de nome uProjectionMatrix
// no shader
utils.linkUniformMatrix({shaderName:"uProjectionMatrix", value: projectionPerspectiveMatrix});

// ToDo: Crie uma matriz de visualização olhando
// para o centro do cubo.
var viewMatrix = mat4.create();
mat4.lookAt(
    viewMatrix,
    [0,0,3],
    [0,0,0],
    [0,1,0]
);


// ToDo: Ligue a matriz de visualização com o shader.
// Provavelmente com o nome uViewMatrix no shader
utils.linkUniformMatrix({shaderName: "uViewMatrix", value: viewMatrix});



function render(){
    theta[0] += rotation_x;
    theta[1] += rotation_y;
    theta[2] += rotation_z; 

    translation[0] += translation_x;
    translation[1] += translation_y;
    translation[2] += translation_z; 

    uScale += scale;
    
    
    utils.linkUniformVariable({shaderName : "theta", value : theta, kind : "3fv"});

    utils.linkUniformVariable({shaderName : "uTranslation", value : translation, kind : "3fv"});

    utils.linkUniformVariable({shaderName : "uScale", value : uScale, kind : "1f"});
    
    utils.linkUniformVariable({shaderName:"uSampler", value:0, kind:"1i"});

    utils.drawElements({method : "TRIANGLES"});

        
    setTimeout(
	render, speed
    );
}
render();