import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

const dirName = dirname(fileURLToPath(import.meta.url));

async function ensureDirectoryExists(path) {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
}

await ensureDirectoryExists(join(dirName, 'memes'));

function generateMemeURL(topText, bottomText, memeName) {
  topText = encodeURIComponent(topText.replace(/ /g, '_'));
  bottomText = encodeURIComponent(bottomText.replace(/ /g, '_'));
  return `https://api.memegen.link/images/${memeName}/${topText}/${bottomText}.jpg`;
}

async function fetchAndSaveMeme(topText, bottomText, memeName) {
  const memeURL = generateMemeURL(topText, bottomText, memeName);
  const response = await fetch(memeURL);

  if (!response.ok) {
    console.error(`Error fetching the meme: ${response.statusText}`);
    return;
  }

  console.log('Fetching meme...');

  const buffer = await response.buffer();
  const filePath = join(dirName, 'memes', `${memeName}.jpg`);
  await fs.writeFile(filePath, buffer);

  console.log('Meme saved successfully!');
}

async function fetchAndSaveTop10Memes() {
  try {
    const response = await fetch(
      'https://memegen-link-examples-upleveled.netlify.app/',
    );
    const text = await response.text();
    const regex =
      /https:\/\/api\.memegen\.link\/images\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+\.[a-z]+/g;
    const imgUrls = [...new Set(text.match(regex))].slice(0, 10); // Remove duplicates

    for (let i = 0; i < imgUrls.length; i++) {
      const imgResponse = await fetch(imgUrls[i]);
      const buffer = await imgResponse.buffer();
      const filePath = join(
        dirName,
        'memes',
        `${String(i + 1).padStart(2, '0')}.jpg`,
      );
      await fs.writeFile(filePath, buffer);
      console.log(`Meme ${i + 1} saved successfully!`);
    }
  } catch (error) {
    console.error('Error fetching or saving memes:', error);
  }
}

const [topText, memeName, bottomText] = process.argv.slice(2);

if (topText && memeName && bottomText) {
  fetchAndSaveMeme(topText, bottomText, memeName);
} else {
  fetchAndSaveTop10Memes();
}
