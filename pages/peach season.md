---
layout: page
title: Peach Season
position: 1
---

Our meandering journey to the land of leaves begins at breakfast.  One of the great secrets of summer in western massachussets is the peaches.  They are juicy, sweet, and fragrant, a full sensory experience.  

One suggested explanation for this is that the peaches in this corner of the world are actually shadows of even fuller hyper-peaches (in the spirit of [flatland](http://www.math.harvard.edu/~knill/mathmovies/swf/flatland1965.html) or this great hungarian [animated short](anim.mome.hu/en/films/rabbitanddeer/)).  In our mini, we started along this thought, and arrived a way of building up a 3-ball and 3-sphere (actually a 3-peach and 3-peel) from lower dimentional versions.  

A full reproduction of this exercise will have to come another time.  On a high level though, what we did was explored the construction of 3-spheres via [Heegaard Splitting](https://en.wikipedia.org/wiki/Heegaard_splitting). In particular, the class independently arrived at a similar construction to the one discussed [here](https://glyphobet.net/3-sphere/node2.html#SECTION00021000000000000000) or [here](http://www.geocities.ws/jsfhome/Think4d/Hyprsphr/envsintr.html).

One thing that I think was unique about the presentation though was that we used a [3d display](http://www.cubetube.org/) to create a perceptual representation of a hypersphere after the class invented a model.  
<img src="{{ site.baseurl }}/public/img/hypersphere.gif" alt="hypersphere, woo!!!">

The actual runnable code for this visualization can be found on [cubetube](http://www.cubetube.org/viz/726/). 

The display proved to be a very compelling and powerful teaching tool - the students in the class were captivated by it, and having a concrete visual representation helped them more fully grasp the (fairly abstract) ideas that were being discussed.  

One other path that we briefly explored, but didn't develop was building up the 3-sphere via the Hopf fibration (as is illustrated [here](http://nilesjohnson.net/hopf.html), or [here](http://philogb.github.io/page/hopf/#)).

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" src="https://www.youtube.com/embed/AKotMPGFJYk" frameborder="0" allowfullscreen></iframe></div>

## Context

Ok that was amusing, but why start here? What does it have to do with leaves?

One answer is that this stuff is that this construction is beautiful and could stand to get more play in math curricula.  Another answer is that it provides a geometric instance of an idea called [linearity](https://en.wikipedia.org/wiki/Linearity), that pervades math and physics (a more visual treatment of this idea can be found [here](http://maxgoldste.in/itad/)).  In particular, that a wildly successful way of reasoning about complicated systems is to find perspectives from which the system in question can be viewed as a collection of simpler pieces which do not depend on each other.

More concretely, suppose we want to answer a question like: How many [peaches](https://www.youtube.com/watch?v=wvAnQqVJ3XQ) will be eaten by HCSSiM students on July 17th, 2015?

In order to answer this question we can create the formalism where $$S$$ is our set of students, and f is a "function" which models the number of peaches eaten any set of students on 7/17/2015.  Using this methodology, if we say that $$S = \{ a, b, c \}$$, and that f is linear, this gives that: 
\\[ 
f(S) = f(\{ a, b, c \}) = f(\{ a \}) + f(\{ b \}) + f(\{ c \})
\\]
The problem on the right is then an easy problem to answer, we just ask each student how many peaches they ate, and in this way get an answer to the original question. 

This approach of breaking down a problem into constituent parts that are easier to model was in many ways the goal here.  

<p class="message">
	Tangents: 
	<a href="https://www.shadertoy.com/view/Md23Rd">A neat gyroid</a>, part of a large family of <a href="http://facstaff.susqu.edu/brakke/evolver/examples/periodic/periodic.html">minimal surfaces</a> (more examples <a href="http://www.indiana.edu/~minimal/archive/index.html">here</a>).
	<div style="margin: 0px auto; text-align: center;">
		<iframe width="420" height="300" frameborder="0" src="https://www.shadertoy.com/embed/Md23Rd?gui=true&t=10&paused=true" allowfullscreen></iframe>
	</div>
</p>