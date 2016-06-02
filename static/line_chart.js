$(document).ready(function () {
    var lineChartData = {
    labels: ["1960", "1970", "1980", "1990", "2000", "2010"],
    datasets: [{
        label: "Waste Generation (lb/person/day)",
        fillColor: "rgba(220,220,220,0)",
        strokeColor: "rgba(220,180,0,1)",
        pointColor: "rgba(220,180,0,1)",
        data: [2.68, 3.25, 3.66, 4.57, 4.72, 4.44]
    // }, {
    //     fillColor: "rgba(151,187,205,0)",
    //     strokeColor: "rgba(151,187,205,1)",
    //     pointColor: "rgba(151,187,205,1)",
    //     data: [60, 10, 40, 30, 80, 30, 20]
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