// Nigel van Herwijnen
// UvA ID: 10330879


// Start when window is loaded
window.onload = function() {

  // Load JSON data, log on error
  d3.json("data/data.json", function(error, jsonData) {
    if(error) throw error;

    // Format data for chart and map
    // var map_data = processDataMap(jsonData);

    console.log(jsonData);
    // console.log(map_data);

    // Setup default year
    var year = 2010;


    // Make a new datamap
    // makeDataMap(chart_data, map_data, year);


  });
};


// This function draws a datamap viewing given data.
function makeDataMap(chart_data, map_data, year) {

  // Define the way data will be formatted
  var formatValue = d3.format(",.2f");

  // Make a new datamap
  var map = new Datamap({
    element: document.getElementById("container_map"),
    done: function(datamap) {


      // When a country is clicked
      datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography) {

        // Surprise when clicking on USA
        if (geography.id == "USA" || geography.id == "RUS") { window.open('https://goo.gl/a1N33x', '_blank'); }

        // Remove drawn elements that will be redrawn
        d3.select("#container_chart").select("svg").remove();
        d3.select("#container_chart").select(".infobox_chart").remove();
        d3.select("#container_chart").select(".country_name").remove();

        // Redraw pie chart
        makePieChart(chart_data, map_data, year, geography.id);


      });
    },
    scope: "world",
    geographyConfig: {

      // // Set colors
      borderColor: "rgba(255,255,255,0.5)",
      highlightBorderColor: "rgba(0,0,0,1.0)",
      highlightFillColor: function(data) { return data["fillKey"]; },

      // Set content of pop-up
      popupTemplate: function(geography, data) {
        if (data.total != 0) {
          return '<div class="hoverinfo">' +
            "<strong>" + geography.properties.name + "</strong><br/>" +
            "Energy consumption: " + formatValue(data.total) + " kWh / capita</div>"
        } else {
          return '<div class="hoverinfo">' +
            "<strong>" + geography.properties.name + "</strong><br/>" +
            "Energy consumption data unavailable</div>"
        };
      }
    },

    // Define fill colors of groups
    fills: {
      veryhigh: "#a50f15",
      high: "#de2d26",
      medium: "#fb6a4a",
      low: "#fc9272",
      verylow: "#fcbba1",
      unavailable: "lightgrey",
      defaultFill: "lightgrey"
    },

    // Load data
    data: map_data[year]
  });

  // Define legend for datamap
  map.legend({
    legendTitle : "Energy consumption in kWh per capita",
    labels: {
      veryhigh: ">4000:",
      high: "3000-4000:",
      medium: "2000-3000:",
      low: "1000-2000:",
      verylow: "<1000:"
    }
  });

};




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
      if (d.total > 4000) { key = "veryhigh"; }
      else if (d.total > 3000) { key = "high"; }
      else if (d.total > 2000) { key = "medium"; }
      else if (d.total > 1000) { key = "low"; }
      else { key = "verylow"; };

      // Save data
      if (d.total != 0) {
        year_data[d.code] = {
          name: d.name,
          fillKey: key,
          total: d.total
        };
      } else {
        year_data[d.code] = {
          name: d.name,
          fillKey: "unavailable",
          total: 0
        };
      };
    });

    // Save data
    map_data[i] = year_data;
  };

  // Return data
  return map_data;
};
