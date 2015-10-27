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

Now it is time to gain experience and mastery of those ideas through play and demos!  

# Let's Get Physical

<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring.js"></script>

<div id='content'>
	<canvas id="system-canvas" height='150' width='700' style='width: 100%;'></canvas>
</div>

<script type="text/javascript">	
	iface.initialXposition = 2;
	iface.reset();

	animate();

	function animate() {
		requestAnimationFrame( animate );

		var time = Date.now();

		iface.simulate(time);
	}
</script>

One thing you may have noticed in playing with the previous example is that with enough initial displacement, the mass will cross over the wall that it is attached to (see the example above).  This suggests that Hooke's law only holds for small displacements, after which the systems in question begin acting non-linearly.  

<img src="{{ site.baseurl }}/public/img/hookeslawforspring.png" alt="via https://commons.wikimedia.org/wiki/File:HookesLawForSpring-English.png">

Modelling this sort of non-linearity is doable, but for our purposes, we can get pretty close by constraining 
A simple approximation that we can implement to account for this is to add a displacement constraint on our mass - not allowing it to stretch it's spring more than a certain amount.

# Under Pressure

Once you have spent enough time playing with the previous example, you might become interested in connecting a few springs together to see what happens.  One such thing you can do is to connect the springs together between two fixed points (as demonstrated [here](http://www.acs.psu.edu/drussell/Demos/multi-dof-springs/multi-dof-springs.html), as an aside, check out some of [Dan Russell's](http://www.acs.psu.edu/drussell/demos.html) other animations).


The one thing to do with a system that simulates spring physics is to connect a few springs together.