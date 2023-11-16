// index.js
import axios from 'axios';
import cheerio from 'cheerio';
// eslint-disable-next-line import/no-unresolved
import fs from 'fs-extra';
// eslint-disable-next-line import/no-unresolved
import ProgressBar from 'progress';

// Function to download an image from a URL
async function downloadImage(url, filename) {
  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(filename);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// Function to scrape meme images
async function scrapeMemes() {
  try {
    const response = await axios.get(
      'https://memegen-link-examples-upleveled.netlify.app/',
    );
    const $ = cheerio.load(response.data);

    const memeUrls = [];

    // Find and collect image URLs
    $('img').each((index, element) => {
      if (index < 10) {
        // Only get the first 10 images
        memeUrls.push($(element).attr('src'));
      }
    });

    const progressBar = new ProgressBar(':bar :percent', {
      total: memeUrls.length,
    });

    for (let i = 0; i < memeUrls.length; i++) {
      const imageUrl = memeUrls[i];
      const imageName = `${i + 1 < 10 ? '0' : ''}${i + 1}.jpg`;
      await downloadImage(imageUrl, `memes/${imageName}`);
      progressBar.tick();
    }

    console.log('Memes downloaded successfully.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

await scrapeMemes();
