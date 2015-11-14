---
layout: page
title: Dream Herding
position: 1
---

<p class="message">
If it were possible to create a reliable simulation of reality, then odds are that our reality is itself a simulation.
</p>

In this section, the goal is to create toy system that simulates a spring.  A brief review (with more extensive references) appears in the [appendix]({{ site.baseurl }}/pages/appendix/).  

If that section is too ad-hoc, there are many more "textbook" treatments of both of those subjects avalible. If you would like to use computers as a learning tool, [Nature of Code](http://natureofcode.com/) offers one such outlet.  [This](http://acko.net/blog/animate-your-way-to-glory/){:target="_blank"} interactive presentation also offers a more complete treatment of relevent ideas.  


## Spring in a Teacup

With that non-overview, it's time to build our first demo.  The goal here is twofold:

1. To build an interactive spring simulation aimed at building intuition
2. To setup and expose a skeleton of code which will progressively gain flesh

One consequence of (2) is that there are some aspects of the first few examples which could be simplified, but are the way they are in order to make the introduction of the full system more gradual.

The system below implements [Hooke's Law](https://en.wikipedia.org/wiki/Hooke%27s_law) for springs.  Do you notice anything weird happening when you change the initial mass position?


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
  	<div class="slider-label">X position</div><div id="Xposition" class="slider"></div><div id="Xposition-text" class="slider-value">1.4</div>
</div>

<script type="text/javascript">
	animate();

	function animate() {
    SpringEx.initialXposition = 1.4;

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
      value: 1.4,
      change: updateXposition
    });
  });

  $( ".e1.editor-run" ).click(function() {
		updateXposition();
	});

</script>

<br>
We will be expanding on this code in the coming sections.  If you want to follow along, some things to think about:

* Notice how there are constants at the top of the file.  Try changing them and rerunning the simulation.  Does it behave as you would expect? This is the "physics" of our simulation.
* The middle of the file is the implementation of numerical integration.  Think about the connection between the code and the mathematical ideas. This is the "math" of simulation.
* At the bottom of the file, there is the "render loop", where the system is evolved in time, and the representation of the system updates a picture.  Try changing values here to see what happens.  


<p class="message">
  Tangents: The approach taken in the design of this site takes much inspiration from <a href="https://worrydream.com">Bret Victor</a> (<a href="http://worrydream.com/LadderOfAbstraction/">this</a> is a good place to start) and <a href="http://arxiv.org/abs/math/9404236">William Thurston</a>.  And to add a tangent to a tangent, here is an <a href="http://www.math.rutgers.edu/~zeilberg/Opinion95.html">opinion</a> of <a href="http://www.math.rutgers.edu/~zeilberg/OPINIONS.html">Doron Zeilberger</a>.

  <br><br>

  In short, the internet provides a new tool for thought and communication - <a href="http://bost.ocks.org/mike/algorithms/">exploring</a> <a href="http://www.r2d3.us/visual-intro-to-machine-learning-part-1/">applications</a> of this <a href="http://explorableexplanations.com/">tool</a> that help more people to see a little further and more clearly than they would have otherwise feels like a socially productive use of time.  
</p>
