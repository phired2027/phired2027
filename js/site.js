/* PhiRED 2027 site scripts */

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
