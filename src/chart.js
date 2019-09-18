import React, {Component} from 'react';
import * as d3 from "d3";

class Chart extends Component {
    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    drawChart() {
        console.log(this.props.data);
        const graphPoints = this.props.data.graphPoints;
        const containerWidth = 700;

        const aspectRatio = 16 / 9;
        const scrollBarWidth = 20;
        const pixelsPerAxisLabel = 75;

        var margin = {top: 20, right: 10, bottom: 30, left: 75},
            width = containerWidth - margin.left - margin.right - scrollBarWidth,
            height = width / aspectRatio - margin.top - margin.bottom;

        const numberOfXTicks = Math.min(width / pixelsPerAxisLabel);

        function calculateYearsBetween(date1, date2) {
            var date1_yr = date1.getFullYear();
            var date2_yr = date2.getFullYear();

            return date2_yr - date1_yr;
        };

        function numberWithCommas(x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        };

        function yTickFormat(tickValue) {
            tickValue = numberWithCommas(tickValue);
            return '$' + tickValue;
        }

        // var customTimeFormat = d3.timeFormat.multi([
        //     [".%L", function(d) { return d.getMilliseconds(); }],
        //     [":%S", function(d) { return d.getSeconds(); }],
        //     ["%I:%M", function(d) { return d.getMinutes(); }],
        //     ["%I %p", function(d) { return d.getHours(); }],
        //     ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
        //     ["%b %d", function(d) { return d.getDate() != 1; }],
        //     ["%b", function(d) { return d.getMonth(); }],
        //     ["%Y", function() { return true; }]
        // ]);

        var xLabel = function(date) {
            var curDate = new Date();
            var currentYearsFromNow;
            var newYearsFromNow = calculateYearsBetween(curDate, date);

            if (currentYearsFromNow === newYearsFromNow) {
                return null;
            }
            else {
                currentYearsFromNow = newYearsFromNow;
                return newYearsFromNow;
            }
        };

        var curDate = new Date();
        var endDate = new Date();
        endDate.setMonth(endDate.getMonth() + graphPoints.length);

        var maxValue = d3.max(graphPoints, function(d) { return d.passiveIncome; });

        console.log(maxValue);

        var chart = d3.select(this.svg);
        chart.selectAll("*").remove();
        chart.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.bottom + margin.top)
            .attr('class','graph-svg')
            .style("overflow", "visible");

        var xScale = d3.scaleTime()
            .domain([curDate, endDate])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([height, 0]);

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(xLabel)
            .ticks(numberOfXTicks);

        var yAxis = d3.axisLeft(yScale)
            .tickFormat(yTickFormat);

        chart.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
            .call(xAxis);

        chart.append("text")
            .attr("class", "xaxis-label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 3)
            .text("Years from now");

        chart.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(yAxis);

        var expenseLine = d3.line()
            .x(function(d) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.spend);
            });

        var withdrawLine = d3.line()
            .x(function(d) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.passiveIncome);
            });

        chart.append("path")
            .attr("class", "expense-line")
            .attr("d", expenseLine(graphPoints))
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ") ")
            .style("stroke-width", 2)
            .style("stroke", "red")
            .style("fill", "none");

        chart.append("path")
            .attr("class", "withdraw-line")
            .attr("d", withdrawLine(graphPoints))
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ") ")
            .style("stroke-width", 2)
            .style("stroke", "green")
            .style("fill", "none");
    }

    render() {
        return (
            <div>
                <div><pre>{JSON.stringify(this.props.data.graphPoints[0], null, 2)}</pre></div>
                <svg ref={(elem) => { this.svg = elem}}></svg>
            </div>
        )
    }
}

export default Chart;
