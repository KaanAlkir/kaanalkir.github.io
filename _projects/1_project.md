---
layout: page
title: Interactive Gas Simulation of Navier–Stokes-Driven Dynamical Systems in 2-D 
description: This project is an interactive simulation of a 2D dynamical system coupled with a fluid flow based on the Navier–Stokes equations. Users can adjust the wind field type and parameters, including custom vector fields, to see how they affect the motion of particles and scalar density. It’s designed to help visualize how external flows influence dynamical behavior in a simple and intuitive way.
img: 
importance: 1
category: work
related_publications: false
---


<div class="row justify-content-sm-center">
  <div class="col-sm-12 mt-4">
    <div class="embed-responsive embed-responsive-16by9" style="border: 1px solid #ccc;">
      <iframe class="embed-responsive-item"
              src="{{ site.baseurl }}/assets/simulations/gas/gas_index.html"
              width="100%"
              height="600"
              allowfullscreen
              style="border: none;">
      </iframe>
    </div>
  </div>
</div>

{% raw %}
{% highlight latex linenos %}
{% include_relative ../assets/tex/nav-str_sim.tex %}
{% endhighlight %}
{% endraw %}
