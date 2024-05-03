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
var theta = [0, 0, 20]; // Inclinações nos eixos X, Y, Z
// Variações a serem aplicadas para gerar a animação
var transform_x = 3;
var transform_y = 1;
var transform_z = 2;
// Velocidade da animação
var speed = 100;

function render() {
    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

    utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });
    utils.drawElements({ method: "TRIANGLES" });
    setTimeout(render, speed);
}

utils.initShader({
    vertexShader: `#version 300 es
precision mediump float;
in vec3 aPosition;
in vec3 aColor;
out vec4 vColor;
uniform vec3 theta;
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

    gl_Position = rz * ry * rx * vec4(aPosition, 1.0);
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