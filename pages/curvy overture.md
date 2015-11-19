---
layout: page
title: Curvy Overture
position: 4
---

<script src="{{ site.baseurl }}/public/js/lib/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/ace/ext-themelist.js" type="text/javascript" charset="utf-8"></script>

<script src="{{ site.baseurl }}/public/js/lib/jquery.visible.min.js"></script>
<script src="{{ site.baseurl }}/public/js/lib/fool-util.js" type="text/javascript" charset="utf-8"></script>

<script src="{{ site.baseurl }}/public/js/lib/delaunay.js"></script> 

<script src="{{ site.baseurl }}/public/js/lib/three.js"></script> 
<script src="{{ site.baseurl }}/public/js/three_libs/stats.min.js"></script> 
<script src="{{ site.baseurl }}/public/js/lib/OrbitControls.js"></script> 
<script src="{{ site.baseurl }}/public/js/lib/Detector.js"></script> 


<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring-system.js"></script>

In the previous section, we took our physical model, and did some technical computer work to place it in a context where it is possible to percieve data in an extra dimension.  

In this section, we will then experiment with ways in which we can use these tools to control the curvature of a geometry as it relaxes.  In performing these experiments, we will draw from a few different sources of inspiration.  

One is the emerging field of [Discrete Differential Geometry](http://ddg.cs.columbia.edu/), which seeks to define ways of measuring curvature in a setting where all the pieces of your geometry are locally triangles in a mesh.  

Another perspective is furnished by the concept of [zippergons]({{ site.baseurl}}/public/img/thurston-zippergon.pdf), i.e. that you can make technically "flat" manifolds look a lot like they have curvature by stepping away from the study of [polyhedra](https://stemkoski.github.io/Three.js/Polyhedra.html).  One cute application of this idea is the [2014 World Cup Ball](http://www.science4all.org/le-nguyen-hoang/brazuca/).

Finally, there are some rich explorations going on following the line of thought set out in D'Arcy Wentworth Thompson's [On Growth and Form]({{ site.baseurl}}/public/img/ongrowthform00thom.djvu).  In particular, my favorites of these are the following two explorations: 

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" style='width: 100%;' src="https://www.youtube.com/embed/9HI8FerKr6Q" frameborder="0" allowfullscreen></iframe>
</div>

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" style='width: 100%;' src="https://player.vimeo.com/video/130977932" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
</div>

# Ripples

With that literature review considered, let's build our first demo, of a single node with variable curvature. 

A great intuitive treatment of curvature can be found in [Experiencing Geometry](http://www.math.cornell.edu/~henderson/ExpGeom/) by David Henderson.  He has also released a more advanced differential geometry [book](http://projecteuclid.org/euclid.bia/1399917369#toc) for free.

The purpose of this demo is to give one a sense of how changing the ratio between the length of the circumference and the radius can influence global geometry.  This sort of demo fits well into the system we have created so far because it allows us to establish a desired "curvature", but allows the system to find it's own balance.  If you are trying to relate this demo to other materials on the subject, note that the slider having a value greater than 1 gives the surface *negative* curvature, and values less than 1 have *positive* curvature. 

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

<script type="text/javascript" src="{{ site.baseurl }}/public/js/curvy/ripple-init.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/curvy/ripple-simulate.js"></script>

<div class='content'>
  <canvas id="ripple-canvas" height='400' width='700' style='width: 100%;'></canvas>
</div>

<div class='content'>
  <div id="ripple-gl" style='width: 100%; display:block; height:350px;'></div>
</div>

<br/>

<div class="slider-label">Curvature Point</div><div id="ripple-curvature" class="slider"></div><div id="ripple-curvature-text" class="slider-value">1.5</div>

<br/>

Initialization: 
<div>
<div id="rippleEd-init" class="editor">
</div>
</div>

<br/>
Simulation:
<div>
<div id="rippleEd-simulate" class="editor">
</div>
</div>

<script type="text/javascript">
var rippleThree = initThree('ripple-gl');
var rippleTexturePath = '{{ site.baseurl }}/public/img/textures/';


// in function to work around some editor loading bug.
var startRippleAnimation = function () {
  rippleInit.reset();
  rippleSim.rippleGeometry = rippleInit.rippleGeometry;

  rippleAnimate();

  function rippleAnimate() {
    requestAnimationFrame( rippleAnimate );

    var time = Date.now();

    if ($('#ripple-canvas').visible( true ) || 
        $('#ripple-gl').visible( true )) {
      animate_circle = false;
      rippleSim.simulate(time);
      rippleSim.render();
  }
  }
}
// from fool-util
initEditor('rippleEd-init');
loadContent('rippleEd-init', '{{ site.baseurl }}/public/js/curvy/ripple-init.js', '8', startRippleAnimation);

initEditor('rippleEd-simulate');
loadContent('rippleEd-simulate', '{{ site.baseurl }}/public/js/curvy/ripple-simulate.js', '23');
</script>

<script type="text/javascript">
// ground

  var groundTexture = THREE.ImageUtils.loadTexture( '{{ site.baseurl }}/public/img/textures/' + "ground3.jpg" );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 25, 25 );
  groundTexture.anisotropy = 16;

  var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

  var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
  mesh.position.y = -350;
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  rippleThree.scene.add( mesh );
</script>

<script type="text/javascript">
  function updateRippleCurvatureLabel() {
    var curve = $( "#ripple-curvature" ).slider( "value" );
    $("#ripple-curvature-text").text(curve + ""); 
  }

  function updateRippleCurvature() {
    var curve = $( "#ripple-curvature" ).slider( "value" );
    // var springs = rippleSim.system.springs;
    // for (var i = 0; i < springs.length; i++) {
    // 	if (i % 2 == 0) {
    // 		springs[i].restLength = curve * rippleInit.springRestDistance;
    // 	}
    // }
    rippleInit.curvature = curve;
    updateRippleParams();
    $("#ripple-curvature-text").text(curve + ""); 
  }

  $(function() {
    $( "#ripple-curvature" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 10,
      step: .05,
      value: 1.5,
      change: updateRippleCurvature,
      slide: updateRippleCurvatureLabel
    });
  });

  var updateRippleParams = function() {
    rippleInit.reset();
    rippleSim.system = rippleInit.system;

    rippleSim.rippleGeometry = rippleInit.rippleGeometry;
  };

  $( ".rippleEd-init.editor-run" ).click(function(){ updateRippleParams(); });
  $( ".rippleEd-simulate.editor-run" ).click(function(){ 
    updateRippleCurvature(); 
  });

</script>
<br/>

Things to think about:

* Experiement with moving the slider to values that are less than 1. What is the resulting shape?  Is it what you expect?  
* Try reducing the number of nodes (exp.n in the initialization script).  What happens?  Is it what you expect? 
* The phenomenon being modeled here appears everywhere in architecture.  A room with a corner where 5 walls meet at 90 degree angles has negative curvature, and a corner where 3 walls meet has positive curvature.  

# Leafy Arrival

In this section we finally arrive at the place we set out for - to make a computer draw a leaf (of sorts).  This is however merely the shoreline of a rich island of thought.  More detailed trailmaps have been produced by [L. Mahadevan](http://www.seas.harvard.edu/softmat/) and [P. Prusinkiewicz](http://algorithmicbotany.org/papers/) (among others).

Here though, we set out to control the curvature of a plane by building a "fabric" with multiple nodes like the ones in the above example.  

To achieve this, we will persue the following implementation to generate a suitable mesh:

1. Randomly place points in a square.
2. Add control points.
3. Get a [Deluanay](https://en.wikipedia.org/wiki/Delaunay_triangulation) [Triangulation](http://travellermap.com/tmp/delaunay.htm) of our point cloud (fun fact, the deluanay triangulation is the [dual](https://en.wikipedia.org/wiki/Dual_graph) of the [Voronoi](https://en.wikipedia.org/wiki/Voronoi_diagram) [Tessellation](http://bl.ocks.org/mbostock/4060366) used in the sidebar on this site).
4. Use the curvature approach from above to manipulate our fabric.  

<script type="text/javascript" src="{{ site.baseurl }}/public/js/curvy/plane-init.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/curvy/plane-simulate.js"></script>

<div class='content'>
  <canvas id="plane-canvas" height='400' width='700' style='width: 100%;'></canvas>
</div>

<div class='content'>
  <div id="plane-gl" style='width: 100%; display:block; height:350px;'></div>
</div>

<br/>

<div class="slider-label">Center</div><div id="plane-center" class="slider"></div><div id="plane-center-text" class="slider-value">0.1</div>
<div class="slider-label">Corner</div><div id="plane-corner" class="slider"></div><div id="plane-corner-text" class="slider-value">2</div>
<div class="slider-label">Drive Point</div><div id="plane-drive" class="slider"></div><div id="plane-drive-text" class="slider-value">Off</div>

<br/>

Initialization: 
<div>
<div id="planeEd-init" class="editor">
</div>
</div>

<br/>
Simulation:
<div>
<div id="planeEd-simulate" class="editor">
</div>
</div>

<script type="text/javascript">
var planeThree = initThree('plane-gl');
var planeTexturePath = '{{ site.baseurl }}/public/img/textures/';


// in function to work around some editor loading bug.
var startPlaneAnimation = function () {
  planeInit.reset();
  planeSim.planeGeometry = planeInit.planeGeometry;

  planeAnimate();

  function planeAnimate() {
    requestAnimationFrame( planeAnimate );

    var time = Date.now();

    if ($('#plane-canvas').visible( true ) || 
        $('#plane-gl').visible( true )) {
      animate_circle = false;
      planeSim.simulate(time);
      planeSim.render();
  }
  }
}
// from fool-util
initEditor('planeEd-init');
loadContent('planeEd-init', '{{ site.baseurl }}/public/js/curvy/plane-init.js', '8', startPlaneAnimation);

initEditor('planeEd-simulate');
loadContent('planeEd-simulate', '{{ site.baseurl }}/public/js/curvy/plane-simulate.js', '23');
</script>

<script type="text/javascript">
// ground

  var groundTexture = THREE.ImageUtils.loadTexture( '{{ site.baseurl }}/public/img/textures/' + "ground3.jpg" );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 25, 25 );
  groundTexture.anisotropy = 16;

  var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

  var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
  mesh.position.y = -350;
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  planeThree.scene.add( mesh );
</script>

<script type="text/javascript">
  function updatePlaneCenterLabel() {
    var point = $( "#plane-center" ).slider( "value" );
    $("#plane-center-text").text(point + ""); 
  }

  function updatePlaneCenter() {
    var point = $( "#plane-center" ).slider( "value" );
    planeInit.lengthMultiplier[0] = point;
    $("#plane-center-text").text(point + ""); 
  }

  function updatePlaneCornerLabel() {
    var point = $( "#plane-corner" ).slider( "value" );
    $("#plane-corner-text").text(point + ""); 
  }

  function updatePlaneCorner() {
    var point = $( "#plane-corner" ).slider( "value" );
    planeInit.lengthMultiplier[1] = point;
    $("#plane-corner-text").text(point + ""); 
  }

  function updatePlaneDrive() {
    var point = $( "#plane-drive" ).slider( "value" );
    if (point == 0) {
      $("#plane-drive-text").text("Off");
    }
    else {
      $("#plane-drive-text").text(point + "");
    }
    planeSim.drive = point;
  }

  $(function() {
    $( "#plane-center" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 6,
      step: .05,
      value: .1,
      change: updatePlaneParams,
      slide: updatePlaneCenterLabel
    });
  });

  $(function() {
    $( "#plane-corner" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 6,
      step: .05,
      value: 2,
      change: updatePlaneParams,
      slide: updatePlaneCornerLabel
    });
  });

  $(function() {
    $( "#plane-drive" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 200,
      step: 1,
      value: 0,
      change: updatePlaneDrive,
      slide: updatePlaneDrive
    });
  });

  var updatePlaneParams = function() {
    updatePlaneCenter();
    updatePlaneCorner();
    planeInit.reset();
    planeSim.system = planeInit.system;
    planeSim.planeGeometry = planeInit.planeGeometry;
  };

  $( ".planeEd-init.editor-run" ).click(function(){ updatePlaneParams(); });
  $( ".planeEd-simulate.editor-run" ).click(function(){ 
    updatePlaneCurvature(); 
  });

