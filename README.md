# Landfill Database

Landfill Database is a web app created by Anna Kiefer which is used to search for and display information about U.S. landfills. Integration of the Google Maps API allows the ability to display landfill locations. National and local landfill information is represented using several data visuals, including pie charts and a scatter plot. A landfill gas-to-energy converter displays the Megawatts produced and homes powered for a given landfill's waste in place. Finally, users can update the database by filling out a report form. 

The data is from the EPA's Landfill Methane Outreach Program, downloaded here https://www3.epa.gov/lmop/index.html.

![](http://i.imgur.com/736LxHB.gif?1)

## Contents
- [Technologies Used](#technologiesused)
- [Search Function](#searchfunction)
- [Data Visualizations](#datavisualizations)

## <a name="technologiesused"></a>Technologies Used
- [Python](https://www.python.org/)
- Javascript/jQuery
- [PostGreSQL](https://www.postgresql.org/)
- [Flask](http://flask.pocoo.org/)
- [SQLAlchemy](http://flask.pocoo.org/)
- [jQuery](https://jquery.com/)
- [Google Maps API](https://developers.google.com/maps/)
- [Bootstrap](http://getbootstrap.com/)
- [Plotly.js](https://plot.ly/javascript/)
- [Chart.js](http://www.chartjs.org/)
- [Parsley](http://parsleyjs.org/)

## <a name="searchfunction"></a>Search Function

Landfill Database employs the use of a haversine function to calculate the landfill closest to the user's zip code. 

A haversine formula at its core gives the distance between two points on a sphere. When a user enters a zip code in the database, a query returns the latitude and longitude of that zip code. The zipcode's latitude and longitude, along with the latitude and longitude of a landfill site, is passed into the function to calculate the shortest distance over the Earth's surface between the two points. This repeats for each site, returning the site with the smallest distance.

![](http://i.imgur.com/CQXthfQ.png)

## <a name="datavisualizations"></a>Data Visualizations 

The data visualizations generated on Landfill Database use the graphing libraries Chart.js and Plotly.js. The doughnut chart that appears upon clicking the infowindow of a landfill shows the amount of waste in place and remaining space for a landfill. The pie chart shows the percent of the total U.S. waste in place that particular landfill accounts for. It is worth noting that the percent of a particular landfill against the total U.S. waste may be so small as to not appear on the chart.

The Landfill Capacity by Region graph was created using Plotly.js. The plot graphs the waste in place, the year that waste in place was measured, and the capacity for open U.S. landfills by region. 

displays four data sets: the landfill's waste in place, the year that waste in place was measured, the capacity, and the region fo

