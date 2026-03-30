const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, "Justine Kem's");
const progressFile = path.join(__dirname, 'scripts', '.upload-progress.json');
const progress = JSON.parse(fs.readFileSync(progressFile, 'utf-8'));
const completedSet = new Set(progress.completed);

const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());
let totalAll = 0, doneAll = 0;

process.stdout.write('\n=== UPLOAD PROGRESS ===\n');
for (const folder of folders) {
  const files = fs.readdirSync(path.join(baseDir, folder)).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const done = files.filter(f => completedSet.has(folder + '/' + f)).length;
  const remaining = files.length - done;
  totalAll += files.length;
  doneAll += done;
  process.stdout.write(folder + ': ' + done + '/' + files.length + ' done (' + remaining + ' remaining)\n');
}
process.stdout.write('\nTOTAL: ' + doneAll + '/' + totalAll + ' done (' + (totalAll - doneAll) + ' remaining)\n');
