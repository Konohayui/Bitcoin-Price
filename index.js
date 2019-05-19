//API to fetch historical data of Bitcoin Price Index
const api = 'https://api.coindesk.com/v1/bpi/historical/close.json';

/**
 * Loading data from API when DOM Content has been loaded'.
 */
document.addEventListener("DOMContentLoaded", function(event) {
fetch(api)
    .then(function(response) { return response.json(); })
    .then(function(data) {
        var parsedData = parseData(data);
        drawChart(parsedData);
    })
    .catch(function(err) { console.log(err); })
});

/**
 * Parse data into key-value pairs
 * @param {object} data Object containing historical data of BPI
 */
function parseData(data) {
    var arr = [];
    for (var i in data.bpi) {
        arr.push({
            date: new Date(i), //date
            value: +data.bpi[i] //convert string to number
        });
    }
    return arr;
}

/**
 * Creates a chart using D3
 * @param {object} data Object containing historical data of BPI
 */
function drawChart(data) {
var svgWidth = 600, svgHeight = 400;
var margin = { top: 20, right: 20, bottom: 30, left: 50 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select('svg')
            .attr("width", svgWidth)
            .attr("height", svgHeight);
    
var g = svg.append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
          .range([0, width]);

var y = d3.scaleLinear()
          .range([height, 0]);

var xAxis = d3.axisBottom()
              .scale(x)
              .tickSize(-height);
              
var yAxis = d3.axisLeft()
              .scale(y);

var area = d3.area()
             .x(function(d) { return x(d.date); })
             .y0(height)
             .y1(function(d) { return y(d.value); });
             
var line = d3.line()
             .x(function(d) { return x(d.date)})
             .y(function(d) { return y(d.value)})
    
x.domain(d3.extent(data, function(d) { return d.date }));
y.domain(d3.extent(data, function(d) { return d.value }));

g.append("g")
 .attr("transform", "translate(0," + height + ")")
 .call(d3.axisBottom(x))
 .select(".domain");

g.append("g")
 .call(d3.axisLeft(y))
 .append("text")
 .attr("fill", "#000")
 .attr("transform", "rotate(-90)")
 .attr("y", 6)
 .attr("dy", "0.71em")
 .attr("text-anchor", "end")
 .text("Price ($)");

g.append("path")
 .datum(data)
 .attr("class", "area")
 .attr("d", area);
 
g.append("path")
 .datum(data)
 .attr("class", "line")
 .attr("fill", "none")
 .attr("stroke", "steelblue")
 .attr("stroke-linejoin", "round")
 .attr("stroke-linecap", "round")
 .attr("stroke-width", 1.5)
 .attr("d", line);

// g.datum(data)
//  .on("click", click);

// function click() {
//     var n = data.length - 1,
//         i = Math.floor(Math.random() * n / 2),
//         j = i + Math.floor(Math.random() * n / 2) + 1;
//     x.domain([data[i].date, data[j].date]);
//     var t = g.transition().duration(750);
//     t.select(".x.axis").call(xAxis);
//     t.select(".area").attr("d", area);
//     t.select(".line").attr("d", line);
//   };

}
