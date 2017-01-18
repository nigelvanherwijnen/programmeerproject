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
  var formatValue = d3.format(".2f");

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

      // Rewrite "other" if data overlaps
      if (other[d.code].value < 0) { other[d.code].value = 0 };
    });

    // console.log(co2["USA"])

    // Save data
    chart_data[i] = [co2, ch4, n2o, other];
  };

  // Return data
  return chart_data;
};

// This function reformats the data for the line chart.
function processDataLine(data) {

  var line_data = new Object;

  data[1990].forEach(function(d) {
    line_data[d.code] = new Object
    line_data[d.code].name = d.name
    line_data[d.code].values = []
  })

  for (i = 1990; i < 2013; i++) {
    data[i].forEach(function(d) {

      line_data[d.code].values.push({
        "year": i,
        "waste": d.waste,
        "agriculture": d.agriculture,
        "energy": d.energy,
        "fuel": d.fuel,
        "industrial": d.industrial,
        "land": d.land
      });
    });
  };

  return line_data;
};

// This function reformats the data for the top 10 chart.
// Used: http://stackoverflow.com/questions/27479750/getting-top-10-values-in-a-json-file
function processDataList(data) {

  var list_data = new Object;
  for (i = 1990; i < 2013; i++) {

    var ranked = data[i].sort(function(a, b) { return a.total < b.total ? 1 : -1; });

    for (j = 0; j < ranked.length; j++) {
      ranked[j]["rank"] = j + 1;
    };

    list_data[i] = ranked;
  };

  return list_data;
};
