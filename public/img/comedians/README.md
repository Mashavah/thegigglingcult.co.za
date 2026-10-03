# Comedian photos

Drop a photo here named after the comedian's `slug` from `lib/data.ts`:

    assets/img/comedians/loyiso-gola.jpg
    assets/img/comedians/celeste-ntuli.jpg

- Format: JPG (square, at least 400x400 works best — it's cropped to a rounded square, top-aligned).
- No data edits needed: `npm run dev` / `npm run build` index this folder automatically (or run `npm run photos`). Comedians without a file show a monogram.
- To use a different filename/format or a hosted URL, add `photo: 'https://...'` to that comedian in `lib/data.ts`.

## Placeholders currently in this folder

The JPGs here are AI-generated portraits of the **fictional** "Rising" comics only
(bongi-mthethwa, fikile-nkosi, hlengiwe-zondo, imraan-davids, ollie-van-der-berg,
ursula-pillay, wandile-sibiya, zanele-mokoena). They exist to demo the layout and must be
replaced along with those placeholder profiles. Uncropped originals are in `../_raw/`.
Real comedians have no photo on purpose — use their approved press shots.

