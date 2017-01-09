# Climate change - an overview
By Nigel van Herwijnen

Climate change is a hot topic in modern society. Because of this, a lot of data is available on all branches of this topic. The problem with a surplus of data is the chaos it creates for viewers. There is no easy interface where general information and precise data are combined on a friendly webpage. This project will aim to do so. The web interface will contain multiple ways of visualizing data, which will be elaborated below.

### Visualization 1 - world map: CO2 emission per capita
This world map will be a datamap visualizing the emission per capita per country. By using a gradial colour scheme, the user will be able to see how much a country emits with respect to other countries. Data in this graph will be available for several years, which can be changed using a slider.

### Visualization 2 - line graph: CO2 levels (over thousands of years)
This graph is the famous hockey stick graph. It shows that the amount of CO2 in the atmosphere is not due to natural causes, but as a result of the industrialization.

### Visualization 3 - line graph: GDP and CO2 emission
This line graph will hold data for one specific country. It will contain a line graph showing the GDP per capita over the years and CO2 emission per capita over the years. The goal of this graph is to find out if there is any correlation in growth of a country and the amount CO2 it emits.

### Visualization 4 - line graph: Forest area and urban population
By plotting the amount of forest in a country and the amount of people living in urban places in a country, a correlation might be found in deforestation and people leaving rural areas to live in urban areas. Both datasets are in percentages of total.

### Visualization 5 - pie chart: Energy sources
To show the user what kind of energy is produced, the viewer can select a country and see in a pie chart what percentage of the country's energy consumption is produced from which source. This includes among others sources such as coal, gas, wind, solar, hydroelectric, etc.

### Visualization 6 - line graph: Average temperature change
To show how the temperature changed through the years, the average temperature change per country is shown in a line graph. The data shown in this graph is initialized on the global temperature change and can be changed to the dataset of a specific country.

## Data
All data needed is available by the World Bank. This will be converted from CSV to JSON using a python script. The visualizations will be made using JS/D3. This will allow for interactivity and basic styling using HTML and CSS.

A concept visualization can be found in the documentation folder.
