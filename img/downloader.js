const fs = require('fs');
const https = require('https');
const path = require('path');

const htmlFile = 'index.html'; // The file to scan
const imgFolder = './img';     // Where to save the downloaded images

// 1. Create the img folder if it doesn't exist
if (!fs.existsSync(imgFolder)) {
    fs.mkdirSync(imgFolder);
}

// 2. Read your HTML file
let html = fs.readFileSync(htmlFile, 'utf8');

// 3. Find all i.ibb.co links
const regex = /https:\/\/i\.ibb\.co\/[a-zA-Z0-9_-]+\/([^"'\s>]+)/g;
let newHtml = html;
let match;
const downloads = [];

while ((match = regex.exec(html)) !== null) {
    const fullUrl = match[0];
    const filename = match[1];
    
    // Check if we already queued this exact image to avoid duplicates
    if (!downloads.some(d => d.url === fullUrl)) {
        downloads.push({ url: fullUrl, filename: filename });
    }
    
    // Replace the long URL with your local img/ folder path
    newHtml = newHtml.split(fullUrl).join(`img/${filename}`);
}

// 4. Save the new HTML
fs.writeFileSync('index.html', newHtml);
console.log(`Successfully updated index.html with new local links!`);

// 5. Download all the images
console.log(`Starting download of ${downloads.length} images...`);

downloads.forEach(img => {
    const dest = path.join(imgFolder, img.filename);
    
    // Only download if the image isn't already in the folder
    if (!fs.existsSync(dest)) {
        const file = fs.createWriteStream(dest);
        https.get(img.url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${img.filename}`);
            });
        }).on('error', err => {
            console.error(`Error downloading ${img.filename}: ${err.message}`);
        });
    }
});
