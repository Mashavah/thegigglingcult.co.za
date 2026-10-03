# The Giggling Cult

Come for the giggles. Stay for the cult.

A platform for South African stand-up comedy: one calendar for every show, a directory of every
comedian, and the week in comedy — across all nine provinces.

**Features**
- Interactive events calendar with list and by-comedian views, filterable by province, URL-shareable
- A–Z comedian directory with bios, social links, upcoming shows and a "Rising" list for new talent
- Individual comedian and article pages
- Weekly summary with live stats, latest news, and comedian/audience newsletter sign-up
- Next.js App Router + TypeScript; persistent layout so navigation never reloads the page

**Status:** demo build. All shows, dates, prices and news are sample data; see `lib/data.ts`.

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

## Structure

```
app/
  layout.tsx              root layout: fonts, nav, footer, drawer/toast provider (persists across pages)
  template.tsx            per-navigation page transition
  page.tsx                home
  events/page.tsx         calendar / list / by-comedian (?view= &province= &comedian=)
  comedians/page.tsx      A–Z (?letter= &province= &rising=1)
  comedians/[slug]/       comedian profile
  news/page.tsx           listing
  news/[slug]/            article
  join/page.tsx           signup (?as=comedian|audience)
  globals.css             the design system (gig-poster direction)
components/
  Chrome.tsx              Nav, Footer
  UIProvider.tsx          event drawer + toasts (useUI())
  Cards.tsx               EventCard, EventRow, MiniEvent, EventsByDate, ComedianCard, NewsCard
  ui.tsx                  Avatar, tags, ProvinceChips, Segmented, Empty
  EventsView.tsx, ComediansGrid.tsx, NewsList.tsx, ComingUp.tsx, JoinForm.tsx
lib/
  types.ts                Comedian, Event, Venue, Article, Province
  data.ts                 ALL content — swap for an API/CMS
  queries.ts              filters, date ranges, lookups
  dates.ts                formatting
public/img/               photography + comedian photos (see public/img/comedians/README.md)
```

## Before launch

- Verify every social handle in `lib/data.ts` — they are best-effort placeholders.
- Replace the `upcoming: true` placeholder comics (and their AI-generated photos) with the real roster.
- Replace `day(n)` relative dates with real dates or an API; then drop `force-dynamic` and let pages prerender.
- Wire `JoinForm.tsx` to a real newsletter/CRM endpoint (currently localStorage).
- Add ticketing links (Quicket / Webtickets / Computicket) to events.
