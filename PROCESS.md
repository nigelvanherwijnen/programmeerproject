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
