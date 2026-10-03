// Writes lib/photos.json: the comedian slugs that have a photo in public/img/comedians.
// Runs before `dev` and `build` (see package.json) so the UI never probes for missing files.
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'img', 'comedians');
const slugs = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).map((f) => f.replace(/\.[^.]+$/, '')).sort();
fs.writeFileSync(path.join(__dirname, '..', 'lib', 'photos.json'), JSON.stringify(slugs, null, 2) + '\n');
console.log(`indexed ${slugs.length} comedian photos`);
