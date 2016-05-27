// $(document).ready(function () {

	google.maps.event.addDomListener(window, 'load', init);

	var INFOWINDOW = new google.maps.InfoWindow({
        width: 170,
    });

	function init() {
        
		siteObjects = [];

        // Sets the appropriate map zoom, center point, and style
        var mapOptions = {
            zoom: 9,
            center: new google.maps.LatLng(37.7749, -122.4194),
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]
        };

        // Get the HTML DOM element that will contain your map 
        var mapElement = document.getElementById('map');

        MAP = new google.maps.Map(mapElement, mapOptions);

        // AJAX call using jQuery to retrieve the site objects
        $.get('/sites_json', function (sites) {

            // The JSON result looks like this:
            // { 'json_list': [
            // {'annualTonnage': null, 'area': 50, capacity': 24029809, 'latitude': 61.293281, 'site_name': u'Anchorage Regional Landfill', 'longitude': -149.602138}, {'latitude': 58.3528, 'site_name': u'Capitol Disposal Landfill', 'longitude': -134.4947},...
            // ]}

            // access the nested list of objects 
            var sitesList = sites['json_list'];
            var openSites = [];
            var stateSet = new Set();

            // iterates through the list of objects and puts state abrvs in a list
            for (i=0; i < sitesList.length; i++) {
                stateSet.add(sitesList[i]["siteState"]);
                siteObjects.push(sitesList[i]);
            }

            // sets the markers, infowindows, and event response for infowindows
            for (i=0; i < siteObjects.length; i++) {
                var objectMarker = makeMarker(siteObjects[i]);
                var parsedObject = parseSiteData(siteObjects[i]);
                var objectInfo = makeInfoWindowContent(parsedObject);

                objectMarker.setMap(MAP);
            
                setEventResponse(objectMarker, objectInfo);
            }
            
            // calculate the average waste in place and remaining space for landfills
            var sumWasteInPlace = 0;
            var sumCapacity = 0;
            for (i=0; i<sitesList.length; i++) {
                
                if ((sitesList[i]["wasteInPlace"] !== null) && (sitesList[i]["wasteInPlaceYear"] !== null) && (sitesList[i]["capacity"] !== null) && (sitesList[i]["currentStatus"] === "Open")) {
                    sumWasteInPlace += sitesList[i]["wasteInPlace"];
                    sumCapacity += sitesList[i]["capacity"];
                    openSites.push(sitesList[i]);
                }
            }
            // pass the list of sites to the scatter plot function
            makeScatterPlot(openSites);

            // pass the sum and capacity to calculate the pie chart data 
            var sumData = makePieData(sumCapacity, sumWasteInPlace);
            
            // pass the data, chart elements, and DOM ID to render the pie chart
            makePieChart(sumData, "avgCapacity");
            autoComplete(stateSet, "#autocompleteState");
        });
    }
    // calculates the percent full of each site for the infowindow
	function parseSiteData(siteObject) {
        if ((siteObject["wasteInPlace"] !== null) && (siteObject["capacity"] !== null)) {
            var percentFull = ((Number(siteObject["wasteInPlace"]) / Number(siteObject["capacity"])*100));
            siteObject["roundedFull"] = percentFull.toFixed(2);
        }
        return siteObject;
    }
    // sets the marker for each object given lat / long
    function makeMarker(siteObject) {
        if ((siteObject["latitude"] !== null) || (siteObject["latitude"] !== "")) {
            // assigns markers on map for lat / longs
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(siteObject["latitude"], siteObject["longitude"]),
                title: 'Site Name: '+ siteObject["siteName"],
                icon: '/static/images/pin.png'
            });
        return marker;
        }
    }

    // sets the content for the infowindow
    function makeInfoWindowContent(siteObject) {
        var info;
        if (siteObject["wasteInPlace"] !== null) {
            info = (
                '<div class="window-content" id='+siteObject["siteID"]+'">' +
                    '<p><b>' + siteObject["siteName"] + '</b></p>' +
                    '<p>Waste in place: '+ siteObject["wasteInPlace"] + ' tons (' + siteObject["wasteInPlaceYear"] + ')' + '<br>' +
                    'Capacity: '+ siteObject["capacity"] + '<br>' +
                    'Percent full: ' + siteObject["roundedFull"] + '%' +
                '</div>');
        } else {
            info = (
                '<div class="window-content">' +
                    '<p><b>' + siteObject["siteName"] + '</b></p>' +
                '</div');
        }
        return info;
    }

    // tells the infowindow to close if one is open 
    function bindInfoWindow(marker, info) {
        INFOWINDOW.close();
        INFOWINDOW.setContent(info);
        INFOWINDOW.open(MAP, marker);
    }

    // adds the listener to the infowindow
    function setEventResponse(marker, info) {
        google.maps.event.addListener(marker, 'click', function () {
            bindInfoWindow(marker, info);
        });
    }

    // sets the piechart data and options given waste and capacity
    function makePieData(capacity, wasteInPlace) {
        var pieData;
        var remainingSpace;
        if ((capacity === null) || (wasteInPlace === null)) {
            pieData = [
                {
                    value: 100,
                    color: "#ffffff",
                    label: "Data not currently available",
                }];
        } else {
            remainingSpace = (capacity-wasteInPlace);
            pieData = [
                {
                    value: wasteInPlace,
                    color: "#bbbbbb",
                    label: "Waste in place (tons)",
                },
                {
                    value: remainingSpace,
                    color: "#78adc1",
                    label: "Remaining space (tons)",
                }];
        }
        return pieData;
    }

    // function to get the DOM element and make the pie chart (sumdata is two objects)
    function makePieChart(data, elementID) {
        var pieOptions = {
            segmentShowStroke : true,
            animateScale : true
            };
        var docID = document.getElementById(elementID).getContext("2d");
        new Chart(docID).Pie(data, pieOptions);
    }

    // when zip-submit is clicked, validate the form and send the zipcode to the db
    $("#zip-button").click(function (evt) {
        var zipcode = parseInt($('#zipcode').val());
        validateForm(zipcode);
        zipcode.toString();
        handleZipSubmit(zipcode);
    });

    function handleZipSubmit(zipcode) {
        // passes zipcode as a parameter to AJAX
        $.get('/zipsearch', {"zipcode": zipcode}, function(zipSiteObject) {
            var zipObjectMarker = makeMarker(zipSiteObject);
            var zipParsedObject = parseSiteData(zipSiteObject);
            var zipObjectInfo = makeInfoWindowContent(zipParsedObject);
            
            zipObjectMarker.setMap(MAP);
            bindInfoWindow(zipObjectMarker, zipObjectInfo);
            var zipData = makePieData(zipParsedObject["capacity"], zipParsedObject["wasteInPlace"]);
            makePieChart(zipData, "avgCapacity");
            // lightUpSite(zipSiteObject);
        });
    }
    // calculator functionality 
    $("#calc-button").click(function (evt) {
        var tonnage = parseInt($('#calc').val());
        validateForm(tonnage);
        calculator(tonnage);
    });

    function calculator(tonnage) {
        tonnage.toString();
        $.get('/calculator', {"tonnage": tonnage}, function(amount) {
            // JSON looks like {'lfg': '.808', 'mw': '.898'}
            // need to display the information using AJAX 
            console.log(amount);
        });
    }

    // function to autocomplete an input box
    function autoComplete(set, tag) {
        var list = Array.from(set);
        $(tag).autocomplete({
            source: list
        });
    }

    function makeScrollableMenu(state) {
        // passes the state abbr to the server to return the state sites
        $.get('/StateList', {"state": state}, function(stateListObjects) {
            // this accesses the list of nested dictionaries
            var stateList = stateListObjects["state_list"];
            for (i=0; i < stateList.length; i++) {
                // need to use Jinja in html to render the list in the menu 
            }
        });
    }

    function validateForm(input) {
    // If userInput is empty or not a number, alert user 
        if (isNaN(input) === true) {
            alert("Please fill in valid digits");
        }
    }

    // function makeLineGraph() {
    //         var data = {
    //             labels: ["January", "February", "March", "April", "May", "June", "July"],
    //             datasets: [
    //         {
    //             label: "My First dataset",
    //             fill: false,
    //             lineTension: 0.1,
    //             backgroundColor: "rgba(75,192,192,0.4)",
    //             borderColor: "rgba(75,192,192,1)",
    //             borderCapStyle: 'butt',
    //             borderDash: [],
    //             borderDashOffset: 0.0,
    //             borderJoinStyle: 'miter',
    //             pointBorderColor: "rgba(75,192,192,1)",
    //             pointBackgroundColor: "#fff",
    //             pointBorderWidth: 1,
    //             pointHoverRadius: 5,
    //             pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //             pointHoverBorderColor: "rgba(220,220,220,1)",
    //             pointHoverBorderWidth: 2,
    //             pointRadius: 1,
    //             pointHitRadius: 10,
    //             data: [65, 59, 80, 81, 56, 55, 40],
    //         }
    //     ]};
    //     return data;
    // }

    //     var myLineChart = new Chart(ctx, {
    //         type: 'line',
    //         data: data,
    //         options: options
    //     });

    //     var growth = document.getElementById("growth").getContext("2d");

    //     new Chart(growth).Line(data, myLineChart);

// });