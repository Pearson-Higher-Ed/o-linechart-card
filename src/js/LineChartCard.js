/*global*/
"use strict";

var lineChart = require("./linechart");

function lineChartCard(element, params) {
  if (!(this instanceof lineChartCard)) {
    throw new TypeError("Constructor lineChart requires \"new\"");
  }
  if (!element) {
    throw new TypeError("missing required argument: element");
  }
  if (typeof element === "string") {
    element = document.querySelector(element);
  }
  if (!element) {
    return;
  }

  if (!params.data) {
    throw "No data provided.  Please provide an array of data."
  }
  var data = params.data;

  if(!params.size) {
		throw "No size provided. Please specify a size.";
	}
  var width,
      height;

	switch(params.size) {
		case "small":
			throw new Error("Size cannot be small");
		case "medium":
			width = 200;
			height = 200;
			break;
		case "large":
			width = 400;
			height = 400;
			break;
		default:
      throw new Error("Size of medium or large must be provided");
  }

  var header = params.header ? params.header : "",
      subheader = params.subheader ? params.subheader : "",
      tooltipText = params.tooltiptext ? params.tooltiptext : "",
      xLabel = params.xlabel ? params.xlabel : "",
      units = params.units ? params.units : "",
      ceiling = parseInt(params.ceiling) !== NaN ? parseInt(params.ceiling) : "soft",
      floor = parseInt(params.floor) !== NaN ? parseInt(params.floor) : "soft",
      useDataColors = params.useDataColors,
      floorA = parseInt(params.floorA) !== NaN ? parseInt(params.floorA) : 90,
      floorB = parseInt(params.floorB) !== NaN ? parseInt(params.floorB) : 80,
      floorC = parseInt(params.floorC) !== NaN ? parseInt(params.floorC) : 70,
      floorD = parseInt(params.floorD) !== NaN ? parseInt(params.floorD) : 60;


  var chartDiv = document.createElement("div"); // The element the linechart will append itself to
  chartDiv.className = "o-linechart";

  this.card = document.createElement("div"); // The element which will be inserted into the consuming page
  this.card.className = "o-card o-card--" + params.size;
  this.card.appendChild(chartDiv);

  var chart = lineChart()
    .height(height)
    .width(width)
    .header(header)
    .subheader(subheader)
    .tooltipText(tooltipText)
    .xLabel(xLabel)
    .units(units)
    .ceiling(ceiling)
    .floor(floor)
    .useDataColors(useDataColors)
    .floorA(floorA)
    .floorB(floorB)
    .floorC(floorC)
    .floorD(floorD);

  chart(data, chartDiv);

  element.appendChild(this.card);

}

module.exports = lineChartCard;
