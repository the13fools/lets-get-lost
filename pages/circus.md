---
layout: page
title: Pan-Dimensional Circus
position: 3
---

<script src="{{ site.baseurl }}/public/js/lib/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/ace/ext-themelist.js" type="text/javascript" charset="utf-8"></script>

<script src="{{ site.baseurl }}/public/js/lib/jquery.visible.min.js"></script>
<script src="{{ site.baseurl }}/public/js/lib/fool-util.js" type="text/javascript" charset="utf-8"></script>

<script src="{{ site.baseurl }}/public/js/lib/three.min.js"></script> 
<script src="{{ site.baseurl }}/public/js/three_libs/stats.min.js"></script> 
<script src="{{ site.baseurl }}/public/js/lib/OrbitControls.js"></script> 
<script src="{{ site.baseurl }}/public/js/lib/Detector.js"></script> 


<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring-system.js"></script>

<!-- <p class="message">
What I cannot create, I do not understand. - Richard Feynman
</p> -->

Ok, so let's recap.  In the first two chapters we developed a physics engine, and used it to simulate a string with mass as a way of studying the physics of waves.  In this chapter we will build on this work by moving up into the third dimension.  

<div style="margin: 0px auto; text-align: center;">
<iframe src="https://player.vimeo.com/video/103736199" width="500" height="281" frameborder="0" style='width: 100%;' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

