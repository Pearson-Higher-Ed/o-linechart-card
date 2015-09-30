/*global*/

"use strict";

module.exports = function() {

  var width,
      height,
      header,
      subheader,
      tooltipText,
      xLabel,
      units,
      ceiling,
      floor,
      useDataColors,
      floorA,
      floorB,
      floorC,
      floorD;

  function chart(data, domElement) {

    // Calculations for Scaling
    var thisWeek = data.splice(-1, 1),
        margin = width / 10,
        yMultiplier = Math.pow(10, ("" + Math.max.apply(null, data)).length) / 10, // determines order of magnitude
        yCeil = !isNaN(ceiling) ? ceiling : (Math.ceil(Math.max.apply(null, data) / yMultiplier)) * yMultiplier, // round up
        yFloor = !isNaN(floor) ? floor : (Math.ceil(Math.min.apply(null, data) / -yMultiplier)) * -yMultiplier, // round down
        fontMultiplier = height < width ? height : width, // Prevents text from being too tall
        dataPointSize = fontMultiplier > 200 ? 7 : 4;

    // Helper Functions
    function x(i) {
      var tickMultiplier = (width - (margin * 3)) / (data.length - 1);
      return (margin * 2) + (tickMultiplier * i);
    }

    function y(d) {
      return 0 - (((((height / 2) - margin) / (yCeil - yFloor)) * (d - yFloor)) + margin) ;
    }

    function getColor(dataIn) {
      if (!useDataColors) return "black";
      if (dataIn >= floorA) return "darkgreen";
      if (dataIn >= floorB) return "darkolivegreen";
      if (dataIn >= floorC) return "darkgoldenrod";
      if (dataIn >= floorD) return "darkorange";
      return "red";
    }

    function createSVGElement(element) {
      return document.createElementNS("http://www.w3.org/2000/svg", element);
    }

    function getPath(){
      var delim = "M";
      var result = "";
      for (var i = 0; i < data.length; i++) {
        result += delim + x(i) + "," + y(data[i]);
        delim = "L";
      }
      return result;
    }

    function onMouseOver(t, e) {
      t = t ? t : this;
      e = e ? e : window.event;

      var circlei = e.target;
      var index = parseInt(circlei.attributes["dataIndex"].value);

      circlei.style.fill = getColor(data[index]);
      circlei.setAttribute("r", dataPointSize + 3);

      tooltip.style.visibility = "visible";
      tooltipWeek.innerHTML = data.length === index + 1 ? "Last Week" : "Week " + (1 + index);
      tooltipPercent.style.color = getColor(data[index]);
      tooltipPercent.innerHTML = data[index] + "" + units;

      var matrix = t.getScreenCTM().translate(+t.getAttribute("cx"), +t.getAttribute("cy"));

      tooltip.style.left = (window.pageXOffset + matrix.e - 75) + "px";
      tooltip.style.top = (window.pageYOffset + matrix.f - 100) + "px";
    }

    function onMouseOut(e) {
      e = e ? e : window.event;

      var circlei = e.target;
      var index = circlei.attributes["dataIndex"].value;

      circlei.style.fill = "dimgray";
      circlei.setAttribute("r", dataPointSize);

      tooltip.style.visibility = "hidden";
      tooltipWeek.innerHTML = "";
      tooltipPercent.innerHTML = "";
    }

    // Create DOM elements
    var container = document.createElement("span");
    container.setAttribute("class", "chartcard")
    domElement.appendChild(container);

    // Tooltips
    var tooltip = document.createElement("div");
    tooltip.setAttribute("class", "chartcard__tooltip");
    container.appendChild(tooltip);

    var tooltipWeek = document.createElement("h1");
    tooltipWeek.setAttribute("class", "chartcard__tooltip__week");
    tooltip.appendChild(tooltipWeek);

    var tooltipPercent = document.createElement("p");
    tooltipPercent.setAttribute("class", "chartcard__tooltip__percent");
    tooltip.appendChild(tooltipPercent);

    // Create the SVG element
    var svg = createSVGElement("svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    container.appendChild(svg)

    var g = createSVGElement("g");
    g.setAttribute("transform", "translate(0," + height + ")");
    svg.appendChild(g);

    // Headers
    var headerNode = createSVGElement("text");
    headerNode.setAttribute("class", "chartcard__header");
    headerNode.setAttribute("x", margin / 2);
    headerNode.setAttribute("y", height * -0.9);
    headerNode.setAttribute("text-anchor", "right");
    headerNode.style.fontSize = ((fontMultiplier < 150 ? 150 : fontMultiplier) / 16) + "px";
    headerNode.textContent = header;
    g.appendChild(headerNode);

    var subheaderNode = createSVGElement("text");
    subheaderNode.setAttribute("class", "chartcard__subheader");
    subheaderNode.setAttribute("x", margin / 2);
    subheaderNode.setAttribute("y", height * -0.84);
    subheaderNode.setAttribute("text-anchor", "right");
    subheaderNode.style.fontSize = (fontMultiplier / 19) + "px";
    subheaderNode.innerHTML = subheader;
    g.appendChild(subheaderNode);

    var percentNode = createSVGElement("text");
    percentNode.setAttribute("class", "chartcard__percent");
    percentNode.setAttribute("x", margin / 2);
    percentNode.setAttribute("y", height * -0.62);
    percentNode.setAttribute("text-anchor", "right");
    percentNode.style.fontSize = (fontMultiplier / 4) + "px";
    percentNode.style.fill = getColor(thisWeek);
    percentNode.textContent = thisWeek + "" + units;
    g.appendChild(percentNode);

    // Guidelines
    for (var i = 0; i <= data.length; i++) {
      var yGuidei = createSVGElement("line");
      yGuidei.setAttribute("class", "chartcard__guidelines");
      yGuidei.setAttribute("x1", x(i));
      yGuidei.setAttribute("x2", x(i));
      yGuidei.setAttribute("y1", y(yCeil));
      yGuidei.setAttribute("y2", y(yFloor));
      g.appendChild(yGuidei);
    }

    for (var i = 0; i < 3; i++) {
      if (i === 0) var yVal = yCeil;
      if (i === 1) var yVal = ((yCeil - yFloor) / 2) + yFloor ;
      if (i === 2) var yVal = yFloor;

      var xGuidei = createSVGElement("line");
      xGuidei.setAttribute("class", "chartcard__guidelines");
      xGuidei.setAttribute("x1", margin * 2);
      xGuidei.setAttribute("x2", width - margin);
      xGuidei.setAttribute("y1", y(yVal));
      xGuidei.setAttribute("y2", y(yVal));
      g.appendChild(xGuidei);

      var xLabeli= createSVGElement("text");
      xLabeli.setAttribute("class", "chartcard__xLabel")
      xLabeli.setAttribute("x", 20);
      xLabeli.setAttribute("y", y(yVal));
      xLabeli.setAttribute("text-anchor", "left");
      xLabeli.setAttribute("dy", 4);
      xLabeli.textContent = Math.round(yVal);
      g.appendChild(xLabeli);
    }

    // Line path
    var path = createSVGElement("path");
    path.setAttribute("class", "chartcard__datapath");
    path.setAttribute("d", getPath());
    g.appendChild(path);

    // Circles
    for (i = 0; i < data.length; i++) {
      var circle = createSVGElement("circle");
      circle.setAttribute("class", "chartcard__datapoint")
      circle.setAttribute("cx", x(i));
      circle.setAttribute("cy", y(data[i]));
      circle.setAttribute("r", dataPointSize);
      circle.setAttribute("dataIndex", i)
      circle.addEventListener("mouseover", function(e) { onMouseOver(this, e); });
      circle.addEventListener("mouseout", function(e) { onMouseOut(e); });
      g.appendChild(circle);
    }
  }

  // Getters and Setters
  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  }

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  }

  chart.header = function(value) {
    if (!arguments.length) return header;
    header = value;
    return chart;
  }

  chart.subheader = function(value) {
    if (!arguments.length) return subheader;
    subheader = value;
    return chart;
  }

  chart.tooltipText = function(value) {
    if (!arguments.length) return tooltipText;
    tooltipText = value;
    return chart;
  }

  chart.xLabel = function(value) {
    if (!arguments.length) return xLabel;
    xLabel = value;
    return chart;
  }

  chart.units = function(value) {
    if (!arguments.length) return units;
    units = value;
    return chart;
  }

  chart.ceiling = function(value) {
    if (!arguments.length) return ceiling;
    ceiling = value;
    return chart;
  }

  chart.floor = function(value) {
    if (!arguments.length) return floor;
    floor = value;
    return chart;
  }

  chart.useDataColors = function(value) {
    if (!arguments.length) return useDataColors;
    useDataColors = value;
    return chart;
  }

  chart.floorA = function(value) {
    if (!arguments.length) return floorA;
    floorA = value;
    return chart;
  }

  chart.floorB = function(value) {
    if (!arguments.length) return floorB;
    floorB = value;
    return chart;
  }

  chart.floorC = function(value) {
    if (!arguments.length) return floorC;
    floorC = value;
    return chart;
  }

  chart.floorD = function(value) {
    if (!arguments.length) return floorD;
    floorD = value;
    return chart;
  }

  return chart;
}
