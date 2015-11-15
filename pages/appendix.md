---
layout: page
title: Ap·pen·dix
position: 6
---

This is a space to establish some intellectual and situational context for the material on this site.

# Math + Physics

## Springs Go Boink

<img src="{{ site.baseurl }}/public/img/calvinboink.gif" alt="Bill Watterson is the man!">

To start on this quest, we begin by thinking about how to model springs.  To do this, we first need to notice (either by playing with a spring, or by trusting the experiments of some guy named [Hooke](https://en.wikipedia.org/wiki/Hooke's_law)), that springs are linear.  To understand how this feels, imagine taking a spring and compressing it against a wall some amount X.  Now if you double the amount of compression, the amount of "force" which you feel in return will also double.  

In math, we write this as: 
\\[F = kX\\] 
Where $$k$$ is the "characteristic" of how spring-y your spring is, and $$X$$ is the displacement from the "rest" length. 

But we want to draw the spring in the computer, where we can't feel it with our hands. Instead we will feel it with our eyes by the way that it changes in time.  To do this, we must evolve the system.  To do that, we need some calculus - specifically, we must implement a scheme for doing numerical integration.  

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

# Contemplating the Past

## History

This site was born out of an experimental a week and half long "mini" course at a summer math program for high school kids called HCSSiM. The title of the course was "Let's Get Lost", with the idea of the being that each day I would prepare the next lesson/course materials in response to the previous days discussion.  As the class was fairly short, I sought to provide direction by choosing a destination - namely I wanted to touch on all of the ideas necessary to make a computer simulate a leaf (or more generally make it simulate something with hyperbolic geometry). 

## Philosophy

This class touched on a number of rich subjects in passing (in an effort to avoid getting to far afield of our initial destination).  The aim was to get lost in connections between disperate ideas while still arriving at a conceptual destination that helped pull all the topics together. 

More than anything else, the factor that drove the class was the question of how much a topic helped to develop "intrinsic" reasoning, i.e. did it help us understand and simulate the way in which global geometry emerges from local rules?

That said, as this class was happening at a summer math program, this pragmatic drive was tempered to a degree by a desire to meditate on ideas the class found independently compelling.

# Literary 

"[The Bet](http://www.eastoftheweb.com/short-stories/UBooks/Bet.shtml)" by Chekhov and by "[The Phantom Tollbooth](http://www.amazon.com/The-Phantom-Tollbooth-Norton-Juster/dp/0394820371)" by Norton Juster, have little to do with anything discussed, but are excellent and worthy of (re)reading if they haven't been considered recently.

	
