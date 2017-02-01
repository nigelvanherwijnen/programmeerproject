// Nigel van Herwijnen
// UvA ID: 10330879
//
// File: ghg_list.js
// Comment: As done by Gregor Aisch on http://bl.ocks.org/gka/17ee676dc59aa752b4e6.
// Made into a DataTable as seen on http://stackoverflow.com/questions/5990386/datatables-search-box-outside-datatable.

// This function makes the table containing the ranked countries
function makeList(list_data, line_data, chart_data, map_data, year) {

  // Set data
  var data = list_data[year]

  // Define the way data will be formatted
  var formatValue = d3.format(",.2f");

  // Remove table if already present
  d3.select("#container_list").selectAll("table").remove();

  // Create table
  var table = d3.select("#container_list").append("table")
    .attr("class", "table table-hover results")
    .attr("id", "tableTopEmitters");

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
            // Pick matching data for cell
            var cell = {};
            d3.keys(c).forEach(function(k) {
                cell[k] = typeof c[k] == "function" ? c[k](row,i) : c[k];
            });
            return cell;
        });
    }).enter()
    .append("td")
    // Fill cell accordingly
    .html(function(d) { return d.html; })
    .attr("class", function(d) { return d.cl; })
    // Give action on click
    .on("click", function(d) {
      updatePieChart(list_data, line_data, chart_data, map_data, year, d.code);
      makeLineGraph(line_data, year, d.code);
      changeSlider(list_data, line_data, chart_data, map_data, year, code);
    });


  // Turn table into DataTable without paging and with customized dom
  var Table = $('#tableTopEmitters').DataTable({
    paging: false,
    "sDom": '<"top">rt<"bottom"lp><"clear">'
  });

  // Link custom search box to table
  $('#searchCountry').keyup(function(){
        Table.search($(this).val()).draw() ;
  });
};
