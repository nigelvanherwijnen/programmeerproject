// Nigel van Herwijnen
// UvA ID: 10330879

// List (http://bl.ocks.org/gka/17ee676dc59aa752b4e6)
function makeList(list_data, line_data, chart_data, map_data, year) {

  var data = list_data[year]

  // Define the way data will be formatted
  var formatValue = d3.format(",.2f");

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
    .attr("class", function(d) { return d.cl })
    .text(function(d) { return d.head });

  //   table.selectAll("thead")
  //     .append("tr")
  //     .attr("class", "warning no-result")
  //     .enter()
  //     .append()
  //
  //     <tr class="warning no-result">
  //   <td colspan="4"><i class="fa fa-warning"></i> No result</td>
  // </tr>

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

// http://www.w3schools.com/howto/howto_js_filter_table.asp
function searchTable() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchCountry");
  filter = input.value.toUpperCase();
  table = document.getElementById("tableTopEmitters");
  tr = table.getElementsByTagName("tr");


  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
