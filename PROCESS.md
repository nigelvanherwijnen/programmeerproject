# Process book

## Day 1 - 09/01/2017
On the first day, the first version of the concept plan had been made and the README had been constructed.

## Day 2 - 10/01/2017
One of the problems in the first version of the concept plan was that a story was missing. This was partly because there were too many graphs on a single page. It was too chaotic. This is resolved by creating multiple pages. The homepage will be an eye catcher with the hockey stick graph and some general information. A second page will include a map showing CO2 emissions per country, a ranking of the countries of these emissions and a line graph visualizing the average temperature over the years of a specific country.
An additional page will focus on the relation between the emission of green house gasses and the welfare of a country. This page will include a bar chart viewing the GHG emission per GDP and a line graph containing two lines, one for the GDP over the years and one for the CO2 emission over the years.
The last page will include information on the way energy is produced. This means the focus of the total project will be on CO2 emission, the correlation with the welfare of a country and the way energy is produced. The visualization showing information on deforestation and urbanization will probably be left out.

## Day 3 - 11/01/2017
The new plan has been elaborated today and the design document has been made.

## Day 4 - 12/01/2017
Today I have planned to have all data collected. I have found out that the datasets for GHG emissions per GDP, GHG emission per capita are not available, but will have to be calculated. This will have to be done whilst converting multiple CSV's from different sets into one JSON set.
No useful dataset can be found on the temperature per country. This, and the thought that the change in temperature per country might not be a fitting link to CO2 emission, has led to the conclusion that the line graph on temperature over the years per country will be left out. Instead, a line graph will visualize from which sector the GHG emissions are originating by plotting a line per sector. Furthermore, a pie chart will visualize which gasses are emitted in which ratio. This will be in range of 1960 to 2012. This tells a more fitting story to the data in the world map.

## Day 5 - 13/01/2017
After collecting all data in the last few days, today the goal was to process the data for the map into JSON and format it in javascript. This was done by calculating the GHG emission per capita with the GHG emission per country and the population per country. But after visualizing this data in a datamap, it was clear that the data was incorrect. Why this was the case is still unknown to me, but luckily I have found a new dataset containing the GHG emission per capita. No calculations will be required. The correct data has now been implemented correctly.

## Day 6 - 14/01/2017
Because of the open issue on GitHub, I decided to work an extra day in the weekend. All data for the MVP has been converted to JSON. All data for the datamap and pie chart are correctly processed. Both the datamap and pie chart are functional and linked. A problem came up when values were greater than 1000, but it has been resolved by changing the numberformat in process.js.

Data for line graph has correctly been imported and the graph has been made. It is functional, but not yet interactive or linked.

## Day 8 - 16/01/2017
An interactive list has been implemented. This list shows the top 10 emitters per capita and updates when using the slider. On click, the pie chart and the line graph are updated to view information on the chosen country.

## Day 10 - 18/01/2017
To make the page organized Bootstrap has been implemented. The data for the top 10 emitters has been changed. It now holds the top emitters totally, whilst it showed the top 10 per capita before. Furthermore, it has been changed into a table instead of a list and all the countries are visible (not just the top 10).

## Day 11 - 19/01/2017
A lot of minor things have been fixed today (location of line over line graph, missing text in tooltip over pie chart, etc.). Further style things have been done (styling input slider, location and style of legends, etc.).

## Day 15 - 23/01/2017 and day 16 - 24/01/2017
Now the MVP has been finished, extra components can be made and minor things that could break the page should be fixed. Today was about brainstorming how to implement the extra components and how the page overall should look.

* The distribution of JS code has been changed to make the file tree more coherent.
* A jQuery function has been written that renders the visualizations when the window has been rescaled, but I commented it out because it made the page buggy, unresponsive and slow.
* The line graph now takes as y_min the minimum value in the graph or zero.
* The sequence of the labels in the legend of the datamap has been changed to a logical sequence.
* Added search bar to table. The hourglass button is just for show. By adding the button it is clearer that there will be a change somewhere on the page by using the search bar. It doesn't do anything, because the search is done while typing.

## Day 17 - 25/01/2017
In the list, a function within a function has been taken out of scope. Fixed a bug where the table was not updated when using the slider. Tried changing the table to DataTable. The search bar has to be placed correctly and now only a couple of results are shown instead of a scrollable list.

Table is now sortable and all results are shown. The self made search box is now linked to the table and DataTable's search box has been made invisible. Also started on making the pie chart animated.

## Day 18 - 26/01/2017 and day 19 - 27/01/2017
Tried changing the way the pie chart is being made to make transition animations nicer. A start has been made.

## Day 20 - 28/01/2017 and day 21 - 29/01/2017
The pie chart now consists of two functions: one that initiates the chart with all the text, legend and data for initial country, and a second function that updates the the data shown in the chart. The transition is now smooth instead of static (YAY!). Furthermore, I cleaned up the way the visualizations were being updated. Erasing the old elements is now the first step inside the functions, which makes the code cleaner.

## Day 22 - 30/01/2017
Rigorous cleaning up of code (really every file, including splitting css) and starting on final lay-out. Retrieved a Bootstrap template and started adjusting for own use and implementing own elements. Also added a MIT license.

## Day 23 - 31/01/2017
Updated readme file.

## Day 24 - 01/02/2017
Fixed error where wrong data was shown in tooltip of pie chart. Fixed error where wrong data was shown as "Other" in the pie chart.
