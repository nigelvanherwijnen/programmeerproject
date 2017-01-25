// This functions makes a pie chart
function makePieChart(list_data, line_data, chart_data, map_data, year, code) {

  // Set data
  var data = chart_data[year];

  // Set size of SVG and radius of chart
  var width = d3.select("#container_chart")[0][0].clientWidth,
    height = 450,
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
      .innerRadius(radius - 70)
      .outerRadius(radius - 20);

  // Put the svg on the page
  var svg = d3.select("#container_chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + ((width / 8) + ((height - 50) / 2)) + ")");

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

  // Write title
  d3.select("#container_chart").select("svg").append("text")
    // .attr("font-weight", "bold")
    .attr("font-size", "20px")
    // .attr("text-align", "center")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + width / 2 + "," + 40 + ")")
    .text("Gass distribution")

  // Write country name below title
  d3.select("#container_chart").select("svg").append("text")
    // .attr("font-weight", "bold")
    .attr("font-size", "16px")
    // .attr("text-align", "center")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + width / 2 + "," + 70 + ")")
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

  // On change on the slider
  d3.select("#year").on("input", function() {

    // Save new value and show on screen
    year = this.value;
    d3.select("#year-value").text(year);
    d3.select("#year").property("value", year);

    // Remove all visible things that will be redrawn
    d3.select("#container_chart").select("svg").remove();
    d3.select("#container_chart").select(".infobox_chart").remove();
    d3.select("#container_chart").select(".country_name").remove();
    d3.select("#container_chart").select(".tooltip_chart").remove();
    d3.select("#container_map").select("svg").remove();
    d3.select("#container_map").select(".datamaps-legend").remove();
    d3.select("#container_list").selectAll("ul").remove();

    // Redraw
    makePieChart(list_data, line_data, chart_data, map_data, year, code);
    makeDataMap(list_data, line_data, chart_data, map_data, year);
    makeList(list_data, line_data, chart_data, map_data, year);

  });

  // UNCOMMENT TO REDRAW PLOTS ON RESIZE
  // $(window).resize(function () {
  //   // Remove all visible things that will be redrawn
  //   d3.select("#container_chart").select("svg").remove();
  //   d3.select("#container_chart").select(".infobox_chart").remove();
  //   d3.select("#container_chart").select(".country_name").remove();
  //   d3.select("#container_chart").select(".tooltip_chart").remove();
  //   d3.select("#container_map").select("svg").remove();
  //   d3.select("#container_map").select(".datamaps-legend").remove();
  //   d3.select("#container_list").selectAll("ul").remove();
  //   d3.select("#container_line").select("svg").remove();
  //
  //   // Redraw
  //   makePieChart(list_data, line_data, chart_data, map_data, year, code);
  //   makeDataMap(list_data, line_data, chart_data, map_data, year);
  //   makeList(list_data, line_data, chart_data, map_data, year);
  //   makeLineGraph(line_data, year, code);
  // });

};
