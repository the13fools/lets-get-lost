---
layout: page
title: Hyper Epilogue
position: 5
---

In the previous section, we explored some of the thinking around form finding - particularly explorations of ways to use local rules in the control of global form of two dimensional surfaces that live in three dimensions. 

In this section, we bump those numbers up by one and mention a few thoughts related to the study of "[three-manifolds](https://en.wikipedia.org/wiki/3-manifold)", three dimensional surfaces that live in four dimensions.  

Before delving into why this is something that is potentially interesting to think about, let's take a look at some materials which might help clarify the flavor of what we will be talking about.  

# Truth from Fiction

One classic exposition of this subject is [flatland](http://www.math.harvard.edu/~knill/mathmovies/swf/flatland1965.html). Another, more modern treatment is this great hungarian short: 

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" style='width: 100%;' src="https://player.vimeo.com/video/51153134" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
</div>

More recently, people have been toying with the idea of making video games that allow one to explore four spacial dimensions. Of these two notable projects are [Tetraspace](http://rantonels.itch.io/tetraspace) and (its inspiration) [Miegakure](http://miegakure.com/).

Finally, for more exploratory tools for studying related ideas, Jeffrey Weeks has a collection of tools for exploring geometry [here](http://geometrygames.org/). 

<img src="{{ site.baseurl }}/public/img/curved-spaces.gif" alt="hyperbolic 3">

[Curved Spaces](http://geometrygames.org/CurvedSpaces/index.html) is particularly remarkable.  

# Let's Build a Hypershape

So all of that is pretty, but really there is no substitute for exercise and play if you are after understanding.  A great first exercise is to implement a system which rotates a hypercube - like this [one](http://hypersolid.milosz.ca/).  

There are two steps that come with implementing something like this.  The first is figuring out how to explain a hypercube to a computer, and the second part is rotating the cube.  We will focus on the encoding question.

It turns out that the trick to representing the n-cube though is to take two copies of the n-1 cube that are "shifted" relative to each other, and then to connect each vertex to it's "clone".  One visual explination of this process can be found [here](http://maxgoldste.in/itad/).  
<!-- http://hi.gher.space/classic/introduction.htm -->

In this way you can build up n-cubes in arbitrary dimensions.  

A subsequent question is if there is a way of doing a similar construction for the [n-sphere](https://en.wikipedia.org/wiki/N-sphere).  It turns out there is, an it two discussions of this argument can be found [here](https://glyphobet.net/3-sphere/node2.html#SECTION00021000000000000000) and [here](http://www.geocities.ws/jsfhome/Think4d/Hyprsphr/envsintr.html).  There are also videos which encode the 2-sphere (i.e. tennis ball) in a plane with color as the third dimension [here](http://www.msri.org/publications/sgp/jim/geom/r4/sphere/index.html).

In this class, I was fortunate enough to have access to a 3d display: 

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" style='width: 100%;' src="https://player.vimeo.com/video/121566038" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

We used this display to create an animations of the 3-sphere and 4-ball.  
<img src="{{ site.baseurl }}/public/img/hypersphere.gif" alt="hypersphere, woo!!!">

The actual runnable code for this visualization can be found on [cubetube](http://www.cubetube.org/viz/726/). 

As an aside, the general technical name for this technique is called [Heegaard Splitting](https://en.wikipedia.org/wiki/Heegaard_splitting).

There are also other ways to build up the three sphere which reveal other aspects of it's geometry.  One particularly notable construction is the Hopf fibration (as is illustrated [here](http://nilesjohnson.net/hopf.html), or [here](http://philogb.github.io/page/hopf/#)).

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" style='width: 100%;' src="https://www.youtube.com/embed/AKotMPGFJYk" frameborder="0" allowfullscreen></iframe></div>


This is a special case of the general approach of studying a higher dimensional space by understanding how to build it up as the union of a collection of lower dimensional surfaces.  The general name for this technique is called [Foliation Theory](https://en.wikipedia.org/wiki/Foliation).  One reason that this approach is interesting is that it offers a way of studying the dynamics of a process which lives in a higher dimensional geometry.  

## Potential Applications

We introduce this subject because there is much room to develop a richer theory of two-dimensional surfaces which evolve in time.  Low dimensional topology is a place where people have already considered some of the questions that might arise in such an exploration, and thus being versed in its language seems useful.  

One potential application that it might be useful to draw on topological result in the construction of more sophisticated filters for video/3D medical data.  

Another potential application is in exploring if there is geometric data that could be used to provide features for machine learning applications (in the spirit of [Topological Data Analysis](https://en.wikipedia.org/wiki/Topological_data_analysis).

<p class="message">
  Tangents: 
  Check out some sphere eversions! 

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" style='width: 100%;'  src="https://www.youtube.com/embed/-6g3ZcmjJ7k" frameborder="0" allowfullscreen></iframe> 
</div>

<div style="margin: 0px auto; text-align: center;">
<iframe width="420" height="315" style='width: 100%;' src="https://www.youtube.com/embed/gs_eUoQPjHc" frameborder="0" allowfullscreen></iframe>  
</div>
</p>
