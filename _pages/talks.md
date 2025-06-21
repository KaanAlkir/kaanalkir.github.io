---
layout: page
permalink: /talks/
title: Talks
description: Talks grouped by year in reversed chronological order.
nav: true
nav_order: 3
---

{% assign talks_by_year = site.data.talks | group_by: "year" %}
{% for group in talks_by_year reversed %}
## {{ group.name }}

<div class="publications">
  {% for talk in group.items %}
    <div class="publication">
      {% if talk.image %}
        <img src="{{ talk.image | relative_url }}" alt="{{ talk.title }}" class="publication-img"/>
      {% endif %}
      
      <h3 class="publication-title">{{ talk.title }}</h3>
      <p class="publication-meta">
        {{ talk.date }} — {{ talk.location }}
      </p>

      {% if talk.authors %}
        <p class="publication-authors">
          {{ talk.authors | join: ", " }}
        </p>
      {% endif %}

      {% if talk.abstract %}
        <p class="publication-abstract">
          {{ talk.abstract }}
        </p>
      {% endif %}

      {% if talk.file %}
        <a href="{{ talk.file | relative_url }}" class="bib-button">PDF</a>
      {% endif %}
    </div>
  {% endfor %}
</div>
{% endfor %}
