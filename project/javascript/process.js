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


// This function reformats the data for the pie chart.
function processDataChart(data) {

  // Define variable to store data and define way to format values
  var chart_data = new Object;
  var formatValue = d3.format(",.0f");

  // Loop over every year
  for (var i = 1990; i < 2013; i++){

    // Make dictionaries to store different values
    var co2 = new Object,
        ch4 = new Object,
        n2o = new Object,
        other = new Object;

    // Loop over every country
    data[i].forEach(function(d) {

      // Store data as needed
      co2[d.code] = {"value": +formatValue(d.co2), "cat": "CO2", "name": d.name};
      ch4[d.code] = {"value": +formatValue(d.ch4), "cat": "CH4", "name": d.name};
      n2o[d.code] = {"value": +formatValue(d.n2o), "cat": "N2O", "name": d.name};
      other[d.code] = {"value": +formatValue(d.n2o), "cat": "Other", "name": d.name};



      // Rewrite "other" if data overlaps data overlaps
      if (other[d.code].value < 0) { other[d.code].value = 0 }
    });

    // Save data
    chart_data[i] = [co2, ch4, n2o, other]
  };

  // Return data
  return chart_data
};
