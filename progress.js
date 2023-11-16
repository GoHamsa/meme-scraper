/*
import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import cheerio from 'cheerio';

const directoryName = dirname(fileURLToPath(import.meta.url));

async function ensureDirectoryExists(path) {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
}

await ensureDirectoryExists(join(directoryName, 'memes'));

function generateMemeURL(topText, bottomText, memeName) {
  if (!topText || !bottomText || !memeName) {
    return null;
  }

  // Convert spaces to underscores and make the text URL-safe
  topText = encodeURIComponent(topText.replace(/ /g, '_'));
  bottomText = encodeURIComponent(bottomText.replace(/ /g, '_'));
  return `https://api.memegen.link/images/${memeName}/${topText}/${bottomText}.jpg`;
}

async function fetchAndSaveMeme(topText, bottomText, memeName) {
  const memeURL = generateMemeURL(topText, bottomText, memeName);

  if (!memeURL) {
    console.log('Please provide valid inputs.');
    return;
  }

  const response = await axios.get(memeURL, { responseType: 'arraybuffer' });

  const filePath = join(directoryName, 'memes', `${memeName}.jpg`);
  await fs.writeFile(filePath, response.data);

  console.log('Meme saved successfully!');
}

async function fetchAndSaveTopTenMemes() {
  const response = await axios.get(
    'https://memegen-link-examples-upleveled.netlify.app/',
  );
  const htmlContent = cheerio.load(response.data);
  const imgUrls = [];

  htmlContent('img').each((index, img) => {
    if (index < 10) {
      imgUrls.push(htmlContent(img).attr('src'));
    }
  });

  for (let index = 0; index < imgUrls.length; index++) {
    const imgResponse = await axios.get(imgUrls[index], {
      responseType: 'arraybuffer',
    });
    const fileName = `meme${index < 9 ? '0' : ''}${index + 1}.jpg`;
    const filePath = join(directoryName, 'memes', fileName);
    await fs.writeFile(filePath, imgResponse.data);
    console.log(`Saved: ${fileName}`);
  }
}

const [topText, memeName, bottomText] = process.argv.slice(2);

if (topText && memeName && bottomText) {
  fetchAndSaveMeme(topText, bottomText, memeName);
} else {
  fetchAndSaveTopTenMemes();
}
*/

import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import cheerio from 'cheerio';

const currentDir = dirname(fileURLToPath(import.meta.url));

async function ensureDirectoryExists(path) {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
}

await ensureDirectoryExists(join(currentDir, 'memes'));

function generateMemeURL(topText, bottomText, memeName) {
  if (!topText || !bottomText || !memeName) {
    return null;
  }

  topText = encodeURIComponent(topText.replace(/ /g, '_'));
  bottomText = encodeURIComponent(bottomText.replace(/ /g, '_'));
  return `https://api.memegen.link/images/${memeName}/${topText}/${bottomText}.jpg`;
}

async function fetchAndSaveMeme(topText, bottomText, memeName) {
  const memeURL = generateMemeURL(topText, bottomText, memeName);

  if (!memeURL) {
    console.log('Please provide valid inputs.');
    return;
  }

  const response = await axios.get(memeURL, { responseType: 'arraybuffer' });

  const filePath = join(currentDir, 'memes', `${memeName}.jpg`);
  await fs.writeFile(filePath, response.data);

  console.log('Meme saved successfully!');
}

async function fetchAndSaveTopTenMemes() {
  const response = await axios.get(
    'https://memegen-link-examples-upleveled.netlify.app/',
  );
  const htmlContent = cheerio.load(response.data);
  const imgUrls = [];

  htmlContent('img').each((index, img) => {
    if (index < 10) {
      imgUrls.push(htmlContent(img).attr('src'));
    }
  });

  for (let index = 0; index < imgUrls.length; index++) {
    const imgResponse = await axios.get(imgUrls[index], {
      responseType: 'arraybuffer',
    });
    const fileName = `meme${index < 9 ? '0' : ''}${index + 1}.jpg`;
    const filePath = join(currentDir, 'memes', fileName);
    await fs.writeFile(filePath, imgResponse.data);
    console.log(`Saved: ${fileName}`);
  }
}

const [topText, memeName, bottomText] = process.argv.slice(2);

if (topText && memeName && bottomText) {
  fetchAndSaveMeme(topText, bottomText, memeName);
} else {
  fetchAndSaveTopTenMemes();
}
