const csv = require("csvtojson")
const { createClient } = require("@google/maps/")
const csvToParse = "./socal2.csv"
const fs = require("fs")

const client = createClient({key: "/*YOUR API KEY HERE*/", Promise: Promise})

// define function to convert the city and street names to coordinates
const geocode = async (city, street) => {
    const query = `${street}, ${city}`
    const res = await client.geocode({address: query}).asPromise()
    if(res.json.results[0].geometry.location){
        const { lat, lng } = res.json.results[0].geometry.location
        return { lat, lng }
    } else {
        const { lat, lng } = { lat: 0, lng: 0 }
        return { lat, lng }
    }
}

csv().fromFile(csvToParse).then(async (json) => {
    const features = []
    for (let i = 0; i < json.length; i++) {
        const { citi, street, bed, bath, sqft, price, price_sqft, counts_locations, average_price_sqft, image_id, n_citi } = json[i]
        const { lat, lng } = await geocode(citi, street)
        const feature = {
            type: "Feature",
            properties: {
                image_id,
                street,
                city: citi,
                n_citi,
                sqft,
                price,
                price_sqft,
                average_price_sqft,
                bed,
                bath,
                counts_locations,
            },
            geometry: {
                type: "Point",
                coordinates: [lng, lat]
            }
        }
        features.push(feature)
        console.log({lat, lng}, {length: json.length - i})
    }
    const geojson = {
        type: "FeatureCollection",
        features
    }
    const jsonString = JSON.stringify(geojson);

    fs.writeFile('geocollection.json', jsonString, (err) => {
      if (err) throw err;
      console.log('JSON file has been saved.');
    });
})
