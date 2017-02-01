# Final report
By Nigel van Herwijnen

To create an organized overview of the emission of greenhouse gasses a webpage has been made containing multiple visualizations to inform the user about these emissions. A DataMap visualizes the emission per capita per country and a table contains a ranked list of the total emission per country. After selecting a country, the user is shown a line graph visualizing the total emission per sector over the years and a pie chart visualizing the different types of greenhouse gasses.
![Alt text](/doc/total_screenshot.png)

## High level overview
The necessary files for the project are divided over five folders: css, data, img, js and vendor. Only the HTML file can be found in the root of the folder. Naturally, all CSS files and JavaScript files can be found in the css folder and the js folder respectively. The JSON file containing the data for the graphs, the SVG and topoJSON can be found in the data folder. The img folder contains images that will be shown on the webpage. The last folder, vendor, contains Bootstrap files, fonts and a copy of jQuery.

## Pipeline
#### js/gasses.js
The pipeline can be found in gasses.js. In the file, it is easily visible that when the window is loaded, all the data is processed for all the different visualizations. Then, all the visualizations are made.

## DataMap
#### js/process.js, js/plots/map.js, css/map.css
The DataMap contains data on the greenhouse gas emission per capita. Firstly, the data is processed with the function processDataMap() which can be found in process.js. In the outputted file, the data is put into categories that will have different colors on the map. A gradial color scheme has been chosen, because it allows the user to see how much a country emits with respect to other countries.

The DataMap, that is rendered in ghg_datamap.js, contains a template (popupTemplate) for the tooltip that is filled with the correct data on hover. DataMap contains a 'done' function that can be executed when the map is drawn. In this function, an 'on click' function is made that updates the pie chart and line graph to visualize the selected country.

## Table
#### js/process.js, js/plots/table.js, css/table.css
On the page is shown a table that contains a ranked list of total greenhouse gas emission per country. The countries are ranked by the function processDataList() before being made into a table. The initial idea was to make it a list, but a table allows for much more interactivity with the user.

The function makeList() makes the table, which was initially a list. The columns are declared, and the table is made. During this process, an on-click function is given along with the rows. This function contains the update of the pie chart and line graph as in the on-click function of the map. After that, the table is made into a DataTable, a Bootstrap plug-in that gives a lot more functionality to a table using jQuery. This allows the user to sort the table alphabetically and numerically, both ascending and descending. Furthermore, a search bar is connected to the table to allow the user to easily search in the table. When the country cannot be found, the user is informed accordingly.

## Line graph
#### js/process.js, js/plots/line.js, css/line.css
The line graph on the page shows the total amount of greenhouse gasses emitted per sector. Each line represents a different sector. The data is processed accordingly by processDataLine() and then plotted with the function makeLineGraph().

Inside the function that makes the graph, two more functions can be found. The first is the function drawLine() that actually draws the line. This allows easy drawing of the six individual lines. A second function, mousemove(), contains the code that is executed when the user hovers with the mouse over the graph. When this happens, the user is shown specific data on the selected year and a guiding line. Using a line graph with 6 lines makes it very clear how certain events in a countries history affected certain sectors. The downside to plotting six graphs at the same time, is the big bulge of data that is shown when hovering over the graph. This makes it feel a bit unorganized, but by relatively keeping the text at the same place from the line, this is mostly avoided.

## Pie chart
#### js/process.js, js/plots/pie.css, css/pie.ss
The third visualization is a pie chart, showing the different greenhouse gasses that are being emitted by a country. After processing the data with processDataChart(), the pie chart is initialized with initPieChart(). This draws the SVG, the legend, defines all the necessary components and draws the pie chart for the initial country. When a different country or year is chosen, the function updatePieChart() is used. This function updates the title and transitions the pie chart to visualize the new data. This is done by first saving the current angles, then calculating the new angles and finally transitioning into the new state using arcTween(), a function by Mike Bostock available on bl.ocks.org.

## Slider
#### js/slider.js, css/slider.css
Data is available from 1990 up to and including 2012. To scroll through these years, the user can use a slider. When the slider is used, the map, the table and the pie chart are updated to show the correct data. The styling of the slider has been done with a slider generator by cssportal.

## Theme
The Bootstrap theme Agency by FreebiesXpress has been used to style the page. This responsive template makes the webpage very organized and easy to look at. The eventual design is very different from the initial design. The extra visualizations would be worth the extra work if that would mean that there was less time to make the pie chart animation or highly interactive table. This means that there is only a single page with visualizations. The elements are all connected, from which it follows that it is not an option to split the visualizations among different pages. But this also means that there is no place for general information or storytelling. By using a scrollable template, the graphs can still be grouped whilst still having place for a big text area.
