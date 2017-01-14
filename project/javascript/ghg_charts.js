// Nigel van Herwijnen
// UvA ID: 10330879


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

        // // Surprise when clicking on USA
        // if (geography.id == "USA" || geography.id == "RUS") { window.open('https://goo.gl/a1N33x', '_blank'); }

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

// This functions makes a pie chart
function makePieChart(chart_data, map_data, year, code) {

  // Set data
  var data = chart_data[year];

  // Set size of SVG and radius of chart
  var width = 1000,
    height = 400,
    radius = Math.min(width, height) / 2;

  // Define colors to use
  var color = d3.scale.ordinal()
    .range(["#7570b3", "#1b9e77", "#d95f02", "#bdbdbd"]);

  // Calculate the angles of the pie
  var pie = d3.layout.pie()
      .value(function(d) { return d[code].value; })
      .sort(null);

  // Define the arcs
  var arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 20);

  // Put the svg on the page
  var svg = d3.select("#container_chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / (4/3) + "," + height / 2 + ")");

  // Draw the pie chart
  var path = svg.datum(data).selectAll("path")
      .data(pie)
      .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc);

  // Define size of legend squares
  var legendRectSize = 17;
  var legendSpacing = 5;

  // Define the legend inside the pie chart
  var legend = svg.selectAll(".legend_chart")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend_chart")
    .attr("transform", function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = -3 * legendRectSize;
      var vert = i * height - offset;
      return "translate(" + horz + "," + vert + ")";
    });

  // Draw colors of legend
  legend.append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", color)
    .style("stroke", color);

  // Write text of legend
  legend.append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize - legendSpacing)
    .text(function(d) {
      if (d == 0) { return "Total CO2 (MtCO2)"; }
      else if (d == 1) { return "Total CH4 (MtCO2e)"; }
      else if (d == 2) { return "Total N2O (MtCO2e)"; }
      else if (d == 3) { return "Other (MtCO2e)"; };
    });

  // Define html text for information box
  var info = "Some text here"

  // Define box for information text
  var infobox = d3.select("#container_chart")
    .append("div")
    .attr("class", "infobox_chart");

  // Append title for information box
  infobox.append("h2")
    .text("Green house gass emission");

  // Append text to information box
  infobox.append("text")
    .html(info)

  // Define tooltip for pie chart
  var tooltip = d3.select("#container_chart")
    .append("div")
    .attr("class", "tooltip_chart");

  // Define div's inside tooltip
  tooltip.append("div")
    .attr("class", "label");
  tooltip.append("div")
    .attr("class", "value");

  // Show tooltip with content on mouseover
  path.on("mouseover", function(d) {
    tooltip.select(".label").html(d.data[code].cat);
    tooltip.select(".value").html(d.data[code].value + " MtCO2(e)");
    tooltip.style("display", "block");
  });

  // Hide tooltip on mouseout
  path.on("mouseout", function() {
    tooltip.style("display", "none");
  });

  // Let the tooltip follow the mouse
  path.on("mousemove", function(d) {
    tooltip.style("top", (d3.event.layerY + 10) + "px")
      .style("left", (d3.event.layerX + 10) + "px");
  });

  // Define div for the country name above pie chart
  var country_name = d3.select("#container_chart")
    .append("div")
    .attr("class", "country_name");

  // Append country name text to div
  country_name.append("text")
    .text(function(d) { return data[0][code].name; });

  // On change on the slider
  // d3.select("#year").on("input", function() {
  //
  //   // Save new value and show on screen
  //   year = this.value;
  //   d3.select("#year-value").text(year);
  //   d3.select("#year").property("value", year);
  //
  //   // Remove all visible things that will be redrawn
  //   d3.select("#container_chart").select("svg").remove();
  //   d3.select("#container_chart").select(".infobox_chart").remove();
  //   d3.select("#container_chart").select(".country_name").remove();
  //   d3.select("#container_map").select("svg").remove();
  //   d3.select("#container_map").select(".datamaps-legend").remove();
  //
  //   // Redraw
  //   makePieChart(chart_data, map_data, year, code);
  //   makeDataMap(chart_data, map_data, year);
  // });
};
