---
layout: page
title: project 1
description: with background image
img: assets/img/12.jpg
importance: 1
category: work
related_publications: true
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



The code is simple.
Just wrap your images with `<div class="col-sm">` and place them inside `<div class="row">` (read more about the <a href="https://getbootstrap.com/docs/4.4/layout/grid/">Bootstrap Grid</a> system).
To make images responsive, add `img-fluid` class to each; for rounded corners and shadows use `rounded` and `z-depth-1` classes.
Here's the code for the last row of images above:

{% raw %}

```html
<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/6.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-4 mt-3 mt-md-0">
    {% include figure.liquid path="assets/img/11.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
```

{% endraw %}
