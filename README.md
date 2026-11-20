# E-invoice status dashboard

A simple dashboard for a finance manager. It shows which e-invoices are done, which are in progress, and which need action.

It is plain HTML, CSS and JavaScript. There is no build step and nothing to install.

## Files

- `index.html`: the page layout.
- `styles.css`: colours, spacing and the background.
- `data.js`: settings (company name, ASP name) and sample invoices.
- `app.js`: the filters, search, "See next step" links and buttons.

## See it in GitHub Codespaces

Run this in the terminal:

```bash
python3 -m http.server 3000
```

Open the **Ports** tab, find port 3000, and click the globe icon to open it in your browser.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, and import the repository.
3. Set **Framework Preset** to **Other**. Leave the build and output settings empty.
4. Click **Deploy**.

Every new push to the main branch deploys again.

## Common changes

- Change the company or ASP name: edit `DASHBOARD_CONFIG` in `data.js`.
- See the failed-run alert: set `showFailedRunAlert` to `true` in `data.js`.
- Use real data: replace `SAMPLE_INVOICES` in `data.js` with data from your middleware API.
