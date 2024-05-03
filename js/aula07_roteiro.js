/*
Vamos dividir a nossa área em um seis quadrados de lado sceneSize. A dimensão do grid será 2x3, duas linhas
e três colunas. Nesse caso, devemos especificar o tamanho da tela de acordo com isso.
*/
var sceneSize = 200;
var utils = new Utils({
    width: sceneSize * 3, // três colunas
    height: sceneSize * 2, // duas linhas
});

//colocaremos aqui os dado que passaremos para a GPU
var vertices = [];
var colors = [];

var cubeVertices = [
    [-0.5, -0.5, 0.5], //0
    [-0.5, 0.5, 0.5], //1
    [0.5, 0.5, 0.5], //2
    [0.5, -0.5, 0.5], //3
    [-0.5, -0.5, -0.5], //4
    [-0.5, 0.5, -0.5], //5
    [0.5, 0.5, -0.5], //6
    [0.5, -0.5, -0.5], //7
];

var cubeColors = [
    [1.0, 1.0, 1.0], //branco
    [1.0, 0.0, 0.0], //vermelho
    [0.0, 1.0, 0.0], //verde
    [0.0, 0.0, 1.0], //azul
    [1.0, 0.0, 1.0], //magenta
    [0.0, 1.0, 1.0], //ciano
];

