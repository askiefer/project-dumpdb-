$(document).ready(function () {
    var lineChartData = {
    labels: ["1960", "1970", "1980", "1990", "2000", "2010"],
    datasets: [{

        label: "Waste Generation (1,000 tons)",
        fillColor: "rgba(220,220,220,0)",
        strokeColor: "rgba(220,180,0,1)",
        pointColor: "rgba(220,180,0,1)",
        // paper
        data: [29990, 44310, 55160, 72730, 87740, 71310]
    }, {
        // glass 
        fillColor: "rgba(151,187,205,0)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        data: [6720, 12740, 15130, 13100, 12770, 11520]
    }, {

        // metals 
        fillColor: "rgba(151,187,205,0)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        data: [10820, 13830, 15510, 16550, 18940, 22370]
    }, {
        // plastics 
        fillColor: "rgba(151,187,205,0)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        data: [390, 2900, 6830, 17130, 25530, 31400]
    }, {
        // food
        fillColor: "rgba(177, 153, 47, 1)",
        strokeColor: "rgba(177, 153, 47, 1)",
        pointColor: "rgba(177, 153, 47, 1)",
        data: [12200, 12800, 13000, 23860, 30700, 35740]
    }, {
        // yard 
        fillColor: "rgba(92,235,144,1)",
        strokeColor: "rgba(92,235,144,1)",
        pointColor: "rgba(92,235,144,1)",
        data: [20000, 23200, 27500, 35000, 30530, 33400]
    }, {
        // all other
        fillColor: "rgba(111, 149, 134, 1)",
        strokeColor: "rgba(111, 149, 134, 1)",
        pointColor: "rgba(111, 149, 134, 1)",
        data: [8000, 11280, 18510, 29900, 37240, 44840]
    }]
};

Chart.defaults.global.animationSteps = 50;
Chart.defaults.global.tooltipYPadding = 16;
Chart.defaults.global.tooltipCornerRadius = 0;
Chart.defaults.global.tooltipTitleFontStyle = "normal";
Chart.defaults.global.tooltipFillColor = "rgba(0,160,0,0.8)";
Chart.defaults.global.animationEasing = "easeOutBounce";
Chart.defaults.global.responsive = true;
Chart.defaults.global.scaleLineColor = "black";
Chart.defaults.global.scaleFontSize = 12;

var ctx = document.getElementById("lineChart").getContext("2d");
// ctx.canvas.width = 50;
// ctx.canvas.height = 50;
var LineChartDemo = new Chart(ctx).Line(lineChartData, {
    pointDotRadius: 10,
    bezierCurve: false,
    scaleShowVerticalLines: false,
    scaleGridLineColor: "black",
    });
});