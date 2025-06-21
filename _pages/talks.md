---
layout: page
permalink: /talks/
title: Talks
description: Talks by categories in reversed chronological order.
nav: true
nav_order: 4
---

<ul class="card-text font-weight-light list-group list-group-flush">
  {% assign talks = site.data.talks | sort: 'date' | reverse %}
  {% for talk in talks %}
    <li class="list-group-item">
      <div class="row">
        <div class="col-xs-2 col-sm-2 col-md-2 text-center date-column">
          {% if talk.date %} {% assign date = talk.date | split: '-' | join: '.' %} {% else %} {% assign date = '' %} {% endif %}
          <table class="table-cv">
            <tbody>
              <tr>
                <td>
                  <span class="badge font-weight-bold danger-color-dark text-uppercase align-middle" style="min-width: 75px">{{ date }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-xs-10 col-sm-10 col-md-10 mt-2 mt-md-0">
          <h6 class="title font-weight-bold ml-1 ml-md-4">
            {% if talk.file %}
              <a href="{{ talk.file | relative_url }}">{{ talk.title }}</a>
            {% else %}
              {{ talk.title }}
            {% endif %}
          </h6>
          {% if talk.location %}
            <h6 class="ml-1 ml-md-4" style="font-size: 0.95rem">{{ talk.location }}</h6>
          {% endif %}
          {% if talk.abstract %}
            <h6 class="ml-1 ml-md-4" style="font-size: 0.95rem; font-style: italic">{{ talk.abstract }}</h6>
          {% endif %}
        </div>
      </div>
    </li>
  {% endfor %}
</ul>
