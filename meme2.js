import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import { load } from 'cheerio';

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!fs.existsSync(join(__dirname, 'memes'))) {
  fs.mkdirSync(join(__dirname, 'memes'));
}

function getFileName(index) {
  return `${String(index + 1).padStart(2, '0')}.jpg`;
}

async function fetchAndSaveMemes() {
  try {
    const response = await axios.get(
      'https://memegen-link-examples-upleveled.netlify.app/',
    );
    const $ = load(response.data);
    const imgUrls = [];

    $('img').each((index, img) => {
      if (index < 10) {
        imgUrls.push($(img).attr('src'));
      }
    });

    for (let index = 0; index < imgUrls.length; index++) {
      const imgResponse = await axios.get(imgUrls[index], {
        responseType: 'arraybuffer',
      });
      const filePath = join(__dirname, 'memes', getFileName(index));
      fs.writeFileSync(filePath, imgResponse.data);
    }
  } catch (error) {
    console.error('There was an error fetching or saving memes:', error);
  }
}

fetchAndSaveMemes();
