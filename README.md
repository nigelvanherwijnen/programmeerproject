# Climate change - an overview
By Nigel van Herwijnen

Climate change is a hot topic in modern society. Because of this, a lot of data is available on all branches of this topic. The problem with a surplus of data is the chaos it creates for viewers. There is no easy interface where general information and precise data are combined on a friendly webpage. This project will aim to do so. The web interface will contain multiple ways of visualizing data, which will be elaborated below.

### Visualization 1 - world map: GHG emission per capita
This world map will be a datamap visualizing the emission per country. By using a gradial colour scheme, the user will be able to see how much a country emits with respect to other countries. Data in this graph will be available for several years, which can be changed using a slider.

### Table: top emitters
A table gives an easy overview of the countries and the total amount of greenhouse gasses being emitted. Initially it is sorted with the greatest emitters on top and the least emitters on the bottom, but by clicking the title this can be switched or sorted alphabetically.

![Alt text](/doc/map_table.png)

### Visualization 2 - line graph: Emission by sector
After selecting a country on the world map or in the table, this line graph will show from which sector the GHG emission originates. This is done by viewing several lines, each representing a sector. In this way, it can also be used to see how the emission per sector chances over the years.

### Visualization 3 - pie chart: Emission by gasses
After selecting a country on the world map or in the table, this pie chart will show what the ratio of different greenhouse gasses is that are being emitted by a country.

![Alt text](/doc/line_pie.png)

## Data
Data has been obtained from the World Recourses Institute. This will is converted from CSV to JSON using a python script. The visualizations will be made using JS/D3. This will allow for interactivity and basic styling using HTML and CSS.
