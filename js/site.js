/* PhireD KTH 2027 site scripts */

/* ------------------------------------------------------------------
   EVENT DATE (drives the countdown on the front page)
------------------------------------------------------------------- */
var EVENT = {
  start: "2027-02-02T12:00:00+01:00", // date confirmed; 12:00 is last year's opening time
  timeConfirmed: false,               // set to true when the 2027 opening time is official
  place: "Nymble, KTH Campus"
};

/* ------------------------------------------------------------------
   EMAIL SIGN-UP SETTINGS
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
        msg.textContent = 'You’re on the list. We’ll email you the date and a reminder before the fair.';
      })
      .catch(function () {
        msg.textContent = 'That didn’t go through. Check your connection and try again.';
      })
      .then(function () { button.disabled = false; });
  });
})();

/* ------------------------------------------------------------------
   COMPANY DIRECTORY (companies.html)
------------------------------------------------------------------- */
(function directory() {
  var list = document.getElementById('company-list');
  if (!list || !window.PHIRED_COMPANIES) return;

  var companies = sortCompanies(window.PHIRED_COMPANIES);
  var search = document.getElementById('company-search');
  var filterBox = document.getElementById('area-filters');
  var count = document.getElementById('company-count');
  var active = null;

  // Filter buttons from all areas
  var areas = [];
  companies.forEach(function (c) {
    (c.areas || []).forEach(function (a) { if (areas.indexOf(a) < 0) areas.push(a); });
  });
  areas.sort(function (a, b) { return a.localeCompare(b); });
  filterBox.innerHTML = ['All'].concat(areas).map(function (a, i) {
    return '<button type="button" class="filter" aria-pressed="' + (i === 0) + '" data-area="' + (i === 0 ? '' : esc(a)) + '">' + esc(a) + '</button>';
  }).join('');

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
    var links = [
      ['Website', c.links && c.links.website],
      ['LinkedIn', c.links && c.links.linkedin],
      ['Careers', c.links && c.links.careers]
    ].filter(function (l) { return l[1]; }).map(function (l) {
      return '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + l[0] + '<span class="visually-hidden"> for ' + esc(c.name) + ' (opens in a new tab)</span></a>';
    }).join('');
    var body = section('About', c.about) + section('At the fair', c.meet) + section('Looking for', c.lookingFor) +
      (links ? '<div class="co-links">' + links + '</div>' : '');

    return '' +
      '<li><details class="co">' +
        '<summary>' + logo +
          '<span class="co-head">' +
            '<span class="co-name">' + esc(c.name) +
              (c.sponsor ? ' <span class="co-badge">' + esc(c.sponsor) + '</span>' : '') +
              (c.example ? ' <span class="co-example">Example</span>' : '') + '</span>' +
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
    count.textContent = shown.length === companies.length
      ? companies.length + ' organisations'
      : shown.length + ' of ' + companies.length + ' organisations';
    document.getElementById('no-results').hidden = shown.length > 0;
  }

  document.getElementById('clear-filters').addEventListener('click', function () {
    search.value = '';
    filterBox.querySelector('.filter').click();
  });

  render();
})();

/* ------------------------------------------------------------------
   COUNTDOWN (index.html)
------------------------------------------------------------------- */
(function countdown() {
  var box = document.getElementById('countdown');
  if (!box) return;
  var start = new Date(EVENT.start);
  var dateText = start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var label = document.getElementById('event-date-label');
  var note = document.getElementById('countdown-note');
  var sr = document.getElementById('countdown-sr');
  label.textContent = dateText + ', ' + EVENT.place;
  note.textContent = EVENT.timeConfirmed
    ? 'Until doors open at ' + start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' on ' + dateText + '.'
    : 'Until ' + dateText + '. Opening time to be confirmed.';

  var els = {};
  box.querySelectorAll('.cd-num').forEach(function (el) { els[el.getAttribute('data-unit')] = el; });
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var ms = start - new Date();
    if (ms <= 0) {
      box.classList.add('cd-done');
      var ended = ms < -8 * 3600 * 1000;
      note.textContent = ended ? 'PhireD KTH 2027 has taken place. Thank you for coming!' : 'PhireD KTH 2027 is happening now. Welcome!';
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
   EXHIBITOR WALL (index.html and companies.html)
------------------------------------------------------------------- */
(function wall() {
  var box = document.getElementById('exhibitor-wall');
  if (!box || !window.PHIRED_COMPANIES) return;
  function tile(o) {
    var url = o.links && (o.links.linkedin || o.links.website);
    var inner = o.logo ? '<img src="' + esc(o.logo) + '" alt="' + esc(o.name) + '">' : '<span>' + esc(o.name) + '</span>';
    if (o.sponsor) inner += '<em>' + esc(o.sponsor) + '</em>';
    return '<li>' + (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + inner + '</a>' : '<div>' + inner + '</div>') + '</li>';
  }
  var all = sortCompanies(window.PHIRED_COMPANIES);
  var sponsors = all.filter(function (o) { return o.sponsor; });
  var others = all.filter(function (o) { return !o.sponsor; });
  box.innerHTML = (sponsors.length ? '<ul class="wall-sponsors" aria-label="Sponsors">' + sponsors.map(tile).join('') + '</ul>' : '') +
    '<ul aria-label="Exhibitors">' + others.map(tile).join('') + '</ul>';
})();
