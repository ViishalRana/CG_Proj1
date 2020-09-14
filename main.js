var vertexShaderText=`
precision mediump float;
attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
void main(){
    fragColor=vertColor;
    gl_Position=vec4(vertPosition,0.0,1.0);
    gl_PointSize=2.0;
} 
`;

var fragmentShaderText=`
precision mediump float;
varying vec3 fragColor;
void main(){
    gl_FragColor=vec4(fragColor,1.0);
}
`;
function createPoints(depth, x, y, length, angle, points) {

    if (depth <= 0)
        return;

    // end of current line segment
    let x2 = x + length * Math.sin(angle);
    let y2 = y + length * Math.cos(angle);

    // add segment
    if(((x>-0.55 && y<0.7) && (x>-0.55 && y>-0.2)) && ((x2>-0.55 && y2<0.7) && (x2>-0.55 && y2>-0.2)))
    points.push(x, y,tr1,tb1,tg1, x2, y2,tr2,tb2,tg2);

    // create 2 branches
    createPoints(depth-1, x2, y2, length*0.5, angle+Math.PI/4, points);
    createPoints(depth-1, x2, y2, length*0.45, angle-Math.PI/6, points);
    createPoints(depth-1, x2, y2, length*0.5, angle-Math.PI/8, points);
    createPoints(depth-1, x2, y2, length*0.65, angle+Math.PI/6, points);
    createPoints(depth-1, x2, y2, length*0.35, angle-Math.PI/4, points);

}

var lr=0.9648,lg=0.5156,lb=0.1757;
var ur=0.9648,ug=0.9648,ub=0.1757;
var tr1=0.0,tb1=0.0,tg1=0.0;
var tr2=0.8,tb2=0.5,tg2=1.0;
var cnt=0;
// var lr=0.140,lg=0.8515,lb=0.9453;
// var ur=1.0,ug=1.0,ub=1.0;

// var lr=0.8164,lg=0.2773,lb=0.3476;
// var ur=0.3203,ug=0.0,ub=0.4687;

// var lr=0.0390,lg=0.3515,lb=0.4296;
// var ur=0.0,ug=0.0,ub=0.0;

