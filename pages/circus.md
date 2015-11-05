---
layout: page
title: Pan-Dimensional Circus
position: 4
---

<script src="{{ site.baseurl }}/public/js/lib/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<!-- load ace themelist extension -->
<script src="{{ site.baseurl }}/public/js/lib/ace/ext-themelist.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/fool-util.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/three.min.js"></script> 
<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring-system.js"></script>

Ok, so let's recap.  The first three chapters respectively touched on ideas from topology, numerical analysis, and the physics of waves.  

<div style="margin: 0px auto; text-align: center;">
<iframe src="https://player.vimeo.com/video/103736199" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

In this chapter, we will unite these ideas by moving up into the third dimension. To do this, we will have to venture forth to the land of computer graphics.  In particular, we will be making use of a library called [three.js](http://threejs.org/), which is a wrapper for a technology called WebGL, which is a port of a storied technology called [OpenGL](https://open.gl/drawing).

Going down this road will allow us to create interactive 3D environments directly in the browser - which for better or worse will probably end up being one of the most culturally impactful technologies of this decade (just look at infrastructure levels of investment going into [VR](https://www.oculus.com/) and [AR](http://www.magicleap.com/#/home)).

All this to say that we might just be able to draw a leaf pretty soon!

# Refactoring 

Starting to use a more heavy handed computer machinery, we hit upon the point where it becomes distracting to attempt to hold all parts of the program in view simultaneously.  
The programmers solution to this problem is generally called [seperation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) or [encapsulation](https://en.wikipedia.org/wiki/Encapsulation_%28computer_programming%29), and basically refers to splitting up the program into files where each one has a specific purpose.

As an exersize, let's do it to the program we have been building. In the example below, we connect a ring of masses with springs and then connect each mass to a central node.  The sliders change the driving frequency of either the bottom node or the central node.  Note how upon initialization, it is possible to find a resonant mode with [five fold](http://www.aps.org/units/dfd/pressroom/gallery/2012/rajchenbach12.cfm){:target="_blank"} symmetry.  What other modes can you discover? Can you find the [spanish dancer]({{ site.baseurl }}/public/img/spanish_dancer.jpg){:target="_blank"}?


<script type="text/javascript" src="{{ site.baseurl }}/public/js/circus/circle-init.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/circus/circle-simulate.js"></script>

<div class='content'>
  <canvas id="circle-canvas" height='400' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript"> 
  //circleEx.initialXposition = 2;
  circleInit.reset();

  circleAnimate();

  function circleAnimate() {
    requestAnimationFrame( circleAnimate );

    var time = Date.now();

    circleSim.simulate(time);
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
  };

  $( ".circleEd-init.editor-run" ).click(function(){ updateCircleParams(); });
  $( ".circleEd-simulate.editor-run" ).click(function(){     
	  	updateYFrequency();
	    updateXFrequency(); 
	});
  $( ".circleEd-system.editor-run" ).click(function(){ updateCircleParams(); });

</script>


We already did this by seperating out the physics library code, but we will now do it again to split the code which initializes our system from the code which is concerned with coordinating the simulation at each step and then displaying the corresponding computer representation to the screen.  






a feat which is certainly something of a technological achievement.   




The first chapter focused on topology of dimention, and the idea of linearity.  The second chapter developed some mathematical methods for integration.  In the third we worked our way up to developing a system that allowed us to study wave phenomenon in things like strings.   


<p class="message">
  Hey there! This page is included as an example. Feel free to customize it for your own use upon downloading. Carry on!
</p>

In the novel, *The Strange Case of Dr. Jeykll and Mr. Hyde*, Mr. Poole is Dr. Jekyll's virtuous and loyal butler. Similarly, Poole is an upstanding and effective butler that helps you build Jekyll themes. It's made by [@mdo](https://twitter.com/mdo).

There are currently two themes built on Poole:

* [Hyde](http://hyde.getpoole.com)
* [Lanyon](http://lanyon.getpoole.com)

Learn more and contribute on [GitHub](https://github.com/poole).

## Setup

Some fun facts about the setup of this project include:

* Built for [Jekyll](http://jekyllrb.com)
* Developed on GitHub and hosted for free on [GitHub Pages](https://pages.github.com)
* Coded with [Sublime Text 2](http://sublimetext.com), an amazing code editor
* Designed and developed while listening to music like [Blood Bros Trilogy](https://soundcloud.com/maddecent/sets/blood-bros-series)

Have questions or suggestions? Feel free to [open an issue on GitHub](https://github.com/poole/issues/new) or [ask me on Twitter](https://twitter.com/mdo).

Thanks for reading!

https://github.com/poole/lanyon