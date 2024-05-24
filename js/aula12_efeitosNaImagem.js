var utils = new Utils({width : 800, height : 800});

utils.initShader({
    vertexShader : `#version 300 es
precision mediump float;

in vec2 aPosition;
in vec2 texCoords;

out vec2 textureCoords; 

void main(){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  textureCoords = texCoords;
}`,
    fragmentShader : `#version 300 es
precision highp float;

in vec2 textureCoords;

uniform sampler2D uSampler;
uniform vec2 uTextureSize;

uniform float uKernel[9];

out vec4 fColor;

void main(){
    vec2 onePixel = vec2(1.0, 1.0) / uTextureSize;



    
    vec4 valorPixelSupEsquerdo  = texture(uSampler, textureCoords + onePixel * vec2(-1, 1))    * uKernel[0];
    vec4 valorPixelSuperior     = texture(uSampler, textureCoords + onePixel * vec2(0, 1))     * uKernel[1];
    vec4 valorPixelSupDireito   = texture(uSampler, textureCoords + onePixel * vec2(1, 1))     * uKernel[2];

    vec4 valorPixelEsquerdo     = texture(uSampler, textureCoords + onePixel * vec2(-1, 0))    * uKernel[3];
    vec4 valorPixelCentro       = texture(uSampler, textureCoords + onePixel * vec2(0, 0))     * uKernel[4];
    vec4 valorPixelDireito      = texture(uSampler, textureCoords + onePixel * vec2(1, 0))     * uKernel[5];
    
    vec4 valorPixelInfEsquerdo  = texture(uSampler, textureCoords + onePixel * vec2(-1, -1))   * uKernel[6];
    vec4 valorPixelInferior     = texture(uSampler, textureCoords + onePixel * vec2(0, -1))    * uKernel[7];
    vec4 valorPixelInfDireito   = texture(uSampler, textureCoords + onePixel * vec2(1, -1))    * uKernel[8];
    
    
    fColor = valorPixelSupEsquerdo + valorPixelSuperior + valorPixelSupDireito + valorPixelEsquerdo + valorPixelCentro + valorPixelDireito + valorPixelInfEsquerdo + valorPixelInferior + valorPixelInfDireito;
    fColor.a = 1.0;
    

    
    // vec4 color = texture(uSampler, textureCoords);
    // float newPixelVal = color.r * 0.6 + color.g * 0.3 + color.b * 0.1;
    // fColor = vec4(newPixelVal, newPixelVal, newPixelVal, 1.0);

    
    // if (color.g < 0.5) {
    //     color.g *= 2.0;
    // }
    // color.b = 1.0 - color.b;

    //fColor = color;
    
}`
});

/******************************
 Posições do Quadrado
******************************/
var pxi = -0.4;
var pyi = -0.4;
var pxf = 0.4;
var pyf = 0.4;

vertices = [
    pxi, pyi, pxi, pyf, pxf, pyf,
    pxi, pyi, pxf, pyi, pxf, pyf
]

/******************************
Posições da Textura
******************************/
var txi = 1.0;
var tyi = 1.0;
var txf = 0.0;
var tyf = 0.0;

textureCoordinates = [
    txi, tyi, txi, tyf, txf, tyf,
    txi, tyi, txf, tyi, txf, tyf
]


/******************************
 Linkando com a GPU
******************************/
utils.initBuffer(
     {vertices : vertices}
);
utils.linkBuffer();

utils.initBuffer({vertices: textureCoordinates});
utils.linkBuffer({reading : 2, variable : "texCoords"});

/******************************
 Configurando as texturas
******************************/
var textureGatoPersa, textureBolinha;
var gatoPersaSize, bolinhaSize;
var loaded = 0;

// Carregar a imagem de textura
var gatoPersaImage = new Image();
gatoPersaImage.onload = function() {
    textureGatoPersa = utils.initTexture({image : gatoPersaImage});
    gatoPersaSize = [gatoPersaImage.width, gatoPersaImage.height];
    loaded += 1;
};
gatoPersaImage.src = 'texturas/01_gato_persa.webp';

var bolinhasImage = new Image();
bolinhasImage.onload = function() {
    textureBolinha = utils.initTexture({image : bolinhasImage});
    bolinhaSize = [bolinhasImage.width, bolinhasImage.height];
    loaded += 1;
};
bolinhasImage.src = 'texturas/03_bolinhas.webp';


var speed = 2500;
var kernelDesfoqueSimples = [
    1/9, 1/9, 1/9,
    1/9, 1/9, 1/9,
    1/9, 1/9, 1/9
];

var kernelDesfoqueGaussiano  = [
    1/16, 1/8, 1/16,
    1/8,  1/4, 1/8,
    1/16, 1/8, 1/16
];

var kernelAgucamento = [
    0,  -1,  0,
    -1,  5, -1,
    0,  -1,  0
];

var kernelRealcaBorda = [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1
];

var kernelDetectaBorda = [
    -1, 0, 1,
    -2, 0, 2,
    -1, 0, 1
];

var kernelDetectaBorda_SobelVertical = [
    -1, -2, -1,
    0,  0,  0,
    1,  2,  1
];

var kernelDetectaBorda_PrewitHorizontal = [
    -1, 0, 1,
    -1, 0, 1,
    -1, 0, 1
];

var kernelDetectaBorda_PrewitVertical = [
    -1, -1, -1,
    0,  0,  0,
    1,  1,  1
];

var kernelLaplaciano = [
    0,  1, 0,
    1, -4, 1,
    0,  1, 0
];

var kernelLaplaciano8Diagonais = [
    1,  1, 1,
    1, -8, 1,
    1,  1, 1
];

var kernelDesfoqueDeCaixa = [
    1/9, 1/9, 1/9,
    1/9, 1/9, 1/9,
    1/9, 1/9, 1/9
];

var kernelDesfoqueBinomial = [
    1/16, 2/16, 1/16,
    2/16, 4/16, 2/16,
    1/16, 2/16, 1/16
]

var kernelSuavização = [
    1/8, 1/8, 1/8,
    1/8, 0,   1/8,
    1/8, 1/8, 1/8
];

count = 0;
function render(){
    utils.activateTexture(textureGatoPersa, 0);
    utils.activateTexture(textureBolinha, 1);

        utils.linkUniformVariable({
            shaderName: "uKernel",
            value: kernelDesfoqueGaussiano,
            kind: "1fv"
        });
        

  utils.linkUniformVariable({
    shaderName: "uSampler",
    value: count % 2,
    kind: "1i",
  });


  if (count % 2 == 0) {
    utils.linkUniformVariable({
      shaderName: "uTextureSize",
      value: [gatoPersaImage.width, gatoPersaImage.height],
      kind: "2fv",
    });
  } else {
    utils.linkUniformVariable({
      shaderName: "uTextureSize",
      value: [bolinhasImage.width, bolinhasImage.height],
      kind: "2fv",
    });
  }


  utils.drawElements({ method: "TRIANGLES" });


  count = count + 1;
        setTimeout(
        function () {render();},
        speed
        );
    
}

render();