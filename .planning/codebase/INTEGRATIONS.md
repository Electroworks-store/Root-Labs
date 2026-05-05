# External Integrations

**Analysis Date:** 2026-05-05

## APIs & External Services

**Email Submission:**
- Contact form submission endpoint - `POST /api/lead`
  - Backend: `server.js` lines 116-319
  - Frontend handler: `src/App.jsx` lines 2180-2240 (form submission logic)
  - Endpoint validates and forwards lead data to email

**Font Services:**
- Google Fonts - Web font CDT
  - Integrated in `index.html` with multiple font families:
    - Playfair Display, Space Grotesk, Space Mono, Inter, Caveat, JetBrains Mono, Cormorant Garamond
  - Preconnect optimization via `<link rel="preconnect">`
- Bunny Fonts - Privacy-focused font CDN
  - Family: Larken (400, 500 weights) - imported in `index.html`

## Data Storage

**Databases:**
- None - stateless application

**File Storage:**
- Local filesystem only - images stored in `/img/` directory
- Static assets served from `public/` directory

**Caching:**
- Browser cache (via Vite build output)
- No server-side caching detected

## Authentication & Identity

**Auth Provider:**
- None - public website, no user authentication
- Contact form uses email validation only (`src/App.jsx` lines 2195-2198)
- Backend email validation: `server.js` lines 88-92, 174-180

## Email Integration (Primary External Service)

**Service:**
- SMTP email via configurable SMTP server
- Supports Gmail, SendGrid, Mailgun, or any SMTP provider

**Implementation:**
- Backend: `server.js` uses `nodemailer` (lines 4, 94-113)
- SMTP configuration: `server.js` lines 95-103
  - `process.env.SMTP_HOST` - SMTP server hostname
  - `process.env.SMTP_PORT` - SMTP port (default 587)
  - `process.env.SMTP_SECURE` - TLS flag (true for 465, false for 587)
  - `process.env.SMTP_USER` - Login username
  - `process.env.SMTP_PASS` - Login password

**Email Configuration:**
- Sender: `process.env.FROM_EMAIL` - "Root Labs Contact Form" identity
- Recipient: `process.env.TO_EMAIL` - Contact form submissions received here
- Reply-To: User's email address from form
- Subject format: `"New Lead: {Name} - {Services}"`

**Email Content:**
- Plain text version: `server.js` lines 195-228
- HTML version with styling: `server.js` lines 238-291
- Contains: name, email, services, budget, timeline, contact preference, pricing call interest, user message
- Timestamp in America/New_York timezone

## Monitoring & Observability

**Error Tracking:**
- None - console logging only (`server.js` lines 305-316)

**Logs:**
- Server startup logging: `server.js` lines 328-338
- Lead submission logging: `server.js` line 305
- SMTP verification logging: `server.js` lines 106-113
- Rate limiting warnings: `server.js` line 131
- Bot detection warnings: `server.js` line 131

## CI/CD & Deployment

**Hosting:**
- Frontend: GitHub Pages (configured in `.github/workflows/jekyll-gh-pages.yml`)
  - Triggered on push to `main` branch
  - Build output: `dist/` directory
  - Node.js 18 used for build

**CI Pipeline:**
- GitHub Actions (`.github/workflows/jekyll-gh-pages.yml`)
  - Checkout code
  - Setup Node.js 18
  - npm ci (clean install)
  - npm run build (Vite build)
  - Upload to GitHub Pages artifact
  - Deploy to GitHub Pages

**Backend Deployment:**
- Not included in GitHub Actions (separate deployment)
- Expects to run on own Node.js server or hosting platform
- Contact form posts to `/api/lead` endpoint

## Environment Configuration

**Required env vars (from `.env.example`):**
- `SMTP_HOST=smtp.gmail.com` (or custom SMTP provider)
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=your-email@gmail.com`
- `SMTP_PASS=your-app-password`
- `FROM_EMAIL=your-email@gmail.com`
- `TO_EMAIL=edwardsadrianj@gmail.com` (contact form destination)
- `PORT=3000` (optional, defaults to 3000)
- `CORS_ORIGIN=*` (CORS whitelist, defaults to all in dev, restricted in prod)
- `NODE_ENV` (development/production, defaults to development)

**Secrets location:**
- Stored in `.env` file (local development)
- GitHub Secrets should be used for Actions (if deploying backend via Actions)
- Environment variables passed to Node.js process at runtime

## Security Features

**Rate Limiting:**
- Implemented in `server.js` lines 47-86
- Limit: 5 requests per 10 minutes per IP address
- In-memory store with periodic cleanup
- Response: 429 Too Many Requests

**Honeypot Protection:**
- `website_url_hp` field in form (`server.js` line 130)
- Blocks bot submissions automatically
- Field should be hidden with CSS in form

**Input Validation:**
- Email format validation: `server.js` lines 88-92
- Required fields: name, email, message
- Field length limits:
  - name: 1-120 characters
  - email: 5-254 characters
  - message: 1-5000 characters
  - budget: max 100 characters
  - timeline: max 100 characters
  - contactMethod: max 100 characters
- File attachment blocking: `server.js` lines 139-144
- HTML escaping for email content: `server.js` lines 37-45

**CORS Protection:**
- Configurable origin whitelist: `server.js` lines 17-34
- Production: Only allows specified `CORS_ORIGIN` origins
- Development: Allows no-origin requests

**HTTPS Headers:**
- Helmet middleware: `server.js` line 11
- Provides security headers (CSP, X-Frame-Options, etc.)

## Webhooks & Callbacks

**Incoming:**
- POST `/api/lead` - Contact form submission endpoint (`server.js` line 116)
  - Expected payload: name, email, message, services[], budget, timeline, contactMethod, pricingCall
  - Validation: `server.js` lines 147-180
  - Response: JSON with ok/error status

**Outgoing:**
- Email notifications to `TO_EMAIL` on form submission
- No external webhooks detected

## Health & Status

**Health Check Endpoint:**
- GET `/health` - `server.js` lines 322-324
- Returns: `{ status: 'ok', timestamp: ISO string }`
- Used to verify server is running

---

*Integration audit: 2026-05-05*
