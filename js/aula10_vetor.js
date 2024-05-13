var utils = new Utils();


// Colocaremos aqui os dado que passaremos para a GPU
var vertices = []
var colors = []
var normals = []

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


/*
  ToDo: A função a seguir recebe três pontos assumidamente distintos.  Como esses
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
    var AB = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
    var AC = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];

    var Nx = AB[1] * AC[2] - AB[2] * AC[1];
    var Ny = AB[2] * AC[0] - AB[0] * AC[2];
    var Nz = AB[0] * AC[1] - AB[1] * AC[0];

    return [Nx, Ny, Nz]; //vetor normal de uma determinada face
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
in vec3 aColor;
// ToDo: receba o vetor de normais com uma variável de nome aNormal
in vec3 aNormal;

out vec4 vColor;

uniform vec3 theta;

// ToDo: receba os novos uniformes uAmbientLight, uLightColor e uLightPosition.
// Já receb uAmbientLight para você
uniform vec3 uAmbientLight;
uniform vec3 uLightColor;
uniform vec3 uLightPosition;

void main(){
   // Computando seno e cosseno para cada 
   // um dos três eixos;
   vec3 angles = radians(theta);
   vec3 c = cos(angles);
   vec3 s = sin(angles);

   // Matrizes de rotação;
   mat4 rx = mat4( 1.0,  0.0,  0.0, 0.0,
                   0.0,  c.x,  s.x, 0.0,
                   0.0, -s.x,  c.x, 0.0,
                   0.0,  0.0,  0.0, 1.0);

   mat4 ry = mat4( c.y, 0.0, -s.y, 0.0,
                   0.0, 1.0,  0.0, 0.0,
                   s.y, 0.0,  c.y, 0.0,
                   0.0, 0.0,  0.0, 1.0);

   mat4 rz = mat4( c.z, s.z, 0.0, 0.0,
                   -s.z,  c.z, 0.0, 0.0,
                    0.0,  0.0, 1.0, 0.0,
                    0.0,  0.0, 0.0, 1.0);

   // Modificando para deixar mais evidente a modelMatrix
   mat4 modelMatrix =  rz * ry * rx;
   gl_Position = modelMatrix * vec4(aPosition, 1.0);

   // ToDo: agora a parte da iluminação, descomente o código a seguir
   vec3 transformedNormal = mat3(transpose(inverse(modelMatrix))) * aNormal;
   vec3 lightDirection = normalize(uLightPosition - (modelMatrix * vec4(aPosition, 1.0)).xyz);
   float diff = max(dot(transformedNormal, lightDirection), 0.0);
   vec3 diffuse = uLightColor * diff;
   vec3 ambient = uAmbientLight;
   vec3 resultColor = ambient + diffuse;


   // ToDo: No código a seguir, faça com que a saída vColor sera resultColor * aColor
   vColor = vec4(resultColor * aColor, 1.0);   
   
}`,
    fragmentShader : `#version 300 es
precision mediump float;

in vec4 vColor;
out vec4 fColor;

void main() {
    fColor = vColor;
}`
});


// Mandaremos o vértice, lembrando agora que leremos o vetor de três em três.
utils.initBuffer({vertices});
utils.linkBuffer({reading : 3});

// Mandaremos as cores, também leremos de três em três, dado que
// estamos enviando RGB.
utils.initBuffer({vertices : colors});
utils.linkBuffer({variable : "aColor", reading : 3});

// Mandaremos as cores, também leremos de três em três, dado que
// estamos enviando RGB.
utils.initBuffer({vertices : colors});
utils.linkBuffer({variable : "aColor", reading : 3});

// ToDo: Mande agora os vetores normais, também leremos de três em três. Note que o nome
// da variável no vertex-shader será aNormal.
utils.initBuffer({vertices : normals});
utils.linkBuffer({variable : "aNormal", reading : 3});
/**************************************************/


// Agora vamos fazer o cubo rotacionar.
var theta = [0.0, 0.0, 0.0]; // Rotações nos eixos X, Y, Z

// Variações a serem aplicadas para gerar a animação
var rotation_x = 3.0;
var rotation_y = 4.0;
var rotation_z = 5.0;

// Velocidade da animação
var speed = 100;

/***************************************************
Agora vamos tratar da luz
***************************************************/

// Todo: defina as variáveis uAmbientLight, uLightColor e uLightPosition.
// Já coloquei para você uma luz fraca para uAmbientLight, para você ter um exemplo.
// Use uma cor branca para uLightColor.
// Em uLightPosition, varie a posição da luz para ver as diferenças
var uLightColor = [1.0, 1.0, 1.0];
var uAmbientLight = [0.2, 0.2, 0.2]; // Luz ambiente fraca
var uLightPosition = [1.0, 1.0, 0.0];

// ToDo: Agora mande as variáveis para a GPU como uniforms. Já envie o uAmbientLight para você
// ToDo: Agora mande as variáveis para a GPU como uniforms. Já envie o uAmbientLight para você
utils.linkUniformVariable({shaderName : "uAmbientLight", value : uAmbientLight, kind : "3fv"});
utils.linkUniformVariable({shaderName : "uLightColor", value : uLightColor, kind : "3fv"});
utils.linkUniformVariable({shaderName : "uLightPosition", value : uLightPosition, kind : "3fv"});


function render(){
    theta[0] += rotation_x;
    theta[1] += rotation_y;
    theta[2] += rotation_z; 
    
    
    utils.linkUniformVariable({shaderName : "theta", value : theta, kind : "3fv"});
    
    utils.drawElements({method : "TRIANGLES"});

    setTimeout(
	render, speed
    );
}
render();