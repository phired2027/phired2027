/* PhireD KTH 2027 site scripts */

/* ------------------------------------------------------------------
   EVENT DATE AND TIME (drives the countdown on the front page)
------------------------------------------------------------------- */
var EVENT = {
  start: "2027-02-02T12:00:00+01:00",
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
   - place:  room or address; leave "" until it's known
   - signup: link to the sign-up form for that workshop. Leave "" to
             show "Sign-up opens soon".
   TODO: the dates below are placeholders. Replace them with the real ones.
------------------------------------------------------------------- */
// Workshops are not confirmed yet, so the list is empty for now and the calendar shows only the fair.
// To publish them, remove the "//" in front of each entry below (and fix the dates).
var WORKSHOPS = [
  // {
  //   date: "2027-01-13", time: "17:00–18:30", place: "",
  //   title: "CV workshop",
  //   text: "Turn your thesis and publications into a CV that industry recruiters understand.",
  //   signup: ""
  // },
  // {
  //   date: "2027-01-18", time: "17:00–18:30", place: "",
  //   title: "Job seeking in Sweden for international researchers",
  //   text: "How the Swedish job market works, where jobs are posted, and what to know about permits and language.",
  //   signup: ""
  // },
  // {
  //   date: "2027-01-21", time: "17:00–18:30", place: "",
  //   title: "Panel: academia, industry or a new direction?",
  //   text: "PhDs who stayed in academia, moved to industry or changed field entirely share how they decided.",
  //   signup: ""
  // },
  // {
  //   date: "2027-01-25", time: "17:00–18:30", place: "",
  //   title: "Pitch your research",
  //   text: "Practise explaining your research in one minute, so it lands with someone from outside your field.",
  //   signup: ""
  // },
  // {
  //   date: "2027-01-28", time: "17:00–18:30", place: "",
  //   title: "Networking with confidence",
  //   text: "The psychology of networking: starting conversations, handling nerves and following up afterwards.",
  //   signup: ""
  // }
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
   COMPANY POP-UP (shared by the front-page wall and the exhibitors page)
   showCompany(list, index) opens one company; the arrows (or ← →) step
   through the same list.
------------------------------------------------------------------- */
var showCompany = (function () {
  var dialog = document.getElementById('co-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return null;
  var content = dialog.querySelector('.dlg-content');
  var list = [], at = 0;

  function block(title, text) {
    return text ? '<section class="dlg-block"><h4>' + title + '</h4><p>' + esc(text) + '</p></section>' : '';
  }
  function draw() {
    var c = list[at];
    var links = companyLinks(c);
    var logo = c.logo
      ? '<img src="' + esc(c.logo) + '" alt="">'
      : '<span class="dlg-mono">' + esc(initials(c.name)) + '</span>';
    content.innerHTML =
      '<div class="dlg-hero">' + logo + '</div>' +
      '<div class="dlg-body">' +
        '<p class="dlg-type">' + esc(c.type || '') + (c.sponsor ? ' <span class="co-badge">' + esc(c.sponsor) + '</span>' : '') + '</p>' +
        '<h3 id="co-dialog-title">' + esc(c.name) + '</h3>' +
        '<p class="dlg-line">' + esc(c.oneLiner) + '</p>' +
        ((c.areas || []).length ? '<p class="co-tags">' + c.areas.map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</p>' : '') +
        block('About', c.about) + block('At the fair', c.meet) + block('Looking for', c.lookingFor) +
        (links ? '<p class="co-links">' + links + '</p>' : '') +
      '</div>' +
      (list.length > 1 ? '<div class="dlg-nav"><button type="button" class="dlg-prev" aria-label="Previous company">←</button>' +
        '<span>' + (at + 1) + ' / ' + list.length + '</span>' +
        '<button type="button" class="dlg-next" aria-label="Next company">→</button></div>' : '');
    dialog.scrollTop = 0;
  }
  function step(d) { at = (at + d + list.length) % list.length; draw(); }

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.closest('.dlg-close')) dialog.close();
    else if (e.target.closest('.dlg-prev')) step(-1);
    else if (e.target.closest('.dlg-next')) step(1);
  });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  return function (items, index) {
    list = items; at = index;
    draw();
    if (!dialog.open) dialog.showModal();
  };
})();

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

  var shownList = [];

  function card(c, i) {
    var logo = c.logo
      ? '<img src="' + esc(c.logo) + '" alt="" loading="lazy">'
      : '<span class="co-mono tone-' + (i % 3) + '">' + esc(initials(c.name)) + '</span>';
    return '<li><button type="button" class="co-card' + (c.sponsor ? ' co-card-sponsor' : '') + '" data-i="' + i + '" aria-haspopup="dialog">' +
      '<span class="co-card-logo">' + logo + '</span>' +
      '<span class="co-card-body">' +
        '<span class="co-card-top"><span>' + esc(c.type || '') + '</span>' + (c.sponsor ? '<span class="co-badge">' + esc(c.sponsor) + '</span>' : '') + '</span>' +
        '<span class="co-name">' + esc(c.name) + '</span>' +
        '<span class="co-line">' + esc(c.oneLiner) + '</span>' +
        '<span class="co-tags">' + (c.areas || []).map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</span>' +
      '</span>' +
      '<span class="co-card-more" aria-hidden="true">Read more <b>→</b></span>' +
    '</button></li>';
  }

  list.addEventListener('click', function (e) {
    var b = e.target.closest('.co-card');
    if (b && showCompany) showCompany(shownList, +b.getAttribute('data-i'));
  });

  function render() {
    var q = search.value.trim().toLowerCase();
    var shown = companies.filter(function (c) {
      if (active && (c.areas || []).indexOf(active) < 0) return false;
      if (!q) return true;
      return [c.name, c.type, c.oneLiner, c.about, c.meet, c.lookingFor, (c.areas || []).join(' ')]
        .join(' ').toLowerCase().indexOf(q) >= 0;
    });
    shownList = shown;
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
  if (!box) return;
  var all = sortCompanies(exhibitors(2026));

  function face(o) {
    return o.logo
      ? '<img src="' + esc(o.logo) + '" alt="' + esc(o.name) + '" loading="lazy">'
      : '<span class="wm">' + esc(o.short || o.name) + '</span>';
  }
  // Copies made only to loop the ticker are hidden from screen readers and the keyboard.
  function tile(o, i, copy) {
    return '<li' + (copy ? ' aria-hidden="true"' : '') + '><button type="button" data-i="' + i + '" aria-haspopup="dialog"' +
      (copy ? ' tabindex="-1"' : '') + ' title="' + esc(o.name) + '">' + face(o) + '</button></li>';
  }
  var sponsors = [], rows = [[], []];
  all.forEach(function (o, i) {
    if (o.sponsor) {
      sponsors.push('<li><button type="button" data-i="' + i + '" aria-haspopup="dialog">' +
        '<span class="sp-logo">' + face(o) + '</span><em>' + esc(o.sponsor) + '</em></button></li>');
    } else {
      rows[rows[0].length <= rows[1].length ? 0 : 1].push(i);
    }
  });
  var tickers = rows.map(function (row, r) {
    var once = row.map(function (i) { return tile(all[i], i, false); }).join('');
    var copy = row.map(function (i) { return tile(all[i], i, true); }).join('');
    return '<div class="ticker' + (r ? ' ticker-rev' : '') + '"><ul class="ticker-track" aria-label="' + (r ? 'More exhibitors' : 'Exhibitors') + '">' + once + copy + '</ul></div>';
  }).join('');
  box.innerHTML = (sponsors.length ? '<ul class="wall-sponsors" aria-label="Sponsors">' + sponsors.join('') + '</ul>' : '') + tickers;

  box.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-i]');
    if (btn && showCompany) showCompany(all, +btn.getAttribute('data-i'));
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
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var FAIR = EVENT.start.slice(0, 10);
  var DAY = 86400000;

  var items = WORKSHOPS.slice().sort(function (a, b) { return a.date.localeCompare(b.date); });
  var byDate = {};
  // Each workshop gets an accent colour (ac0-ac4 in style.css), shared by its calendar day and its card.
  items.forEach(function (w, i) { w.id = 'ws-' + i; w.ac = 'ac' + (i % 5); (byDate[w.date] = byDate[w.date] || []).push(w); });

  function toDate(isoDate) { var p = isoDate.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(dt) { return dt.toISOString().slice(0, 10); }
  function nice(isoDate) {
    return toDate(isoDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  }
  function monday(dt) { return new Date(dt - ((dt.getUTCDay() + 6) % 7) * DAY); }

  // From the week of the first workshop to the week of the fair. Each month gets its own
  // heading row, and its days start in the right weekday column, so every month looks the same.
  function draw() {
    var fair = toDate(FAIR);
    var monthStart = new Date(Date.UTC(fair.getUTCFullYear(), fair.getUTCMonth(), 1));
    var monthEnd = new Date(Date.UTC(fair.getUTCFullYear(), fair.getUTCMonth() + 1, 0));
    var from = items.length ? monday(toDate(items[0].date)) : monthStart;
    var to = items.length ? new Date(monday(fair).getTime() + 6 * DAY) : monthEnd;
    var m1 = from.getUTCMonth(), m2 = to.getUTCMonth();
    var multi = m1 !== m2; // month labels only when the calendar spans more than one month
    title.textContent = MONTHS[m1] + (m1 !== m2 ? ' – ' + MONTHS[m2] : '') + ' ' + to.getUTCFullYear();

    var html = DAYS.map(function (d) { return '<span class="cal-dow" aria-hidden="true">' + d + '</span>'; }).join('');
    var month = -1;
    for (var dt = from; dt <= to; dt = new Date(dt.getTime() + DAY)) {
      var key = iso(dt);
      var d = dt.getUTCDate();
      var col = (dt.getUTCDay() + 6) % 7;
      if (dt.getUTCMonth() !== month) {
        // close the previous month's last row, then start the new month on its own row
        if (month !== -1 && col > 0) for (var p = col; p < 7; p++) html += '<span class="cal-day cal-pad" aria-hidden="true"></span>';
        month = dt.getUTCMonth();
        if (multi) html += '<span class="cal-month">' + MONTHS[month] + '</span>';
        for (var q = 0; q < col; q++) html += '<span class="cal-day cal-pad" aria-hidden="true"></span>';
      }
      var ws = byDate[key];
      if (ws) {
        html += '<button type="button" class="cal-day cal-ws ' + ws[0].ac + '" data-target="' + ws[0].id + '" aria-label="' + esc(nice(key) + ': ' + ws.map(function (w) { return w.title; }).join(', ')) + '">' + d + '</button>';
      } else if (key === FAIR) {
        html += '<button type="button" class="cal-day cal-fair" data-target="ws-fair" aria-label="' + esc(nice(key)) + ': PhireD career fair">' + d + '</button>';
      } else {
        html += '<span class="cal-day">' + d + '</span>';
      }
    }
    grid.innerHTML = html;
  }

  var fairItem = '<li class="ws ws-fair" id="ws-fair" tabindex="-1"><p class="ws-when"><time datetime="' + FAIR + '">' + esc(nice(FAIR)) + '</time> · 12:00–15:00 · Nymble, KTH Campus</p>' +
    '<div class="ws-head"><h3>PhireD career fair</h3><a class="ws-btn ws-btn-fair" href="#register-now">Register</a></div>' +
    '<p>The main event: meet the exhibitors.</p></li>';

  list.innerHTML = items.map(function (w) {
    var btn = w.signup
      ? '<a class="ws-btn" href="' + esc(w.signup) + '" target="_blank" rel="noopener">Sign up<span class="visually-hidden"> for ' + esc(w.title) + ' (opens in a new tab)</span></a>'
      : '<span class="ws-btn ws-soon">Sign-up soon</span>';
    return '<li class="ws ' + w.ac + '" id="' + w.id + '" tabindex="-1">' +
      '<p class="ws-when"><time datetime="' + w.date + '">' + esc(nice(w.date)) + '</time>' + (w.time ? ' · ' + esc(w.time) : '') + (w.place ? ' · ' + esc(w.place) : '') + '</p>' +
      '<div class="ws-head"><h3>' + esc(w.title) + '</h3>' + btn + '</div>' +
      '<p>' + esc(w.text) + '</p></li>';
  }).join('') + fairItem +
    (items.length ? '' : '<li class="ws-note">Workshops and other events will be published here once they are confirmed.</li>');

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-target]');
    if (!b) return;
    var el = document.getElementById(b.getAttribute('data-target'));
    list.querySelectorAll('.ws-active').forEach(function (x) { x.classList.remove('ws-active'); });
    el.classList.add('ws-active');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    el.focus({ preventScroll: true });
  });
  draw();

  // Hovering (or focusing) a card makes its calendar day pop, and the other way round.
  function link(id, on) {
    var day = grid.querySelector('[data-target="' + id + '"]');
    var card = document.getElementById(id);
    if (day) day.classList.toggle('cal-pop', on);
    if (card) card.classList.toggle('ws-hl', on);
  }
  [['mouseover', true], ['mouseout', false], ['focusin', true], ['focusout', false]].forEach(function (ev) {
    list.addEventListener(ev[0], function (e) {
      var card = e.target.closest('.ws');
      if (card && !(ev[1] === false && card.contains(e.relatedTarget))) link(card.id, ev[1]);
    });
    grid.addEventListener(ev[0], function (e) {
      var day = e.target.closest('[data-target]');
      if (day && !(ev[1] === false && day.contains(e.relatedTarget))) link(day.getAttribute('data-target'), ev[1]);
    });
  });
})();

