/* PhireD KTH 2027 site scripts */

/* ------------------------------------------------------------------
   EVENT DATE AND TIME (drives the countdown on the front page)
------------------------------------------------------------------- */
var EVENT = {
  start: "2027-02-02T13:00:00+01:00",
  end:   "2027-02-02T15:00:00+01:00"
};

/* ------------------------------------------------------------------
   REGISTRATION
   Paste the link to the KTH registration form here. Until then the
   "Register" buttons say "Registration opens soon" and link to the
   reminder sign-up instead.
------------------------------------------------------------------- */
var REGISTRATION_URL = "";

/* ------------------------------------------------------------------
   WORKSHOPS (calendar on the front page)
   - date:   "YYYY-MM-DD"
   - time:   free text, e.g. "17:00–18:30"
   - signup: link to the sign-up form for that workshop. Leave "" to
             show "Sign-up opens soon".
   TODO: the dates below are placeholders. Replace them with the real ones.
------------------------------------------------------------------- */
var WORKSHOPS = [
  {
    date: "2027-01-13", time: "17:00–18:30", place: "KTH Campus",
    title: "CV workshop",
    text: "Turn your thesis and publications into a CV that industry recruiters understand.",
    signup: ""
  },
  {
    date: "2027-01-18", time: "17:00–18:30", place: "KTH Campus",
    title: "Job seeking in Sweden for international researchers",
    text: "How the Swedish job market works, where jobs are posted, and what to know about permits and language.",
    signup: ""
  },
  {
    date: "2027-01-21", time: "17:00–18:30", place: "KTH Campus",
    title: "Panel: academia, industry or a new direction?",
    text: "PhDs who stayed in academia, moved to industry or changed field entirely share how they decided.",
    signup: ""
  },
  {
    date: "2027-01-25", time: "17:00–18:30", place: "KTH Campus",
    title: "Pitch your research",
    text: "Practise explaining your research in one minute, so it lands with someone from outside your field.",
    signup: ""
  },
  {
    date: "2027-01-28", time: "17:00–18:30", place: "KTH Campus",
    title: "Networking with confidence",
    text: "The psychology of networking: starting conversations, handling nerves and following up afterwards.",
    signup: ""
  }
];

/* ------------------------------------------------------------------
   REMINDER EMAIL SIGN-UP
   Until "action" is filled in, the form shows "Sign-up isn't open yet"
   and nothing is sent. See README.md for how to connect a Google Form.
------------------------------------------------------------------- */
var SIGNUP_FORM = {
  // e.g. "https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxx/formResponse"
  action: "",
  fields: {
    email: "entry.0000000001", // the Google Form question for the email address
    role: "entry.0000000002"   // the Google Form question for "I am a..."
  }
};

/* Shared helpers */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function initials(name) {
  return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
}
function sortCompanies(arr) {
  var rank = function (c) { return /silver|gold|main/i.test(c.sponsor || '') ? 0 : (c.sponsor ? 1 : 2); };
  return arr.slice().sort(function (a, b) {
    return rank(a) - rank(b) || a.name.localeCompare(b.name, 'sv');
  });
}
function exhibitors(year) {
  return (window.PHIRED_EXHIBITORS && window.PHIRED_EXHIBITORS[year]) || [];
}
function companyLinks(c) {
  return [
    ['Website', c.links && c.links.website],
    ['LinkedIn', c.links && c.links.linkedin],
    ['Careers', c.links && c.links.careers]
  ].filter(function (l) { return l[1]; }).map(function (l) {
    return '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + l[0] + '<span class="visually-hidden"> for ' + esc(c.name) + ' (opens in a new tab)</span></a>';
  }).join('');
}

/* ------------------------------------------------------------------
   REGISTER BUTTONS
------------------------------------------------------------------- */
(function register() {
  document.querySelectorAll('[data-register]').forEach(function (a) {
    if (REGISTRATION_URL) {
      a.href = REGISTRATION_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.href = '#reminders';
      a.textContent = a.getAttribute('data-soon') || 'Registration opens soon';
    }
  });
})();

