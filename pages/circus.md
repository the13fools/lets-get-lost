---
layout: page
title: Pan-Dimensional Circus
position: 4
---

<script src="{{ site.baseurl }}/public/js/lib/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/jquery.visible.min.js"></script>
<!-- load ace themelist extension -->
<script src="{{ site.baseurl }}/public/js/lib/ace/ext-themelist.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/fool-util.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/three.min.js"></script> 
<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring-system.js"></script>

Ok, so let's recap.  The first three chapters respectively touched on ideas from topology, numerical analysis, and the physics of waves.  In this chapter, we will unite these ideas by moving up into the third dimension. 

<div style="margin: 0px auto; text-align: center;">
<iframe src="https://player.vimeo.com/video/103736199" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

To do this, we will have to venture forth to the land of computer graphics.  In particular, we will be making use of a library called [three.js](http://threejs.org/), which is a wrapper for a technology called WebGL, which is a port of a storied technology called [OpenGL](https://open.gl/drawing).

Going down this road will allow us to create interactive 3D environments directly in the browser - which for better or worse will probably end up being one of the most culturally impactful technologies of this decade (just look at infrastructure levels of investment going into [VR](https://www.oculus.com/) and [AR](http://www.magicleap.com/#/home)).

All this to say that we might just be able to draw a leaf pretty soon!

# Resonant Refactoring 

Starting to use a more heavy handed computer machinery, we hit upon the point where it becomes distracting to attempt to hold all parts of the program in view simultaneously.  
The programmers solution to this problem is generally called [seperation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) or [encapsulation](https://en.wikipedia.org/wiki/Encapsulation_%28computer_programming%29), and basically refers to splitting up the program into files where each one has a specific purpose.

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

# Up Up and Away!!!

In the previous section, we returned to the central theme of our exploration, namely the study of the way in which high order structure emerges from local rules.  

In this section, we will use our system to build a simple cloth simulator, adapted from this [demo](http://threejs.org/examples/webgl_animation_cloth.html).

<script type="text/javascript" src="{{ site.baseurl }}/public/js/circus/sheet-init.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/circus/sheet-simulate.js"></script>

<div class='content'>
  <canvas id="sheet-canvas" height='400' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript"> 
  // sheetEx.initialXposition = 2;
  sheetInit.reset();

  sheetAnimate();

  var animate_sheet = false;

  function sheetAnimate() {
    requestAnimationFrame( sheetAnimate );

    var time = Date.now();

    if ($('#sheet-canvas').visible( true )) {
    	animate_circle = false;
    	sheetSim.simulate(time);
	}
  }
</script>
<div class="slider-label">Bottom</div><div id="sheet-yFreq" class="slider"></div><div id="sheet-yFreq-text" class="slider-value">1.49</div>

<div class="slider-label">Center</div><div id="sheet-xFreq" class="slider"></div><div id="sheet-xFreq-text" class="slider-value">Off</div>

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
// from fool-util
initEditor('sheetEd-init');
loadContent('sheetEd-init', '{{ site.baseurl }}/public/js/circus/sheet-init.js', '8');

initEditor('sheetEd-simulate');
loadContent('sheetEd-simulate', '{{ site.baseurl }}/public/js/circus/sheet-simulate.js', '31');
</script>

<script type="text/javascript">
 //  function updateYLabel() {
 //    var freq = $( "#sheet-yFreq" ).slider( "value" );
 //    if (freq == 0) { 
 //      $("#sheet-yFreq-text").text("Off"); 
 //    }
 //    else { 
 //      $("#sheet-yFreq-text").text(freq + ""); 
 //    }
 //  }

 //  function updateYFrequency() {
 //    var freq = $( "#sheet-yFreq" ).slider( "value" );
 //    sheetSim.yFreq = freq;
 //    if (freq == 0) { 
 //      $("#sheet-yFreq-text").text("Off"); 
 //    }
 //    else { 
 //      $("#sheet-yFreq-text").text(freq + ""); 
 //    }
 //  }

 //  function updateXLabel() {
 //    var freq = $( "#sheet-xFreq" ).slider( "value" );
 //    if (freq == 0) { 
 //      $("#sheet-xFreq-text").text("Off"); 
 //    }
 //    else { 
 //      $("#sheet-xFreq-text").text(freq + ""); 
 //    }
 //  }

 //  function updateXFrequency() {
 //    var freq = $( "#sheet-xFreq" ).slider( "value" );
 //    sheetSim.xFreq = freq;
 //    if (freq == 0) { 
 //      $("#sheet-xFreq-text").text("Off"); 
 //    }
 //    else { 
 //      $("#sheet-xFreq-text").text(freq + ""); 
 //    }
 //  }

 //  $(function() {
 //    $( "#sheet-yFreq" ).slider({
 //      orientation: "horizontal",
 //      range: "min",
 //      max: 5,
 //      step: .01,
 //      value: 1.49,
 //      change: updateYFrequency,
 //      slide: updateYLabel
 //    });
 //  });

 //  $(function() {
 //    $( "#sheet-xFreq" ).slider({
 //      orientation: "horizontal",
 //      range: "min",
 //      max: 5,
 //      step: .01,
 //      value: 0,
 //      change: updateXFrequency,
 //      slide: updateXLabel
 //    });
 //  });

 //  var updateSheetParams = function() {
 //    updateYFrequency();
 //    updateXFrequency();
 //    sheetInit.reset();
 //    sheetSim.system = sheetInit.system;
 //  };

 //  $( ".sheetEd-init.editor-run" ).click(function(){ updateSheetParams(); });
 //  $( ".sheetEd-simulate.editor-run" ).click(function(){     
	//   	updateYFrequency();
	//     updateXFrequency(); 
	// });
 //  $( ".sheetEd-system.editor-run" ).click(function(){ updateSheetParams(); });

