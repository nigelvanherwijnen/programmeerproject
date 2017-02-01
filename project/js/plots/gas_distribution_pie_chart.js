// Nigel van Herwijnen
// UvA ID: 10330879
//
// File: gas_distribution_pie_chart.js

// This function initializes the pie chart
function initPieChart(list_data, line_data, chart_data, map_data, year, code) {

  // Set size of SVG and radius of chart
  var width = d3.select("#container_chart")[0][0].clientWidth,
    height = 450,
    radius = Math.min(width, height) / 2;

  // Put the svg on the page
  var svg = d3.select("#container_chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + ((width / 8) + ((height - 100) / 2)) + ")");

  // Set data
  var data = chart_data[year];

  // Define colors to use
  var color = d3.scale.ordinal()
    .range(["#7570b3", "#1b9e77", "#d95f02", "#bdbdbd"]);

  // Calculate the angles of the pie
  var pie = d3.layout.pie()
    .value(function(d) { return d[code].value; })
    .sort(null);

  // Define the arcs
  var arc = d3.svg.arc()
    .innerRadius(radius - 70)
    .outerRadius(radius - 20);


  // Draw the pie chart
  var path = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("path")
    .attr("class", "arc");

  path.attr("fill", function(d, i) { return color(i); })
    .attr("d", arc)
    .each(function(d) { this._current = d; });

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
      var horz = -2.5 * legendRectSize;
      var vert = i * height - offset;
      return "translate(" + horz + "," + vert + ")";
    });

  // Draw colors of legend
  legend.append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", color)
    .style("stroke", color);

  // Write text of legend (all in MtCO2e)
  legend.append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize - legendSpacing)
    .text(function(d) {
      if (d == 0) { return "CO2 (MtCO2)"; }
      else if (d == 1) { return "CH4 (MtCO2e)"; }
      else if (d == 2) { return "N2O (MtCO2e)"; }
      else if (d == 3) { return "Other (MtCO2e)"; };
    });

  // Write country name below title
  d3.select("#container_chart").select("svg").append("text")
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + width / 2 + "," + 20 + ")")
    .attr("class", "country_name")
    .text(function(d) { return data[0][code].name + " - " + year; });

  // Define tooltip for pie chart
  var tooltip = d3.select("#container_chart")
    .append("div")
    .attr("class", "tooltip_chart");

  // Define div's inside tooltip
  tooltip.append("div")
    .attr("class", "label_tooltip");
  tooltip.append("div")
    .attr("class", "value");

  // Show tooltip with content on mouseover
  path.on("mouseover", function(d) {
    tooltip.select(".label_tooltip").html(d.data[code].cat + ":");
    tooltip.select(".value").html(d.data[code].value + " MtCO2e");
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

  // Start listening to the year slider
  changeSlider(list_data, line_data, chart_data, map_data, year, code);
};

// This function updates the pie chart when new data is chosen
function updatePieChart(list_data, line_data, chart_data, map_data, year, code) {

  // Set size of SVG and radius of chart
  var width = d3.select("#container_chart")[0][0].clientWidth,
      height = 450,
      radius = Math.min(width, height) / 2;
  var svg = d3.select("#container_chart").select("svg").select("g");

  // Set data
  var data = chart_data[year];

  // Erase country name below title and write the new country name
  d3.select("#container_chart").select(".country_name").remove();
  d3.select("#container_chart").select("svg").append("text")
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + width / 2 + "," + 20 + ")")
    .attr("class", "country_name")
    .text(function(d) { return data[0][code].name + " - " + year; });

  // Define colors to use
  var color = d3.scale.ordinal()
    .range(["#7570b3", "#1b9e77", "#d95f02", "#bdbdbd"]);

  // Calculate the angles of the pie
  var pie = d3.layout.pie()
    .value(function(d) { return d[code].value; })
    .sort(null);

  // Define the arcs
  var arc = d3.svg.arc()
    .innerRadius(radius - 70)
    .outerRadius(radius - 20);

  // Select paths and save all the angles, then transition to new data
  var path = svg.selectAll("path")
    .each(function(d) { this._current = d; })
    .data(pie(data))
    .transition().duration(250).attrTween("d", arcTween);

  // Define tooltip of and path for pie chart
  var path_tooltip = svg.selectAll("path");
  var tooltip = d3.select(".tooltip_chart");

  // Update content shown on tooltip
  path_tooltip.on("mouseover", function(d) {
    tooltip.select(".label_tooltip").html(d.data[code].cat + ":");
    tooltip.select(".value").html(d.data[code].value + " MtCO2e");
    tooltip.style("display", "block");
  });

  // Update slider to new country
  changeSlider(list_data, line_data, chart_data, map_data, year, code);

  // Store the displayed angles in _current.
  // Then, interpolate from _current to the new angles.
  // During the transition, _current is updated in-place by d3.interpolate.
  // https://bl.ocks.org/mbostock/1346410
  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {  return arc(i(t)); };
  };
};

// This function changes the graphs to the corresponding year when slider is used
function changeSlider(list_data, line_data, chart_data, map_data, year, code) {

  // On change on the slider
  d3.select("#year").on("input", function() {

    // Save new value and show on screen
    year = this.value;
    d3.select("#year-value").text(year);
    d3.select("#year").property("value", year);

    // Remove map
    d3.select("#container_map").select("svg").remove();
    d3.select("#container_map").select(".datamaps-legend").remove();

    // Redraw
    updatePieChart(list_data, line_data, chart_data, map_data, year, code);
    makeDataMap(list_data, line_data, chart_data, map_data, year);
    makeList(list_data, line_data, chart_data, map_data, year);

  });
}