/* ------------------------------------------------------------------
   REMINDER SIGN-UP FORM
------------------------------------------------------------------- */
(function signup() {
  var form = document.getElementById('register');
  if (!form) return;
  var msg = form.querySelector('.signup-msg');
  var email = form.querySelector('#email');
  var consent = form.querySelector('#consent');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!email.checkValidity()) {
      msg.textContent = 'Enter an email address like name@example.com.';
      email.focus();
      return;
    }
    if (!consent.checked) {
      msg.textContent = 'Tick the box so we’re allowed to email you.';
      consent.focus();
      return;
    }
    if (!SIGNUP_FORM.action) {
      msg.textContent = 'Sign-up isn’t open yet. Check back soon.';
      return;
    }

    var body = new URLSearchParams();
    body.append(SIGNUP_FORM.fields.email, email.value.trim());
    body.append(SIGNUP_FORM.fields.role, form.querySelector('#role').value);

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    msg.textContent = 'Sending…';

    // Google Forms doesn't allow reading the reply, so "no-cors" is used and a sent request counts as success.
    fetch(SIGNUP_FORM.action, { method: 'POST', mode: 'no-cors', body: body })
      .then(function () {
        form.reset();
        msg.textContent = 'You’re on the list. We’ll email you a reminder before the fair.';
      })
      .catch(function () {
        msg.textContent = 'That didn’t go through. Check your connection and try again.';
      })
      .then(function () { button.disabled = false; });
  });
})();

/* ------------------------------------------------------------------
   COMPANY DIRECTORY with year tabs (companies.html)
------------------------------------------------------------------- */
(function directory() {
  var list = document.getElementById('company-list');
  if (!list || !window.PHIRED_EXHIBITORS) return;

  var tabs = document.querySelectorAll('.year-tab');
  var search = document.getElementById('company-search');
  var filterBox = document.getElementById('area-filters');
  var count = document.getElementById('company-count');
  var controls = document.getElementById('dir-controls');
  var empty = document.getElementById('year-empty');
  var noResults = document.getElementById('no-results');
  var year = /2026/.test(location.hash) ? 2026 : 2027;
  var companies = [];
  var active = null;

  function setYear(y) {
    year = y;
    companies = sortCompanies(exhibitors(y));
    active = null;
    search.value = '';
    tabs.forEach(function (t) { t.setAttribute('aria-selected', String(+t.getAttribute('data-year') === y)); });
    empty.hidden = companies.length > 0;
    controls.hidden = companies.length === 0;

    var areas = [];
    companies.forEach(function (c) {
      (c.areas || []).forEach(function (a) { if (areas.indexOf(a) < 0) areas.push(a); });
    });
    areas.sort(function (a, b) { return a.localeCompare(b); });
    filterBox.innerHTML = ['All'].concat(areas).map(function (a, i) {
      return '<button type="button" class="filter" aria-pressed="' + (i === 0) + '" data-area="' + (i === 0 ? '' : esc(a)) + '">' + esc(a) + '</button>';
    }).join('');
    render();
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var y = +t.getAttribute('data-year');
      history.replaceState(null, '', '#' + y);
      setYear(y);
    });
  });
  document.querySelectorAll('[data-show-year]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var y = +a.getAttribute('data-show-year');
      history.replaceState(null, '', '#' + y);
      setYear(y);
    });
  });

  filterBox.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter');
    if (!btn) return;
    active = btn.getAttribute('data-area') || null;
    filterBox.querySelectorAll('.filter').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b === btn));
    });
    render();
  });
  search.addEventListener('input', render);

  function section(title, text) {
    return text ? '<div><h3>' + title + '</h3><p>' + esc(text) + '</p></div>' : '';
  }

  function card(c, i) {
    var logo = c.logo
      ? '<img class="co-logo" src="' + esc(c.logo) + '" alt="">'
      : '<span class="co-logo co-mono tone-' + (i % 3) + '" aria-hidden="true">' + esc(initials(c.name)) + '</span>';
    var links = companyLinks(c);
    var body = section('About', c.about) + section('At the fair', c.meet) + section('Looking for', c.lookingFor) +
      (links ? '<div class="co-links">' + links + '</div>' : '');

    return '' +
      '<li><details class="co" id="' + esc(slug(c.name)) + '">' +
        '<summary>' + logo +
          '<span class="co-head">' +
            '<span class="co-name">' + esc(c.name) +
              (c.sponsor ? ' <span class="co-badge">' + esc(c.sponsor) + '</span>' : '') + '</span>' +
            '<span class="co-line">' + esc(c.oneLiner) + '</span>' +
            '<span class="co-tags">' + (c.areas || []).map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</span>' +
          '</span>' +
          '<span class="co-meta">' + (c.type ? '<span>' + esc(c.type) + '</span>' : '') + '</span>' +
        '</summary>' +
        '<div class="co-body">' + body + '</div>' +
      '</details></li>';
  }

  function render() {
    var q = search.value.trim().toLowerCase();
    var shown = companies.filter(function (c) {
      if (active && (c.areas || []).indexOf(active) < 0) return false;
      if (!q) return true;
      return [c.name, c.type, c.oneLiner, c.about, c.meet, c.lookingFor, (c.areas || []).join(' ')]
        .join(' ').toLowerCase().indexOf(q) >= 0;
    });
    list.innerHTML = shown.map(card).join('');
    count.hidden = companies.length === 0;
    count.textContent = shown.length === companies.length
      ? companies.length + ' organisations in ' + year
      : shown.length + ' of ' + companies.length + ' organisations in ' + year;
    noResults.hidden = shown.length > 0 || companies.length === 0;
  }

  document.getElementById('clear-filters').addEventListener('click', function () {
    search.value = '';
    filterBox.querySelector('.filter').click();
  });

  setYear(year);
})();