function initDemo(){
    console.log("Works fine.!");

    var canvas=document.getElementById("myCanvas");
    var gl=canvas.getContext("webgl");

    if(!gl){
        alert("Webgl not supported.!");
        return;
    }

    gl.clearColor(0.5429,0.7,0.965, 1.0); //wall paint
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    var vertexShader=gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader,fragmentShaderText);

    gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

    gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
    }
    
    var program=gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
    }
    gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
    }
    var ax=-1,ay=-0.4,bx=ax+0.25,by=-0.4,cx=bx,cy=by-0.25,dx=ax,dy=ay-0.25;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
    var ac=1.0,bc=0.0;
    for(i=0;i<8;i++){
        for(j=0;j<4;j++){
            var vertices=[
                //x,y           r,g,b
                ax,ay,       ac,ac,ac,
                bx,by,          ac,ac,ac,
                cx,cy,         ac,ac,ac,
                dx,dy,       ac,ac,ac,
            ];
            var vertices2=[
                //x,y           r,g,b
                bx,by,       bc,bc,bc,
                bx+0.25,by,          bc,bc,bc,
                cx+0.25,cy,         bc,bc,bc,
                cx,cy,       bc,bc,bc,
            ];
            var squareVertexBufferObject=gl.createBuffer();
            var squareVertexBufferObject2=gl.createBuffer();
        
            gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);    
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
            var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
            var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
            gl.vertexAttribPointer(
                positionAttribLocation, // Attribute location
                2, // Number of elements per attribute
                gl.FLOAT, // Type of elements
                gl.FALSE,
                5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                0 // Offset from the beginning of a single vertex to this attribute
            ); 
            gl.vertexAttribPointer(
                colorAttribLocation, // Attribute location
                3, // Number of elements per attribute
                gl.FLOAT, // Type of elements
                gl.FALSE,
                5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
            );    
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.enableVertexAttribArray(colorAttribLocation);
            
            gl.useProgram(program);
        
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        
        
            gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject2);    
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);
        
            var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
            var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
            gl.vertexAttribPointer(
                positionAttribLocation, // Attribute location
                2, // Number of elements per attribute
                gl.FLOAT, // Type of elements
                gl.FALSE,
                5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                0 // Offset from the beginning of a single vertex to this attribute
            ); 
            gl.vertexAttribPointer(
                colorAttribLocation, // Attribute location
                3, // Number of elements per attribute
                gl.FLOAT, // Type of elements
                gl.FALSE,
                5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
            );    
            gl.enableVertexAttribArray(positionAttribLocation);
            gl.enableVertexAttribArray(colorAttribLocation);
            
            gl.useProgram(program);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
             ax=ax+0.5;
             bx=bx+0.5;
             cx=bx;
             dx=ax;
        }
        ay=ay-0.25;
        by=ay;
        cy=cy-0.25;
        dy=cy;
        ax=-1;
        bx=ax+0.25;
        cx=bx;
        dx=ax;
        if(i%2==0){
            ac=0.0;
            bc=1.0;
        }else{
            ac=1.0;
            bc=0.0;
        }
    }
    var tpoints=[];
    var cnt=1000;
    while(cnt--){
        tpoints.push((Math.random()*2-1),(Math.random()*(0.6)-1.0),0.0,0.0,0.0);
    }
    console.log(tpoints);
    var tpointsBufferObject=gl.createBuffer();
        
    gl.bindBuffer(gl.ARRAY_BUFFER, tpointsBufferObject);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tpoints), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.POINTS, 0, tpoints.length);


    windowVertices=[
        //x , y         r, g, b
        -0.55, 0.7,      ur,ug,ub,   //top left and shading from dark sky blue to light
        0.55, 0.7,       ur,ug,ub,  //top right
        0.55, -0.2,      lr,lg,lb,  //bottom right
        -0.55, -0.2,     lr,lg,lb,  //bottom left
    ];    

    var windowBuffer=gl.createBuffer();
        
    gl.bindBuffer(gl.ARRAY_BUFFER, windowBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(windowVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    let points = [];
    createPoints(10, -0.795, -1.0, 0.7, 0.0, points);

    var pointsBuffer=gl.createBuffer();
        
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);
    
    gl.drawArrays(gl.LINES, 0, points.length);



//Creating right cupboard first because table may overlap the right cupboard


    var RcupboardVertices=[
        1.0,1.0,       0.5429,0.804,0.875,  //creating first side wall
        0.9,1.0,       0.5429,0.804,0.875,
        0.9,-0.9,      0.5429,0.804,0.875,
        1.0,-1.0,      0.5429,0.804,0.875,  
        0.9,1.0,       0.5429,0.804,0.875,  //creating mid wall/backside
        0.7,1.0,       0.6914,0.9335,0.9375,
        0.7,-0.9,      0.5429,0.804,0.875,
        0.9,-0.9,      0.6914,0.9335,0.9375,    
        0.7,1.0,       0.5429,0.804,0.875,  //creating second sidewall
        0.6,1.0,       0.5429,0.804,0.875, 
        0.6,-1.0,      0.5429,0.804,0.875,
        0.7,-0.9,      0.5429,0.804,0.875,
        1.0,0.85,      0.609,0.496,0.363,   //most upper board
        0.6,0.85,      0.609,0.496,0.363,
        0.9,0.95,      0.609,0.496,0.363,
        0.7,0.95,      0.609,0.496,0.363,
        1.0,0.55,      0.609,0.496,0.363,   //second 
        0.6,0.55,      0.609,0.496,0.363,
        0.9,0.65,      0.609,0.496,0.363,
        0.7,0.65,      0.609,0.496,0.363,
        1.0,0.25,      0.609,0.496,0.363,   //third
        0.6,0.25,      0.609,0.496,0.363,
        0.9,0.35,      0.609,0.496,0.363,
        0.7,0.35,      0.609,0.496,0.363,
        1.0,-0.2,      0.609,0.496,0.363,   //last
        0.6,-0.2,      0.609,0.496,0.363,
        0.9,-0.1,      0.609,0.496,0.363,
        0.7,-0.1,      0.609,0.496,0.363,

        
        1.0,0.85,      0.709,0.596,0.363,
        0.6,0.85,      0.709,0.596,0.363,
        0.6,0.83,      0.709,0.596,0.363,
        1.0,0.83,      0.709,0.596,0.363,

        1.0,0.55,      0.709,0.596,0.363,
        0.6,0.55,      0.709,0.596,0.363,
        0.6,0.53,      0.709,0.596,0.363,
        1.0,0.53,      0.709,0.596,0.363,

        1.0,0.25,      0.709,0.596,0.363,
        0.6,0.25,      0.709,0.596,0.363,
        0.6,0.23,      0.709,0.596,0.363,
        1.0,0.23,      0.709,0.596,0.363,

        1.0,-0.2,      0.709,0.596,0.363,
        0.6,-0.2,      0.709,0.596,0.363,
        0.6,-0.23,      0.709,0.596,0.363,
        1.0,-0.23,      0.709,0.596,0.363,

    ];
    var RcupboardBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, RcupboardBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RcupboardVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 16, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 20, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);

    var tableBack=[
        0.5,-0.2,       0.386,0.2460,0.2304,
        -0.5,-0.2,      0.386,0.2460,0.2304,
        -0.5,-0.6,      0.609,0.4179,0.394,
        0.5,-0.6,        0.609,0.4179,0.394,
    ];
        
    var chairBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, chairBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tableBack), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    
    chairVertices=[
        -0.55,-0.4,     0.109,0.4179,0.1914,    //sitting base
        -0.38,-0.4,     0.109,0.4179,0.1914,
        -0.4,-0.6,     0.109,0.4179,0.1914,
        -0.6,-0.6,     0.109,0.4179,0.1914,
        -0.6,-0.6,     0.109,0.4179,0.1914, //support
        -0.6,-0.3,     0.109,0.4179,0.1914,
        -0.59,-0.32,     0.109,0.4179,0.1914,
        -0.59,-0.6,     0.109,0.4179,0.1914,
        -0.6,-0.3,     0.109,0.4179,0.1914, //support upper frame
        -0.55,-0.2,     0.109,0.4179,0.1914,
        -0.55,-0.23,     0.109,0.4179,0.1914,
        -0.59,-0.32,     0.109,0.4179,0.1914,
        -0.55,-0.2,     0.109,0.4179,0.1914,//support right
        -0.55,-0.4,     0.109,0.4179,0.1914,
        -0.56,-0.44,     0.109,0.4179,0.1914,
        -0.56,-0.25,     0.109,0.4179,0.1914,
        -0.6,-0.6,     0.109,0.4179,0.1914,//legs left front
        -0.6,-0.8,     0.109,0.4179,0.1914,
        -0.59,-0.8,     0.109,0.4179,0.1914,
        -0.59,-0.6,     0.109,0.4179,0.1914,
        -0.56,-0.44,     0.109,0.4179,0.1914,
        -0.56,-0.65,     0.109,0.4179,0.1914,
        -0.55,-0.65,     0.109,0.4179,0.1914,
        -0.55,-0.44,     0.109,0.4179,0.1914,
 //right side
        0.55,-0.4,     0.109,0.4179,0.1914,    //sitting base
        0.38,-0.4,     0.109,0.4179,0.1914,
        0.4,-0.6,     0.109,0.4179,0.1914,
        0.6,-0.6,     0.109,0.4179,0.1914,
        0.6,-0.6,     0.109,0.4179,0.1914, //support
        0.6,-0.3,     0.109,0.4179,0.1914,
        0.59,-0.32,     0.109,0.4179,0.1914,
        0.59,-0.6,     0.109,0.4179,0.1914,
        0.6,-0.3,     0.109,0.4179,0.1914, //support upper frame
        0.55,-0.2,     0.109,0.4179,0.1914,
        0.55,-0.23,     0.109,0.4179,0.1914,
        0.59,-0.32,     0.109,0.4179,0.1914,
        0.55,-0.2,     0.109,0.4179,0.1914,//support right
        0.55,-0.4,     0.109,0.4179,0.1914,
        0.56,-0.44,     0.109,0.4179,0.1914,
        0.56,-0.25,     0.109,0.4179,0.1914,
        0.6,-0.6,     0.109,0.4179,0.1914,//legs left front
        0.6,-0.8,     0.109,0.4179,0.1914,
        0.59,-0.8,     0.109,0.4179,0.1914,
        0.59,-0.6,     0.109,0.4179,0.1914,
        0.56,-0.44,     0.109,0.4179,0.1914,
        0.56,-0.65,     0.109,0.4179,0.1914,
        0.55,-0.65,     0.109,0.4179,0.1914,
        0.55,-0.44,     0.109,0.4179,0.1914,


    ];

    
    var chairBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, chairBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chairVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 44, 4);

    tableVertices=[
        //x , y         r, g, b
        0.5, -0.2,      0.386,0.2460,0.2304,   //upside of table
        -0.5,-0.2,       0.386,0.2460,0.2304,
        -0.4,-0.55,      0.609,0.4179,0.394,
        0.65,-0.55,     0.609,0.4179,0.394,
        -0.5, -0.2,      0.3008,0.0820,0.0820,   //dark brown stip left side
        -0.5, -0.23,      0.3008,0.0820,0.0820,   
        -0.4,-0.55,     0.3008,0.0820,0.0820,
        -0.4,-0.58,     0.3008,0.0820,0.0820,       
        -0.4,-0.55,     0.386,0.2460,0.2304,    //front side
        -0.4,-0.88,     0.609,0.4179,0.394,       
        0.1,-0.55,     0.386,0.2460,0.2304,  
        0.1,-0.88,     0.609,0.4179,0.394,
        0.1,-0.55,     0.386,0.2460,0.2304,     
        0.1,-0.88,     0.609,0.4179,0.394,       
        0.65,-0.55,     0.386,0.2460,0.2304,  
        0.65,-0.88,     0.609,0.4179,0.394,
        0.0,-0.2,       0.0,0.0,0.0,
        0.01,-0.2,     0.0,0.0,0.0,
        0.1,-0.55,     0.0,0.0,0.0,
        0.09,-0.55,     0.0,0.0,0.0,
        0.1,-0.55,     0.0,0.0,0.0,
        0.09,-0.55,     0.0,0.0,0.0,
        0.1,-0.88,     0.0,0.0,0.0,
        0.09,-0.88,     0.0,0.0,0.0,


    ];    

    var tableBuffer=gl.createBuffer();
        
    gl.bindBuffer(gl.ARRAY_BUFFER, tableBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tableVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);
    
    //gl.drawArrays(gl.TRIANGLE_FAN,24,4);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 20, 4);


    var curtainVertices=[
        -0.57,0.72,     1.0, 1.0, 0.0,
        0.57,0.72,     1.0, 1.0, 0.0,
        -0.57,0.7,     1.0,1.0,1.0,
        0.57,0.7,     1.0,1.0,1.0,
    ];

    var curtainBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, curtainBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curtainVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    var ax=0.57,ay=0.71,bx=0.59,by=0.71;
    var theta=0;
    var r=0.02;

    while(theta<=2*Math.PI){
        var vertices=[
            //x, y,     r, g, b
            ax, ay,     0.609,0.4179,0.394,
            bx, by,     0.386,0.2460,0.2304,
        ];
        var squareVertexBufferObject=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
    
        gl.drawArrays(gl.LINES, 0, 2);
        bx=ax+r*Math.cos(theta);
        by=ay-r*Math.sin(theta);
        theta+=0.01;
    }

    var ax=-0.57,ay=0.71,bx=-0.55,by=0.71;
    var theta=0;
    var r=0.02;

    while(theta<=2*Math.PI){
        var vertices=[
            //x, y,     r, g, b
            ax, ay,     0.609,0.4179,0.394,
            bx, by,     0.386,0.2460,0.2304,
        ];
        var squareVertexBufferObject=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
    
        gl.drawArrays(gl.LINES, 0, 2);
        bx=ax+r*Math.cos(theta);
        by=ay-r*Math.sin(theta);
        theta+=0.01;
    }

    var LcupboardVertices=[
        -1.0,1.0,       0.5429,0.804,0.875,
        -0.9,1.0,       0.5429,0.804,0.875,
        -0.9,-0.9,      0.5429,0.804,0.875,
        -1.0,-1.0,      0.5429,0.804,0.875,

        -0.9,1.0,       0.5429,0.804,0.875,
        -0.7,1.0,       0.6914,0.9335,0.9375,
        -0.7,-0.9,      0.5429,0.804,0.875,
        -0.9,-0.9,      0.6914,0.9335,0.9375,
        
        -0.7,1.0,       0.5429,0.804,0.875,
        -0.6,1.0,       0.5429,0.804,0.875,
        -0.6,-1.0,      0.5429,0.804,0.875,
        -0.7,-0.9,      0.5429,0.804,0.875,
        
        -1.0,0.85,      0.609,0.496,0.363,
        -0.6,0.85,      0.609,0.496,0.363,
        -0.9,0.95,      0.609,0.496,0.363,
        -0.7,0.95,      0.609,0.496,0.363,
        
        -1.0,0.55,      0.609,0.496,0.363,
        -0.6,0.55,      0.609,0.496,0.363,
        -0.9,0.65,      0.609,0.496,0.363,
        -0.7,0.65,      0.609,0.496,0.363,

        -1.0,0.25,      0.609,0.496,0.363,
        -0.6,0.25,      0.609,0.496,0.363,
        -0.9,0.35,      0.609,0.496,0.363,
        -0.7,0.35,      0.609,0.496,0.363,
        
        -1.0,-0.2,      0.609,0.496,0.363,
        -0.6,-0.2,      0.609,0.496,0.363,
        -0.9,-0.1,      0.609,0.496,0.363,
        -0.7,-0.1,      0.609,0.496,0.363,

        -1.0,0.85,      0.709,0.596,0.363,
        -0.6,0.85,      0.709,0.596,0.363,
        -0.6,0.83,      0.709,0.596,0.363,
        -1.0,0.83,      0.709,0.596,0.363,

        -1.0,0.55,      0.709,0.596,0.363,
        -0.6,0.55,      0.709,0.596,0.363,
        -0.6,0.53,      0.709,0.596,0.363,
        -1.0,0.53,      0.709,0.596,0.363,

        -1.0,0.25,      0.709,0.596,0.363,
        -0.6,0.25,      0.709,0.596,0.363,
        -0.6,0.23,      0.709,0.596,0.363,
        -1.0,0.23,      0.709,0.596,0.363,

        -1.0,-0.2,      0.709,0.596,0.363,
        -0.6,-0.2,      0.709,0.596,0.363,
        -0.6,-0.23,      0.709,0.596,0.363,
        -1.0,-0.23,      0.709,0.596,0.363,

    ];
    var LcupboardBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, LcupboardBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(LcupboardVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 16, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 20, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);
    
    
    var bedVertices=[
        -1.0,-0.57,     1.0,1.0,1.0,
        -0.55,-0.57,     1.0,1.0,1.0,
        -0.55,-0.85,     0.769,0.7851,0.4101,
        -1.0,-0.85,     0.769,0.7851,0.4101,
        -1.0,-0.85,     1.0,1.0,1.0,
        -0.55,-0.85,     1.0,1.0,1.0,
        -0.60,-1.0,     0.769,0.7851,0.4101,
        -1.0,-1.0,     0.769,0.7851,0.4101,
        -0.55,-0.85,     0.769,0.7851,0.4101,
        -0.55,-1.0,     0.769,0.7851,0.4101,
        -0.56,-1.0,     0.769,0.7851,0.4101,
        -0.56,-0.85,     0.769,0.7851,0.4101,


// right
1.0,-0.57,     1.0,1.0,1.0,
0.55,-0.57,     1.0,1.0,1.0,
0.55,-0.85,     0.769,0.7851,0.4101,
1.0,-0.85,     0.769,0.7851,0.4101,
1.0,-0.85,     1.0,1.0,1.0,
0.55,-0.85,     1.0,1.0,1.0,
0.60,-1.0,     0.769,0.7851,0.4101,
1.0,-1.0,     0.769,0.7851,0.4101,
0.55,-0.85,     0.769,0.7851,0.4101,
0.55,-1.0,     0.769,0.7851,0.4101,
0.56,-1.0,     0.769,0.7851,0.4101,
0.56,-0.85,     0.769,0.7851,0.4101,
    ];
    var bedBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bedBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bedVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    //gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);

    var thingsVertices=[
        -0.8,-0.2, 0.0,0.0,0.0,//dibba
        -0.7,-0.2,0.0,0.0,0.0,
        -0.7,-0.05,0.0,0.0,0.0,
        -0.8,-0.05,0.0,0.0,0.0,   
        -0.8,-0.05,1.0,0.9,0.0,
        -0.7,-0.05,1.0,0.9,0.0,
        -0.7,-0.03,1.0,0.9,0.0,
        -0.8,-0.03,1.0,0.9,0.0,
        //books
        -1.0,0.45,0.0,0.0,1.0,
        -0.93,0.25,0.0,0.0,1.0,
        -0.9,0.25,0.0,0.0,1.0,
        -0.97,0.45,0.0,0.0,1.0, 
        
        -0.945,0.38,0.0,0.0,0.0,
        -0.9,0.25,0.0,0.0,0.0,
        -0.88,0.25,0.0,0.0,0.0,
        -0.92,0.38,0.0,0.0,0.0, 
        //
        1.0,0.45,0.0,0.0,1.0,
        0.93,0.25,0.0,0.0,1.0,
        0.9,0.25,0.0,0.0,1.0,
        0.97,0.45,0.0,0.0,1.0, 
        
        0.945,0.38,0.0,0.0,0.0,
        0.9,0.25,0.0,0.0,0.0,
        0.88,0.25,0.0,0.0,0.0,
        0.92,0.38,0.0,0.0,0.0, 
    ];
    var thingsBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, thingsBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(thingsVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);

    var bedsheet=[
        -1.0,-0.855,     0.0,0.5,0.0,
        -0.59,-0.855,    0.0,0.4,0.0,
        -0.65,-1.0,    0.0,0.2,0.0,
        -1.0,-1.0,     0.0,0.1,0.0,
    ];
    var bedsheetBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bedsheetBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bedsheet), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    var tc=1;
    setInterval(function(){
        if(tc==0){
            var lr=0.9648,lg=0.5156,lb=0.1757;
            var ur=0.9648,ug=0.9648,ub=0.1757;
                tr1=0.0,tb1=0.0,tg1=0.0;
                tr2=0.8,tb2=0.5,tg2=1.0;
                
            tc++;
        }else if(tc==1){
             var lr=0.140,lg=0.8515,lb=0.9453;
             var ur=1.0,ug=1.0,ub=1.0;
             tr1=0.0,tb1=0.0,tg1=0.0;
             tr2=0.0,tb2=0.6,tg2=0.3;
            tc++;
        }else if(tc==2){
           var lr=0.8164,lg=0.2773,lb=0.3476;
            var ur=0.3203,ug=0.0,ub=0.4687;
            tr1=0.0,tb1=0.0,tg1=0.0;
            tr2=0.0,tb2=0.5,tg2=0.4;

            tc++;
        }else{
            var lr=0.0390,lg=0.3515,lb=0.4296;
             var ur=0.0,ug=0.0,ub=0.0;
             tr1=0.6,tb1=0.6,tg1=0.6;
             tr2=1.0,tb2=1.0,tg2=1.0;
 
             tc=0;
        }

        var ax=-1,ay=-0.4,bx=ax+0.25,by=-0.4,cx=bx,cy=by-0.25,dx=ax,dy=ay-0.25;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
        var ac=1.0,bc=0.0;
        for(i=0;i<8;i++){
            for(j=0;j<4;j++){
                var vertices=[
                    //x,y           r,g,b
                    ax,ay,       ac,ac,ac,
                    bx,by,          ac,ac,ac,
                    cx,cy,         ac,ac,ac,
                    dx,dy,       ac,ac,ac,
                ];
                var vertices2=[
                    //x,y           r,g,b
                    bx,by,       bc,bc,bc,
                    bx+0.25,by,          bc,bc,bc,
                    cx+0.25,cy,         bc,bc,bc,
                    cx,cy,       bc,bc,bc,
                ];
                var squareVertexBufferObject=gl.createBuffer();
                var squareVertexBufferObject2=gl.createBuffer();
            
                gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);    
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            
                var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
                var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
                gl.vertexAttribPointer(
                    positionAttribLocation, // Attribute location
                    2, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0 // Offset from the beginning of a single vertex to this attribute
                ); 
                gl.vertexAttribPointer(
                    colorAttribLocation, // Attribute location
                    3, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
                );    
                gl.enableVertexAttribArray(positionAttribLocation);
                gl.enableVertexAttribArray(colorAttribLocation);
                
                gl.useProgram(program);
            
                gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            
            
                gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject2);    
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);
            
                var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
                var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
                gl.vertexAttribPointer(
                    positionAttribLocation, // Attribute location
                    2, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    0 // Offset from the beginning of a single vertex to this attribute
                ); 
                gl.vertexAttribPointer(
                    colorAttribLocation, // Attribute location
                    3, // Number of elements per attribute
                    gl.FLOAT, // Type of elements
                    gl.FALSE,
                    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
                    2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
                );    
                gl.enableVertexAttribArray(positionAttribLocation);
                gl.enableVertexAttribArray(colorAttribLocation);
                
                gl.useProgram(program);
                gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
                 ax=ax+0.5;
                 bx=bx+0.5;
                 cx=bx;
                 dx=ax;
            }
            ay=ay-0.25;
            by=ay;
            cy=cy-0.25;
            dy=cy;
            ax=-1;
            bx=ax+0.25;
            cx=bx;
            dx=ax;
            if(i%2==0){
                ac=0.0;
                bc=1.0;
            }else{
                ac=1.0;
                bc=0.0;
            }
        }
        var tpoints=[];
        var cnt=1000;
        while(cnt--){
            tpoints.push((Math.random()*2-1),(Math.random()*(0.6)-1.0),0.0,0.0,0.0);
        }
        console.log(tpoints);
        var tpointsBufferObject=gl.createBuffer();
            
        gl.bindBuffer(gl.ARRAY_BUFFER, tpointsBufferObject);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tpoints), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
    
        gl.drawArrays(gl.POINTS, 0, tpoints.length);
        
    
        windowVertices=[
            //x , y         r, g, b
            -0.55, 0.7,      ur,ug,ub,   //top left and shading from dark sky blue to light
            0.55, 0.7,       ur,ug,ub,  //top right
            0.55, -0.2,      lr,lg,lb,  //bottom right
            -0.55, -0.2,     lr,lg,lb,  //bottom left
        ];    
    
        var windowBuffer=gl.createBuffer();
            
        gl.bindBuffer(gl.ARRAY_BUFFER, windowBuffer);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(windowVertices), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
    
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

        let points = [];
        createPoints(10, -0.795, -1.0, 0.7, 0.0, points);
    
        var pointsBuffer=gl.createBuffer();
            
        gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
        
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
        
        gl.drawArrays(gl.LINES, 0, points.length);
    
    
    //Creating right cupboard first because table may overlap the right cupboard
    
    var RcupboardVertices=[
        1.0,1.0,       0.5429,0.804,0.875,  //creating first side wall
        0.9,1.0,       0.5429,0.804,0.875,
        0.9,-0.9,      0.5429,0.804,0.875,
        1.0,-1.0,      0.5429,0.804,0.875,  
        0.9,1.0,       0.5429,0.804,0.875,  //creating mid wall/backside
        0.7,1.0,       0.6914,0.9335,0.9375,
        0.7,-0.9,      0.5429,0.804,0.875,
        0.9,-0.9,      0.6914,0.9335,0.9375,    
        0.7,1.0,       0.5429,0.804,0.875,  //creating second sidewall
        0.6,1.0,       0.5429,0.804,0.875, 
        0.6,-1.0,      0.5429,0.804,0.875,
        0.7,-0.9,      0.5429,0.804,0.875,
        1.0,0.85,      0.609,0.496,0.363,   //most upper board
        0.6,0.85,      0.609,0.496,0.363,
        0.9,0.95,      0.609,0.496,0.363,
        0.7,0.95,      0.609,0.496,0.363,
        1.0,0.55,      0.609,0.496,0.363,   //second 
        0.6,0.55,      0.609,0.496,0.363,
        0.9,0.65,      0.609,0.496,0.363,
        0.7,0.65,      0.609,0.496,0.363,
        1.0,0.25,      0.609,0.496,0.363,   //third
        0.6,0.25,      0.609,0.496,0.363,
        0.9,0.35,      0.609,0.496,0.363,
        0.7,0.35,      0.609,0.496,0.363,
        1.0,-0.2,      0.609,0.496,0.363,   //last
        0.6,-0.2,      0.609,0.496,0.363,
        0.9,-0.1,      0.609,0.496,0.363,
        0.7,-0.1,      0.609,0.496,0.363,

        
        1.0,0.85,      0.709,0.596,0.363,
        0.6,0.85,      0.709,0.596,0.363,
        0.6,0.83,      0.709,0.596,0.363,
        1.0,0.83,      0.709,0.596,0.363,

        1.0,0.55,      0.709,0.596,0.363,
        0.6,0.55,      0.709,0.596,0.363,
        0.6,0.53,      0.709,0.596,0.363,
        1.0,0.53,      0.709,0.596,0.363,

        1.0,0.25,      0.709,0.596,0.363,
        0.6,0.25,      0.709,0.596,0.363,
        0.6,0.23,      0.709,0.596,0.363,
        1.0,0.23,      0.709,0.596,0.363,

        1.0,-0.2,      0.709,0.596,0.363,
        0.6,-0.2,      0.709,0.596,0.363,
        0.6,-0.23,      0.709,0.596,0.363,
        1.0,-0.23,      0.709,0.596,0.363,

    ];
    var RcupboardBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, RcupboardBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(RcupboardVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 16, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 20, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);

    var tableBack=[
        0.5,-0.2,       0.386,0.2460,0.2304,
        -0.5,-0.2,      0.386,0.2460,0.2304,
        -0.5,-0.6,      0.609,0.4179,0.394,
        0.5,-0.6,        0.609,0.4179,0.394,
    ];
        
    var chairBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, chairBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tableBack), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


    
    chairVertices=[
        -0.55,-0.4,     0.109,0.4179,0.1914,    //sitting base
        -0.38,-0.4,     0.109,0.4179,0.1914,
        -0.4,-0.6,     0.109,0.4179,0.1914,
        -0.6,-0.6,     0.109,0.4179,0.1914,
        -0.6,-0.6,     0.109,0.4179,0.1914, //support
        -0.6,-0.3,     0.109,0.4179,0.1914,
        -0.59,-0.32,     0.109,0.4179,0.1914,
        -0.59,-0.6,     0.109,0.4179,0.1914,
        -0.6,-0.3,     0.109,0.4179,0.1914, //support upper frame
        -0.55,-0.2,     0.109,0.4179,0.1914,
        -0.55,-0.23,     0.109,0.4179,0.1914,
        -0.59,-0.32,     0.109,0.4179,0.1914,
        -0.55,-0.2,     0.109,0.4179,0.1914,//support right
        -0.55,-0.4,     0.109,0.4179,0.1914,
        -0.56,-0.44,     0.109,0.4179,0.1914,
        -0.56,-0.25,     0.109,0.4179,0.1914,
        -0.6,-0.6,     0.109,0.4179,0.1914,//legs left front
        -0.6,-0.8,     0.109,0.4179,0.1914,
        -0.59,-0.8,     0.109,0.4179,0.1914,
        -0.59,-0.6,     0.109,0.4179,0.1914,
        -0.56,-0.44,     0.109,0.4179,0.1914,
        -0.56,-0.65,     0.109,0.4179,0.1914,
        -0.55,-0.65,     0.109,0.4179,0.1914,
        -0.55,-0.44,     0.109,0.4179,0.1914,
 //right side
        0.55,-0.4,     0.109,0.4179,0.1914,    //sitting base
        0.38,-0.4,     0.109,0.4179,0.1914,
        0.4,-0.6,     0.109,0.4179,0.1914,
        0.6,-0.6,     0.109,0.4179,0.1914,
        0.6,-0.6,     0.109,0.4179,0.1914, //support
        0.6,-0.3,     0.109,0.4179,0.1914,
        0.59,-0.32,     0.109,0.4179,0.1914,
        0.59,-0.6,     0.109,0.4179,0.1914,
        0.6,-0.3,     0.109,0.4179,0.1914, //support upper frame
        0.55,-0.2,     0.109,0.4179,0.1914,
        0.55,-0.23,     0.109,0.4179,0.1914,
        0.59,-0.32,     0.109,0.4179,0.1914,
        0.55,-0.2,     0.109,0.4179,0.1914,//support right
        0.55,-0.4,     0.109,0.4179,0.1914,
        0.56,-0.44,     0.109,0.4179,0.1914,
        0.56,-0.25,     0.109,0.4179,0.1914,
        0.6,-0.6,     0.109,0.4179,0.1914,//legs left front
        0.6,-0.8,     0.109,0.4179,0.1914,
        0.59,-0.8,     0.109,0.4179,0.1914,
        0.59,-0.6,     0.109,0.4179,0.1914,
        0.56,-0.44,     0.109,0.4179,0.1914,
        0.56,-0.65,     0.109,0.4179,0.1914,
        0.55,-0.65,     0.109,0.4179,0.1914,
        0.55,-0.44,     0.109,0.4179,0.1914,


    ];

    
    var chairBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, chairBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chairVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 44, 4);

    tableVertices=[
        //x , y         r, g, b
        0.5, -0.2,      0.386,0.2460,0.2304,   //upside of table
        -0.5,-0.2,       0.386,0.2460,0.2304,
        -0.4,-0.55,      0.609,0.4179,0.394,
        0.65,-0.55,     0.609,0.4179,0.394,
        -0.5, -0.2,      0.3008,0.0820,0.0820,   //dark brown stip left side
        -0.5, -0.23,      0.3008,0.0820,0.0820,   
        -0.4,-0.55,     0.3008,0.0820,0.0820,
        -0.4,-0.58,     0.3008,0.0820,0.0820,       
        -0.4,-0.55,     0.386,0.2460,0.2304,    //front side
        -0.4,-0.88,     0.609,0.4179,0.394,       
        0.1,-0.55,     0.386,0.2460,0.2304,  
        0.1,-0.88,     0.609,0.4179,0.394,
        0.1,-0.55,     0.386,0.2460,0.2304,     
        0.1,-0.88,     0.609,0.4179,0.394,       
        0.65,-0.55,     0.386,0.2460,0.2304,  
        0.65,-0.88,     0.609,0.4179,0.394,
        0.0,-0.2,       0.0,0.0,0.0,
        0.01,-0.2,     0.0,0.0,0.0,
        0.1,-0.55,     0.0,0.0,0.0,
        0.09,-0.55,     0.0,0.0,0.0,
        0.1,-0.55,     0.0,0.0,0.0,
        0.09,-0.55,     0.0,0.0,0.0,
        0.1,-0.88,     0.0,0.0,0.0,
        0.09,-0.88,     0.0,0.0,0.0,


    ];    

    var tableBuffer=gl.createBuffer();
        
    gl.bindBuffer(gl.ARRAY_BUFFER, tableBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tableVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);
    
    //gl.drawArrays(gl.TRIANGLE_FAN,24,4);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 20, 4);


    var curtainVertices=[
        -0.57,0.72,     1.0, 1.0, 0.0,
        0.57,0.72,     1.0, 1.0, 0.0,
        -0.57,0.7,     1.0,1.0,1.0,
        0.57,0.7,     1.0,1.0,1.0,
    ];

    var curtainBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, curtainBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(curtainVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    var ax=0.57,ay=0.71,bx=0.59,by=0.71;
    var theta=0;
    var r=0.02;

    while(theta<=2*Math.PI){
        var vertices=[
            //x, y,     r, g, b
            ax, ay,     0.609,0.4179,0.394,
            bx, by,     0.386,0.2460,0.2304,
        ];
        var squareVertexBufferObject=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
    
        gl.drawArrays(gl.LINES, 0, 2);
        bx=ax+r*Math.cos(theta);
        by=ay-r*Math.sin(theta);
        theta+=0.01;
    }

    var ax=-0.57,ay=0.71,bx=-0.55,by=0.71;
    var theta=0;
    var r=0.02;

    while(theta<=2*Math.PI){
        var vertices=[
            //x, y,     r, g, b
            ax, ay,     0.609,0.4179,0.394,
            bx, by,     0.386,0.2460,0.2304,
        ];
        var squareVertexBufferObject=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBufferObject);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
    
        gl.drawArrays(gl.LINES, 0, 2);
        bx=ax+r*Math.cos(theta);
        by=ay-r*Math.sin(theta);
        theta+=0.01;
    }

    var LcupboardVertices=[
        -1.0,1.0,       0.5429,0.804,0.875,
        -0.9,1.0,       0.5429,0.804,0.875,
        -0.9,-0.9,      0.5429,0.804,0.875,
        -1.0,-1.0,      0.5429,0.804,0.875,

        -0.9,1.0,       0.5429,0.804,0.875,
        -0.7,1.0,       0.6914,0.9335,0.9375,
        -0.7,-0.9,      0.5429,0.804,0.875,
        -0.9,-0.9,      0.6914,0.9335,0.9375,
        
        -0.7,1.0,       0.5429,0.804,0.875,
        -0.6,1.0,       0.5429,0.804,0.875,
        -0.6,-1.0,      0.5429,0.804,0.875,
        -0.7,-0.9,      0.5429,0.804,0.875,
        
        -1.0,0.85,      0.609,0.496,0.363,
        -0.6,0.85,      0.609,0.496,0.363,
        -0.9,0.95,      0.609,0.496,0.363,
        -0.7,0.95,      0.609,0.496,0.363,
        
        -1.0,0.55,      0.609,0.496,0.363,
        -0.6,0.55,      0.609,0.496,0.363,
        -0.9,0.65,      0.609,0.496,0.363,
        -0.7,0.65,      0.609,0.496,0.363,

        -1.0,0.25,      0.609,0.496,0.363,
        -0.6,0.25,      0.609,0.496,0.363,
        -0.9,0.35,      0.609,0.496,0.363,
        -0.7,0.35,      0.609,0.496,0.363,
        
        -1.0,-0.2,      0.609,0.496,0.363,
        -0.6,-0.2,      0.609,0.496,0.363,
        -0.9,-0.1,      0.609,0.496,0.363,
        -0.7,-0.1,      0.609,0.496,0.363,

        -1.0,0.85,      0.709,0.596,0.363,
        -0.6,0.85,      0.709,0.596,0.363,
        -0.6,0.83,      0.709,0.596,0.363,
        -1.0,0.83,      0.709,0.596,0.363,

        -1.0,0.55,      0.709,0.596,0.363,
        -0.6,0.55,      0.709,0.596,0.363,
        -0.6,0.53,      0.709,0.596,0.363,
        -1.0,0.53,      0.709,0.596,0.363,

        -1.0,0.25,      0.709,0.596,0.363,
        -0.6,0.25,      0.709,0.596,0.363,
        -0.6,0.23,      0.709,0.596,0.363,
        -1.0,0.23,      0.709,0.596,0.363,

        -1.0,-0.2,      0.709,0.596,0.363,
        -0.6,-0.2,      0.709,0.596,0.363,
        -0.6,-0.23,      0.709,0.596,0.363,
        -1.0,-0.23,      0.709,0.596,0.363,

    ];
    var LcupboardBuffer=gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, LcupboardBuffer);    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(LcupboardVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    ); 
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );    
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);
    
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 16, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 20, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 24, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 28, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 32, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 36, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 40, 4);
        
        var bedVertices=[
            -1.0,-0.57,     1.0,1.0,1.0,
            -0.55,-0.57,     1.0,1.0,1.0,
            -0.55,-0.85,     0.769,0.7851,0.4101,
            -1.0,-0.85,     0.769,0.7851,0.4101,
            -1.0,-0.85,     1.0,1.0,1.0,
            -0.55,-0.85,     1.0,1.0,1.0,
            -0.60,-1.0,     0.769,0.7851,0.4101,
            -1.0,-1.0,     0.769,0.7851,0.4101,
            -0.55,-0.85,     0.769,0.7851,0.4101,
            -0.55,-1.0,     0.769,0.7851,0.4101,
            -0.56,-1.0,     0.769,0.7851,0.4101,
            -0.56,-0.85,     0.769,0.7851,0.4101,
    // right
    1.0,-0.57,     1.0,1.0,1.0,
    0.55,-0.57,     1.0,1.0,1.0,
    0.55,-0.85,     0.769,0.7851,0.4101,
    1.0,-0.85,     0.769,0.7851,0.4101,
    1.0,-0.85,     1.0,1.0,1.0,
    0.55,-0.85,     1.0,1.0,1.0,
    0.60,-1.0,     0.769,0.7851,0.4101,
    1.0,-1.0,     0.769,0.7851,0.4101,
    0.55,-0.85,     0.769,0.7851,0.4101,
    0.55,-1.0,     0.769,0.7851,0.4101,
    0.56,-1.0,     0.769,0.7851,0.4101,
    0.56,-0.85,     0.769,0.7851,0.4101,
        ];
        var bedBuffer=gl.createBuffer();
    
        gl.bindBuffer(gl.ARRAY_BUFFER, bedBuffer);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bedVertices), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
    
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
    
        gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);
    
        var thingsVertices=[
            -0.8,-0.2, 0.0,0.0,0.0,//dibba
            -0.7,-0.2,0.0,0.0,0.0,
            -0.7,-0.05,0.0,0.0,0.0,
            -0.8,-0.05,0.0,0.0,0.0,   
            -0.8,-0.05,1.0,0.9,0.0,
            -0.7,-0.05,1.0,0.9,0.0,
            -0.7,-0.03,1.0,0.9,0.0,
            -0.8,-0.03,1.0,0.9,0.0,
            //books
            -1.0,0.45,0.0,0.0,1.0,
            -0.93,0.25,0.0,0.0,1.0,
            -0.9,0.25,0.0,0.0,1.0,
            -0.97,0.45,0.0,0.0,1.0, 
            
            -0.945,0.38,0.0,0.0,0.0,
            -0.9,0.25,0.0,0.0,0.0,
            -0.88,0.25,0.0,0.0,0.0,
            -0.92,0.38,0.0,0.0,0.0, 
            //
            1.0,0.45,0.0,0.0,1.0,
            0.93,0.25,0.0,0.0,1.0,
            0.9,0.25,0.0,0.0,1.0,
            0.97,0.45,0.0,0.0,1.0, 
            
            0.945,0.38,0.0,0.0,0.0,
            0.9,0.25,0.0,0.0,0.0,
            0.88,0.25,0.0,0.0,0.0,
            0.92,0.38,0.0,0.0,0.0, 
        ];
        var thingsBuffer=gl.createBuffer();
    
        gl.bindBuffer(gl.ARRAY_BUFFER, thingsBuffer);    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(thingsVertices), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
        gl.vertexAttribPointer(
            positionAttribLocation, // Attribute location
            2, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        ); 
        gl.vertexAttribPointer(
            colorAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(colorAttribLocation);
        
        gl.useProgram(program);
    
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 12, 4);
        
        gl.drawArrays(gl.TRIANGLE_FAN, 16, 4);
        gl.drawArrays(gl.TRIANGLE_FAN, 20, 4);       
    },4000);



}
function changeTime(){
 //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


}