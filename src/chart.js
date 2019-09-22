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
        const graphPoints = this.props.data.graphPoints;
        const containerWidth = 700;

        const aspectRatio = 16 / 9;
        const scrollBarWidth = 20;
        const pixelsPerAxisLabel = 75;

        let margin = {top: 20, right: 10, bottom: 30, left: 75},
            width = containerWidth - margin.left - margin.right - scrollBarWidth,
            height = width / aspectRatio - margin.top - margin.bottom;

        const numberOfXTicks = Math.min(width / pixelsPerAxisLabel);

        let curDate = new Date();
        let endDate = new Date();
        endDate.setMonth(endDate.getMonth() + graphPoints.length);

        let maxValue = d3.max(graphPoints, function(d) { return Math.max(d.passiveIncome, d.spend); });
        let minValue = d3.min(graphPoints, function(d) { return Math.min(0, d.passiveIncome, d.spend); });

        let chart = d3.select(this.svg);
        chart.selectAll("*").remove();
        chart.attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.bottom + margin.top)
            .attr('class','graph-svg')
            .style("overflow", "visible");

        let xScale = d3.scaleTime()
            .domain([curDate, endDate])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([minValue, maxValue])
            .range([height, 0]);

        let xAxis = d3.axisBottom(xScale)
            .tickFormat(multiFormat)
            .ticks(numberOfXTicks);

        let yAxis = d3.axisLeft(yScale)
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

        let expenseLine = d3.line()
            .x(function(d) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.spend);
            });

        let withdrawLine = d3.line()
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

        if (this.props.data.intersectionPoint !== null) {
            chart.selectAll('circle')
                .data([this.props.data.intersectionPoint])
                .enter()
                .append('circle')
                .attr('cx', function(d) {
                    return xScale(d.x);
                })
                .attr('cy', function(d) {
                    return yScale(d.y);
                })
                .attr('r', 5)
                .attr('class', 'intersection-point')
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
        }
    }

    render() {
        return (
            <div>
                <svg ref={(elem) => { this.svg = elem}}></svg>
            </div>
        )
    }
}

const formatMillisecond = d3.timeFormat(".%L"),
      formatSecond = d3.timeFormat(":%S"),
      formatMinute = d3.timeFormat("%I:%M"),
      formatHour = d3.timeFormat("%I %p"),
      formatDay = d3.timeFormat("%a %d"),
      formatWeek = d3.timeFormat("%b %d"),
      formatMonth = d3.timeFormat("%B"),
      formatYear = d3.timeFormat("%Y");

function multiFormat(date) {
    return (d3.timeSecond(date) < date ? formatMillisecond
        : d3.timeMinute(date) < date ? formatSecond
        : d3.timeHour(date) < date ? formatMinute
        : d3.timeDay(date) < date ? formatHour
        : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
        : d3.timeYear(date) < date ? formatMonth
        : formatYear)(date);
}

function numberWithCommas(x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

function yTickFormat(tickValue) {
    tickValue = numberWithCommas(tickValue);
    return '$' + tickValue;
}

export default Chart;
