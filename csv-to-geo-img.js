const csvFilePath = '/Users/natkha/Desktop/dashboardMasterWorks/csvtogeocode/imgurlcomma.csv';
const geojsonFilePath = '/Users/natkha/Desktop/dashboardMasterWorks/csvtogeocode/geocollection.json';

const csvtojson = require('csvtojson');
const fs = require('fs');

// Read the CSV file and convert it to a JSON object
csvtojson()
  .fromFile(csvFilePath)
  .then(csvData => {

    // Read the GeoJSON file
    fs.readFile(geojsonFilePath, 'utf-8', (err, geojsonData) => {
      if (err) throw err;

      // Parse the GeoJSON data to a JSON object
      const geojson = JSON.parse(geojsonData);

      // Loop through each feature in the GeoJSON object
      geojson.features.forEach(feature => {

        // Find the CSV row that matches the current feature's image_id
        const csvRow = csvData.find(row => row.image_id === feature.properties.image_id);

        // Add the image_url property to the current feature, if a matching CSV row is found
        if (csvRow) {
          feature.properties.image_url = csvRow.image_url;
        }
      });

      // Write the updated GeoJSON object back to the file
      fs.writeFile(geojsonFilePath, JSON.stringify(geojson), 'utf-8', err => {
        if (err) throw err;
        console.log('Image URLs added to GeoJSON file successfully!');
      });
    });
  });
