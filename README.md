# PhireD KTH 2027

Event website, served at https://phired.se via GitHub Pages.

| File | What it is |
|---|---|
| `index.html` | Front page |
| `companies.html` | Exhibitors page with 2027 / 2026 tabs (reads `data/companies.js`) |
| `exhibit.html` | For companies: packages, add-ons and contact (from the 2027 catalog) |
| `privacy.html` | How sign-up emails are used. Fill in the `[bracketed]` parts before sign-up opens |
| `data/companies.js` | Exhibitor profiles. Copy a block to add one |
| `js/site.js` | Event time, registration link, workshops and sign-up settings at the top; page code below |
| `style/style.css` | Styles |
| `fonts/` | Self-hosted fonts (Bricolage Grotesque, Instrument Sans; SIL Open Font License) |
| `images/brand/` | PhireD and PhD Chapter logos, emblem, favicon, link-preview image (`og.jpg`). `originals/` holds the source files |
| `images/photos/2026/` | Photos from PhireD 2026 |
| `images/exhibitors/` | Exhibitor logos used by the site. `originals/` holds the files as received |
| `CNAME` | Custom domain for GitHub Pages. Keep this file |

## Quick edits

- **Event date / countdown:** top of `js/site.js` (`EVENT.start`, `EVENT.end`). The date, time and venue in the hero, FAQ and footer are plain text in the HTML files.
- **Registration:** paste the KTH registration form link into `REGISTRATION_URL` at the top of `js/site.js`. Until then the Register buttons say "Registration opens soon".
- **Workshops calendar:** the `WORKSHOPS` list at the top of `js/site.js`. Each has a date, time, place, title, text and a `signup` link. The dates there now are placeholders.
- **Organising committee:** the "Organising committee" section at the end of `index.html` (front page only). The order is shuffled on every page load.
- **Photos:** `images/photos/2026/`. Landscape, about 1600px wide, under 400 KB each. `images/brand/og.jpg` (1200x630) is the link preview image.
- **Exhibitors:** `data/companies.js` has one list per year. `PHIRED_EXHIBITORS[2027]` fills the 2027 tab (empty shows "coming soon"); `PHIRED_EXHIBITORS[2026]` fills the 2026 tab and the front-page wall.

- **After changing CSS or JS:** bump the `?v=...` number on the `style.css`, `site.js` and `companies.js` links in the HTML files, so browsers fetch the new version instead of an old cached one.

Search the files for `TODO` to find placeholders that still need real content.

## Adding an exhibitor

1. Open `data/companies.js` and copy one `{ ... }` block into the right year's list (including the comma between blocks).
2. Fill in the fields; leave any text as `""` to hide it. Use `sponsor: "Silver sponsor"` etc. for sponsors.
3. Optional logo: put it in `images/exhibitors/` and set `logo: "images/exhibitors/name.svg"`. Without it, the name is shown. SVG or a wide PNG on a transparent background works best, trimmed to the logo with no extra margin. Keep the file you received in `images/exhibitors/originals/`.

## Connecting the reminder sign-up to a Google Form

People who register through the KTH form are already on your reminder list: export the emails from the KTH form's responses. The small "Get a reminder" form on the front page is for people who aren't ready to register yet. It sends emails into a Google Form, and the answers land in a Google Sheet you can use for reminders and the feedback-form email.

1. Create a Google Form with two **Short answer** questions: `Email` and `Role`.
   (Turn off "Collect email addresses" in the form settings; the site sends the email as an ordinary answer.)
2. In the form, open the ⋮ menu → **Get pre-filled link**. Type `test@test.se` and `test`, then click **Get link** and copy it.
3. The link looks like
   `https://docs.google.com/forms/d/e/1FAIpQL.../viewform?usp=pp_url&entry.123456789=test@test.se&entry.987654321=test`
4. In `js/site.js`, at the top, set:
   - `action` to the first part with `viewform` changed to `formResponse`:
     `https://docs.google.com/forms/d/e/1FAIpQL.../formResponse`
   - `email` to the first `entry.` number (`entry.123456789`)
   - `role` to the second (`entry.987654321`)
5. Commit, push, and try the form on phired.se. A new row should appear under **Responses** in the Google Form.
6. In **Responses**, click **Link to Sheets** to get a spreadsheet of all sign-ups.

For the reminder and the after-event feedback, send one email to the list with BCC, or use a mail-merge add-on in Google Sheets. Make the feedback form a separate Google Form.
