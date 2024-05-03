/*
  Passo 0:  Inicializando o Canvas e o context.
 */
  var canvas = document.getElementById('canvas');
  canvas.width = 200;
  canvas.height = 200;
  
  var gl = canvas.getContext('webgl2');
  console.log(gl);
  
  gl.clearColor(0.1, 0.2, 0.3, 0.4);
  
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  
  
  /*
    Passo 1: Enviando os dados para a GPU
  */
  
    var vertices = [
      
      0.0, 0.0,  // 
      0.1, 0.0,  // largura
      0.2,  0.0,//
      0.3, 0.0,
      0.4, 0.0,
      0.5, 0.0,
      0.6, 0.0,
      
      0.0,  0.1, //
      0.0,  0.2, //altura
      0.0,  0.3, //
      0.0,  0.4, //
      0.0,  0.5, //
      0.0,  0.6,
      
      0.1, 0.5,//
      0.2, 0.4,//
      0.3, 0.3,//diagonal
      0.4, 0.2,//
      0.5, 0.1,//
    ];

  ///////////////
  //Atividade 02, implementando o algoritmo PPS
  ///////////////
  function isVertice(vertices, cordX_vizinho, cordY_vizinho){
    var z = 0;
    
    while(z < vertices.length){
      if(cordX_vizinho === vertices[z] && cordY_vizinho === vertices[z + 1]){
            return true;
      }else{
            z = z + 2;
      }
    }
    
    return false;
  }

  function alreadyInFillArray( array, cordX_vizinho, cordY_vizinho){
    var z = 0;
  
    while(z < array.length){
      if(cordX_vizinho === array[z][0] && cordY_vizinho === array[z][1]){
          return true;
      }else{
          z ++;
      }
    }
    
    return false;
  }


  function PPS(vertices){
    var fillStack = [];
    var filledPoints = [];
    var conjuntoQuatroVizinhos = [];
    var seed = [0.2, 0.2];
    fillStack.push(seed);

    while(fillStack.length !== 0){
      //retirando da pilha e gravando a cord desse pixel
      var currentPixel = fillStack.pop();
      var cordX = currentPixel[0];
      var cordY = currentPixel[1];

      filledPoints.push(currentPixel);
      var step = 0.1; // Precisão
      var conjuntoQuatroVizinhos = [
      [cordX, parseFloat((cordY + step).toFixed(1))],
      [parseFloat((cordX + step).toFixed(1)), cordY],
      [cordX, parseFloat((cordY - step).toFixed(1))],
      [parseFloat((cordX - step).toFixed(1)), cordY]
      ];
      console.log(conjuntoQuatroVizinhos);
      for(let i = 0; i < 4; i++){
        var vizinhoX = conjuntoQuatroVizinhos[i][0];
        var vizinhoY = conjuntoQuatroVizinhos[i][1];

        
        var alreadyVertice       = isVertice(vertices, vizinhoX, vizinhoY);
        var alreadyInFillStack   = alreadyInFillArray(fillStack, vizinhoX, vizinhoY);
        var alreadyFilled        = alreadyInFillArray(filledPoints, vizinhoX, vizinhoY); 
        //true -> já se encontra no array

        if(!alreadyVertice && !alreadyInFillStack && !alreadyFilled){
          fillStack.push(conjuntoQuatroVizinhos[i]);
          
            console.log(conjuntoQuatroVizinhos[i]);
            
        }
        
      }
      
    }

    return filledPoints;
  }
  var filledPoints = PPS(vertices);
  
  
  
  //concatenando
  for (let i = 0; i < filledPoints.length; i++) {
    // Adiciona a coordenada x
    vertices.push(filledPoints[i][0]);
    // Adiciona a coordenada y
    vertices.push(filledPoints[i][1]);
  }
  
  console.log(vertices);
  ////////////////////////////////////////////

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),
            gl.STATIC_DRAW);
  
  /*
    Passo 2: Criando o código dos shaders que serão executados
    na GPU.
  */
  
  var vertexShader = `#version 300 es
  precision mediump float;
  
  in vec2 aPosition;
  
  void main(){
  gl_PointSize = 10.0;
  gl_Position = vec4(aPosition, 0.0, 1.0);
  }`;
  
  var fragmentShader = `#version 300 es
  precision highp float;
  out vec4 fColor;
  void main(){
     fColor=vec4(1.0, 0.0, 0.0, 1.0);
  }`;
  
  /*
    Passo 3: Compilando os códigos e enviando para a GPU. Essa parte do
    código é sempre igual para todos os programas que criaremos.
   */
  
  var vertShdr = gl.createShader( gl.VERTEX_SHADER );
  var fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
  gl.shaderSource( vertShdr, vertexShader);
  gl.shaderSource( fragShdr, fragmentShader);
  gl.compileShader( vertShdr );
  gl.compileShader( fragShdr );
  
  if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
      var msg = "Vertex shader failed to compile.  The error log is:"
          + "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
      alert( msg );
  }
    
  if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
      var msg = "Fragment shader failed to compile.  The error log is:"
          + "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
      alert( msg );
  }
  
  var program = gl.createProgram();
  gl.attachShader( program, vertShdr );
  gl.attachShader( program, fragShdr );
  gl.linkProgram( program );
  
  if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
      var msg = "Shader program failed to link.  The error log is:"
          + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
      alert( msg );
  }
  console.log(program);
  
  /*
    Passo 4: precisamos linkar as variáveis criadas nos shaders com os
    dados que enviamos à GPU para que o programa consiga usar o que foi
    enviado.
   */
  
  gl.useProgram(program);
  var positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);
  
  /*
    Passo 5: finalmente, agora que está tudo pronto, podemos fazer uma
    chamada para realmente colocar os gráficos na tela.
   */
  gl.drawArrays(gl.POINTS, 0, vertices.length / 2);