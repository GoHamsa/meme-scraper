// URL to meme website: https://memegen-link-examples-upleveled.netlify.app/

import cheerio from 'cheerio';
import download from 'image-downloader';

const url = 'https://memegen-link-examples-upleveled.netlify.app/'; // fetch page from URL

// get HTML content from a page
fetch(url)
  .then((response) => response.text())
  .then((htmlContent) => {
    const $ = cheerio.load(htmlContent); // Load the HTML content into Cheerio
    const imgTags = $('img'); // Get all the <img> tags on the page
    const imgSrcArray = []; // Create an array to store the image source URLs

    // Loop through the first 10 <img> tags and extract the image source
    imgTags.slice(0, 10).each((index, imgTag) => {
      const imgSrc = $(imgTag).attr('src');
      imgSrcArray.push(imgSrc);
    });

    // download images
    imgSrcArray.forEach((imgSrc, index) => {
      const options = {
        url: imgSrc,
        dest: `C:/Users/Hamsa/projects/meme-scraper/memes/${index + 1}.jpg`, // Customize the file path
      };

      download
        .image(options)
        .then(({ filename }) => {
          console.log(`Downloaded: ${imgSrc} as ${filename}`);
        })
        .catch((err) => {
          console.error(`Error downloading: ${imgSrc}`, err);
        });
    });
  })
  .catch((error) => {
    console.error('Error fetching or parsing HTML:', error);
  });
