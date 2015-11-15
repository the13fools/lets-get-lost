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

Hello traveller, welcome!  I hope you take a moment to explore this site and to meditate on corresponding visuals.

The idea that drives this site is to explore space and shape by thinking about systems of masses connected by springs.  

Our journey begins with a single mass on a single spring, and our destination is generating a computer model of a crunchy fall leaf. 

<img src="{{ site.baseurl }}/public/img/runthrough.gif" alt="come play!!!">

## How to use this site

If you are just passing through, this site aims to entertain by telling a compelling visual story.  If you are curious, it aims to enlighten by providing easily accessible levers that can be used to probe the demonstrations.  If you are exploring, the site comes equipped with a framework which allows for investigation without installation, to help you get on the way of finding new destinations as quickly as possible.

Regardless of who you are the trail is marked with numerous references and tangents to facilitate connections between ideas that could stand to be closer.

<img src="{{ site.baseurl }}/public/img/intro.jpg" alt="Wander!">



