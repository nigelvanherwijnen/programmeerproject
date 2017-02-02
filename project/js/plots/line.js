// Nigel van Herwijnen
// UvA ID: 10330879
//
// File: ghg_per_sector_line_graph.js

// This function makes a line graph
function makeLineGraph(line_data, year, code) {

  // Set data
  var data = line_data[code];

  // Retrieve width and set height
  var total_width = d3.select("#container_line")[0][0].clientWidth,
      total_height = 450;

  // Remove graph if already present
  d3.select("#container_line").select("svg").remove();

  // Initialize graph
  var graph = d3.select("#container_line").append("svg")
                .attr("width", total_width)
                .attr("height", total_height),
      margin = {top: 20, right: 140, bottom: 50, left: 40},
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
      .interpolate("cardinal")
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
  y.domain([
    d3.min([data], function(c) {
      return d3.min(c.values, function(d) {
        return Math.min(0, d.waste, d.energy, d.industrial, d.land, d.agriculture, d.fuel);
      });
    }),
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
    .text("Gas (MtCO2e)");


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

  // Add a variable to hold a legend
  var legend = g.selectAll(".country")
    .data([data])
    .enter().append("g")
    .attr("class", "legend");

  // Define names for in legend
  var legend_names = ["Industrial", "Energy", "Waste", "Agriculture", "Fuel", "Land-use / Forestry"]

  // Make legend
  for (i = 0; i < 6; i++) {
    // Draw the colored boxes
    legend.append("rect")
      .attr("x", 40 + width - 20)
      .attr("y", 130 + margin.top + (20 * (i + 1)))
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors[i]);

    // Write the text
    legend.append("text")
      .attr("x", 40 + width - 8)
      .attr("y", 130 + margin.top + 30 + (20 * i))
      .text(legend_names[i]);
  };

  // Write the name of the country currently active on screen
  g.selectAll(".country_line").remove();
  g.append("text")
  .attr("class", "country_line")
  .attr("x", width)
  .attr("dy", 28)
  .text(data["name"])

  // Define variable to hold information on data
  var focus = g.append("g")
    .attr("class", "focus")
    .style("display", "none");

  // Append a horizontal line
  focus.append("line")
    .attr("y1", -(height / 2))
    .attr("y2", (height / 2) + 10)
    .style("stroke-width", 1.5)
    .style("stroke", "black")
    .style("fill", "none");

  // Append information to canvas
  g.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

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

  // This function renders the information to be gathered on mouseover
  function mousemove() {

    // Find out which datapoint is pointed at
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data["values"], x0, 1),
      d0 = data["values"][i - 1],
      d1 = data["values"][i],
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;

    // Translate the mouseover to the calculated position
    focus.attr("transform", "translate(" + x(d.year) + "," + 180 + ")");

    // Set variables to be printed
    var variables_list = ["Industrial", "Energy", "Waste", "Agriculture", "Fuel", "Land-use / Forestry", "Year"];
    var values_list = [d.industrial, d.energy, d.waste, d.agriculture, d.fuel, d.land, d.year];

    // Empty focus
    focus.selectAll(".text_class").remove();

    // Print all variables
    for (i = 0; i < 6; i++) {
      focus.append("text")
        .attr("x", 9)
        .attr("dy", -15 * i)
        .attr("class", "text_class")
        .text(variables_list[i] + ": " + formatValue(values_list[i]));

    };

    // Add two more elements
    focus.append("text")
      .attr("x", 9)
      .attr("dy", -15 * 6)
      .attr("class", "text_class")
      .text("Data in MtCO2");
    focus.append("text")
      .attr("x", 9)
      .attr("dy", -15 * 7)
      .attr("class", "text_class")
      .text(variables_list[6] + ": " + values_list[6]);
  };
};
