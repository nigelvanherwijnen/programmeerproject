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
  // map.legend({
  //   legendTitle : "Total GHG Emissions Per Capita (tCO2e Per Capita)",
  //   labels: {
  //     veryhigh: ">15:",
  //     high: "10-15:",
  //     medium: "5-10:",
  //     low: "1-5:",
  //     verylow: "<1:"
  //   }
  // });

};

// This functions makes a pie chart
function makePieChart(list_data, line_data, chart_data, map_data, year, code) {

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
      .innerRadius(radius - 70)
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

  // // Define html text for information box
  // var info = "Some text here"
  //
  // // Define box for information text
  // var infobox = d3.select("#container_chart")
  //   .append("div")
  //   .attr("class", "infobox_chart");
  //
  // // Append title for information box
  // infobox.append("h2")
  //   .text("Green house gass emission");
  //
  // // Append text to information box
  // infobox.append("text")
  //   .html(info)

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
  d3.select("#year").on("input", function() {

    // Save new value and show on screen
    year = this.value;
    d3.select("#year-value").text(year);
    d3.select("#year").property("value", year);

    // Remove all visible things that will be redrawn
    d3.select("#container_chart").select("svg").remove();
    d3.select("#container_chart").select(".infobox_chart").remove();
    d3.select("#container_chart").select(".country_name").remove();
    d3.select("#container_map").select("svg").remove();
    d3.select("#container_map").select(".datamaps-legend").remove();
    d3.select("#container_list").selectAll("li").remove();

    // Redraw
    makePieChart(list_data, line_data, chart_data, map_data, year, code);
    makeDataMap(list_data, line_data, chart_data, map_data, year);
    makeList(list_data, line_data, chart_data, map_data, year);
  });
};

// Line graph (http://bl.ocks.org/mbostock/1541816)
function makeLineGraph(line_data, year, code) {

  var data = line_data[code];

  var total_width = 1000,
      total_height = 400;

  // Initialize graph
  var graph = d3.select("#container_line").append("svg").attr("width", total_width).attr("height", total_height),
      margin = {top: 20, right: 210, bottom: 50, left: 50},
      width = total_width - margin.left - margin.right,
      height = total_height - margin.top - margin.bottom,
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
      .attr("y", 180 + margin.top + (20 * (i + 1)))
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors[i]);

    // Write the text
    legend.append("text")
      .attr("x", 40 + width - 8)
      .attr("y", 180 + margin.top + 30 + (20 * i))
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
    .attr("y1", y(0))
    .attr("y2", y(height))
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
    focus.attr("transform", "translate(" + x(d.year) + "," + 120 + ")");


    var variables_list = ["Industrial", "Energy", "Waste", "Agriculture", "Fuel", "Land-use / Forestry", "Year"];
    var values_list = [d.industrial, d.energy, d.waste, d.agriculture, d.fuel, d.land, d.land];

    focus.selectAll(".text_class").remove();
    for (i = 0; i < 6; i++) {
      focus.append("text")
        .attr("x", 9)
        .attr("dy", -15 * i)
        .attr("class", "text_class")
        .text(variables_list[i] + ": " + values_list[i] + " MtCO2e");

    };
  };
};

// List
function makeList(list_data, line_data, chart_data, map_data, year) {

  var data = list_data[year]

  list = d3.select("#container_list").append("ul");
  list.selectAll("li")
    .data(data)
    .enter()
    .append("li")
    .text(function(d){return d.name;})
    .on("click", changeGraphs);

    function changeGraphs (d) {
      // Remove drawn elements that will be redrawn
      d3.select("#container_chart").select("svg").remove();
      d3.select("#container_chart").select(".infobox_chart").remove();
      d3.select("#container_chart").select(".country_name").remove();
      d3.select("#container_line").select("svg").remove();

      // Redraw pie chart
      makePieChart(list_data, line_data, chart_data, map_data, year, d.code);
      makeLineGraph(line_data, year, d.code);
    };


};