To do this, we will have to venture forth to the land of computer graphics.  In particular, we will be making use of a library called [three.js](http://threejs.org/), which is a wrapper for a technology called WebGL, which is a port of a storied technology called [OpenGL](https://open.gl/drawing).

Going down this road will allow us to create interactive 3D environments directly in the browser - which for better or worse will probably end up being one of the most culturally impactful technologies of this decade (just look at the infrastructure levels of investment going into [VR](https://www.oculus.com/) and [AR](http://www.magicleap.com/#/home)).

All this to say that we might just be able to draw a leaf pretty soon!

# Resonant Refactoring 

Starting to use a more heavy handed computer machinery, we hit upon the point where it becomes distracting to attempt to hold all parts of the program in view simultaneously.  
The programmers solution to this problem is generally called [separation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) or [encapsulation](https://en.wikipedia.org/wiki/Encapsulation_%28computer_programming%29), and basically refers to splitting up the program into files where each one has a specific purpose.

As an exersize, let's do it to the program we have been building. In the example below, we connect a ring of masses with springs and then connect each mass to a central node.  The sliders change the driving frequency of either the bottom node or the central node.  Note how upon initialization, a resonant mode with [five fold](http://www.aps.org/units/dfd/pressroom/gallery/2012/rajchenbach12.cfm){:target="_blank"} symmetry appears.  What other modes can you discover? Can you find the [spanish dancer]({{ site.baseurl }}/public/img/spanish_dancer.jpg){:target="_blank"}?


<script type="text/javascript" src="{{ site.baseurl }}/public/js/circus/circle-init.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/circus/circle-simulate.js"></script>

<div class='content'>
  <canvas id="circle-canvas" height='400' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript"> 
  //circleEx.initialXposition = 2;
  circleInit.reset();

  circleAnimate();

  var animate_circle = true;

  function circleAnimate() {
    requestAnimationFrame( circleAnimate );

    var time = Date.now();

    animate_circle = animate_circle || $('#circle-canvas').visible( true );
    if (animate_circle) {
    	circleSim.simulate(time);
	}
  }
</script>
<div class="slider-label">Bottom</div><div id="circle-yFreq" class="slider"></div><div id="circle-yFreq-text" class="slider-value">1.49</div>

<div class="slider-label">Center</div><div id="circle-xFreq" class="slider"></div><div id="circle-xFreq-text" class="slider-value">Off</div>

<br/>

Initialization: 
<div>
<div id="circleEd-init" class="editor">
</div>
</div>

<br/>
Simulation:
<div>
<div id="circleEd-simulate" class="editor">
</div>
</div>

<br/>
Physics System:
<div>
<div id="circleEd-system" class="editor">
</div>
</div>

<script type="text/javascript">
// from fool-util
initEditor('circleEd-init');
loadContent('circleEd-init', '{{ site.baseurl }}/public/js/circus/circle-init.js', '8');

initEditor('circleEd-simulate');
loadContent('circleEd-simulate', '{{ site.baseurl }}/public/js/circus/circle-simulate.js', '31');

initEditor('circleEd-system');
loadContent('circleEd-system', '{{ site.baseurl }}/public/js/spring-system.js', '102');
</script>

<script type="text/javascript">
  function updateYLabel() {
    var freq = $( "#circle-yFreq" ).slider( "value" );
    if (freq == 0) { 
      $("#circle-yFreq-text").text("Off"); 
    }
    else { 
      $("#circle-yFreq-text").text(freq + ""); 
    }
  }

  function updateYFrequency() {
    var freq = $( "#circle-yFreq" ).slider( "value" );
    circleSim.yFreq = freq;
    if (freq == 0) { 
      $("#circle-yFreq-text").text("Off"); 
    }
    else { 
      $("#circle-yFreq-text").text(freq + ""); 
    }
  }

  function updateXLabel() {
    var freq = $( "#circle-xFreq" ).slider( "value" );
    if (freq == 0) { 
      $("#circle-xFreq-text").text("Off"); 
    }
    else { 
      $("#circle-xFreq-text").text(freq + ""); 
    }
  }

  function updateXFrequency() {
    var freq = $( "#circle-xFreq" ).slider( "value" );
    circleSim.xFreq = freq;
    if (freq == 0) { 
      $("#circle-xFreq-text").text("Off"); 
    }
    else { 
      $("#circle-xFreq-text").text(freq + ""); 
    }
  }

  $(function() {
    $( "#circle-yFreq" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 5,
      step: .01,
      value: 1.49,
      change: updateYFrequency,
      slide: updateYLabel
    });
  });

  $(function() {
    $( "#circle-xFreq" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 5,
      step: .01,
      value: 0,
      change: updateXFrequency,
      slide: updateXLabel
    });
  });

  var updateCircleParams = function() {
    updateYFrequency();
    updateXFrequency();
    circleInit.reset();
    circleSim.system = circleInit.system;
  };

  $( ".circleEd-init.editor-run" ).click(function(){ updateCircleParams(); });
  $( ".circleEd-simulate.editor-run" ).click(function(){     
	  	updateYFrequency();
	    updateXFrequency(); 
	});
  $( ".circleEd-system.editor-run" ).click(function(){ updateCircleParams(); });

</script>
<br/>
Things to Think: 

* Try changing the physics constants in the initialization.  What happens when you increase the mass?  When you increase the spring constant?  
* Why does the system behave as it does when the middle node moves?  What would you expect to happen in three dimentions?
* Why does the 5-fold symmetry appear?  Can you find a closed form way of predicting/discovering other symmetric modes?  

# Up Up and Away!!!

In the previous section, we returned to the central theme of our exploration, namely the study of the way in which high order structure emerges from local rules.  

Now is a good place to take an interlude to learn a little more about some of the things that one should keep in mind when making computers draw in 3D with webGL.  A good tutorial on the subject can be found [here](http://acko.net/files/fullfrontal/fullfrontal/webglmath/online.html). 

We will avoid repeating that material here, instead moving forward to building a simple cloth simulator (adapted from this [demo](http://threejs.org/examples/webgl_animation_cloth.html)).  We have already essentially done this.  The first step is to initialize a "[fabric]({{ site.baseurl }}/public/img/provot_cloth_simulation_96.pdf)" of springs.
<a href="{{ site.baseurl }}/public/img/bouncing carpet2.gif"><img src="{{ site.baseurl }}/public/img/bouncing carpet.gif" alt="bounce bounce!!!"></a>

Having done this we need to do all manner of incantations to summon a webGL context (to initialize a camera and define shaders and things).  We won't go into these details for fear of getting too far afield, but certianly try changing values in the editor and rerunning things.  It's a great way to study the different parts of a big system.  

In the system below, we have a fabric attached to fixed points at four corners, and driven from a variable place in the Z axis.  The top visualization of this data projects each point to the XY-plane, and marks the point being driven in red.  The bottom visualization allows one to witness the three dimensional structure of the fabric.  If you would like to turn off the camera rotation in order to get a closer look, set rotateCamera to false, and re-run the simulation script. 

<script type="x-shader/x-fragment" id="fragmentShaderDepth">

  uniform sampler2D texture;
  varying vec2 vUV;

  vec4 pack_depth( const in float depth ) {

    const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );
    const vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );
    vec4 res = fract( depth * bit_shift );
    res -= res.xxyz * bit_mask;
    return res;

  }

  void main() {

    vec4 pixel = texture2D( texture, vUV );

    if ( pixel.a < 0.5 ) discard;

    gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );

  }
</script>

<script type="x-shader/x-vertex" id="vertexShaderDepth">

  varying vec2 vUV;

  void main() {

    vUV = 0.75 * uv;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * mvPosition;

  }

</script>

<script type="text/javascript" src="{{ site.baseurl }}/public/js/circus/sheet-init.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/circus/sheet-simulate.js"></script>

<div class='content'>
  <canvas id="sheet-canvas" height='400' width='700' style='width: 100%;'></canvas>
</div>

<div class='content'>
  <div id="sheet-gl" style='width: 100%; display:block; height:350px;'></div>
</div>

<br/>

<div class="slider-label">Drive Point</div><div id="sheet-drive" class="slider"></div><div id="sheet-drive-text" class="slider-value">144</div>

<br/>

Initialization: 
<div>
<div id="sheetEd-init" class="editor">
</div>
</div>

<br/>
Simulation:
<div>
<div id="sheetEd-simulate" class="editor">
</div>
</div>

<script type="text/javascript">
var sheetThree = initThree('sheet-gl');
var sheetTexturePath = '{{ site.baseurl }}/public/img/textures/';


// in function to work around some editor loading bug.
var startSheetAnimation = function () {
  sheetInit.reset();
  sheetSim.sheetGeometry = sheetInit.sheetGeometry;

  sheetAnimate();

  function sheetAnimate() {
    requestAnimationFrame( sheetAnimate );

    var time = Date.now();

    if ($('#sheet-canvas').visible( true ) || 
        $('#sheet-gl').visible( true )) {
      animate_circle = false;
      sheetSim.simulate(time);
      sheetSim.render();
  }
  }
}
// from fool-util
initEditor('sheetEd-init');
loadContent('sheetEd-init', '{{ site.baseurl }}/public/js/circus/sheet-init.js', '8', startSheetAnimation);

initEditor('sheetEd-simulate');
loadContent('sheetEd-simulate', '{{ site.baseurl }}/public/js/circus/sheet-simulate.js', '23');
</script>

<script type="text/javascript">
// ground

  var groundTexture = THREE.ImageUtils.loadTexture( '{{ site.baseurl }}/public/img/textures/' + "ground3.jpg" );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 25, 25 );
  groundTexture.anisotropy = 16;

  var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

  var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
  mesh.position.y = -300;
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  sheetThree.scene.add( mesh );
</script>

<script type="text/javascript">
  function updateSheetDriveLabel() {
    var point = $( "#sheet-drive" ).slider( "value" );
    $("#sheet-drive-text").text(point + ""); 
  }

  function updateSheetDrivePoint() {
    var point = $( "#sheet-drive" ).slider( "value" );
    sheetSim.drive = point;
    $("#sheet-drive-text").text(point + ""); 
  }

  $(function() {
    $( "#sheet-drive" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 288,
      step: 1,
      value: 144,
      change: updateSheetDrivePoint,
      slide: updateSheetDriveLabel
    });
  });

  var updateSheetParams = function() {
    updateSheetDrivePoint();
    sheetInit.reset();

    sheetSim.system = sheetInit.system;
    sheetSim.sheetGeometry = sheetInit.sheetGeometry;
  };

  $( ".sheetEd-init.editor-run" ).click(function(){ updateSheetParams(); });
  $( ".sheetEd-simulate.editor-run" ).click(function(){ 
    updateSheetDrivePoint(); 
  });

</script>

<br/>

<p class="message">
Tangents:
People have done a lot of work organizing families of graphs.  One project which helps organize this data is the <a href="http://hog.grinvin.org/">house of graphs</a>.

Some people have even attempted to apply the approach we are taking here to produce pretty <a href="http://yifanhu.net/GALLERY/GRAPHS/index.html">visualizations</a>.  This approach makes use of fancy matrix computation <a href="http://faculty.cse.tamu.edu/davis/matrices.html">libraries</a>.


<a href="http://www.cise.ufl.edu/research/sparse/matrices/Andrianov/fxm4_6.html"><img src="{{ site.baseurl }}/public/img/poppy_fxm4_6.gif" alt="sweet"></a>
</p>


