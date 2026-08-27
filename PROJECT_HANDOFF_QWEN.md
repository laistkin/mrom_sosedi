# MROM Sosedi Project Handoff

## Project Goal

Prototype donation website for the local Islamic center "МРОМ Соседи".

The project is currently a clickable local prototype, but its structure is prepared for a future working architecture with database, YooKassa payments, donor accounts, admin management, reports, and legal/contact content.

Important: current implementation uses browser `localStorage` for demo persistence. There is no real backend, no real auth, no real YooKassa integration yet.

## Tech Stack

- Framework/runtime: Vinext / Next-style App Router
- React: 19
- Styling: Tailwind CSS classes in JSX + `app/globals.css`
- Package manager: npm
- Dev command:

```bash
npm run dev -- --hostname 127.0.0.1
```

- Local URL:

```text
http://127.0.0.1:3000/
```

Use `127.0.0.1`, not plain `localhost`, because the dev server previously bound incorrectly to IPv6 when started without `--hostname 127.0.0.1`.

## Main Routes

- `/` - homepage with header, hero, campaign feed, navigation cards.
- `/campaigns/[id]` - campaign detail page with photo, needed/collected amounts, progress, description, documents, related reports, and donation form.
- `/account` - donor account prototype.
- `/admin` - admin panel prototype.
- `/about` - organization info, contacts, legal data, requisites.
- `/reports` - public report posts with images, dates, expenses, text, and documents.

## Demo Credentials And Codes

Admin panel:

```text
URL: /admin
Password: sosedi2026
```

Donor account:

```text
URL: /account
SMS demo code: 1234
```

## Current Completed Stages

1. Stage 1: Project scaffold, modern black/white design direction, soft green accent, header, SVG logo placeholder, homepage, campaign feed demo data.
2. Stage 2: Campaign cards and detail pages. Cards link to individual campaign pages. Share button copies/opens a campaign link.
3. Stage 3: Donation form with name, anonymous donation, amount, quick amounts, one-time donation, disabled future recurring donation, bank card, SBP, consent checkbox, YooKassa demo payment stub.
4. Stage 4: Donor account prototype with phone login, SMS code placeholder, profile, total donated, and donation history from localStorage.
5. Stage 5: Admin panel with password placeholder, campaign create/edit, status active/completed/hidden, manual amounts, photo URL, text fields, campaign reports, duplicate, reset demo data, and delete campaign.
6. Stage 6: Public About and Reports pages, plus admin editing for About content and general report posts.

## Important Files

```text
app/page.tsx
Homepage.

app/layout.tsx
Root layout and metadata.

app/globals.css
Global styles.

app/data/campaigns.ts
Base campaign data and Campaign type.

app/components/SiteHeader.tsx
Shared header/navigation.

app/components/CampaignList.tsx
Client-side campaign feed. Reads admin demo changes from localStorage.

app/components/CampaignDetail.tsx
Client-side campaign detail. Can display campaigns created through admin localStorage.

app/components/DonationForm.tsx
Donation form and demo payment flow.

app/components/ShareButton.tsx
Campaign share button.

app/lib/payments/yookassa-demo.ts
YooKassa demo payment adapter. Replace this later with real YooKassa integration.

app/lib/donations/demo-donations.ts
Demo donation history localStorage helpers.

app/lib/campaigns/demo-campaign-store.ts
Demo campaign localStorage helpers.

app/lib/site-content/demo-site-content.ts
About/reports default content and localStorage helpers.

app/account/page.tsx
Donor account route.

app/account/AccountClient.tsx
Client-side donor account logic.

app/admin/page.tsx
Admin route.

app/admin/AdminClient.tsx
Admin panel logic.

app/about/page.tsx
About route.

app/about/AboutClient.tsx
Client-side About page, reads edited content from localStorage.

app/reports/page.tsx
Reports route.

app/reports/ReportsClient.tsx
Client-side Reports page, reads edited reports from localStorage.

public/logo-placeholder.svg
Temporary SVG logo placeholder.
```

## localStorage Keys

```text
mrom_sosedi_demo_campaigns
Stores edited/created campaigns from admin panel.

mrom_sosedi_demo_donations
Stores demo donation history after successful demo payment.

mrom_sosedi_demo_user
Stores donor account profile.

mrom_sosedi_admin_session
Stores admin logged-in state.

mrom_sosedi_demo_site_content
Stores editable About content and general reports.
```

## Design Direction

- Main style: modern black/white, clean, mobile-first.
- Green accent is intentionally soft now, not bright reference-green.
- Main public action colors were softened after feedback:
  - primary action green around `#2f9f6b`
  - soft share background around `#eef6f2`
  - darker green text around `#356f59` / `#2f7d5f`
- Avoid copying the original reference too closely.
- Logo is only a placeholder SVG and should be replaced later.

## Current Behavior Notes

- Admin changes are saved in browser localStorage. They are visible after refreshing public pages.
- New campaigns created in admin can be opened via `/campaigns/<generated-id>`.
- Hidden campaigns do not appear in the campaign feed and show a "not found/hidden" state on detail page.
- Deleting a campaign removes it from localStorage demo campaigns. "Reset demo" restores initial code-defined campaigns.
- Donation form creates fake YooKassa payments only. No money is charged.
- Demo donation history is stored locally and shown in `/account`.
- The public totals on campaign pages are still based on campaign data/admin manual values, not automatically recomputed from donation history. Future YooKassa webhooks should update real campaign totals.

## Future Stage 7: Real Architecture Preparation

Recommended next work:

1. Replace localStorage demo campaign/content storage with database-backed storage.
2. Add proper server-side admin authentication.
3. Implement real YooKassa adapter:
   - create payment
   - choose payment method: bank card or SBP
   - redirect/confirmation flow
   - webhook processing
   - idempotency keys
   - update campaign collected amount after successful payment
   - write payment/donation history for donor
4. Add real SMS provider for phone auth.
5. Later add T-ID and SberID login.
6. Add file uploads for campaign/report photos and documents instead of URL-only fields.
7. Add validation, error states, and server-side security.
8. Add production deployment path after real payment/legal data is ready.

## Known Issues / Watchouts

- `next/link` inside some client-heavy Vinext HMR sessions previously triggered noisy React/Vite dev warnings after hot updates. A clean restart fixed it. If this happens again, restart dev server.
- Always start dev server with:

```bash
npm run dev -- --hostname 127.0.0.1
```

- `npm install` showed audit warnings. They were not addressed during prototyping.
- There is no real payment security, no backend auth, and no protected database yet.
- Admin password is visible in client code and is only acceptable for prototype/demo.

## User Preferences Captured

- Language: Russian only for now.
- Payment provider planned: YooKassa.
- Payment methods in UI: bank card online and SBP only.
- Recurring donations: not active now, keep structure/placeholder for later.
- Registration: placeholder now, phone SMS first; T-ID and SberID later.
- Admin: simple separate closed page, understandable, not overdesigned.
- Reports: editable via admin, post-like format, with photo/document placeholders and expense amounts.
- Design: black/white modern with a careful green accent.
