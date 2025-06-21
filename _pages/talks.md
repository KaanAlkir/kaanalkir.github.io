---
layout: publications
title: Talks
permalink: /talks/
nav: true
nav_order: 4
---

Talks by categories in reversed chronological order.

Type to filter…

{% for talk in site.data.talks reversed %}
  {% include publication.html item=talk %}
{% endfor %}
