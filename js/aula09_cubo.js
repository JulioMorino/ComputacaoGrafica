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


//makeFace 
function makeFace(v1, v2, v3, v4) {
    var triangulos = [];
    triangulos.push(cubeVertices[v1]);
    triangulos.push(cubeVertices[v2]);
    triangulos.push(cubeVertices[v4]);
    triangulos.push(cubeVertices[v2]);
    triangulos.push(cubeVertices[v3]);
    triangulos.push(cubeVertices[v4]);

    for (i = 0; i < 6; i++) {
        vertices.push(triangulos[i][0]); //coletei x
        vertices.push(triangulos[i][1]); //coletei y
        vertices.push(triangulos[i][2]); //coletei z


        colors.push(cubeColors[v1 - 1][0]);
        colors.push(cubeColors[v1 - 1][1]);
        colors.push(cubeColors[v1 - 1][2]);
    }
    console.log(cubeColors);

}

makeFace(1, 0, 3, 2);
makeFace(2, 3, 7, 6);
makeFace(3, 0, 4, 7);
makeFace(4, 5, 6, 7);
makeFace(5, 4, 0, 1);
makeFace(6, 5, 1, 2);

//slide 22
utils.initShader({
    vertexShader: `#version 300 es
precision mediump float;
in vec3 aPosition;
in vec3 aColor;
out vec4 vColor;
void main(){
gl_Position = vec4(aPosition, 1.0);
vColor = vec4(aColor, 1.0);
}`,
    fragmentShader: `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 fColor;
void main() {
fColor = vColor;
}`
});

utils.initBuffer({ vertices });
utils.linkBuffer({ reading: 3 });
utils.initBuffer({ vertices: colors });
utils.linkBuffer({ variable: "aColor", reading: 3 });
utils.drawElements({ method: "TRIANGLES" });

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

function render() {
    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

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
    utils.drawElements({ method: "TRIANGLES" });

    speed = document.getElementById("slider").value;
    setTimeout(render, speed);
}

utils.initShader({
    vertexShader: `#version 300 es
precision mediump float;
in vec3 aPosition;
in vec3 aColor;
out vec4 vColor;
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
    vColor = vec4(aColor, 1.0);
}`, fragmentShader: `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 fColor;
void main(){
    fColor = vColor;
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