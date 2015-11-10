---
layout: page
title: Preface
position: 0
---
<script src="{{ site.baseurl }}/public/js/lib/jquery.visible.min.js"></script>
<script src="{{ site.baseurl }}/public/js/lib/fool-util.js" type="text/javascript" charset="utf-8"></script>

<script src="{{ site.baseurl }}/public/js/lib/three.min.js"></script> 
<script src="{{ site.baseurl }}/public/js/three_libs/stats.min.js"></script> 
<script src="{{ site.baseurl }}/public/js/lib/OrbitControls.js"></script> 
<script src="{{ site.baseurl }}/public/js/lib/Detector.js"></script> 

<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring-system.js"></script>

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

<script type="text/javascript" src="{{ site.baseurl }}/public/js/preface/sheet-init.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/preface/sheet-simulate.js"></script>

<div class='content'>
	    <div id="sheet-gl" style='width: 100%; display:block; height:400px;'></div>
</div>
<br/>

<script type="text/javascript">
var sheetThree = initThree('sheet-gl');
var sheetTexturePath = '{{ site.baseurl }}/public/img/textures/';
var startSheetAnimation = function () {
  sheetInit.reset();
  sheetSim.sheetGeometry = sheetInit.sheetGeometry;

  sheetAnimate();

  function sheetAnimate() {
    requestAnimationFrame( sheetAnimate );

    var time = Date.now();

    if ($('#sheet-gl').visible( true )) {
      animate_circle = false;
      sheetSim.simulate(time);
      sheetSim.render();
  }
  }
}
startSheetAnimation();
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

Hello traveller, welcome!  I hope you take a moment to explore this site and to meditate on corresponding visuals.  Please feel free to reach out if you have feedback or if you would like to help me make more things like this. 

This site was born out of an experimental a week and half long "mini" course at a summer math program for high school kids called HCSSiM. The title of the course was "Let's Get Lost", with the idea of the being that each day I would prepare the next lesson/course materials in response to the previous days discussion.  As the class was fairly short, I sought to provide direction by choosing a destination - namely I wanted to touch on all of the ideas necessary to make a computer simulate a leaf (or more generally make it simulate something with hyperbolic geometry). 

In organizing these notes after the fact, the idea has been to demonstrate how far one can get just thinking about systems of masses connected by springs.

References and citations will appear throughout, but before we begin, I would like to mention two "un-references", "[The Bet](http://www.eastoftheweb.com/short-stories/UBooks/Bet.shtml)" by Chekhov and by "[The Phantom Tollbooth](http://www.amazon.com/The-Phantom-Tollbooth-Norton-Juster/dp/0394820371)" by Norton Juster, which have little to do with anything discussed outside of being excellent and worthy of (re)reading if they haven't been considered recently.

<img src="{{ site.baseurl }}/public/img/intro.jpg" alt="Wander!">	

# Philosophical Context

This class touched on a number of rich subjects in passing (in an effort to avoid getting to far afield of our initial destination).  The aim was to get lost in connections between disperate ideas while still arriving at a conceptual destination that helped pull all the topics together. 

More than anything else, the factor that drove the class was the question of how much a topic helped to develop "intrinsic" reasoning, i.e. did it help us understand and simulate the way in which global geometry emerges from local rules?

That said, as this class was happening at a summer math program, this pragmatic drive was tempered to a degree by a desire to meditate on ideas the class found independently compelling.


