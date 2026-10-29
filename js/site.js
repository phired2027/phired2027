/* PhireD KTH 2027 site scripts */

/* ------------------------------------------------------------------
   EVENT DATE (drives the countdown on the front page)
   Set "confirmed" to true once the date is official.
------------------------------------------------------------------- */
var EVENT = {
  start: "2027-03-18T10:00:00+01:00", // PROVISIONAL – replace with the real date and time
  confirmed: false,
  place: "KTH Campus, Stockholm"
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

  var companies = window.PHIRED_COMPANIES.slice().sort(function (a, b) {
    return a.name.localeCompare(b.name, 'sv');
  });
  var search = document.getElementById('company-search');
  var filterBox = document.getElementById('area-filters');
  var count = document.getElementById('company-count');
  var active = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  }

  // Filter buttons from all research areas
  var areas = [];
  companies.forEach(function (c) {
    (c.areas || []).forEach(function (a) { if (areas.indexOf(a) < 0) areas.push(a); });
  });
  areas.sort(function (a, b) { return a.localeCompare(b); });
  filterBox.innerHTML = ['All areas'].concat(areas).map(function (a, i) {
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

  function card(c, i) {
    var logo = c.logo
      ? '<img class="co-logo" src="' + esc(c.logo) + '" alt="">'
      : '<span class="co-logo co-mono tone-' + (i % 3) + '" aria-hidden="true">' + esc(initials(c.name)) + '</span>';
    var links = [
      ['Website', c.links && c.links.website],
      ['Careers', c.links && c.links.careers],
      ['LinkedIn', c.links && c.links.linkedin]
    ].filter(function (l) { return l[1]; }).map(function (l) {
      return '<a href="' + esc(l[1]) + '" target="_blank" rel="noopener">' + l[0] + '</a>';
    }).join('');

    return '' +
      '<li><details class="co">' +
        '<summary>' + logo +
          '<span class="co-head">' +
            '<span class="co-name">' + esc(c.name) + (c.example ? ' <span class="co-example">Example</span>' : '') + '</span>' +
            '<span class="co-line">' + esc(c.oneLiner) + '</span>' +
            '<span class="co-tags">' + (c.areas || []).map(function (a) { return '<span>' + esc(a) + '</span>'; }).join('') + '</span>' +
          '</span>' +
          '<span class="co-meta">' + (c.booth ? '<span>Booth ' + esc(c.booth) + '</span>' : '') + (c.location ? '<span>' + esc(c.location) + '</span>' : '') + '</span>' +
        '</summary>' +
        '<div class="co-body">' +
          '<div><h3>Research</h3><p>' + esc(c.about) + '</p></div>' +
          '<div><h3>At the fair</h3><p>' + esc(c.teams) + '</p></div>' +
          '<div><h3>Looking for</h3><p>' + esc(c.lookingFor) + '</p></div>' +
          (c.positions && c.positions.length ? '<div><h3>Typical roles</h3><ul>' + c.positions.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>' : '') +
          (links ? '<div class="co-links">' + links + '</div>' : '') +
        '</div>' +
      '</details></li>';
  }

  function render() {
    var q = search.value.trim().toLowerCase();
    var shown = companies.filter(function (c) {
      if (active && (c.areas || []).indexOf(active) < 0) return false;
      if (!q) return true;
      return [c.name, c.oneLiner, c.about, c.lookingFor, (c.areas || []).join(' '), (c.positions || []).join(' ')]
        .join(' ').toLowerCase().indexOf(q) >= 0;
    });
    list.innerHTML = shown.map(card).join('');
    count.textContent = shown.length === companies.length
      ? companies.length + ' companies'
      : shown.length + ' of ' + companies.length + ' companies';
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
  label.textContent = (EVENT.confirmed ? dateText : 'Spring 2027') + ', ' + EVENT.place;
  note.textContent = EVENT.confirmed
    ? 'Until doors open on ' + dateText + ' at ' + start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + '.'
    : 'Counting down to the provisional date, ' + dateText + '. Final date coming soon.';

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
   2026 EXHIBITOR WALL (index.html and companies.html)
------------------------------------------------------------------- */
(function wall() {
  var box = document.getElementById('wall-2026');
  if (!box || !window.PHIRED_2026) return;
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var list = window.PHIRED_2026.slice().sort(function (a, b) {
    if ((a.type === 'sponsor') !== (b.type === 'sponsor')) return a.type === 'sponsor' ? -1 : 1;
    return a.name.localeCompare(b.name, 'sv');
  });
  box.innerHTML = '<ul>' + list.map(function (o) {
    var inner = o.logo ? '<img src="' + esc(o.logo) + '" alt="' + esc(o.name) + '">' : '<span>' + esc(o.name) + '</span>';
    if (o.type === 'sponsor') inner += '<em>Sponsor</em>';
    var cls = o.type === 'sponsor' ? ' class="is-sponsor"' : '';
    return '<li' + cls + '>' + (o.url ? '<a href="' + esc(o.url) + '" target="_blank" rel="noopener">' + inner + '</a>' : '<div>' + inner + '</div>') + '</li>';
  }).join('') + '</ul>';
})();
