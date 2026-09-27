const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(getFiles(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = getFiles('./src');
const imageRegex = /['"](\/(?:img|images)[^'"]+\.(?:jpg|png|webp|svg|jpeg))['"]/g;
const referencedImages = new Set();

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    referencedImages.add(match[1]);
  }
});

console.log('Total referenced images:', referencedImages.size);
const missing = [];
const existing = [];

referencedImages.forEach(img => {
  const localPath = path.join('./public', img);
  if (fs.existsSync(localPath)) {
    existing.push(img);
  } else {
    missing.push(img);
  }
});

console.log('Existing count:', existing.length);
console.log('Missing count:', missing.length);
console.log('MISSING IMAGES:');
missing.forEach(m => console.log(' - ' + m));
