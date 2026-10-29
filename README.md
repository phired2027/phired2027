# PhireD KTH 2027

Event website, served at https://phired.se via GitHub Pages.

| File | What it is |
|---|---|
| `index.html` | Front page |
| `companies.html` | Company directory (reads `data/companies.js`) |
| `privacy.html` | How sign-up emails are used. Fill in the `[bracketed]` parts before sign-up opens |
| `data/companies.js` | Company profiles. Copy a block to add a company |
| `js/site.js` | Sign-up form and directory code. The sign-up settings are at the top |
| `style/style.css` | Styles |
| `images/` | Favicon, logos (put company logos in `images/companies/`) |
| `CNAME` | Custom domain for GitHub Pages. Keep this file |

## Quick edits

- **Event date / countdown:** top of `js/site.js` (`EVENT.start`). Set `confirmed: true` when the date is official.
- **2026 photos:** save them as `images/2026/fair-floor.jpg`, `booth.jpg`, `workshop.jpg`, `funding.jpg`, `team.jpg`. They replace the placeholders automatically. Landscape, about 1600px wide, under 400 KB each.
- **2026 exhibitor wall:** `PHIRED_2026` list at the bottom of `data/companies.js`. Add `logo: "images/logos/name.svg"` to show a logo instead of the name.

Search the files for `TODO` to find placeholders that still need real content.

## Adding a company

1. Open `data/companies.js` and copy one `{ ... }` block (including the comma between blocks).
2. Fill in the fields. Delete `example: true` for real companies.
3. Put the logo in `images/companies/` and set `logo: "images/companies/name.svg"`, or leave `""` to show initials.
4. When all example companies are gone, remove the yellow note near the top of `companies.html`.

## Connecting the email sign-up to a Google Form

The form on the front page sends emails into a Google Form, and the answers land in a Google Sheet you can use for reminders and the feedback-form email.

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
