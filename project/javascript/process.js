// Nigel van Herwijnen
// UvA ID: 10330879

// Reformat the JSON data as necassery for datamap.
function processDataMap(data) {

  // Define object to save data
  var map_data = new Object;

  // Loop over every year
  for (var i = 1990; i < 2013; i++) {
    var year_data = new Object;

    // Loop over every country
    data[i].forEach(function(d) {

      // Define fillKey
      if (d.ghg > 15) { key = "veryhigh"; }
      else if (d.ghg > 10) { key = "high"; }
      else if (d.ghg > 5) { key = "medium"; }
      else if (d.ghg > 1) { key = "low"; }
      else { key = "verylow"; };

      // Save data
      if (d.ghg != 0) {
        year_data[d.code] = {
          name: d.name,
          fillKey: key,
          ghg: d.ghg
        };
      } else {
        year_data[d.code] = {
          name: d.name,
          fillKey: "unavailable",
          ghg: 0
        };
      };
    });

    // Save data
    map_data[i] = year_data;
  };

  // Return data
  return map_data;
};