function slug(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/* ------------------------------------------------------------------
   COUNTDOWN (index.html)
------------------------------------------------------------------- */
(function countdown() {
  var box = document.getElementById('countdown');
  if (!box) return;
  var start = new Date(EVENT.start);
  var end = new Date(EVENT.end);
  var note = document.getElementById('countdown-note');
  var sr = document.getElementById('countdown-sr');

  var els = {};
  box.querySelectorAll('.cd-num').forEach(function (el) { els[el.getAttribute('data-unit')] = el; });
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var now = new Date();
    var ms = start - now;
    if (ms <= 0) {
      box.classList.add('cd-done');
      note.textContent = now > end ? 'PhireD KTH 2027 has taken place. Thank you for coming!' : 'PhireD KTH 2027 is happening now. Welcome!';
      sr.textContent = note.textContent;
      return false;
    }
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    els.days.textContent = d;
    els.hours.textContent = pad(h);
    els.minutes.textContent = pad(m);
    els.seconds.textContent = pad(s);
    sr.textContent = d + ' days until PhireD KTH 2027.';
    return true;
  }
  if (tick()) {
    var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000);
  }
})();

/* ------------------------------------------------------------------
   2026 EXHIBITOR WALL with pop-up descriptions (index.html)
------------------------------------------------------------------- */
(function wall() {
  var box = document.getElementById('exhibitor-wall');
  var dialog = document.getElementById('co-dialog');
  if (!box) return;
  var all = sortCompanies(exhibitors(2026));

  function tile(o, i) {
    var inner = o.logo ? '<img src="' + esc(o.logo) + '" alt="' + esc(o.name) + '">' : '<span>' + esc(o.name) + '</span>';
    if (o.sponsor) inner += '<em>' + esc(o.sponsor) + '</em>';
    return '<li><button type="button" data-i="' + i + '" aria-haspopup="dialog">' + inner + '</button></li>';
  }
  var sponsors = [], others = [];
  all.forEach(function (o, i) { (o.sponsor ? sponsors : others).push(tile(o, i)); });
  box.innerHTML = (sponsors.length ? '<ul class="wall-sponsors" aria-label="Sponsors">' + sponsors.join('') + '</ul>' : '') +
    '<ul aria-label="Exhibitors">' + others.join('') + '</ul>';

  if (!dialog || typeof dialog.showModal !== 'function') return;
  var content = dialog.querySelector('.dlg-content');

  box.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-i]');
    if (!btn) return;
    var c = all[+btn.getAttribute('data-i')];
    var links = companyLinks(c);
    content.innerHTML =
      '<p class="dlg-type">' + esc(c.type || '') + (c.sponsor ? ' · ' + esc(c.sponsor) : '') + '</p>' +
      '<h3 id="co-dialog-title">' + esc(c.name) + '</h3>' +
      '<p class="dlg-line">' + esc(c.oneLiner) + '</p>' +
      (c.about ? '<p>' + esc(c.about) + '</p>' : '') +
      (c.lookingFor ? '<p><b>Looking for:</b> ' + esc(c.lookingFor) + '</p>' : '') +
      ((c.areas || []).length ? '<p class="co-tags">' + c.areas.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</p>' : '') +
      (links ? '<p class="co-links">' + links + '</p>' : '');
    dialog.showModal();
  });
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.closest('.dlg-close')) dialog.close();
  });
})();

