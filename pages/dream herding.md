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

# Springs Go Boink

To start on this quest, we begin by thinking about how to model springs.  To do this, we first need to notice (either by playing with a spring, or by trusting the experiments of some guy named [Hooke](https://en.wikipedia.org/wiki/Hooke's_law), that springs are linear.  To understand how this feels, imagine taking a spring and compressing it against a wall some amount X.  Now if you double the amount of compression, the amount of "force" which you feel in return will also double.  

In math, we write this as: 
\\[F = kX\\] 
Where $$k$$ is the "characteristic" of how spring-y your spring is, and $$X$$ is the displacement from the "rest" length. 

But we want to draw the spring in the computer, where we can't feel it with our hands. Instead we will feel it with our eyes by the way that it changes in time.  To do this, we must evolve the system.  To do that, we need some calculus - specifically, we must implement a scheme for doing numerical integration.  

## Numerical Integration

This is a large subject in it's own right, and there are many resources [avalible](http://physics.bu.edu/py502/lectures3/cmotion.pdf) which provide a more complete view the problems that arise (like numerical stability, speed of convergence, ect).

For completeness, a short intuition on the core idea: 
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

<!-- <script src="{{ site.baseurl }}/public/js/three.min.js"></script>  --><!-- This is to use the vector data-types to make it easier to make 3d visualizations later -->
<!-- <script type="text/javascript" src="{{ site.baseurl }}/public/js/disk.js"></script> -->

<script src="{{ site.baseurl }}/public/js/ace/ace.js" type="text/javascript" charset="utf-8"></script>
<!-- load ace themelist extension -->
<script src="{{ site.baseurl }}/public/js/ace/ext-themelist.js" type="text/javascript" charset="utf-8"></script>

<div id="e1" class="editor">function foo(items) {
    var i;
    for (i = 0; i &lt; items.length; i++) {
        alert("Ace Rocks " + items[i]);
    }
}</div>
<div class="editor-control">
<div class="editor-run"><span class="el el-caret-right"></span>
Run</div>
<div class="editor-expand">
Expand <span class="el el-resize-full"></span></div>
</div>


<div></div>

<script type="text/javascript">
$( ".editor-expand" ).click(function() {
  $( "#e1" ).toggleClass( "editor-big", 500, "easeOutSine" )
  	.promise().done(function(){
  		var dom = ace.require("ace/lib/dom");
  		ace.edit("e1").resize();
  	});
});
</script>

<script>
//var $ = document.getElementById.bind(document);
var dom = ace.require("ace/lib/dom");
//add command to all new editor instaces
ace.require("ace/commands/default_commands").commands.push({
    name: "Toggle Fullscreen",
    bindKey: "Command-L",
    exec: function(editor) {
        var fullScreen = dom.toggleCssClass(document.body, "fullScreen")
        dom.setCssClass(editor.container, "fullScreen", fullScreen)
        editor.setAutoScrollEditorIntoView(!fullScreen)
        editor.resize()
    }
})

var editor = ace.edit("e1");
editor.setTheme("ace/theme/tomorrow");
editor.session.setMode("ace/mode/javascript");
editor.renderer.setScrollMargin(10, 10);
editor.setOptions({
    // "scrollPastEnd": 0.8,
    autoScrollEditorIntoView: true,
    vScrollBarAlwaysVisible: false

});

var themes = ace.require("ace/ext/themelist").themes.map(function(t){return t.theme});

</script>






