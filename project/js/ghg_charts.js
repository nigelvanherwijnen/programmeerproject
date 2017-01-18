// Nigel van Herwijnen
// UvA ID: 10330879


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

        // // Surprise when clicking on USA
        // if (geography.id == "USA" || geography.id == "RUS") { window.open('https://goo.gl/a1N33x', '_blank'); }

        // Remove drawn elements that will be redrawn
        d3.select("#container_chart").select("svg").remove();
        d3.select("#container_chart").select(".infobox_chart").remove();
        d3.select("#container_chart").select(".country_name").remove();
        d3.select("#container_chart").select(".tooltip_chart").remove();
        d3.select("#container_line").select("svg").remove();

        // Redraw pie chart
        makePieChart(list_data, line_data, chart_data, map_data, year, geography.id);
        makeLineGraph(line_data, year, geography.id);
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
};

// Line graph (http://bl.ocks.org/mbostock/1541816)
function makeLineGraph(line_data, year, code) {

  var data = line_data[code];

  var total_width = d3.select("#container_line")[0][0].clientWidth,
      total_height = 450;

  // Initialize graph
  var graph = d3.select("#container_line").append("svg")
                .attr("width", total_width)
                .attr("height", total_height),
      margin = {top: 70, right: 140, bottom: 50, left: 20},
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
  y.domain([0,
    d3.max([data], function(c) {
      return d3.max(c.values, function(d) {
        return Math.max(d.waste, d.energy, d.industrial, d.land, d.agriculture, d.fuel);
      });
    })
  ]);


  graph.append("text")
    // .attr("font-weight", "bold")
    .attr("font-size", "20px")
    .attr("transform", "translate(" + margin.left + "," + 40 + ")")
    .text("GHG emission per sector")

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

  // Write the name of the city currently active on screen
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


  // This function renders the information to be gathered on mouseover
  function mousemove() {

    // Find out which datapoint is pointed at
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data["values"], x0, 1),
      d0 = data["values"][i - 1],
      d1 = data["values"][i],
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;

    // Translate the mouseover to the calculated position
    focus.attr("transform", "translate(" + x(d.year) + "," + 160 + ")");


    var variables_list = ["Industrial", "Energy", "Waste", "Agriculture", "Fuel", "Land-use / Forestry", "Year"];
    var values_list = [d.industrial, d.energy, d.waste, d.agriculture, d.fuel, d.land, d.year];

    focus.selectAll(".text_class").remove();


    for (i = 0; i < 6; i++) {
      focus.append("text")
        .attr("x", 9)
        .attr("dy", -15 * i)
        .attr("class", "text_class")
        .text(variables_list[i] + ": " + formatValue(values_list[i]));

    };
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

// List (http://bl.ocks.org/gka/17ee676dc59aa752b4e6)
function makeList(list_data, line_data, chart_data, map_data, year) {

  var data = list_data[year]

  // Define the way data will be formatted
  var formatValue = d3.format(",.2f");

  // Create table
  var table = d3.select("#container_list").append("table").attr("class", "table table-hover");

  // Define the columns
  var columns = [
    { head: "#", cl: "number", html: function(d) { return d.rank; }, "code": function(d) { return d.code; } },
    { head: "Name", cl: "title", html: function(d) { return d.name; }, "code": function(d) { return d.code; } },
    { head: "Emission (MtCO2e)", cl: "center", html: function(d) { return formatValue(d.total); }, "code": function(d) { return d.code; } }
  ];

  // Append the header to the table
  table.append("thead")
    .append("tr")
    .selectAll("th")
    .data(columns).enter()
    .append("th")
    .attr("class", function(d) { return d.cl })
    .text(function(d) { return d.head });

  // Append the rest of the table
  table.append("tbody")
    // Append row
    .selectAll("tr")
    .data(data).enter()
    .append("tr")
    // Append cell
    .selectAll("td")
    .data(function(row, i) {
        return columns.map(function(c) {
            // NOG EVEN UITZOEKEN HOE DIT PRECIES WERKT
            var cell = {};
            d3.keys(c).forEach(function(k) {
                cell[k] = typeof c[k] == "function" ? c[k](row,i) : c[k];
            });
            return cell;
        });
    }).enter()
    .append("td")
    .html(function(d) { return d.html; })
    .attr("class", function(d) { return d.cl; })
    .on("click", changeGraphs);

    // When clicking an item, view correct graphs
    function changeGraphs (d) {
      // Remove drawn elements that will be redrawn
      d3.select("#container_chart").select("svg").remove();
      d3.select("#container_chart").select(".infobox_chart").remove();
      d3.select("#container_chart").select(".country_name").remove();
      d3.select("#container_chart").select(".tooltip_chart").remove();
      d3.select("#container_line").select("svg").remove();

      // Redraw pie chart
      makePieChart(list_data, line_data, chart_data, map_data, year, d.code);
      makeLineGraph(line_data, year, d.code);
    };




};
