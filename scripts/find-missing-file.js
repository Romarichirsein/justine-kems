const fs = require('fs');
const path = require('path');
const baseDir = path.resolve("Justine Kem's");
const progress = JSON.parse(fs.readFileSync('scripts/.upload-progress.json', 'utf-8'));
const completedSet = new Set(progress.completed);

const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());
for (const folder of folders) {
  const files = fs.readdirSync(path.join(baseDir, folder)).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  for (const file of files) {
    if (!completedSet.has(folder + '/' + file)) {
      console.log('MISSING:', folder + '/' + file);
    }
  }
}