</script>

<br/>

<p class="message">
  Tangents: 
  Another approach to generating a hyperbolic surface would be to apply our physical modelling approach to a tiling of the <a href="http://www.malinc.se/math/noneuclidean/poincaretilingen.php">Poincaré Disc</a>.

  <br/> <br/>

  Another approach which is conceptually different, but which ultimately gets at the same question of finding "interesting" surfaces embedded in 3D is the study of <a href="http://facstaff.susqu.edu/brakke/evolver/examples/periodic/periodic.html">minimal surfaces</a> (more examples <a href="http://www.indiana.edu/~minimal/archive/index.html">here</a>).  A good overview for generating gyroids can be found <a href="{{ site.baseurl }}/public/img/gyroid.gif">here</a>.  One neat thing about them is that people are trying to manufacture this geometry in order to create more effecient batteries and <a href="http://pubs.acs.org/doi/abs/10.1021/nl803174p">solar cells</a>.  

  <br/><br/>

  If you perfer physics to chemistry, <a href="http://www.physics.upenn.edu/~kamien/kamiengroup/talks/ILCC%202006.html">Randall Kamien</a> approaches these sorts of problems from the perspective of liquid crystals.

  <div style="margin: 0px auto; text-align: center;">
  <iframe width="420" height="315" style='width: 100%;' frameborder="0" src="https://www.shadertoy.com/embed/Md23Rd?gui=true&t=10&paused=true" allowfullscreen></iframe>
  </div>
</p>
