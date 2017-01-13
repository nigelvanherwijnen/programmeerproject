// Nigel van Herwijnen
// UvA ID: 10330879


// This function draws a datamap viewing given data.
function makeDataMap(map_data, year) {

  // Define the way data will be formatted
  var formatValue = d3.format(",.2f");

  // Make a new datamap
  var map = new Datamap({
    element: document.getElementById("container_map"),
    // done: function(datamap) {
    //
    //
    //   // When a country is clicked
    //   datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography) {
    //
    //     // Surprise when clicking on USA
    //     if (geography.id == "USA" || geography.id == "RUS") { window.open('https://goo.gl/a1N33x', '_blank'); }
    //
    //     // Remove drawn elements that will be redrawn
    //     d3.select("#container_chart").select("svg").remove();
    //     d3.select("#container_chart").select(".infobox_chart").remove();
    //     d3.select("#container_chart").select(".country_name").remove();
    //
    //     // Redraw pie chart
    //     makePieChart(chart_data, map_data, year, geography.id);
    //
    //
    //   });
    // },
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
            "GHG Emission: " + formatValue(data.ghg) + " tCO2e / capita</div>"
        } else {
          return '<div class="hoverinfo">' +
            "<strong>" + geography.properties.name + "</strong><br/>" +
            "GHG Emission data unavailable</div>"
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
    legendTitle : "Total GHG Emissions Per Capita (tCO2e Per Capita)",
    labels: {
      veryhigh: ">15:",
      high: "10-15:",
      medium: "5-10:",
      low: "1-5:",
      verylow: "<1:"
    }
  });

};
