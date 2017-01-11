# Climate change - an overview
By Nigel van Herwijnen

Climate change is a hot topic in modern society. Because of this, a lot of data is available on all branches of this topic. The problem with a surplus of data is the chaos it creates for viewers. There is no easy interface where general information and precise data are combined on a friendly webpage. This project will aim to do so. The web interface will contain multiple ways of visualizing data, which will be elaborated below.

### Visualization 1 - world map: CO2 emission per capita
This world map will be a datamap visualizing the emission per capita per country. By using a gradial colour scheme, the user will be able to see how much a country emits with respect to other countries. Data in this graph will be available for several years, which can be changed using a slider.

### Visualization 2 - line graph: CO2 levels (over thousands of years)
This graph is the famous hockey stick graph. It shows that the amount of CO2 in the atmosphere is not due to natural causes, but as a result of the industrialization.

### Visualization 3 - line graph: GDP and CO2 emission
This line graph will hold data for one specific country. It will contain a line graph showing the GDP per capita over the years and CO2 emission per capita over the years. The goal of this graph is to find out if there is any correlation in growth of a country and the amount CO2 it emits.

### Visualization 4 - bar chart: GHG emissions per GDP
To visualize if money being spend in a country is used in a polluting way, the GHG emission per GDP is visualized in a bar chart.

### Visualization 5 - line graph: Average temperature change
To show how the temperature changed through the years, the average temperature change per country is shown in a line graph. The data shown in this graph is initialized on the global temperature change and can be changed to the dataset of a specific country.

## Data
Data has been obtained from the World Bank, the World Recourses Institute and Berkeley Earth. This will be converted from CSV to JSON using a python script. The visualizations will be made using JS/D3. This will allow for interactivity and basic styling using HTML and CSS.

## GUI
A concept of the GUI can be found here.
![Alt text](/doc/title_page_v1.jpg)
![Alt text](/doc/CO2_emission_page_v2.jpg)
![Alt text](/doc/GDP_CO2_page_v2.jpg)