var textureCoordinates = [
    //Faces cuboide
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
]

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

    uniform vec3 theta;
    uniform mat4 uViewMatrix; // Matriz da câmera
    uniform mat4 uProjectionMatrix; // Matriz de projeção

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

        gl_Position = uProjectionMatrix * uViewMatrix *  rz * ry * rz * vec4(aPosition, 1.0);
        

        textureCoords = textCoords;
    }
    `,
    fragmentShader: `#version 300 es
    precision mediump float;
    //in vec4 vColor;
    out vec4 fColor;
    
    in vec2 textureCoords;
    uniform sampler2D uSampler;

    void main(){

        fColor = texture(uSampler, textureCoords);
    }
    `,
});

utils.initBuffer({
    vertices: vertices,
});

utils.linkBuffer({
    variable: "aPosition",
    reading: 3,
});

utils.initBuffer({vertices: textureCoordinates});
utils.linkBuffer({reading : 2, variable : "textCoords"});

var theta = [0, 0, 0]; // Rotações nos eixos X, Y, Z. Variações a serem aplicadas para gerar a animação
var transform_x = 2;
var transform_y = 3;
var transform_z = 5;
var speed = 100;
var projectionOrthoMatrix = mat4.create();

var size = 1; // Metade da largura/altura total desejada
var centerX = 0; // Posição X central da janela de projeção
var centerY = 0; // Posição Y central da janela de projeção
mat4.ortho(
    projectionOrthoMatrix,
    centerX - size, // esquerda
    centerX + size, // direta
    centerY - size, // baixo
    centerY + size, // cima
    0.1, // Quão perto objetos podem estar da câmera
    // antes de serem recortados
    100.0
); // Quão longe objetos podem estar da câmera antes
// de serem recortados
utils.linkUniformMatrix({
    shaderName: "uProjectionMatrix",
    value: projectionOrthoMatrix,
    kind: "4fv",
});

// Criando uma matriz de visualização frontal de um cubo parado na origem
var viewMatrixFront = mat4.create();
mat4.lookAt(
    viewMatrixFront,
    [
        0, 0, 5,
    ] /* Posição da câmera, ou seja, onde a câmera está localizada no espaço 3D. Neste caso, a
câmera está cinco unidades para trâs em Z.*/,
    [0, 0, 0], // Ponto de referência para onde a câmera está olhando.
    [0, 1, 0]
); /* Vetor Up. Geralmente (0, 1, 0) em um sistema de coordenadas onde Y é para cima,
esse vetor indica a orientação vertical da câmera. */

// Criando uma matriz de visualização em vista superior de um cubo parado na origem
var viewMatrixTop = mat4.create();
mat4.lookAt(
    viewMatrixTop,
    [0, 5, 0] /* Posição da câmera, ou seja, onde a câmera
está localizada no espaço 3D. Neste caso, a câmera está cinco unidades para cima em Y.*/,
    [0, 0, 0], // Ponto de referência para onde a câmera está olhando.
    [0, 0, -1]
); /* Vetor Up aponta para trás nesse caso. */

// Visão lateral esquerda de um cubo parado na origem
var viewMatrixSide = mat4.create();
mat4.lookAt(
    viewMatrixSide,
    [-5, 0, 0], // Posição da câmera está 5 unidades à esquerda em X
    [0, 0, 0],
    [0, 1, 0]
);

// Visão da frente e lateral esquerda de um cubo parado na origem
var viewMatrixFrontSide = mat4.create();
mat4.lookAt(
    viewMatrixFrontSide,
    [-5, 0, 5], // Posição da câmera está 5 unidades à esquerda em X
    [0, 0, 0],
    [0, 1, 0]
);

// Visão isométrica de um cubo parado na origem
var viewMatrixIsometric = mat4.create();
mat4.lookAt(
    viewMatrixIsometric,
    [-5, 5, 5], // Posição da câmera para obter uma vista isométrica
    [0, 0, 0],
    [0, 1, 0]
);

/*
Uma matriz isométrica para ver a parte traseira, de baixo e da
direita de um cubo parado na origem.
*/
var viewMatrixIsometric2 = mat4.create();
mat4.lookAt(
    viewMatrixIsometric2,
    [5, -5, 5], // Posição da câmera para obter uma vista isométrica
    [0, 0, 0],
    [0, 1, 0]
);

/*Textura bolinha*/
var gl = utils.gl;
var textureBolinha = gl.createTexture();

var bolinhasImage = new Image();
bolinhasImage.onload = function() {
// Configuraremos a textureBolinha aqui.
    gl.bindTexture(gl.TEXTURE_2D, textureBolinha);
    gl.texImage2D(gl.TEXTURE_2D,  0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,bolinhasImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);      
}
bolinhasImage.src = 'texturas/03_bolinhas.webp';



/*Textura bolinha*/
var textureOnca = gl.createTexture();

var oncaImage = new Image();
oncaImage.onload = function() {
// Configuraremos a textureBolinha aqui.
    gl.bindTexture(gl.TEXTURE_2D, textureOnca);
    gl.texImage2D(gl.TEXTURE_2D,  0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, oncaImage);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);      
}
oncaImage.src = 'texturas/02_onca_pintada.webp';

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, textureBolinha);

gl.activeTexture(gl.TEXTURE1);
gl.bindTexture(gl.TEXTURE_2D, textureOnca);

/*Função para renderização*/
function render() {
    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

    utils.linkUniformVariable({
        shaderName:"uSampler", value:0, kind:"1i"
    });

    utils.linkUniformVariable({
        shaderName: "theta",
        value: theta,
        kind: "3fv",
    });

    // Primeira célula
    utils.linkUniformMatrix({
        shaderName: "uViewMatrix",
        value: viewMatrixFront,
        kind: "4fv",
    });
    utils.drawScene({
        method: "TRIANGLES",
        viewport: { x: 0, y: sceneSize, width: sceneSize, height: sceneSize },
    });

    // Segunda célula
    utils.linkUniformMatrix({
        shaderName: "uViewMatrix",
        value: viewMatrixTop,
        kind: "4fv",
    });
    utils.drawScene({
        method: "TRIANGLES",

        viewport: {
            x: sceneSize,
            y: sceneSize,

            width: sceneSize,
            height: sceneSize,
        },
    });

    // Terceira célula
    utils.linkUniformVariable({
        shaderName:"uSampler", value:1, kind:"1i"
    });

    utils.linkUniformMatrix({
        shaderName: "uViewMatrix",
        value: viewMatrixSide,
        kind: "4fv",
    });
    utils.drawScene({
        method: "TRIANGLES",

        viewport: {
            x: 2 * sceneSize,
            y: sceneSize,

            width: sceneSize,
            height: sceneSize,
        },
    });

    /*
  Segunda Linha
  */
    // Quarta Célula
    utils.linkUniformMatrix({
        shaderName: "uViewMatrix",
        value: viewMatrixFrontSide,
        kind: "4fv",
    });
    utils.drawScene({
        method: "TRIANGLES",
        viewport: { x: 0, y: 0, width: sceneSize, height: sceneSize },
    });

    // Quinta Célula
    utils.linkUniformMatrix({
        shaderName: "uViewMatrix",
        value: viewMatrixIsometric,
        kind: "4fv",
    });
    utils.drawScene({
        method: "TRIANGLES",
        viewport: { x: sceneSize, y: 0, width: sceneSize, height: sceneSize },
    });

    // Sexta célula
    utils.linkUniformMatrix({
        shaderName: "uViewMatrix",
        value: viewMatrixIsometric2,
        kind: "4fv",
    });
    utils.drawScene({
        method: "TRIANGLES",
        viewport: { x: 2 * sceneSize, y: 0, width: sceneSize, height: sceneSize },
    });

    

    setTimeout(render, speed);
}

render();
