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

### Documentation
The following document presents a detailed and formal derivation of the equations underlying the fluid simulation above. It explains how the mathematical model is constructed from physical laws—mass conservation, momentum balance, and incompressibility—and how these
are translated into the numerical scheme. The exposition emphasizes both conceptual clarity
and mathematical precision, making it suitable for readers seeking to understand the theoretical
principles behind the simulation and how they guide its implementation.


<iframe
  src="{{ '/assets/pdf/nav-str_sim.pdf#toolbar=0&navpanes=0&scrollbar=1' | relative_url }}"
  width="110%"
  height="800px"
  style="border: none; background: var(--global-theme-color); color: var(--global-text-color);">
</iframe>

