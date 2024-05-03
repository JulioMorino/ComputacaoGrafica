/*
  Passo 0:  Inicializando o Canvas e o context.
 */
  var canvas = document.getElementById('canvas');

  var gl = canvas.getContext('webgl2');
  console.log(gl);
  
  gl.clearColor(0.1, 0.2, 0.3, 0.4);
  
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  
  
  var maxX = 200, maxY = 200;

  /*usando a regra de três para webGl.*/
    function convertCoords(x, y){
    var xw = (2*x)/maxX - 1;
    var yw = (2*y)/maxY - 1;
    return [xw, yw];
  };
  
  
  /*função para desenhar uma linha usando o algoritmo de DDA*/
  function DDA(x0, y0, x1, y1){
    var length;
    if( Math.abs(x1 - x0) >= Math.abs(y1 - y0)){
      length = Math.abs(x1 - x0);
    }else{
      length = Math.abs(y1 - y0);
    }
    var dx = (x1 - x0) / length;
    var dy = (y1 - y0) / length;
    var x = x0 + 0.5;
    var y = y0 + 0.5;
    var i = 1;
    var vertices = [];
    
    while(i <= length){
        var cords = convertCoords(Math.floor(x),Math.floor(y)); 
        vertices.push(cords[0], cords[1]);
        x = x + dx;
        y = y + dy;
        i++;
    }
    
    return vertices;
  }
  
  

  /*
    Passo 1: Enviando os dados para a GPU
  */
  
  var vertices = DDA(0, 0, 200, 130);
  
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
  gl.drawArrays(gl.POINTS, 0, vertices.length/2);