// Nigel van Herwijnen
// UvA ID: 10330879

// Start when window is loaded
window.onload = function() {

  // Load JSON data, log on error
  d3.json("data/data_ghg.json", function(error, jsonData) {
    if(error) throw error;

    // Format data for chart and map
    var map_data = processDataMap(jsonData);

    // console.log(jsonData);
    // console.log(map_data);

    // Setup default year
    var year = 2011;

    // Make a new datamap
    // makeDataMap(map_data, year);

  });


};
