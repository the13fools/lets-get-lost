---
layout: page
title: Spring Time
position: 2
---


<script src="{{ site.baseurl }}/public/js/lib/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<!-- load ace themelist extension -->
<script src="{{ site.baseurl }}/public/js/lib/ace/ext-themelist.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/fool-util.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/three.min.js"></script> 

Hooke's law is fairly standard material for intro physics classes, and in the previous section we implemented a system that simulates it.  

Now let's take our system and play!

# Let's Get Physical

<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring.js"></script>

<div class='content'>
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

Before we get too far into exploring, let's refine our physics model.  In particular, you may have noticed that with enough initial displacement, the mass will cross over the wall that it is attached to (see the example above).

Real springs don't do that, if you try to stretch or squeeze them enough, they stop wanting to move (this non-linearity is illustrated in the chart below):

<img src="{{ site.baseurl }}/public/img/hookeslawforspring.png" alt="via https://commons.wikimedia.org/wiki/File:HookesLawForSpring-English.png">

Modelling this sort of non-linearity is doable, but for our purposes, we can get pretty close by simply by placing constraints on the length that a spring can take. 

We do this in the following example.  Try to see what happens when you start the system outside of the constraints.  Why is the system behaving like that?

<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring-system.js"></script>
<script type="text/javascript" src="{{ site.baseurl }}/public/js/constrained-spring.js"></script>

<div class='content'>
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
<div class="slider-label">Min Value</div><div id="con-lower-bound" class="slider"></div><div id="con-lower-bound-text" class="slider-value">0.2</div>

<div class="slider-label">X position</div><div id="con-Xposition" class="slider"></div><div id="con-Xposition-text" class="slider-value">1.45</div>

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
      change: updateConstrained
    });
  });

  $(function() {
  	$( "#con-lower-bound" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3,
      step: .05,
      value: .2,
      change: updateConstrained
    });
  });

  $(function() {
  	$( "#con-upper-bound" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3,
      step: .05,
      value: 2.5,
      change: updateConstrained
    });
  });

  function updateXposition() {
    var Xposition = $( "#con-Xposition" ).slider( "value" );
    ConstrainedEx.initialXposition = Xposition;
    $("#con-Xposition-text").text(ConstrainedEx.initialXposition + "");
  }

  function updateLowerBound() {
    var bound = $( "#con-lower-bound" ).slider( "value" );
    ConstrainedEx.lowerBound = bound;
    $("#con-lower-bound-text").text(ConstrainedEx.lowerBound + "");
  }

  function updateUpperBound() {
    var bound = $( "#con-upper-bound" ).slider( "value" );
    ConstrainedEx.upperBound = bound;
    $("#con-upper-bound-text").text(ConstrainedEx.upperBound + "");
  }


  var updateConstrained = function() {
  	updateXposition();
  	updateLowerBound();
  	updateUpperBound();
    ConstrainedEx.reset();
  }

  $( ".constraintEd-logic.editor-run" ).click( function(){ updateConstrained(); });
  $( ".constraintEd-system.editor-run" ).click( function(){ updateConstrained(); });

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

Once you have spent enough time playing with the previous example, you might become interested in connecting a few springs together to see what happens.  One such thing you can do is to connect the springs together between two fixed points (as demonstrated [here](http://www.acs.psu.edu/drussell/Demos/multi-dof-springs/multi-dof-springs.html){:target="_blank"}, as an aside, check out some of [Dan Russell's](http://www.acs.psu.edu/drussell/demos.html){:target="_blank"} other animations). For a more formal treatment of this thought, check out this [chapter]({{ site.baseurl }}/public/img/normalmodes.pdf) on normal modes from this [book](http://www.people.fas.harvard.edu/~djmorin/book.html) on waves.

For a more poetic treatment, consider how physical [models]({{ site.baseurl }}/public/img/Romeo.pdf) might apply to interpersonal relationships.

Let's reproduce the 2 degree of freedom (DOF)-system for fun.  As an exercise, try to modify the code to implement the 3 or 4 or $$n$$ DOF-system!


<script type="text/javascript" src="{{ site.baseurl }}/public/js/dof-spring.js"></script>

<div class='content'>
	<canvas id="dofex-canvas" height='150' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript">	
	dofEx.initialXposition = 2;
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

<div>
<div id="dofEd-logic" class="editor">
</div>
</div>

<script type="text/javascript">
// from fool-util
initEditor('dofEd-logic');
loadContent('dofEd-logic', '{{ site.baseurl }}/public/js/dof-spring.js', '7');
</script>

<script type="text/javascript">
  function updateP1() {
    var initP1 = $( "#dof-initP1" ).slider( "value" );
    dofEx.initP1 = initP1;
    $("#dof-initP1-text").text(dofEx.initP1 + "");
  }

  function updateP2() {
    var initP2 = $( "#dof-initP2" ).slider( "value" );
    dofEx.initP2 = initP2;
    $("#dof-initP2-text").text(dofEx.initP2 + "");
  }

  $(function() {
  	$( "#dof-initP1" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3,
      step: .05,
      value: 1,
      change: updateDof
    });
  });

  $(function() {
  	$( "#dof-initP2" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3,
      step: .05,
      value: 1.5,
      change: updateDof
    });
  });

  var updateDof = function() {
  	updateP1();
    updateP2();
    dofEx.reset();
  }

  $( ".dofEd-logic.editor-run" ).click( function() { updateDof(); });

</script>

<br/>


# New Wave  

Well now that we've done so much work, let's double down.  One nice thing about this simulator is that we can approximate a spring with mass (like a slinky) as a collection of masses connected by massless springs.  Thus, we can use our simulator to study all sorts of wave behaviors, like [transverse]({{ site.baseurl }}/public/img/transverse.pdf) and [longitudinal]({{ site.baseurl }}/public/img/longitudinal.pdf) waves.  

