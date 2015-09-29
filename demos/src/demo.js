/*global require*/
"use strict";

document.addEventListener("DOMContentLoaded", function() {
	var lineChart = require("../../main");

	new lineChart("#chart", {
		size:"large",
		data:[75, 90, 85, 55, 63, 79],
		header: "Average Grade to Date",
    subheader: "Cumulative",
    tooltipText: "Last Week",
    xLabel: "Week",
    ceiling: 100,
    floor: "soft",
    useDataColors: true,
    floorA: 90,
    floorB: 80,
    floorC: 70,
    floorD: 60
  });
});
