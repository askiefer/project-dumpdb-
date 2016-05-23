$(document).ready(function () {

	google.maps.event.addDomListener(window, 'load', init);

	var INFOWINDOW = new google.maps.InfoWindow({
        width: 150,
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
    
            // iterates through the list of objects
            for (i=0; i < sitesList.length; i++) {
                siteObjects.push(sitesList[i]);
                // add the object as nested dicts with the site 
                // siteObjects[]
            }

            for (i=0; i < siteObjects.length; i++) {
                var objectMarker = makeMarker(siteObjects[i]);
                var parsedObject = parseSiteData(siteObjects[i]);
                // var objectPieData = makePieData(siteObjects[i]);
                var objectInfo = makeInfoWindowContent(parsedObject);

                objectMarker.setMap(MAP);
             
                setEventResponse(objectMarker, objectInfo);
                // makePieData(parsedObject);
                // setPieResponse()
            }
        });
    }

    // All of these occur on one site object

	function parseSiteData(siteObject) {
        if ((siteObject["wasteInPlace"] !== null) && (siteObject["capacity"] !== null)) {
            var percentFull = ((Number(siteObject["wasteInPlace"]) / Number(siteObject["capacity"])*100));
            siteObject["roundedFull"] = percentFull.toFixed(2);
        }
        return siteObject;
    }

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

    function bindInfoWindow(marker, info) {
        INFOWINDOW.close();
        INFOWINDOW.setContent(info);
        INFOWINDOW.open(MAP, marker);
    }

    function setEventResponse(marker, info) {
        google.maps.event.addListener(marker, 'click', function () {
            bindInfoWindow(marker, info);
        });
    }

    function makePieData(siteObject) {
        var pieData;
        // for (var key in siteObject) {
        if (siteObject["capacity"] === null) {
            pieData = [
                {
                    value: 100,
                    color: "#ffffff",
                    label: "No data currently available",
                }];
        } else {
            pieData = [
                {
                    value: siteObject["wasteInPlace"],
                    color: "#bbbbbb",
                    label: "Waste in place",
                },
                {
                    value: siteObject["capacity"],
                    color: "#78adc1",
                    label: "Remaining space",
                }];
            }
        var pieOptions = {
            segmentShowStroke : true,
            animateScale : true
        };

        var capacity = document.getElementById("capacity").getContext("2d");

        new Chart(capacity).Pie(pieData, pieOptions);
    }

    // when submit is clicked, run the function
    $("#zip-button").click(function (evt) {
        var zipcode = $('#zipcode').val();
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
            makePieData(zipParsedObject);
        });
    }
    // calculator functionality 
    $("#calc-button").click(function (evt) {
        var tonnage = $('#calculator').val();
        debugger;
        calculator(tonnage);
    });

    function calculator(tonnage) {
        $.get('/calculator', {"tonnage": tonnage}, function(amount) {
            console.log(amount);
        });
    }
});

