# Geo Parser

Very simple, kind of..

Takes in a csv file with city and street address and queries googleMaps API to parse it into coordinate [lat, long] 

Then it takes the coordinates and all the values, and converts the csv row into a geoJSON object.

## File output

The index.js file outputs the geocollection.json file

```bash
index.js = 'geocollection.json'
```