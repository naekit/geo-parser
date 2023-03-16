const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const credentials = JSON.parse(fs.readFileSync('./token.json'));
const folderId = '1RQDH8bIfWL4GtF8mF8XT-brJeLEl9N2G';

const auth = new GoogleAuth(
    {
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive']
    }
);


const drive = google.drive({
    version: 'v3',
    auth
});

const getImagesUrls = async () => {
    const res = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: 'nextPageToken, files(id, name)'
    });

    console.log(res.data.files)
    const imagesUrls = res.data.files.reduce((result, { id, name }) => {
        const imageName = path.parse(name).name;
        const imageUrl = `https://drive.google.com/uc?id=${id}`;
        return { ...result, [imageName]: imageUrl };
    }, {});

    return imagesUrls;
};

const addImageUrl = async () => {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'geocollection.json')));
    const imagesUrls = await getImagesUrls();



    fs.writeFileSync(path.resolve(__dirname, 'data-with-urls.json'), JSON.stringify(imagesUrls));


    const updatedData = data.features.map(feature => {
        const imageId = feature.properties.image_id;
        const imageName = imageId.split('.')[0];
        const imageUrl = imagesUrls[imageName];

        return {
            ...feature,
            properties: {
                ...feature.properties,
                img_url: imageUrl
            }
        };
    });

    fs.writeFileSync(path.resolve(__dirname, 'data-with-image-urls.json'), JSON.stringify(updatedData));
};

addImageUrl();
