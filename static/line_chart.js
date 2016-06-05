$(document).ready(function () {
    
    var lineChartData = {
        labels: ["1960", "1970", "1980", "1990", "2000", "2010"],
        datasets: [{
            label: "paper",
            fillColor: "rgba(255,255,255,0)",
            strokeColor: "rgba(63,169,245,1)",
            pointColor: "rgba(63,169,245,1)",
            pointStrokeColor: "#fff",
            data: [29990, 44310, 55160, 72730, 87740, 71310]
        }, {
            label: "glass",
            fillColor: "rgba(255,255,255,0)",
            strokeColor: "rgba(235, 45, 60, 0.9)",
            pointColor: "rgba(235, 45, 60, 0.9)",
            pointStrokeColor: "#fff",
            data: [6720, 12740, 15130, 13100, 12770, 11520]
        }, {
            label: "metals",
            fillColor: "rgba(255,255,255,0)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            data: [10820, 13830, 15510, 16550, 18940, 22370]
        }, {
            label: "plastics",
            fillColor: "rgba(255,255,255,0)",
            strokeColor: "rgb(244, 150, 56)",
            pointColor: "rgb(244, 150, 56)",
            pointStrokeColor: "#fff",
            data: [390, 2900, 6830, 17130, 25530, 31400]
        }, {
            label: "food",
            fillColor: "rgba(255,255,255,0)",
            strokeColor: "rgba(125, 100, 52, 0.9)",
            pointColor: "rgba(125, 100, 52, 0.9)",
            pointStrokeColor: "#fff",
            data: [12200, 12800, 13000, 23860, 30700, 35740]
        }, {
            label: "yard",
            fillColor: "rgba(255,255,255,0)",
            strokeColor: "rgba(9, 188, 9, 0.9)",
            pointColor: "rgba(9, 188, 9, 0.9)",
            pointStrokeColor: "#fff",
            data: [20000, 23200, 27500, 35000, 30530, 33400]
        }, {
            label: "all other",
            fillColor: "rgba(255,255,255,0)",
            strokeColor: "rgba(122, 52, 125, 0.9)",
            pointColor: "rgba(122, 52, 125, 0.9)",
            pointStrokeColor: "#fff",
            data: [8000, 11280, 18510, 29900, 37240, 44840]
        }]
    };


    var lineOptions = {
        animation: true,
        pointDot: true,
        scaleOverride : true,
        scaleShowGridLines : false,
        scaleShowLabels : true,
        scaleSteps : 10,
        scaleStepWidth : 10000,
        scaleStartValue : 0,

    };

    var ctx = document.getElementById("lineChart").getContext("2d");
    var myNewChart = new Chart(ctx).Line(lineChartData, lineOptions);
    document.getElementById("lineChart-legend").innerHTML = myNewChart.generateLegend();

});