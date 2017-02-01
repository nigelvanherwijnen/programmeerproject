// Nigel van Herwijnen
// UvA ID: 10330879
//
// File: slider.js

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
