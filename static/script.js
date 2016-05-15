function initMap() {

  var myLatLng = {lat: 39.8282, lng: 98.5795};
  
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 5,
    zoomControl: true,
    panControl: true,
    streetViewControl: false,
    styles: MAPSTYLE,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });

  var infoWindow = new google.maps.InfoWindow({
    width: 150
  });
}
  $.get('sites.json', function (sites) {

//   // Returned JSON looks like this:
//   // { 
//   //     "1": = {
//   //           "siteType": site.site_type
//   //           "siteName": site.site_name,
//   //           "siteAddress": site.site_address,
//   //           "siteCity": site.site_city,
//   //           "siteState": site.site_state,
//   //           "ownershipType": site.ownership_type,
//   //           "yearOpened": site.year_opened 
//   //           "latitude": site.latitude,
//   //           "longitude": site.longitude
//   //       }
//   //   }

    var site, marker, info;

    // sets key / value pairs 
    for (var key in sites) {
        site = sites[key];

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(site.latitude, site.longitude),
            map: map,
            title: 'Site Name: '+ site.siteName,
            icon: '/images/landfill.png'
      });

        // changes site type to lowercase for rendering appropriate icon 
        // site.site_type.toLowerCase();

        // define each marker by creating nested dictionaries of key: site_type, value: icon
  //       var icons = {
  //         landfill: {
  //           icon: iconBase + '/images/landfill.png'
  //         },
  //         recycling: {
  //           icon: iconBase + '/images/recycling.png'
  //         },
  //         compost: {
  //           icon: iconBase + '/static/image/compost.png'
  //         }
  //       };

        // Define the content of the info window for each site
        info = (
          '<div class="window-content">' +
                  '<p><b>Site name: </b>' + site.siteName + '</p>' +
                  '<p><b>Ownership type: </b>' + site.ownershipType + '</p>' +
                  '<p><b>Year opened: </b>' + site.yearOpened + '</p>' +
              '</div>');

        // call closeInfoWindow and pass it the marker, map, infoWindow, and info string
        // addMarker(site);
        closeInfoWindow(marker, map, infoWindow, info);
    }
    
  });

    function addMarker(site) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(site.latitude, site.longitude),
        map: map,
        title: 'Site Name: '+ site.siteName,
        icon: icons[site.siteType].icon
      });
    }

    function closeInfoWindow(marker, map, infoWindow, info) {
        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.close();
          infoWindow.setContent(html);
          infoWindow.open(map, marker);
        });
  }
});

google.maps.event.addDomListener(window, 'load', initMap);

