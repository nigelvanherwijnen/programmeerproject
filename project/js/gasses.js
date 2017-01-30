// Nigel van Herwijnen
// UvA ID: 10330879
//
// File: gasses.js

// Start when window is loaded
window.onload = function() {

  // Load JSON data, log on error
  d3.json("data/data_ghg.json", function(error, jsonData) {
    if(error) throw error;

    // Format data for chart and map
    var map_data = processDataMap(jsonData);
    var chart_data = processDataChart(jsonData);
    var line_data = processDataLine(jsonData);
    var list_data = processDataList(jsonData);

    // Setup default year
    var year = 2001;
    d3.select("#year-value").text(year);
    d3.select("#year").property("value", year);

    // Make a new datamap
    makeDataMap(list_data, line_data, chart_data, map_data, year);
    initPieChart(list_data, line_data, chart_data, map_data, year, "NLD");
    makeLineGraph(line_data, year, "NLD");
    makeList(list_data, line_data, chart_data, map_data, year);
  });
};
