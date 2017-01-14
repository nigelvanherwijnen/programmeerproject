# Design document
### Minimum Viable Product
A single page will contain a world map, displaying the emission of GHG emission per capita per country. In a list on the side are the countries ranked such that the most polluting country is at the top. Furthermore, a line graph will show how much gasses each sector in a country emits. Next to the line graph, a pie chart will visualize the ratio of the different gasses that are being emitted. It is possible to cycle through data of different years by using a slider. The map, the list and the chart will change when using the slider. The map and list are linked to the line graph and pie chart in a way that by clicking a country in either two will make the two graphs show the data for that specific country. All data has been obtained from the WRI.
![Alt text](/doc/CO2_emission_page_v3.jpg)

### Optional
The homepage will contain general information and a stand-alone line graph which will be made using D3. The line graph will represent the CO2 levels in the atmosphere and will be obtained from the Carbon Dioxide Information Analysis Center.
![Alt text](/doc/title_page_v1.jpg)

The next page will link welfare of a country to GHG emission. Two lines will be visible in a line graph. This will contain data on a single country. One line will represent the amount of CO2 a country produces per capita, whilst the other represents the GDP per capita. Data for this can be obtained from the World Bank. A bar chart will display the amount of GHG emissions per GDP. This data can be retrieved from the World Recourses Institute. By clicking on a country in the bar chart, the corresponding data will be visualized in the line graph. Optionally, more visualizations can be added containing data on the source of energy production. These can be obtained from the World Bank.
![Alt text](/doc/GDP_CO2_page_v2.jpg)

### Data
The JSON for the page with the world map will look as follows.
```
{
    "1990": [{
            "code": "DZA",
            "name": "Algeria",
            "GHG": "150000",
            "CO2": "3000",
            ...
        },
        {
            "code": "CUB",
            "name": "Cuba",
            ...
            "waste": "4000"
        }
    ],
    ...,
    "2012": [{
            "code": "DZA",
            "name": "Algeria",
            "GHG": "300000",
            "CO2": "30000",
            ...
        },
        {
            "code": "CUB",
            "name": "Cuba",
            ...
            "waste": "5000"
        }
    ]
}
```

The x value for the hockey stick figure will be in 'years before present', so higher numbers will be on the left of the graph, zero will be on the right. The JSON for this graph is shown below.
```
{
    {
        "year": "0",
        "value": "410"
    }, {
        "year": "100",
        "value": "280"
    }, ... , {
        "year": "800000",
        "value": "270"
    }
}
```
