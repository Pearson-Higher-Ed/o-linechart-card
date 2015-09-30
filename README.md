# o-linechartcard [![Build Status](https://travis-ci.org/Pearson-Higher-Ed/o-linechart-card.svg)](https://travis-ci.org/Pearson-Higher-Ed/o-linechart-card)

## Use

To use, create a new instance of the card, passing in the DOM target and a JSON configuration payload, in the format:
```
new lineChart([targetDomElement], [JsonPayload]);
```

where the targetDomElement is the DOM element where the card will be inserted,
and and JsonPayload is a JSON object containing the following parameters:

* **data** (required): Data, as an array of numbers, to be displayed in the bar chart
* **size** (required): The size of the chart to be inserted onto the page. Accepts:
  * medium: 200px by 200px
  * large: 400px by 400px
* **header** (required): Header text to be displayed on the card
* **subheader** (required): The subheader text to be displayed below the header
* **tooltipText** (required): How to describe the second-to-last item in the data set (eg, "Last weeks grade," or "second coldest day")
* **xLabel** (required): How the data is broken up. For example, if the data is grade by week, xLabel would be "week"
* **units** (optional, default is empty): Indicates what measurement the data (y axis) was taken in, for example, "%"
* **ceiling** (optional, default is "soft"): Can be a number, "soft." If a number, this will be the max value on the Y axis. if "soft", the chart will caclulate the max Y value from the data.
* **floor** (optional, default is "soft"): Like "ceiling," above, but for the minimum Y value.  
* **useDataColors** (optional, default is false): if true, mouseover colors will be calculated based on the floor cutoff numbers, below. If false, all numbers and mouseovers will be black
* **floorA** (optional, default is 90): Any datapoint at or above this value will be green in the tooltip. Only used if useDataColors is true.
* **floorB** (optional, default is 80): Any datapoint between this value and the floorA value will be yellow-green. Only used if useDataColors is true.
* **floorC** (optional, default is 70): Any datapoint between this value and the floorB value will be yellow. Only used if useDataColors is true.
* **floorD** (optional, default is 60): Any datapoint between this value and the floorC value will be orange, and any datapoint below this value will be red. Only used if useDataColors is true.

### Example HTML
See /demos/ for a complete example
```
<div id="chart"></div>
<script>
  var lineChart = require("../../main");
  new lineChart("#chart", {
    size:"large",
    data:[75, 90, 85, 55, 63, 79],
    header: "Average Grade to Date",
    subheader: "Cumulative"
    tooltipText: "Last Week",
    xLabel: "Week",
    units: "%",
    ceiling: 100,
    floor: "soft",
    useDataColors: true,
    floorA: 90,
    floorB: 80,
    floorC: 70,
    floorD: 60
  });
</script>
```
### Quick-start (to see the demo)
This card uses [Origami Build Tools](https://github.com/Financial-Times/origami-build-tools)

To run the demo:
```bash
origami-build-tools install
origami-build-tools build
origami-build-tools demo --runServer --watch
```
The page will now be available locally, probably at <http://localhost:8080/demos/local/demo.html>
