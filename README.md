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

## Backend integration

The React app calls the Spring Boot API gateway at `http://localhost:8079/api` by default. Override it for another environment with `VITE_API_BASE_URL`, for example:

```bash
VITE_API_BASE_URL=https://api.example.com/api npm run dev
```

Start the backend services in this order: service registry, API gateway, auth service, food service, request service, payment service, and user service. The gateway routes `/api/auth`, `/api/foods`, `/api/requests`, `/api/payments`, and `/api/users` to those services. Auth registration and login now submit to the backend; the backend persists account data in its configured MySQL database (`foodshare_auth_db`). Food, request, and payment API helpers are available for dashboard flows and persist through their corresponding service databases.

The MySQL databases must exist and the credentials in each backend service's `application.properties` must be configured before submitting data. Do not use the default empty database password outside local development.

### Notes
- All original HTML pages are represented as React-rendered page content.
- Existing CSS is included in `src/styles.css`.
- Original assets are in `public/assets`.
- Existing FoodShare demo JavaScript/localStorage behavior remains available only for legacy pages that have not yet been migrated.
- Login and signup are React forms backed by the Spring Boot auth service.
- The API demo page (`/api-demo`) verifies live food records through the gateway.
