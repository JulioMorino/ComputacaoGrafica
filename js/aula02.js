var utils = new Utils();

vertices = []
function bresenham(){
    var positions = [1,1,1,2,2,3,3,4,4,5,5,5,5,6,6,7]
    
    for (var i = 0; i < positions.length; i = i+2){
	var {x, y} = utils.convertCoords(
	    {
		x : positions[i], y : positions[i+1],
		maxX : 20, maxY:20, flipY : 1
	    }
	)
	vertices.push(x);
	vertices.push(y);	    
    }
}
bresenham();


utils.initBuffer({vertices});
utils.initShader();
utils.linkBuffer();
utils.drawElements();
