
$(document).ready(function () {

    var MAP;

    // create empty sets to add state abbrs
    var STATELIST = new Set();
    var SITEID = [];
    var MARKERLIST = [];
    var INFOWINDOWLISTCONTENT = [];

    var INFOWINDOW = new google.maps.InfoWindow({
        width: 150,
    });

    // When the window has finished loading create our google map below
    google.maps.event.addDomListener(window, 'load', init);

    // var siteId, siteName, latitude, longitude, waste, wasteYear, info, siteZipcode, capacity, roundedFull;

    function init() {
        // Sets the appropriate map zoom, center point, and style
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(40.6700, -101.019460),
            styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]
        };

        // Get the HTML DOM element that will contain your map 
        var mapElement = document.getElementById('map');

        // Create the Google Map using our element and options defined above
        MAP = new google.maps.Map(mapElement, mapOptions);

        // AJAX call using jQuery to retrieve the site objects
        $.get('/sites_json', function (sites) {

            // The JSON result looks like this:
            // { 'json_list': [
            // {'annualTonnage': null, 'area': 50, capacity': 24029809, 'latitude': 61.293281, 'site_name': u'Anchorage Regional Landfill', 'longitude': -149.602138}, {'latitude': 58.3528, 'site_name': u'Capitol Disposal Landfill', 'longitude': -134.4947},...
            // ]}

            // access the nested list of objects 
            var sites_list = sites['json_list'];
    
            // iterates through the list of objects
            for (i=0; i < sites_list.length; i++) {
                
                site_data = parseSiteData(sites_list[i]);
                
                if (site_data["siteState"] !== null) {
                    site_data["siteState"].trim();
                    STATELIST.add(site_data["siteState"]);
                }
                var marker_name = "marker" + String(i);
                
                var marker = makeMarker(site_data, marker_name);
                
                SITEID[(site_data["siteID"])] = site_data["siteID"];

                MARKERLIST[(site_data["siteID"])] = marker;

                marker.setMap(MAP);

                var info = makeInfoWindowContent(site_data);
        
                INFOWINDOWLISTCONTENT[(site_data["siteID"])] = info;

                setEventInfoWindow(marker, info);
            }
        });
    }

    var parseSiteData = function(site_object) {
        if ((site_object["wasteInPlace"] !== null) && (site_object["capacity"] !== null)) {
            var percentFull = ((Number(site_object["wasteInPlace"]) / Number(site_object["capacity"])*100));
            site_object["roundedFull"] = percentFull.toFixed(2);
        }
        return site_object;
    };


    // FIX ME
    // if (site_object["siteState"] !== null) {
    //     site_object["siteState"].trim();
    //     STATELIST[(site_object["siteState"])] = site_object["siteState"];
    // }
            
    function makeMarker(site_data, marker_name) {
        if ((site_data["latitude"] !== null) || (site_data["latitude"] !== "")) {
            // assigns markers on map for lat / longs
            marker_name = new google.maps.Marker({
                position: new google.maps.LatLng(site_data["latitude"], site_data["longitude"]),
                title: 'Site Name: '+ site_data["siteName"],
                icon: '/static/images/pin.png'
            });
        return marker_name;
        }
    }

    // passes in the sets the content for each infowindow
    function makeInfoWindowContent(site_data) {
        var info;
        if (site_data["wasteInPlace"] !== null) {
            info = (
                '<div class="window-content" id='+site_data["siteID"]+'">' +
                    '<p><b>' + site_data["siteName"] + '</b></p>' +
                    '<p>Waste in place: '+ site_data["wasteInPlace"] + ' tons (' + site_data["wasteInPlaceYear"] + ')' + '<br>' +
                    'Capacity: '+ site_data["capacity"] + '<br>' +
                    'Percent full: ' + site_data["roundedFull"] + '%' +
                '</div>');
        } else {
            info = (
                '<div class="window-content">' +
                    '<p><b>' + site_data["siteName"] + '</b></p>' +
                '</div');
        }
        return info;
    }

    function bindInfoWindow(marker, info) {
        INFOWINDOW.close();
        INFOWINDOW.setContent(info);
        INFOWINDOW.open(MAP, marker);
    }

    function setEventInfoWindow(marker, info) {
        google.maps.event.addListener(marker, 'click', function () {
            bindInfoWindow(marker, info);
        });
    }

    function handleZipSubmit(zipcode) {
        // passes zipcode as a parameter to AJAX
        // pass through the entire site object and run parseSite on it
        $.get('/zipSearch', {"zipcode": zipcode}, function(site_id) {
            var zip_marker = MARKERLIST[parseInt(site_id)];
            var zip_info_window = INFOWINDOWLISTCONTENT[parseInt(site_id)];
            bindInfoWindow(zip_marker, zip_info_window);
        });
    }


    // when submit is clicked, run the function
    $("#zip-button").click(function (evt) {
        var zipcode = $('#zipcode').val();
        handleZipSubmit(zipcode);
    });

    // autocomplete functionality for the state search input box 
    var array = Array.from(STATELIST);
 
    // Checks db and autocompletes given user input
    $(function() {
        // state_list === ["AK", "AL", "AR", "AZ", "CA" ...]
        $( "#autocompleteState" ).autocomplete({source: array});
    });
});