/* ------------------------------------------------------------------
   WORKSHOP CALENDAR (index.html)
------------------------------------------------------------------- */
(function calendar() {
  var grid = document.getElementById('cal-grid');
  var list = document.getElementById('workshop-list');
  if (!grid || !list) return;

  var title = document.getElementById('cal-title');
  var prev = document.getElementById('cal-prev');
  var next = document.getElementById('cal-next');
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var FAIR = EVENT.start.slice(0, 10);

  var items = WORKSHOPS.slice().sort(function (a, b) { return a.date.localeCompare(b.date); });
  var byDate = {};
  items.forEach(function (w, i) { w.id = 'ws-' + i; (byDate[w.date] = byDate[w.date] || []).push(w); });

  function parts(iso) { var p = iso.split('-'); return { y: +p[0], m: +p[1] - 1, d: +p[2] }; }
  function iso(y, m, d) { return y + '-' + (m < 9 ? '0' : '') + (m + 1) + '-' + (d < 10 ? '0' : '') + d; }
  function nice(isoDate) {
    var p = parts(isoDate);
    return new Date(p.y, p.m, p.d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  var first = parts(items.length ? items[0].date : FAIR);
  var last = parts(FAIR);
  var view = { y: first.y, m: first.m };

  function drawMonth() {
    title.textContent = MONTHS[view.m] + ' ' + view.y;
    var startDay = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
    var daysIn = new Date(view.y, view.m + 1, 0).getDate();
    var html = DAYS.map(function (d) { return '<span class="cal-dow" aria-hidden="true">' + d + '</span>'; }).join('');
    for (var i = 0; i < startDay; i++) html += '<span class="cal-day cal-pad" aria-hidden="true"></span>';
    for (var d = 1; d <= daysIn; d++) {
      var key = iso(view.y, view.m, d);
      var ws = byDate[key];
      if (ws) {
        html += '<button type="button" class="cal-day cal-ws" data-target="' + ws[0].id + '" aria-label="' + esc(nice(key) + ': ' + ws.map(function (w) { return w.title; }).join(', ')) + '">' + d + '</button>';
      } else if (key === FAIR) {
        html += '<a class="cal-day cal-fair" href="#top" aria-label="' + esc(nice(key)) + ': PhireD career fair">' + d + '</a>';
      } else {
        html += '<span class="cal-day">' + d + '</span>';
      }
    }
    grid.innerHTML = html;
    var vKey = view.y * 12 + view.m;
    prev.disabled = vKey <= first.y * 12 + first.m;
    next.disabled = vKey >= last.y * 12 + last.m;
  }

  list.innerHTML = items.map(function (w) {
    var btn = w.signup
      ? '<a class="btn btn-small" href="' + esc(w.signup) + '" target="_blank" rel="noopener">Sign up<span class="visually-hidden"> for ' + esc(w.title) + ' (opens in a new tab)</span></a>'
      : '<span class="ws-soon">Sign-up opens soon</span>';
    return '<li class="ws" id="' + w.id + '" tabindex="-1">' +
      '<p class="ws-when"><time datetime="' + w.date + '">' + esc(nice(w.date)) + '</time>' + (w.time ? ' · ' + esc(w.time) : '') + (w.place ? ' · ' + esc(w.place) : '') + '</p>' +
      '<h3>' + esc(w.title) + '</h3>' +
      '<p>' + esc(w.text) + '</p>' + btn + '</li>';
  }).join('');

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('.cal-ws');
    if (!b) return;
    var el = document.getElementById(b.getAttribute('data-target'));
    list.querySelectorAll('.ws-active').forEach(function (x) { x.classList.remove('ws-active'); });
    el.classList.add('ws-active');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    el.focus({ preventScroll: true });
  });
  prev.addEventListener('click', function () { view.m--; if (view.m < 0) { view.m = 11; view.y--; } drawMonth(); });
  next.addEventListener('click', function () { view.m++; if (view.m > 11) { view.m = 0; view.y++; } drawMonth(); });
  drawMonth();
})();
