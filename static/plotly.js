$(document).ready(function () {

    // [
            // {'annualTonnage': null, 'area': 50, capacity': 24029809, 'latitude': 61.293281, 'site_name': u'Anchorage Regional Landfill', 'longitude': -149.602138}, {'latitude': 58.3528, 'site_name': u'Capitol Disposal Landfill', 'longitude': -134.4947},...
            // ]
            
    // filter the legend by rocky mountain region, pacific region, southwest)
    var map = {"ID": "rmr", "MT": "rmr", "WY": "rmr", "UT": "rmr", "CO": "rmr",
        "NV": "rmr", "CA": "pr", "WA": "pr", "OR": "pr", "HI": "pr", "AK": "pr",
        "TX": "sw", "OK": "sw", "AZ": "sw", "NM": "sw", "ND": "mw", "KY": "mw",
        "SD": "mw", "NE": "mw", "KS": "mw", "MN": "mw", "IA": "mw", "MO": "mw",
        "IL": "mw", "IN": "mw", "OH": "mw", "MI": "mw", "VT": "ne", "NH": "ne",
        "ME": "ne", "MA": "ne", "RI": "ne", "CT": "ne", "NY": "ne", "NJ": "ne",
        "DE": "ne", "MD": "ne", "DC": "ne", "PA": "ne", "AR": "se", "LA": "se",
        "MS": "se", "AL": "se", "GA": "se", "SC": "se", "NC": "se", "FL": "se",
        "WV": "se", "WI": "mw", "TN": "se", "VA": "se"};
    
    // sites is an array of objects, with the status Open
    function makeScatterPlot(sites) {
        
        var rmrSeries = {
                name: "Rocky Mountain Region",
                text: [],
                marker: {
                    sizemode: "area",
                    sizeref: 200000,
                    size: []
                },
                mode: "markers",
                y: [],
                x: [],
            };
        var prSeries = {
                name: "Pacific Region",
                text: [],
                marker: {
                    sizemode: "area",
                    sizeref: 200000,
                    size: []
                },
                mode: "markers",
                y: [],
                x: [],
            };
        var swSeries = {
                name: "Southwest Region",
                text: [],
                marker: {
                    sizemode: "area",
                    sizeref: 200000,
                    size: []
                },
                mode: "markers",
                y: [],
                x: [],
            };
        var mwSeries = {
                name: "Midwest Region",
                text: [],
                marker: {
                    sizemode: "area",
                    sizeref: 200000,
                    size: []
                },
                mode: "markers",
                y: [],
                x: [],
            };
        var seSeries = {
                name: "Southeast Region",
                text: [],
                marker: {
                    sizemode: "area",
                    sizeref: 200000,
                    size: []
                },
                mode: "markers",
                y: [],
                x: [],
            };
        var neSeries = {
                name: "Northeast Region",
                text: [],
                marker: {
                    sizemode: "area",
                    sizeref: 200000,
                    size: []
                },
                mode: "markers",
                y: [],
                x: [],
            };
        // iterate the sites array and push the sites to the corresponding object
        for (i=0; i < sites.length; i++) {
            
            // check the associated value for the key that corresponds to the site's siteState
            var currentSiteState = sites[i]["siteState"];
            if (map[currentSiteState] === "rmr") {
                // update the associated object
                rmrSeries.text.push(sites[i]["siteName"]);
                rmrSeries.marker.size.push(sites[i]["capacity"]);
                rmrSeries.y.push(sites[i]["wasteInPlace"]);
                rmrSeries.x.push(sites[i]["wasteInPlaceYear"]);
            } else if (map[currentSiteState] === "pr") {
                prSeries.text.push(sites[i]["siteName"]);
                prSeries.marker.size.push(sites[i]["capacity"]);
                prSeries.y.push(sites[i]["wasteInPlace"]);
                prSeries.x.push(sites[i]["wasteInPlaceYear"]);
            } else if (map[currentSiteState] === "sw") {
                swSeries.text.push(sites[i]["siteName"]);
                swSeries.marker.size.push(sites[i]["capacity"]);
                swSeries.y.push(sites[i]["wasteInPlace"]);
                swSeries.x.push(sites[i]["wasteInPlaceYear"]);
            } else if (map[currentSiteState] === "mw") {
                mwSeries.text.push(sites[i]["siteName"]);
                mwSeries.marker.size.push(sites[i]["capacity"]);
                mwSeries.y.push(sites[i]["wasteInPlace"]);
                mwSeries.x.push(sites[i]["wasteInPlaceYear"]);
            } else if (map[currentSiteState] === "se") {
                seSeries.text.push(sites[i]["siteName"]);
                seSeries.marker.size.push(sites[i]["capacity"]);
                seSeries.y.push(sites[i]["wasteInPlace"]);
                seSeries.x.push(sites[i]["wasteInPlaceYear"]);
            } else {
                neSeries.text.push(sites["siteName"]);
                neSeries.marker.size.push(sites[i]["capacity"]);
                neSeries.y.push(sites[i]["wasteInPlace"]);
                neSeries.x.push(sites[i]["wasteInPlaceYear"]);
            }
        }

        var layout = {
            height: 550,
            width: 1100,
            
            xaxis: {
                title: 'Year of Waste in Place',
                gridcolor: 'rgb(255, 255, 255)',
                type: 'log',
                gridwidth: 2,
                ticklen: 5,
            },
            yaxis: {
                title: 'Waste in Place (tons)',
                gridcolor: 'rgb(255, 255, 255)',
                type: 'log',
                gridwidth: 2,
                ticklen: 5,
            },
            paper_bgcolor: 'rgb(238, 238, 238)',
            plot_bgcolor: 'rgb(238, 238, 238)',

            margin: {
                t: 20,
            },
            hovermode: 'closest'
        };
        
        Plotly.plot('chartContainer', [rmrSeries, prSeries, swSeries, mwSeries, seSeries, neSeries], layout);
    }


    window.makeScatterPlot = makeScatterPlot;
});
