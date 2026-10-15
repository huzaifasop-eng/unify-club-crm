// Unify Club — single place to point this website at your live API.
//
// Once the CRM/API (apps/api in this repo) is deployed — see the repo root
// DEPLOY.md — set this to that deployment's base URL with /api/v1 appended,
// e.g. "https://unify-api-production.up.railway.app/api/v1".
//
// Until this is set to a real URL, the Book a Trial / Contact / Volunteer
// forms will show a clear "not connected yet" message instead of silently
// pretending to succeed — see website/docs/SECURITY.md §8.
window.UNIFY_API_BASE_URL = '';
