const fs = require('fs');
const path = require('path');
const https = require('https');

const downloads = [
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'services', 'architectural-outdoor-lighting.jpg'),
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'services', 'structural-earthworks-grading.jpg'),
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'services', 'integrated-pest-management.jpg'),
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'services', 'commercial-landscape-maintenance.jpg'),
    url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'services', 'indoor-plantscapes-maintenance.jpg'),
    url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'hero-royal-palace.jpg'),
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80',
  },
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'service-4.jpg'),
    url: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'service-5.jpg'),
    url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
  },
  {
    dest: path.join(__dirname, '..', 'public', 'img', 'service-6.jpg'),
    url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1200&q=80',
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const size = fs.statSync(dest).size;
        console.log(`Saved ${path.basename(dest)} (${size} bytes)`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const item of downloads) {
    try {
      console.log(`Downloading ${path.basename(item.dest)}...`);
      await downloadFile(item.url, item.dest);
    } catch (err) {
      console.error(`Error for ${item.dest}:`, err.message);
    }
  }
  console.log('All image downloads completed!');
}

run();
