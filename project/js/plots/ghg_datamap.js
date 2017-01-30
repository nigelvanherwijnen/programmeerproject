// Nigel van Herwijnen
// Uva ID: 10330879

// This function draws a datamap viewing given data.
function makeDataMap(list_data, line_data, chart_data, map_data, year) {

  // Define the way data will be formatted
  var formatValue = d3.format(",.2f");

  // Make a new datamap
  var map = new Datamap({
    element: document.getElementById("container_map"),
    done: function(datamap) {

      // When a country is clicked
      datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography) {

        // Surprise when clicking on USA and Russia
        if (geography.id == "USA" || geography.id == "RUS") { window.open('https://goo.gl/a1N33x', '_blank'); }

        // update pie chart and redraw line graph
        makeLineGraph(line_data, year, geography.id);
        updatePieChart(list_data, line_data, chart_data, map_data, year, geography.id);
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
        if (data.ghg != 0) {
          return '<div class="hoverinfo">' +
            "<strong>" + geography.properties.name + "</strong><br/>" +
            "GHG emission: " + formatValue(data.ghg) + " tCO2e / capita</div>"
        } else {
          return '<div class="hoverinfo">' +
            "<strong>" + geography.properties.name + "</strong><br/>" +
            "GHG emission data unavailable</div>"
        };
      }
    },

    // Define fill colors of groups
    fills: {
      verylow: "#fcbba1",
      low: "#fc9272",
      medium: "#fb6a4a",
      high: "#de2d26",
      veryhigh: "#a50f15",
      unavailable: "lightgrey",
      defaultFill: "lightgrey"
    },

    // Load data
    data: map_data[year]
  });

  // Define legend for datamap
  map.legend({
    legendTitle : "(tCO2e Per Capita)",
    labels: {
      verylow: "<1:",
      low: "1-5:",
      medium: "5-10:",
      high: "10-15:",
      veryhigh: ">15:"
    }
  });
};
