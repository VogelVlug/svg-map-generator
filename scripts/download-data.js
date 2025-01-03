import { createWriteStream, unlink } from 'fs';
import fs from 'fs/promises';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');

const DATASETS = {
  '50mcoast': 'https://naciscdn.org/naturalearth/50m/physical/ne_50m_coastline.zip',
  '110mcoast': 'https://naciscdn.org/naturalearth/110m/physical/ne_110m_coastline.zip'
};

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      unlink(destPath, () => {
        reject(err);
      });
    });
  });
}

async function main() {
  await ensureDataDir();
  
  for (const [name, url] of Object.entries(DATASETS)) {
    const destPath = path.join(DATA_DIR, `${name}.zip`);
    console.log(`Downloading ${name} dataset...`);
    try {
      await downloadFile(url, destPath);
      console.log(`Successfully downloaded ${name}`);
    } catch (error) {
      console.error(`Error downloading ${name}:`, error.message);
      // Clean up failed download
      try {
        await fs.unlink(destPath);
      } catch {}
    }
  }
}

main().catch(console.error); 