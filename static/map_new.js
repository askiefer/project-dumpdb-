
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

             // sum the waste in place and remaining space for all landfills
            var sumWasteInPlace = 0;
            var sumCapacity = 0;

            for (i=0; i<sitesList.length; i++) {
                
            if ((sitesList[i]["wasteInPlace"] !== null) && (sitesList[i]["wasteInPlaceYear"] !== null) && (sitesList[i]["capacity"] !== null) && (sitesList[i]["currentStatus"] === "Open")) {
                    sumWasteInPlace += sitesList[i]["wasteInPlace"];
                    sumCapacity += sitesList[i]["capacity"];
                    openSites.push(sitesList[i]);
                }
            }

            // sets the markers, infowindows, and event response for infowindows
            for (i=0; i < siteObjects.length; i++) {
                var objectMarker = makeMarker(siteObjects[i]);
                var parsedObject = parseSiteData(siteObjects[i]);
                var objectInfo = makeInfoWindowContent(parsedObject);

                var objectChartData = makeChartData(siteObjects[i]["capacity"], siteObjects[i]["wasteInPlace"]);

                var objectPieData = percentPieData(siteObjects[i]["wasteInPlace"], sumWasteInPlace);

                objectMarker.setMap(MAP);
            
                setEventResponse(objectMarker, objectInfo, objectChartData, objectPieData);
            }
            

            // pass the list of sites to the scatter plot function
            makeScatterPlot(openSites);
            // pass the sum and capacity to calculate the pie chart data 
            var sumData = makeChartData(sumCapacity, sumWasteInPlace);
            
            // pass the data, chart elements, and DOM ID to render the pie chart
            makePieChart(sumData, "sumCapacity", "sum-legend");
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
        if ((siteObject["wasteInPlace"] !== null) && (siteObject["capacity"] !== null)) {
            info = (
                '<div class="window-content" id='+siteObject["siteID"]+'">' +
                    '<p><b>' + siteObject["siteName"] + '</b></p>' +
                    '<p>Waste in place: '+ siteObject["wasteInPlace"] + ' tons (' + siteObject["wasteInPlaceYear"] + ')' + '<br>' +
                    'Capacity: '+ siteObject["capacity"] + '<br>' +
                    'Percent full: ' + siteObject["roundedFull"] + '%' + '<br>' +
                    'Ownership: ' + siteObject["ownershipType"] +
                '</div>');
        } else {
            info = (
                '<div class="window-content">' +
                    '<p><b>' + siteObject["siteName"] + '</b></p>' +
                    'Ownership: ' + siteObject["ownershipType"] +
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
    function setEventResponse(marker, info, chartData, pieData) {
        google.maps.event.addListener(marker, 'click', function () {
            bindInfoWindow(marker, info);
            makeDoughnutChart(chartData, "doughnut");
            makePieChart(pieData, "pie", "pie-legend");
        });
    }

    // sets the piechart data and options given waste and capacity
    function makeChartData(capacity, wasteInPlace) {
        var chartData;
        var remainingSpace;
        if ((capacity === null) || (wasteInPlace === null)) {
            chartData = [
                {
                    value: 100,
                    color: "#bbbbbb",
                    label: "Data not currently available",
                }];
        } else {
            remainingSpace = (capacity-wasteInPlace);
            chartData = [
                {
                    value: wasteInPlace,
                    color: "#CB4B16",
                    label: "Waste in place (tons)",
                },
                {
                    value: remainingSpace,
                    color: "#78adc1",
                    label: "Remaining space (tons)",
                }];
        }
        return chartData;
    }

    function percentPieData(wasteInPlace, sumWasteInPlace) {
        var pieChartData;
        if ((wasteInPlace !== null)) {
            var sitePercent = ((wasteInPlace/sumWasteInPlace)*100).toFixed(2);
            var percentRemaining = (100-sitePercent).toFixed(2);
            pieChartData = [
                {
                    value: sitePercent,
                    color: "#F0470E",
                    label: "Percent covered by site",
                },
                {
                    value: percentRemaining,
                    color: "#bbbbbb",
                    label: "Percent covered by remaining U.S. sites"
                }];
        }
        return pieChartData;
    }

    // function to get the DOM element and make the pie chart (sumdata is two objects)
    function makePieChart(data, elementID, legendID) {
        var pieOptions = {
            segmentShowStroke : true,
            animateScale : true,
            maintainAspectRation: false,
            };
        var ctx = document.getElementById(elementID).getContext("2d");
        var pie = new Chart(ctx).Pie(data, pieOptions);
        document.getElementById(legendID).innerHTML=pie.generateLegend();
    }

    function makeDoughnutChart(data, elementID) {
        var doughnutOptions = {
            segmentShowStroke : true,
            segmentStrokeColor : "#fff",
            segmentStrokeWidth : 2,
            percentageInnerCutout : 50,
            animation : true,
            animationSteps : 100,
            animationEasing : "easeOutBounce",
            responsive: true,
        };

        var ctx = document.getElementById(elementID).getContext("2d");
        var doughnut = new Chart(ctx).Doughnut(data, doughnutOptions);
        document.getElementById('doughnut-legend').innerHTML = doughnut.generateLegend();
    }

    // when zip-submit is clicked, validate the form and send the zipcode to the db
    $("#zip").submit(function (evt) {
        evt.preventDefault();
        var zipcode = $('#zipcode').val();
        validateForm(zipcode);
        zipcode.toString();
        handleZipSubmit(zipcode);
        
    });

    function handleZipSubmit(zipcode) {
        // passes zipcode as a parameter to AJAX
        $.get('/zipsearch', {"zipcode": zipcode}, function(zipSiteObject) {
            if (zipSiteObject["siteName"] === 'Great Pacific Garbage Patch') {
                // grab the element id and change it to the picture of Texas
                var zipObjectMarker = makeMarker(zipSiteObject);
                var zipParsedObject = parseSiteData(zipSiteObject);
                var zipObjectInfo = makeInfoWindowContent(zipParsedObject);
                zipObjectMarker.setMap(MAP);
                bindInfoWindow(zipObjectMarker, zipObjectInfo);
                setVortexImage();
                return;
            }
            if (zipSiteObject["wasteInPlace"] !== null) {
                calculator(zipSiteObject["wasteInPlace"]);
                document.getElementById("calc").value = zipSiteObject["wasteInPlace"];
            }
            
            var zipObjectMarker = makeMarker(zipSiteObject);
            var zipParsedObject = parseSiteData(zipSiteObject);
            var zipObjectInfo = makeInfoWindowContent(zipParsedObject);
            
            zipObjectMarker.setMap(MAP);
            bindInfoWindow(zipObjectMarker, zipObjectInfo);
            var zipData = makeChartData(zipParsedObject["capacity"], zipParsedObject["wasteInPlace"]);
            var sumWasteInPlace = 3991852251;
            var zipPieData = percentPieData(zipParsedObject["wasteInPlace"], sumWasteInPlace);
            makeDoughnutChart(zipData, "doughnut");
            makePieChart(zipPieData, "pie", "pie-legend");
        });
    }

    // function setVortexImage() {
    //     $("#pie").remove("");
    //     $"#doughnut").remove("");
    //     $("#texas").attr('<img src="/static/images/texas.png">');
    //     // $("#doughnut").before('<img src="/static/images/texas.png">');
    //     debugger;
    // }

    // calculator functionality 
    $("#calculator").keyup(function (evt) {
        evt.preventDefault();
        var tonnage = parseInt($('#calc').val());
        setTimeout(validateForm(tonnage), calculator(tonnage), 300);
    });

    function calculator(tonnage) {
        tonnage.toString();
        // returned JSON looks like {lfg: "864.0", mw: "0.00156"}
        $.get('/calculator', {"tonnage": tonnage}, addAnswers);
    }

    function addAnswers(answers) {
        $('#landfill-gas').html(answers["lfg"]);
        $('#megawatts').html(answers["mw"]);
        $('#homes').html(answers["homes"]);
    }

    // function to autocomplete state input box
    function autoComplete(set, tag) {
        var list = Array.from(set);
        $(tag).autocomplete({
            source: list
        });
    }

    // retrieve input state 
    $('#autocompleteState').keyup(function(evt) {
        var state = $('#autocompleteState').val();
        setTimeout(setDropdown(state), 300);
    });

    // sets the dropdown list for the given state
    function setDropdown(state) {
        // passes the state abbr to the server to return the state site objects
        $.get('/stateList.json', {"state": state}, function(stateListObjects) {
            // access the nested list of dictionaries
            $("#dropdown").empty();
            var stateList = stateListObjects["state_list"];
            $.each(stateList, function(key,value) {
                var option = $('<option/>').text(value.siteName);
            $("#dropdown").append(option);
            });
        });
    }

    // get the name of the selected option
    $('#dropdown').on("change", function () {
        var name = $('#dropdown').val();
        siteInfo(name);
    });

    function showUpdateResults(result) {
        alert(result);
    }

    function updateDatabase(evt) {
        console.log(formInputs);
        evt.preventDefault();

        var formInputs = {
            "site": $("#dropdown").val(),
            "new": $("#new").val(),
            "update": $("#update").val(),
            "info": $("#info").val(),
        };

        $.post("/update_database",
            formInputs,
            showUpdateResults
            );
    }

    $('#report-submit').on('submit', updateDatabase);

    $("form[name=reportForm]").parsley();

    function validateForm(input) {
    // If userInput is empty or not a number, alert user
        if (input !== 'vortex') {
            parseInt(input);
                if (isNaN(input) === true) {
                    alert("Please fill in valid digits");
                }
            }
        }
        // if ((isNaN(input) === true) && (input !== 'vortex'))  {
        //     alert("Please fill in valid digits");
        // }
