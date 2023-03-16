const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Replace with your own folder ID
const folderId = '1RQDH8bIfWL4GtF8mF8XT-brJeLEl9N2G';

// Replace with your own credentials file name
const credentialsFile = './token.json'

// Create a new instance of the drive API with the specified credentials
const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(__dirname, credentialsFile),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
const drive = google.drive({ version: 'v3', auth });

async function getImageUrls() {
  // Get a list of all the files in the folder
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'nextPageToken, files(id, name, mimeType)',
  });

  const images = [];

  // Loop through each file in the folder
  for (const file of res.data.files) {
    // Check if the file is an image
    if (file.mimeType.startsWith('image/')) {
      try {
        // Get a shareable link to the image
        const { data } = await drive.permissions.create({
          fileId: file.id,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });

        const imageUrl = `https://drive.google.com/uc?id=${file.id}&export=download`;

        images.push({ name: file.name, imageUrl });
      } catch (err) {
        console.error(`Could not retrieve image URL for file ${file.name}: ${err.message}`);
      }
    }
  }

  return images;
}

(async function() {
  try {
    const images = await getImageUrls();
    console.log(images);
  } catch (err) {
    console.error(`Failed to retrieve images: ${err.message}`);
  }
})();
