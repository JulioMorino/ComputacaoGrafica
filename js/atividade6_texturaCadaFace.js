var utils = new Utils();

var vertices = [];
var colors = [];
//8 vertices do cubo
var cubeVertices = [
    [-0.5, -0.5, 0.5], //0
    [-0.5, 0.5, 0.5],  //1
    [0.5, 0.5, 0.5],   //2
    [0.5, -0.5, 0.5],  //3
    [-0.5, -0.5, -0.5],//4
    [-0.5, 0.5, -0.5], //5
    [0.5, 0.5, -0.5],  //6
    [0.5, -0.5, -0.5]  //7
];

var cubeColors = [
    [1.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
    [1.0, 0.0, 1.0],
    [0.0, 1.0, 1.0]
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


//makeFace 
function makeFace(v0, v1, v2, v3) {
    var triangulos = [v0, v1, v2, v0, v2, v3];

    for (var i = 0; i < 6; i++) {
        vertices.push(cubeVertices[triangulos[i]][0]);
        vertices.push(cubeVertices[triangulos[i]][1]);
        vertices.push(cubeVertices[triangulos[i]][2]);
        colors.push(cubeColors[v0][0]);
        colors.push(cubeColors[v0][1]);
        colors.push(cubeColors[v0][2]);
    }
}

makeFace(0, 3, 2, 1);
makeFace(2, 3, 7, 6);
makeFace(3, 0, 4, 7);
makeFace(4, 5, 6, 7);
makeFace(5, 4, 0, 1);
makeFace(1, 2, 6, 5);

utils.initShader({
    vertexShader: `#version 300 es
precision mediump float;
in vec3 aPosition;
//in vec3 aColor;
//out vec4 vColor;

in vec2 textCoords;
out vec2 textureCoords;

void main(){
gl_Position = vec4(aPosition, 1.0);
textureCoords = textCoords;
}`,
fragmentShader: `#version 300 es
precision mediump float;
//in vec4 vColor;
out vec4 fColor;
    
in vec2 textureCoords;
uniform sampler2D uSampler;

void main(){

    fColor = texture(uSampler, textureCoords);
}`
});

utils.initBuffer({ vertices });
utils.linkBuffer({ reading: 3 });
utils.initBuffer({ vertices: textureCoordinates });
//utils.linkBuffer({ variable: "aColor", reading: 3 });
utils.linkBuffer({reading : 2, variable : "textCoords"});


/////////////////////SEGUNDA PARTE - ROTACAO
var theta = [0, 0, 0]; // Inclinações nos eixos X, Y, Z
// Variações a serem aplicadas para gerar a animação
var transform_x = 0;
var transform_y = 0;
var transform_z = 0;

var transformValue_scale = [1, 1, 1];

var transformValue_translation = [0.0, 0.0, 0.0];
// Velocidade da animação
var speed = 100;

//criando a textura
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

function render() {
    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

    utils.linkUniformVariable({
        shaderName:"uSampler", value:0, kind:"1i"
    });

    utils.drawElements({ method: "TRIANGLES" });

    if (scalePressed) {
        if (scalePositive) {
            transformValue_scale[0] = transformValue_scale[0] + 0.01;
            transformValue_scale[1] = transformValue_scale[1] + 0.01;
            transformValue_scale[2] = transformValue_scale[2] + 0.01;
        } else {
            transformValue_scale[0] = transformValue_scale[0] - 0.01;
            transformValue_scale[1] = transformValue_scale[1] - 0.01;
            transformValue_scale[2] = transformValue_scale[2] - 0.01;
        }
    }

    if (translationPressedX) {
        if (translationPositiveX) {
            transformValue_translation[0] = transformValue_translation[0] + 0.01;
        } else {
            transformValue_translation[0] = transformValue_translation[0] - 0.01;
        }
    }

    if (translationPressedY) {
        if (translationPositiveY) {
            transformValue_translation[1] = transformValue_translation[1] + 0.01;
        } else {
            transformValue_translation[1] = transformValue_translation[1] - 0.01;
        }
    }

    if (translationPressedZ) {
        if (translationPositiveZ) {
            transformValue_translation[2] = transformValue_translation[2] + 0.01;
        } else {
            transformValue_translation[2] = transformValue_translation[2] - 0.01;
        }
    }

    utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });
    utils.linkUniformVariable({ shaderName: "transformValue_scale", value: transformValue_scale, kind: "3fv" });
    utils.linkUniformVariable({ shaderName: "transformValue_translation", value: transformValue_translation, kind: "3fv" });
    

    speed = document.getElementById("slider").value;
    setTimeout(render, speed);
}

