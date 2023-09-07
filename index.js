// URL to meme website: https://memegen-link-examples-upleveled.netlify.app/

import cheerio from 'cheerio';
import download from 'image-downloader';

// URL of the page you want to fetch
const url = 'https://memegen-link-examples-upleveled.netlify.app/';

// Use a method like fetch to get the HTML content from a webpage
fetch(url)
  .then((response) => response.text())
  .then((htmlContent) => {
    // Load the HTML content into Cheerio
    const $ = cheerio.load(htmlContent);

    // Get all the <img> tags on the page
    const imgTags = $('img');

    // Create an array to store the image source URLs
    const imgSrcArray = [];

    // Loop through the first 10 <img> tags and extract the image source
    imgTags.slice(0, 10).each((index, imgTag) => {
      const imgSrc = $(imgTag).attr('src');
      imgSrcArray.push(imgSrc);
    });

    // Now, you can download the images
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