Perceptually, these are interesting because longitudinal waves provide a good model for understanding sound ([here](https://jackschaedler.github.io/circles-sines-signals/sound.html){:target="_blank"} is a nice interactive presentation). On the other hand, transverse waves appear in places like violins and other stringed instruments.  This [page](http://newt.phys.unsw.edu.au/jw/Bows.html) provides a good overview of the physics, and the video below shows this taking place in the real world!

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" src="https://www.youtube.com/embed/6JeyiM0YNo4" frameborder="0" allowfullscreen></iframe></div>

While this is physically intersting, it doesn't immediately provide a model for generating sound that mimics a violin. An (apparently) convincing way of doing this for a plucked string is called the [Karplus–Strong](http://music.columbia.edu/cmc/musicandcomputers/chapter4/04_09.php) algorithm (the rest of this [book](http://music.columbia.edu/cmc/musicandcomputers/){:target="_blank"} is compelling as well).

Anyway, here is a demo which might help to illuminate some of these thoughts!  What is going on below is that we have a row of masses connected by springs.  The leftmost spring is being driven (i.e. we force it to occupy a particular point in space at a particular point in time), and the right most spring is fixed.

<script type="text/javascript" src="{{ site.baseurl }}/public/js/wave-spring.js"></script>

<div class='content'>
  <canvas id="waveex-canvas" height='300' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript"> 
  //waveEx.initialXposition = 2;
  waveEx.reset();

  waveExAnimate();

  function waveExAnimate() {
    requestAnimationFrame( waveExAnimate );

    var time = Date.now();

    waveEx.simulate(time);
  }
</script>
<div class="slider-label">Transverse</div><div id="wave-yFreq" class="slider"></div><div id="wave-yFreq-text" class="slider-value">1.35</div>

<div class="slider-label">Longitudinal</div><div id="wave-xFreq" class="slider"></div><div id="wave-xFreq-text" class="slider-value">Off</div>

<br/>

<div>
<div id="waveEd-logic" class="editor">
</div>
</div>

<script type="text/javascript">
// from fool-util
initEditor('waveEd-logic');
loadContent('waveEd-logic', '{{ site.baseurl }}/public/js/wave-spring.js', '108');
</script>

<script type="text/javascript">
  function updateYLabel() {
    var freq = $( "#wave-yFreq" ).slider( "value" );
    if (freq == 0) { 
      $("#wave-yFreq-text").text("Off"); 
    }
    else { 
      $("#wave-yFreq-text").text(freq + ""); 
    }
  }

  function updateYFrequency() {
    var freq = $( "#wave-yFreq" ).slider( "value" );
    waveEx.yFreq = freq;
    if (freq == 0) { 
      $("#wave-yFreq-text").text("Off"); 
    }
    else { 
      $("#wave-yFreq-text").text(freq + ""); 
    }
  }

  function updateXLabel() {
    var freq = $( "#wave-xFreq" ).slider( "value" );
    if (freq == 0) { 
      $("#wave-xFreq-text").text("Off"); 
    }
    else { 
      $("#wave-xFreq-text").text(freq + ""); 
    }
  }

  function updateXFrequency() {
    var freq = $( "#wave-xFreq" ).slider( "value" );
    waveEx.xFreq = freq;
    if (freq == 0) { 
      $("#wave-xFreq-text").text("Off"); 
    }
    else { 
      $("#wave-xFreq-text").text(freq + ""); 
    }
  }

  $(function() {
    $( "#wave-yFreq" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 5,
      step: .05,
      value: 1.35,
      change: updateYFrequency,
      slide: updateYLabel
    });
  });

  $(function() {
    $( "#wave-xFreq" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 5,
      step: .05,
      value: 0,
      change: updateXFrequency,
      slide: updateXLabel
    });
  });

  var updateWave = function() {
    console.log('update');
    updateYFrequency();
    updateXFrequency();
    waveEx.reset();
  };

  $( ".waveEd-logic.editor-run" ).click(function(){ updateWave(); });

</script>

<br/>
The sliders control frequency.

Some things to try: 

* When the transverse frequency is high, the waves stop travelling.  This is due to an effect called impedance.  What happens to this effect when you change the damping of the system?  What happens when you change the mass of each weight? 
* Press run on the editor to restart the simulation.  What can you say about the initial transient behavior that you see?   
* Try setting Transverse to 0 and pressing run on the editor.  This should then allow you to study Longitudinal waves.  
* Try changing the rendering code to make the particles smaller.  Try adding more particles to the simulation to improve the approximation.  Then try only having a few particles.  How does the behavior of the system change? 
* Use this system to implement a simulator for [Fermi-Pasta-Ulam-Tsingou](http://www.scholarpedia.org/article/Fermi-Pasta-Ulam_nonlinear_lattice_oscillations), one of the first experimental mathematics/physics problems.





<p class="message">
  Tangents:
We can actually use the constraint enforcing function to implement one way of solving
<a href='https://en.wikipedia.org/wiki/Inverse_kinematics'>inverse kinematics</a> problems called <a href='http://www.andreasaristidou.com/FABRIK.html'>FABRIK</a>.  An animated explination of the method can be found below:
<a href="http://antinegationism.tumblr.com/post/115774636121/an-inverse-kinematics-algorithm-in-a-single-gif"><img src="{{ site.baseurl }}/public/img/inversekinematics.gif" alt="sweet"></a>

<br/>

To tangent the tangent, <a href="http://www.disneyresearch.com/project/mechanical-characters/">this</a> paper from disney explores another way of avoiding the traditional approach to solving inverse kinematics problems.

</p>

















