---
layout: page
title: Dream Herding
position: 2
---

<p class="message">
If it were possible to create a reliable simulation of reality, then odds are that our reality is itself a simulation.
</p>

In this section, the goal is to create toy system that simulates physics (as a step along this path, as well as a step towards making computers draw a leaf).  In particular, we will focus on modeling waves, as they are beautiful and also a good place to study the emergence of global structure from local rules. 

As a warning, this discussion will feature an ad-hoc collection of technical ideas.  If you find yourself getting lost, take solace in the course name.  If you are looking for a more "textbook" path which explores the use of computers for physical simulation, take a look at [Nature of Code](http://natureofcode.com/). 

If find this page confusing this [beautiful](http://acko.net/blog/animate-your-way-to-glory/){:target="_blank"} interactive presentation touches many of the same ideas.  

# Springs Go Boink

To start on this quest, we begin by thinking about how to model springs.  To do this, we first need to notice (either by playing with a spring, or by trusting the experiments of some guy named [Hooke](https://en.wikipedia.org/wiki/Hooke's_law), that springs are linear.  To understand how this feels, imagine taking a spring and compressing it against a wall some amount X.  Now if you double the amount of compression, the amount of "force" which you feel in return will also double.  

In math, we write this as: 
\\[F = kX\\] 
Where $$k$$ is the "characteristic" of how spring-y your spring is, and $$X$$ is the displacement from the "rest" length. 

But we want to draw the spring in the computer, where we can't feel it with our hands. Instead we will feel it with our eyes by the way that it changes in time.  To do this, we must evolve the system.  To do that, we need some calculus - specifically, we must implement a scheme for doing numerical integration.  

One advantage of this approach is that it makes it much easier to see high Xposition phenomena, another is that it allows us to simulate systems that might be very technically challenging to actually build.  

## Numerical Integration

This is a large subject in it's own right, and there are many resources [avalible](http://physics.bu.edu/py502/lectures3/cmotion.pdf) which provide a more complete view the problems that arise (like numerical stability, speed of convergence, ect). 

For completeness, a brief note to guide intuition: 
[Taylor's Theorem](https://en.wikipedia.org/wiki/Taylor's_theorem) gives a way of approximating a function about a point in terms of it's derivatives at that point.  [Euler's Method](https://en.wikipedia.org/wiki/Euler_method) is then the naive application of this observation in order to approximate a function in terms of it's derivatives.

For example, if you have a function which describes the change in velocity of a particle as a function of time, then you can approximate the resulting position by moving that velocity for a time step:
\\[
vel(t) = g(x), t_n = n * step, pos(0) = x_0
\\]
\\[
pos(t_n) = pos(n * step) = pos( (n - 1) * step) + step * vel(n - 1)
\\]
Where $$step$$ is a constant which determines the step size in time for each step of the approxmiation, and g(x) is our "given" function.

In simulating springs, and more generally in a lot of physics, we interact with a system (i.e. apply a force) by changing the value of a second derivative (the acceleration).  This means that in order to simulate how the position of particles evolves in time, we have to implement euler's method using second order terms.  

[Vertlet]({{ site.baseurl}}/public/img/vertlet.pdf) integration (a good practical guide can be found [here](http://www.gotoandplay.it/_articles/2005/08/advCharPhysics.php#Verlet)) is then a method of implementing second order Euler which implicitly calculates the velocity terms.  This simplifies the implementation, and improves the numerical stability of the system.  As such, it's what we will be using going forward.

## Spring in a Teacup

With that overview, it's time to build our first demo.  The goal here is twofold:

1. To build an interactive spring simulation aimed at building intuition
2. To setup and expose a skeleton of code which will progressively gain flesh

One consequence of (2) is that there are some aspects of the first few examples which could be simplified, but are the way they are in order to make the introduction of the full system more gradual.


<script src="{{ site.baseurl }}/public/js/lib/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<!-- load ace themelist extension -->
<script src="{{ site.baseurl }}/public/js/lib/ace/ext-themelist.js" type="text/javascript" charset="utf-8"></script>
<script src="{{ site.baseurl }}/public/js/lib/fool-util.js" type="text/javascript" charset="utf-8"></script>

<div>
<div id="e1" class="editor">
</div>

</div>

<!-- This is to use the vector data-types to make it easier to make 3d visualizations later -->
<script src="{{ site.baseurl }}/public/js/lib/three.min.js"></script> 
<script type="text/javascript" src="{{ site.baseurl }}/public/js/spring.js"></script>

<script type="text/javascript">
// from fool-util
initEditor('e1');
loadContent('e1', '{{ site.baseurl }}/public/js/spring.js', '8');
</script>

<div id='content'>
  	<canvas id="springex-canvas" height='150' width='700' style='width: 100%;'></canvas>
  	<div style='float: left;'>X position</div><div id="Xposition" style='width: 80%; float: left; left: 10px; top: 7px;'></div><div id="Xposition-text" style="position: relative; left: 25px;">1.1</div>
</div>

<script type="text/javascript">
	animate();

	function animate() {
    SpringEx.initialXposition = 1.1;

		requestAnimationFrame( animate );

		var time = Date.now();

		SpringEx.simulate(time);
	}
</script>

<script type="text/javascript">
  function updateXposition() {
    var Xposition = $( "#Xposition" ).slider( "value" );
    SpringEx.initialXposition = Xposition;
    $("#Xposition-text").text(SpringEx.initialXposition + "");
    SpringEx.reset();
  }

  $(function() {
  	$( "#Xposition" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 3,
      step: .05,
      value: 1.1,
      change: updateXposition
    });
  });

  $( ".e1.editor-run" ).click(function() {
		updateXposition();
	});

</script>

<br>
Take a moment to play with this example and to get familiar with the code, as we will be expanding on it in the coming sections.  

Some things to think about:

* Notice how there are constants at the top of the file.  Try changing them and rerunning the simulation.  Does it behave as you would expect? This is the "physics" of our simulation.
* The middle of the file is the implementation of numerical integration.  Think about the connection between the code and the mathematical ideas. This is the "math" of simulation.
* At the bottom of the file, there is the "render loop", where the system is evolved in time, and the representation of the system updates a picture.  Try changing values here to see what happens.  


<p class="message">
  Tangents: The approach taken in the design of this site takes much inspiration from <a href="https://worrydream.com">Bret Victor</a> (<a href="http://worrydream.com/LadderOfAbstraction/">this</a> is a good place to start) and <a href="http://arxiv.org/abs/math/9404236">William Thurston</a>.  And to add a tangent to a tangent, here is an <a href="http://www.math.rutgers.edu/~zeilberg/Opinion95.html">opinion</a> of <a href="http://www.math.rutgers.edu/~zeilberg/OPINIONS.html">Doron Zeilberger</a>.

  <br><br>

  In short, the internet provides a new tool for thought and communication - <a href="http://bost.ocks.org/mike/algorithms/">exploring</a> <a href="http://www.r2d3.us/visual-intro-to-machine-learning-part-1/">applications</a> of this tool that help more people to see a little further and more clearly than they would have otherwise feels like a socially productive use of time.  
</p>
