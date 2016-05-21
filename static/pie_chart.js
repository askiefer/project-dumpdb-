$(document).ready(function () {
    function makePieData(site_object) {

        // if (site_object["roundedFull"]) {
            
        var pieData = [
            {
                value: site_object["wasteInPlace"],
                color: "#878BB6",
                label: "Waste in place",
            },
            {
                value: site_object["capacity"],
                color: "#4ACAB4",
                label: "Remaining capacity",
            }
        ];


        // }
        return pieData;
    }

    var pieOptions = {
            segmentShowStroke : false,
            animateScale : true
        };

    // get pie chart canvas
    sample_site_object = {
          "annualTonnage": null,
          "area": 150.0,
          "capacity": 27104647.0,
          "closureYear": 2043,
          "currentStatus": "Open",
          "depth": 150.0,
          "latitude": 61.293281,
          "longitude": -149.602138,
          "ownershipOrganization": "Municipality of Anchorage, AK",
          "ownershipType": "Public",
          "siteAddress": "15500 E. Eagle River Loop Road",
          "siteCounty": "Anchorage",
          "siteID": 1,
          "siteName": "Anchorage Regional Landfill",
          "siteState": "AK",
          "siteType": "Landfill",
          "siteZipcode": "99577",
          "wasteInPlace": 8000000,
          "wasteInPlaceYear": 2011,
          "yearOpened": 1987
        };

    pieData = makePieData(sample_site_object);
    console.log(pieData);

    var capacity = document.getElementById("capacity").getContext("2d");
    console.log(document.getElementById("capacity"));
    // draw pie chart
    new Chart(capacity).Pie(pieData, pieOptions);
});