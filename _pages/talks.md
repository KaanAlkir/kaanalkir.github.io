---
layout: page
permalink: /talks/
title: Talks
description: talks by categories in reversed chronological order.
nav: true
nav_order: 3    # adjust to position in the menu
---

<div class="publications">

{% for talk in site.data.talks reversed %}
  <div class="publication">
    <h3 class="publication-title">
      {% if talk.bib %}
        <a href="{{ talk.bib | relative_url }}">{{ talk.title }}</a>
      {% else %}
        {{ talk.title }}
      {% endif %}
    </h3>
    <p class="publication-meta">
      {{ talk.venue }}, {{ talk.year }}
    </p>
    {% if talk.authors %}
      <p class="publication-authors">
        {{ talk.authors | join: ", " }}
      </p>
    {% endif %}
    {% if talk.categories %}
      <p class="publication-tags">
        {% for c in talk.categories %}
          <span class="tag">{{ c }}</span>
        {% endfor %}
      </p>
    {% endif %}
  </div>
{% endfor %}

</div>
