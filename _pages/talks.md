---
layout: page
permalink: /talks/
title: Talks
description: Talks grouped by year in reversed chronological order.
nav: true
nav_order: 4
---

<style>
.talks-list .talks-item {
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid rgba(255,255,255,0.1) !important;
  position: relative;
  padding: 1rem;
}
.talk-date {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
}
.talk-pdf {
  float: right;
  margin-top: 0.5rem;
  font-size: 1.2rem;
}
</style>

{% assign talks_by_year = site.data.talks | group_by: 'year' %}
{% for group in talks_by_year reversed %}
  <div class="publications-year">{{ group.name }}</div>
  <ul class="card-text font-weight-light list-group list-group-flush talks-list">
    {% for talk in group.items %}
      <li class="list-group-item talks-item">
        <div class="row">
          <div class="col-2"></div>
          <div class="col-10">
            <span class="talk-date">{{ talk.date }}</span>
            <h6 class="title font-weight-bold">{{ talk.title }}</h6>
            {% if talk.location %}
              <p class="font-weight-light">{{ talk.location }}</p>
            {% endif %}
            {% if talk.authors %}
              <p class="font-weight-light">{{ talk.authors | join: ", " }}</p>
            {% endif %}
            {% if talk.abstract %}
              <p class="font-italic">{{ talk.abstract }}</p>
            {% endif %}
            {% if talk.file %}
              <a href="{{ talk.file | relative_url }}" class="talk-pdf" title="Download PDF">
                <i class="ti ti-file-text"></i>
              </a>
            {% endif %}
          </div>
        </div>
      </li>
    {% endfor %}
  </ul>
{% endfor %}
