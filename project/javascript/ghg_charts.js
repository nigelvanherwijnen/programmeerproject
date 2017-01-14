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

function makeLineGraph(line_data, year, code) {

  var data = line_data[code];

  // Initialize graph
  var graph = d3.select("svg"),
      margin = {top: 20, right: 100, bottom: 50, left: 50},
      width = graph.attr("width") - margin.left - margin.right,
      height = graph.attr("height") - margin.top - margin.bottom,
      g = graph.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Setup functions to parse dates and values
  var parseTime = d3.time.format("%Y").parse,
      bisectDate = d3.bisector(function(d) { return d.year; }).left,
      formatValue = d3.format(",.2f");

  // Define graph colors and scaling factors
  var colors = ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02"];
  var x = d3.scale.linear().range([0, width]),
      y = d3.scale.linear().range([height, 0]),
      z = d3.scale.category20();

  // Define line to draw graph
  var line = d3.svg.line()
      .x(function(d) { return x(d.year); });

  // Define the x axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickFormat(d3.format("d"));

  // Define the y axis
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // Calculate domains for x and y axes
  x.domain(d3.extent(data["values"], function(d) { return d.year }));
  y.domain([0,
    d3.max([data], function(c) {
      return d3.max(c.values, function(d) {
        return Math.max(d.waste, d.energy, d.industrial, d.land, d.agriculture, d.fuel);
      });
    })
  ]);

  // Make the x axis
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Make the y axis
  g.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .style("text-anchor", "end")
    .text("Gass (MtCO2e)");


  // Define variable for the plot
  var plot = g.selectAll(".plot")
    .data([data])
    .enter().append("g")
    .attr("class", "line_graph");

  // Draw three graphs for three variables
  drawLine("waste", colors[2]);
  drawLine("energy", colors[1]);
  drawLine("industrial", colors[0]);
  drawLine("agriculture", colors[3]);
  drawLine("fuel", colors[4]);
  drawLine("land", colors[5]);

  // This function draws the graphs
  function drawLine(whichFeature, color){

    line.y(function(d) {
      // console.log(whichFeature);
      return y(d[whichFeature]); }
    );

    // Append the line to the graph
    plot.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", color);

  };

  // Add a variable to hold a legend
  var legend = g.selectAll(".country")
    .data([data])
    .enter().append("g")
    .attr("class", "legend");

  // Append colored boxes to legend
  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", margin.top + 20)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors[0]);

  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", margin.top + 40)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors[2]);

  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", margin.top + 60)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors[1]);

  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", margin.top + 80)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors[3]);

  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", margin.top + 100)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors[4]);

  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", margin.top + 120)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors[5]);

  // Append variable names to legend
  legend.append("text")
      .attr("x", width - 8)
      .attr("y", margin.top + 30)
      .text("Industrial");

  legend.append("text")
      .attr("x", width - 8)
      .attr("y", margin.top + 50)
      .text("Waste");

  legend.append("text")
      .attr("x", width - 8)
      .attr("y", margin.top + 70)
      .text("Energy");

  legend.append("text")
      .attr("x", width - 8)
      .attr("y", margin.top + 90)
      .text("Agriculture");

  legend.append("text")
      .attr("x", width - 8)
      .attr("y", margin.top + 110)
      .text("Fuel");

  legend.append("text")
      .attr("x", width - 8)
      .attr("y", margin.top + 130)
      .text("Land-use / Forestry");

  // Buttons that remove present graph and draw new dataset
  // d3.select("#data0")
  //   .on("click", function(d,i) {
  //       g.selectAll(".line_graph").remove();
  //       render(data1);
  //   })
  // d3.select("#data1")
  //     .on("click", function(d,i) {
  //       g.selectAll(".line_graph").remove();
  //       render(data2);
  //     })

  // Default dataset, before buttons are pressed
  // render(data);
  //
  // // This functions renders the graphs to be drawn.
  // function render(data) {
  //
  //   // Write the name of the city currently active on screen
  //   // g.selectAll(".city_name").remove();
  //   // g.append("text")
  //   //   .attr("class", "city_name")
  //   //   .attr("x", width)
  //   //   .attr("dy", 28)
  //   //   .text(data["name"])
  //
  //   // Define variable for the plot
  //   var plot = g.selectAll(".plot")
  //     .data(data)
  //     .enter().append("g")
  //     .attr("class", "line_graph");
  //
  //   // Draw three graphs for three variables
  //   drawLine("waste", colors[2]);
  //   drawLine("energy", colors[1]);
  //   drawLine("industrial", colors[0]);
  //
  //   // Define variable to hold information on data
  //   // var focus = g.append("g")
  //   //     .attr("class", "focus")
  //   //     .style("display", "none");
  //
  //   // Append a horizontal line
  //   // focus.append("line")
  //   //   .attr("y1", y(0))
  //   //   .attr("y2", y(height))
  //   //   .style("stroke-width", 2)
  //   //   .style("stroke", "black")
  //   //   .style("fill", "none");
  //
  //   // Append information to canvas
  //   // g.append("rect")
  //   //     .attr("class", "overlay")
  //   //     .attr("width", width)
  //   //     .attr("height", height)
  //   //     .on("mouseover", function() { focus.style("display", null); })
  //   //     .on("mouseout", function() { focus.style("display", "none"); })
  //   //     .on("mousemove", mousemove);
  //
  //   // This function renders the information to be gathered on mouseover
  //   // function mousemove() {
  //   //
  //   //   // Find out which datapoint is pointed at
  //   //   var x0 = x.invert(d3.mouse(this)[0]),
  //   //       i = bisectDate(data[0]["values"], x0, 1),
  //   //       d = data[0]["values"][i];
  //   //
  //   //   // Translate the mouseover to the calculated position
  //   //   focus.attr("transform", "translate(" + x(d.date) + "," + y(30) + ")");
  //   //
  //   //   // Save a string containing date information
  //   //   var date_string = d.date.getDate() + "/" + d.date.getMonth() + "/" + (1900 + d.date.getYear());
  //   //
  //   //   // Remove text if present and append new text
  //   //   focus.selectAll(".text_class").remove();
  //   //   focus.append("text")
  //   //       .attr("x", 9)
  //   //       .attr("dy", 0)
  //   //       .attr("class", "text_class")
  //   //       .text("Minimum: " + formatValue(d.minimum) + " ºC");
  //   //   focus.append("text")
  //   //       .attr("x", 9)
  //   //       .attr("dy", -15)
  //   //       .attr("class", "text_class")
  //   //       .text("Average: " + formatValue(d.average) + " ºC");
  //   //   focus.append("text")
  //   //       .attr("x", 9)
  //   //       .attr("dy", -30)
  //   //       .attr("class", "text_class")
  //   //       .text("Maximum: " + formatValue(d.maximum) + " ºC");
  //   //   focus.append("text")
  //   //       .attr("x", 9)
  //   //       .attr("dy", -45)
  //   //       .attr("class", "text_class")
  //   //       .text("Date: " + date_string);
  //   // };
  //
  //   // This function draws the graphs
  //   function drawLine(whichFeature, color){
  //
  //     line.y(function(d) {
  //       console.log(d);
  //       return y(d[whichFeature]); }
  //     );
  //
  //     // Append the line to the graph
  //     plot.append("path")
  //       .attr("class", "line")
  //       .attr("d", function(d) { return line(d.values); })
  //       .style("stroke", color);
  //   };
  // };


};
