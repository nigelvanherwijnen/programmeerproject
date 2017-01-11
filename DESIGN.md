# Design document
### Minimum Viable Product
The homepage will contain general information and a stand-alone line graph which will be made using D3. The line graph will represent the CO2 levels in the atmosphere and will be obtained from the Carbon Dioxide Information Analysis Center.
![Alt text](/doc/title_page_v1.jpg)

A different page will contain a world map, displaying the emission of CO2 per country. In a list on the side are the countries ranked such that the most polluting country is at the top. It is possible to cycle through data of different years by using a slider. Both the map and the list will change when using the slider. Data for the map has been obtained from the World Bank. Furthermore, a line graph will show how average temperature has developed per country since 1750 (well before the industrial revolution). This data has been retrieved from Berkeley Earth. The map and list are linked to the line graph in a way that by clicking a country in either two will make the line graph show the data for that specific country.
![Alt text](/doc/CO2_emission_page_v2.jpg)

The next page will link welfare of a country to GHG emission. Two lines will be visible in a line graph. This will contain data on a single country. One line will represent the amount of CO2 a country produces per capita, whilst the other represents the GDP per capita. Data for this can be obtained from the World Bank. A bar chart will display the amount of GHG emissions per GDP. This data can be retrieved from the World Recourses Institute. By clicking on a country in the bar chart, the corresponding data will be visualized in the line graph.
![Alt text](/doc/GDP_CO2_page_v2.jpg)

### Optional
Optionally, more visualizations can be added containing data on the source of energy production. These can be obtained from the World Bank.