/* ------------------------------------------------------------------
   COMMITTEE (footer): shuffle the order on every page load,
   so nobody is always first or last.
------------------------------------------------------------------- */
(function shuffleTeam() {
  var ul = document.getElementById('footer-team');
  if (!ul) return;
  var items = Array.prototype.slice.call(ul.children);
  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = items[i]; items[i] = items[j]; items[j] = t;
  }
  items.forEach(function (li) { ul.appendChild(li); });
})();

/* ------------------------------------------------------------------
   BRIDGE (index.html): draws in when scrolled into view; hovering a
   card lights its point on the bridge, clicking a point lights its card.
------------------------------------------------------------------- */
(function bridge() {
  var fig = document.getElementById('bridge-fig');
  if (!fig) return;
  var section = fig.closest('section');
  var svg = fig.querySelector('svg');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (still) {
    if (svg.pauseAnimations) svg.pauseAnimations();
    section.classList.add('b-still');
  } else if ('IntersectionObserver' in window) {
    section.classList.add('b-anim');
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { section.classList.add('b-in'); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(fig);
  }

  function light(key, on) {
    section.querySelectorAll('[data-key="' + key + '"]').forEach(function (el) { el.classList.toggle('is-on', on); });
  }
  section.querySelectorAll('.b-card, .b-node').forEach(function (el) {
    var key = el.getAttribute('data-key');
    el.addEventListener('mouseenter', function () { light(key, true); });
    el.addEventListener('mouseleave', function () { light(key, false); });
    el.addEventListener('focusin', function () { light(key, true); });
    el.addEventListener('focusout', function () { light(key, false); });
  });
  section.querySelectorAll('.b-node').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var key = a.getAttribute('data-key');
      var card = document.getElementById('bridge-' + key);
      light(key, true);
      card.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'nearest' });
      setTimeout(function () { light(key, false); }, 1600);
    });
  });
})();
