---
layout: page
title: Spring Time
position: 3
---


<script src="{{ site.baseurl }}/public/js/lib/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<!-- load ace themelist extension -->
<script src="{{ site.baseurl }}/public/js/lib/ace/ext-themelist.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/fool-util.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/three.min.js"></script> 

The previous section referenced a whirlwind of technical ideas and developed a code framework which implements them.  

Now it is time to play!

# Let's Get Physical

<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring.js"></script>

<div id='content'>
	<canvas id="springex-canvas" height='150' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript">	
	SpringEx.initialXposition = 2;
	SpringEx.DAMPING = 0;
	SpringEx.reset();

	springExAnimate();

	function springExAnimate() {
		requestAnimationFrame( springExAnimate );

		var time = Date.now();

		SpringEx.simulate(time);
	}
</script>

One thing you may have noticed in playing with the previous example is that with enough initial displacement, the mass will cross over the wall that it is attached to (see the example above).  This suggests that Hooke's law only holds for small displacements, after which the systems in question begin acting non-linearly.  

<img src="{{ site.baseurl }}/public/img/hookeslawforspring.png" alt="via https://commons.wikimedia.org/wiki/File:HookesLawForSpring-English.png">

Modelling this sort of non-linearity is doable, but for our purposes, we can get pretty close by simply by placing constraints on the length that a spring can take. 

We do this in the example below.  Try to see what happens when you start the system outside of the constraints.  Why is the system behaving like that?

<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring-system.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/constrained-spring.js"></script>

<div id='content'>
	<canvas id="constrainedex-canvas" height='150' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript">	
	ConstrainedEx.initialXposition = 2;
	ConstrainedEx.reset();

	constrainedExAnimate();

	function constrainedExAnimate() {
		requestAnimationFrame( constrainedExAnimate );

		var time = Date.now();

		ConstrainedEx.simulate(time);
	}
</script>
<div class="slider-label">X position</div><div id="con-Xposition" class="slider"></div><div id="con-Xposition-text" class="slider-value">1.45</div>

<div class="slider-label">Min Value</div><div id="con-lower-bound" class="slider"></div><div id="con-lower-bound-text" class="slider-value">0.2</div>

<div class="slider-label">Max Value</div><div id="con-upper-bound" class="slider"></div><div id="con-upper-bound-text" class="slider-value">2.5</div>

<br/>

<script type="text/javascript">
  $(function() {
  	$( "#con-Xposition" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3,
      step: .05,
      value: 1.45,
      change: updateXposition
    });
  });

  $(function() {
  	$( "#con-lower-bound" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 1,
      step: .05,
      value: .2,
      change: updateLowerBound
    });
  });

  $(function() {
  	$( "#con-upper-bound" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3.5,
      min: .9,
      step: .05,
      value: 2.5,
      change: updateUpperBound
    });
  });

  function updateXposition() {
    var Xposition = $( "#con-Xposition" ).slider( "value" );
    ConstrainedEx.initialXposition = Xposition;
    $("#con-Xposition-text").text(ConstrainedEx.initialXposition + "");
    ConstrainedEx.reset();
  }

  function updateLowerBound() {
    var bound = $( "#con-lower-bound" ).slider( "value" );
    ConstrainedEx.lowerBound = bound;
    $("#con-lower-bound-text").text(ConstrainedEx.lowerBound + "");
    ConstrainedEx.reset();
  }

  function updateUpperBound() {
    var bound = $( "#con-upper-bound" ).slider( "value" );
    ConstrainedEx.upperBound = bound;
    $("#con-upper-bound-text").text(ConstrainedEx.upperBound + "");
    ConstrainedEx.reset();
  }


  var update = function() {
  	updateXposition();
  	updateLowerBound();
  	updateUpperBound();
  }

  $( ".constraintEd-logic.editor-run" ).click(update());
  $( ".constraintEd-system.editor-run" ).click(update());

</script>

<div>
<div id="constraintEd-logic" class="editor">
</div>
</div>

<br/>

<div>
<div id="constraintEd-system" class="editor">
</div>
</div>
<script type="text/javascript">
// from fool-util
initEditor('constraintEd-logic');
loadContent('constraintEd-logic', '{{ site.baseurl }}/public/js/constrained-spring.js', '8');

initEditor('constraintEd-system');
loadContent('constraintEd-system', '{{ site.baseurl }}/public/js/spring-system.js', '102');
</script>
<br/>

Here is the implementation of the above simulation.  Note that it is now spread across two files to make it easier to think about.  The first file is concerned with initialization and display, and the second file is the "math", which implements the more general algorithms.  

Going forward, we will be playing with different ways of initializing and displaying the system while keeping the simulation layer more or less the same.  

If you are curious about the details of how the constraint enforcement is implemented, take a look at the second editor.  The reason that the system behaves strangely when initialized outside of a constrained region is because the constraint enforcer moves the particle, which to the vertlet integrator looks as though the particle has a very high initial velocity.  

# Under Pressure

Once you have spent enough time playing with the previous example, you might become interested in connecting a few springs together to see what happens.  One such thing you can do is to connect the springs together between two fixed points (as demonstrated [here](http://www.acs.psu.edu/drussell/Demos/multi-dof-springs/multi-dof-springs.html){:target="_blank"}, as an aside, check out some of [Dan Russell's](http://www.acs.psu.edu/drussell/demos.html){:target="_blank"} other animations).  There is a certian amount of poetics here if you think of how these sorts of models might apply to interpersonal relationships.

Let's reproduce the 2 degree of freedom (DOF)-system for fun.  As an exercise, try to modify the code to implement the 3 or 4 or $$n$$ DOF-system!


<script type="text/javascript" src="{{ site.baseurl }}/public/js/dof-spring.js"></script>

<div id='content'>
	<canvas id="dofex-canvas" height='150' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript">	
	//dofEx.initialXposition = 2;
	dofEx.reset();

	dofExAnimate();

	function dofExAnimate() {
		requestAnimationFrame( dofExAnimate );

		var time = Date.now();

		dofEx.simulate(time);
	}
</script>
<div class="slider-label">Particle 1</div><div id="dof-initP1" class="slider"></div><div id="dof-initP1-text" class="slider-value">1</div>

<div class="slider-label">Particle 2</div><div id="dof-initP2" class="slider"></div><div id="dof-initP2-text" class="slider-value">1.5</div>

<br/>

<script type="text/javascript">
  function updateP1() {
    var initP1 = $( "#dof-initP1" ).slider( "value" );
    dofEx.initP1 = initP1;
    $("#dof-initP1-text").text(dofEx.initP1 + "");
    dofEx.reset();
  }

  function updateP2() {
    var initP2 = $( "#dof-initP2" ).slider( "value" );
    dofEx.initP2 = initP2;
    $("#dof-initP2-text").text(dofEx.initP2 + "");
    dofEx.reset();
  }

  $(function() {
  	$( "#dof-initP1" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3,
      step: .05,
      value: 1,
      change: updateP1
    });
  });

  $(function() {
  	$( "#dof-initP2" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3,
      step: .05,
      value: 1.5,
      change: updateP2
    });
  });

  var update = function() {
  	updateP1();
    updateP2();
  }

  $( ".dofEd-logic.editor-run" ).click(update());

</script>

<div>
<div id="dofEd-logic" class="editor">
</div>
</div>

<script type="text/javascript">
// from fool-util
initEditor('dofEd-logic');
loadContent('dofEd-logic', '{{ site.baseurl }}/public/js/dof-spring.js', '8');
</script>
<br/>


