utils.initShader({
    vertexShader: `#version 300 es
precision mediump float;
in vec3 aPosition;
//in vec3 aColor;
//out vec4 vColor;

in vec2 textCoords;
out vec2 textureCoords;

uniform vec3 theta;
uniform vec3 transformValue_scale;
uniform vec3 transformValue_translation;

mat4 scaleMatrix(vec3 scale) {
    return mat4(
        scale.x, 0.0, 0.0, 0.0,
        0.0, scale.y, 0.0, 0.0,
        0.0, 0.0, scale.z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 translationMatrix(vec3 translation) {
    return mat4(
        1.0, 0.0, 0.0, translation.x,
        0.0, 1.0, 0.0, translation.y,
        0.0, 0.0, 1.0, translation.z,
        0.0, 0.0, 0.0, 1.0
    );
}

void main(){
    vec3 angles = radians(theta);
    vec3 c = cos(angles);
    vec3 s = sin(angles);

    // Matriz de rotação para o eixo X
    mat4 rx = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, c.x, -s.x, 0.0,
        0.0, s.x, c.x, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // Matriz de rotação para o eixo Y
    mat4 ry = mat4(
        c.y, 0.0, s.y, 0.0,
        0.0, 1.0, 0.0, 0.0,
        -s.y, 0.0, c.y, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // Matriz de rotação para o eixo Z
    mat4 rz = mat4(
        c.z, -s.z, 0.0, 0.0,
        s.z, c.z, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // Matrizes de escala e translação
    mat4 scaleMat = scaleMatrix(transformValue_scale);
    mat4 translationMat = translationMatrix(transformValue_translation);

    // Aplicando todas as transformações
    gl_Position =  rz * ry * rx * scaleMat  * vec4(aPosition, 1.0) * translationMat;

    //gl_Position = modelMatrix ;
    textureCoords = textCoords;
}`, fragmentShader: `#version 300 es
precision mediump float;
    //in vec4 vColor;
out vec4 fColor;
    
in vec2 textureCoords;
uniform sampler2D uSampler;

void main(){

    fColor = texture(uSampler, textureCoords);
}
`
});


render();
////////////////
////////////////
var scalePressed = false;
var scalePositive = true;

var translationPressedX = false;
var translationPositiveX = true;

var translationPressedY = false;
var translationPositiveY = true;

var translationPressedZ = false;
var translationPositiveZ = true;

document.getElementById("RotationStartX").addEventListener("click", function () {

    transform_y = 2;
});
document.getElementById("RotationStopX").addEventListener("click", function () {

    transform_y = 0;
});
document.getElementById("RotationX").addEventListener("click", function () {

    transform_y = transform_y * -1;
});

document.getElementById("RotationStartY").addEventListener("click", function () {

    transform_x = 2;
});
document.getElementById("RotationStopY").addEventListener("click", function () {

    transform_x = 0;
});
document.getElementById("RotationY").addEventListener("click", function () {

    transform_x = transform_x * -1;
});

document.getElementById("RotationStartZ").addEventListener("click", function () {

    transform_z = 2;
});
document.getElementById("RotationStopZ").addEventListener("click", function () {

    transform_z = 0;
});
document.getElementById("RotationZ").addEventListener("click", function () {

    transform_z = transform_z * -1;
});


document.getElementById("ScaleStart").addEventListener("click", function () {
    scalePressed = true;

});

document.getElementById("ScaleDirection").addEventListener("click", function () {
    if (scalePositive)
        scalePositive = false;
    else scalePositive = true;

});

document.getElementById("ScaleStop").addEventListener("click", function () {
    scalePressed = false;

});

//transladar
document.getElementById("TranslationStartX").addEventListener("click", function () {

    translationPressedX = true;

});

document.getElementById("TranslationStopX").addEventListener("click", function () {

    translationPressedX = false;

});

document.getElementById("TranslationX").addEventListener("click", function () {

    if (translationPositiveX)
        translationPositiveX = false;
    else translationPositiveX = true;

});


//Y
document.getElementById("TranslationStartY").addEventListener("click", function () {

    translationPressedY = true;

});

document.getElementById("TranslationStopY").addEventListener("click", function () {

    translationPressedY = false;

});

document.getElementById("TranslationY").addEventListener("click", function () {

    if (translationPositiveY)
        translationPositiveY = false;
    else translationPositiveY = true;

});


//Z
document.getElementById("TranslationStartZ").addEventListener("click", function () {

    translationPressedZ = true;

});

document.getElementById("TranslationStopZ").addEventListener("click", function () {

    translationPressedZ = false;

});

document.getElementById("TranslationZ").addEventListener("click", function () {

    if (translationPositiveZ)
        translationPositiveZ = false;
    else translationPositiveZ = true;

});