# FoodShare — React.js Frontend

FoodShare is a Vite + React frontend for the donor, NGO, volunteer, and admin workflows.

## Run

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run check
npm run preview
```

## Deployment

The project needs Node.js 20.19 or later. `vercel.json` includes SPA fallback, immutable caching for static assets, and baseline browser security headers for Vercel deployments. For another host, configure an equivalent rewrite so requests such as `/about.html` return `index.html`.

## Important production integration

The supplied workflow remains a local demo: its users, passwords, sessions, donations, and reset tokens are stored in browser `localStorage`. It must not be used with real user accounts or food operations until these flows are replaced by authenticated backend APIs (with server-side authorization, secure httpOnly sessions, password hashing, email-based reset tokens, and validation). No backend contract was present in this repository, so this frontend does not invent one.

### Notes
- All original HTML pages are represented as React-rendered page content.
- Existing CSS is included in `src/styles.css`.
- Original assets are in `public/assets`.
- Existing FoodShare demo JavaScript/localStorage behavior is preserved and runs after React mounts.
- The existing demo accounts/data are kept as provided by the original project.
- This is a compatibility-first conversion: the UI is React-rendered while the original DOM logic remains available. The deployment safeguards added here make the static frontend more robust, but API integration remains the release gate for a real application.
