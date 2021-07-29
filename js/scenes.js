var dataSet;
var svg;

const canvas = {width: 900, height: 900};
const margin = {top: 150, bottom: 70, right: 150, left: 70};
const chart_dimensions = {
    width: canvas.width - (margin.right + margin.left),
    height: canvas.height - (margin.top + margin.bottom)
};

const offenseGroups = {};
const offensesByDay = {};
const offensesByHour = {};
const offensesByMonth = {};

const x_offenses = d3.scaleBand();
const y_offenseCount = d3.scaleLinear();
const y_offenseCount_axis = d3.scaleLinear();
const yAxis = d3.axisLeft();

const x_days = d3.scaleBand();
const y_offensesByDayCount = d3.scaleLinear();
const y_offensesByDayCount_axis = d3.scaleLinear();
const yAxis2 = d3.axisLeft();

const x_hours = d3.scaleBand();
const y_offensesByHourCount = d3.scaleLinear();
const y_offensesByHourCount_axis = d3.scaleLinear();
const yAxis3 = d3.axisLeft();

var xScale = d3.scaleBand();
var yScale = d3.scaleLinear();
const y_offensesByMonthCount_axis = d3.scaleLinear();
const yAxis4 = d3.axisLeft();

var x_axis;
var y_axis;
//var xScale;
//var yScale;

function initializeVisualization() {
	loadChart1();
	d3.select("#b1").classed("active",true);
    loadcsvdata( dataloaded );
}

function loadcsvdata( dataloaded ) {
    d3.dsv(",", "../dataset/crime.csv", function(d) {

        const dataobj = {
			year: +d.YEAR,
            month: d.MONTH_NAME,
			month_index: +d.MONTH,
			day: d.DAY_OF_WEEK,
			day_index: +d.DAY,
			hour: +d.HOUR,
			date: d.OCCURRED_ON_DATE,
            offense: d.OFFENSE_CODE_GROUP,
			desc: d.OFFENSE_DESCRIPTION,
			street: d.STREET
        };
		
		if (!offenseGroups[dataobj.offense])
				offenseGroups[dataobj.offense] = { offense: dataobj.offense, offenseCount: 0};

		offenseGroups[dataobj.offense].offenseCount++;
		
		if (!offensesByDay[dataobj.day])
				offensesByDay[dataobj.day] = { day: dataobj.day, index: dataobj.day_index, offenseCount: 0};

		offensesByDay[dataobj.day].offenseCount++;
		
		if (!offensesByHour[dataobj.hour])
				offensesByHour[dataobj.hour] = { hour: dataobj.hour, offenseCount: 0};

		offensesByHour[dataobj.hour].offenseCount++;

		if (!offensesByMonth[dataobj.month])
				offensesByMonth[dataobj.month] = { month: dataobj.month, index: dataobj.month_index, offenseCount: 0};

		offensesByMonth[dataobj.month].offenseCount++;
	
        return dataobj;

    }).then(function(data) {
        dataSet = data;
        dataloaded();
    });	
}

function dataloaded() {
    d3.select("#chart-id")
        .classed("invisible",false);
}

function calculateScales1(){
	d3.select("#b1").classed("active",true);
	d3.select("#b2").classed("active",false);
	d3.select("#b3").classed("active",false);
	d3.select("#b4").classed("active",false);
	d3.select("#b5").classed("active",false);
	d3.select(".selection").selectAll("*").remove();
	//d3.selectAll("#selection").style("visibility","hidden");
	const referenceData = d3.values(offenseGroups);
	//console.log(referenceData);
	x_offenses.range([0, chart_dimensions.width])
        .domain(d3.keys(offenseGroups));
    y_offenseCount.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
        .range([0, chart_dimensions.height]);
	y_offenseCount_axis.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
        .range([chart_dimensions.height, 0]);
}

function calculateScalesByMonth(){
	d3.select("#b1").classed("active",false);
	d3.select("#b2").classed("active",true);
	d3.select("#b3").classed("active",false);
	d3.select("#b4").classed("active",false);
	d3.select("#b5").classed("active",false);
	d3.select(".selection").selectAll("*").remove();
	//d3.selectAll("#selection").style("visibility","hidden");
	var referenceData = d3.values(offensesByMonth);
	//console.log(referenceData4);
	xScale.range([0, chart_dimensions.width])
        .domain(d3.keys(offensesByMonth));
    yScale.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
        .range([chart_dimensions.height, 0]);
	//y_offensesByMonthCount_axis.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
        //.range([chart_dimensions.height, 0]);
}

function calculateScales3(){
	d3.select("#b1").classed("active",false);
	d3.select("#b2").classed("active",false);
	d3.select("#b3").classed("active",true);
	d3.select("#b4").classed("active",false);
	d3.select("#b5").classed("active",false);
	d3.select(".selection").selectAll("*").remove();
	//d3.selectAll("#selection").style("visibility","hidden");
	const referenceData2 = d3.values(offensesByDay);
	//console.log(referenceData2);
	x_days.range([0, chart_dimensions.width])
        .domain(d3.keys(offensesByDay));
    y_offensesByDayCount.domain([0, d3.max(referenceData2, function(d) { return d.value; })])
        .range([0, chart_dimensions.height]);
	y_offensesByDayCount_axis.domain([0, d3.max(referenceData2, function(d) { return d.value; })])
        .range([chart_dimensions.height, 0]);
}

function calculateScales4(){
	d3.select("#b1").classed("active",false);
	d3.select("#b2").classed("active",false);
	d3.select("#b3").classed("active",false);
	d3.select("#b4").classed("active",true);
	d3.select("#b5").classed("active",false);
	d3.select(".selection").selectAll("*").remove();
	//d3.selectAll("#selection").style("visibility","hidden");
	const referenceData3 = d3.values(offensesByHour);
	//console.log(referenceData3);
	
	x_hours.range([0, chart_dimensions.width])
        .domain(d3.keys(offensesByHour));
    y_offensesByHourCount.domain([0, d3.max(referenceData3, function(d) { return d.offenseCount; })])
        .range([0, chart_dimensions.height]);
	y_offensesByHourCount_axis.domain([0, d3.max(referenceData3, function(d) { return d.offenseCount; })])
        .range([chart_dimensions.height, 0]);
}

function initializeChartArea() {
	d3.select(".heading").selectAll("*").remove();	
	d3.select(".para").selectAll("*").remove();
	d3.select(".parascenes").selectAll("*").remove();
	d3.select(".chart").selectAll("*").remove();
	d3.select(".selection").selectAll("*").remove();
    var chart = d3.select(".chart")
        .attr("width", canvas.width)
        .attr("height", canvas.height);
}

function createOffenseCountBars() {
var div = d3.select("body").append("div");

	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("h4").text("Types of Serious Crimes").style("text-anchor", "start");
	d3.select("#chart-div").insert("div").classed("parascenes",true).style('width','300px').style('height','180px');
	d3.select(".parascenes").insert("p").text("The graph shows crimes reported over 3 years and their frequency by type of a crime.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("Larceny is by far the most common serious crime, and homicides are pretty rare.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("Click on next slide for frequency of crimes happening over each month.");
	
    d3.select(".chart")
		.selectAll(".bar-offenseCount")
        .data(d3.values(offenseGroups))
        .enter()
        .append("g")
        .classed("bar-offenseCount",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + (20 + x_offenses(d.offense)-x_offenses.bandwidth()/2)) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("rect-offenseCount",true)
        .attr("x", x_offenses.bandwidth()/2)
        .attr("y", chart_dimensions.height)
		.attr("width", x_offenses.bandwidth()/2 - 1)
        .attr("height",0);
}

function showOffenseCountBars() {

    d3.selectAll(".rect-offenseCount")
        .transition()
        .duration(1000)
        .attr("height", function (d) {
            return y_offenseCount(d.offenseCount);
        })
        .attr("y", function (d) {
            return (chart_dimensions.height - y_offenseCount(d.offenseCount));
        });
		
	d3.select(".chart")
		.append("line")
		.classed("scene-1-line",true)
		.attr("x1",190)
		.attr("y1",720)
		.attr("x2",190)
		.attr("y2",800)
		.attr("stroke-width",0.75)
		.attr("stroke","gray");
		
	d3.select(".chart")
		.append("rect")
		.classed("scene-1-rect",true)
		.attr("x",110)
		.attr("y",660)
		.attr("width",158)
		.attr("height",60)
		.attr("fill","lightgray")
		.transition().duration(1000);
	
	d3.select(".chart")
		.append("text")
		.classed("scene-1-text",true)
		.attr("x",237)
		.attr("y",675)
		.style("font-size","11px")
		.attr("dy",".35em")
		.text("Type of crimes with")
		.attr("fill","black");
		
	d3.select(".chart")
		.append("text")
		.classed("scene-1-text-1",true)
		.attr("x",257)
		.attr("y",690)
		.attr("dy",".35em")
		.style("font-size","11px")
		.text("low frequency - Homicide, ")
		.attr("fill","black");
	
	d3.select(".chart")
		.append("text")
		.classed("scene-1-text-2",true)
		.attr("x",267)
		.attr("y",705)
		.style("font-size","11px")
		.attr("dy",".35em")
		.text("other and commercial burglaries")
		.attr("fill","black");	
		
	d3.select(".chart")
		.append("line")
		.classed("scene-1-line-2",true)
		.attr("x1",670)
		.attr("y1",420)
		.attr("x2",670)
		.attr("y2",560)
		.attr("stroke-width",0.75)
		.attr("stroke","gray");
		
	d3.select(".chart")
		.append("rect")
		.classed("scene-1-rect-2",true)
		.attr("x",531)
		.attr("y",380)
		.attr("width",140)
		.attr("height",40)
		.attr("fill","lightgray")
		.transition().duration(1000);
	
	d3.select(".chart")
		.append("text")
		.classed("scene-1-text-3",true)
		.attr("x",650)
		.attr("y",392)
		.style("font-size","11px")
		.attr("dy",".35em")
		.text("Type of crimes with")
		.attr("fill","black");
		
	d3.select(".chart")
		.append("text")
		.classed("scene-1-text-4",true)
		.attr("x",660)
		.attr("y",407)
		.attr("dy",".35em")
		.style("font-size","11px")
		.text("high frequency - Larceny")
		.attr("fill","black");
}

function createOffenseCountAxis() {
    yAxis.scale(y_offenseCount_axis)
        .tickSize(10).ticks(20);

    d3.select(".chart").append("g")
        .attr("id", "yAxis")
        .classed("y-axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height + margin.bottom) + ")")
        .call(yAxis);

    d3.select("svg").append("text")
        .attr("id", "yAxisLabel")
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height + margin.bottom + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Records");
}

function showOffenseCountAxis() {
    d3.select("#yAxis")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis)
        .selectAll("text")
        .attr("x", -50)
        .attr("y", 0)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "start");

    d3.select("#yAxisLabel")
        .transition()
        .duration(1000)
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)");
}

function showOffenseAxis() {
    const xAxis = d3.axisBottom().scale(x_offenses)
        .ticks(d3.keys(offenseGroups));

    d3.select(".chart").append("g")
        .attr("id", "xAxis")
        .classed("x axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height) + ")")
        .call(xAxis)
        .selectAll("text")
		.call(wrap, x_offenses.bandwidth())
        .attr("x", -20)
        .attr("y", 20)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .attr("transform", "rotate(0)")
        .style("text-anchor", "start");

    d3.select(".chart").append("text")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width / 2) + " ," +
            (margin.top + chart_dimensions.height + 50) + ")")
        .style("text-anchor", "middle")
        .text("Offense Group");
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", -20).attr("y", y).attr("dy", dy + "em")
    while (word = words.pop()) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text.append("tspan").attr("x", -20).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
      }
    }
  })
}

function createOffensesByDayCountBars() {
var div = d3.select("body").append("div");
	
	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("h4").text("Crimes over Days").style("text-anchor", "start");
	d3.select("#chart-div").insert("div").classed("parascenes",true).style('width','300px').style('height','180px');
	d3.select(".parascenes").insert("p").text("The graph shows crimes reported over 3 years and their frequency over days of the week.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("There is a little variation across days of the week, with Friday having the highest crime rate and Sunday having the lowest.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("Click on next slide for frequency of crimes happening over hours of a day.");
	
    d3.select(".chart")
		.selectAll(".bar-offenseCount")
        .data(d3.values(offensesByDay))
        .enter()
        .append("g")
        .classed("bar-offenseCount",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + (25 + x_days(d.day)-x_days.bandwidth()/2)) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("bar",true)
        .attr("x", x_days.bandwidth()/2)
        .attr("y", chart_dimensions.height)
		.attr("width", x_days.bandwidth()/2 - 1)
        .attr("height",0);
}

function showOffensesByDayCountBars() {

    d3.selectAll(".bar")
        .transition()
        .duration(1000)
        .attr("height", function (d) {
            return y_offensesByDayCount(d.offenseCount);
        })
        .attr("y", function (d) {
            return (chart_dimensions.height - y_offensesByDayCount(d.offenseCount));
        });
}

function createOffensesByDayCountAxis() {
    yAxis2.scale(y_offensesByDayCount_axis)
        .tickSize(10).ticks(20);

    d3.select(".chart").append("g")
        .attr("id", "yAxis")
        .classed("y-axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height + margin.bottom) + ")")
        .call(yAxis2);

    d3.select("svg").append("text")
        .attr("id", "yAxisLabel")
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height + margin.bottom + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Records");
}

function showOffensesByDayCountAxis() {
    d3.select("#yAxis")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis2)
        .selectAll("text")
        .attr("x", -50)
        .attr("y", 0)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "start");

    d3.select("#yAxisLabel")
        .transition()
        .duration(1000)
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)");
}

function showDaysAxis() {
    const xAxis = d3.axisBottom().scale(x_days)
        .ticks(d3.keys(offensesByDay));

    d3.select(".chart").append("g")
        .attr("id", "xAxis")
        .classed("x axis",true)
        .attr("transform", "translate(" + (margin.left) + "," + (margin.top + chart_dimensions.height) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("x", -20)
        .attr("y", 13)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .attr("transform", "rotate(0)")
        .style("text-anchor", "start");

    d3.select(".chart").append("text")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width / 2) + " ," +
            (margin.top + chart_dimensions.height + 50) + ")")
        .style("text-anchor", "middle")
        .text("Days of Week");
}

function createOffensesByHourCountBars() {
var div = d3.select("body").append("div");

	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("h4").text("Crimes over Hours").style("text-anchor", "start");
	d3.select("#chart-div").insert("div").classed("parascenes",true).style('width','300px').style('height','180px');
	d3.select(".parascenes").insert("p").text("The graph shows crimes reported over 3 years and their frequency over hours of a day.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("Crime rates are low between 1-7 in the morning, and gradually rise throughout the day, peaking around 6 PM.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("Click on next slide for exploring data by your self.");
	
    d3.select(".chart")
		.selectAll(".bar-offenseCount")
        .data(d3.values(offensesByHour))
        .enter()
        .append("g")
        .classed("bar-offenseCount",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + (8 + x_hours(d.hour)-x_hours.bandwidth()/2)) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("rect-offenseCount",true)
        .attr("x", x_hours.bandwidth()/2)
        .attr("y", chart_dimensions.height)
		.attr("width", x_hours.bandwidth()/2 - 1)
        .attr("height",0);
}

function showOffensesByHourCountBars() {

    d3.selectAll(".rect-offenseCount")
        .transition()
        .duration(1000)
        .attr("height", function (d) {
            return y_offensesByHourCount(d.offenseCount);
        })
        .attr("y", function (d) {
            return (chart_dimensions.height - y_offensesByHourCount(d.offenseCount));
        });
		
	d3.select(".chart")
		.append("line")
		.classed("scene-4-line",true)
		.attr("x1",204)
		.attr("y1",460)
		.attr("x2",204)
		.attr("y2",680)
		.attr("stroke-width",0.75)
		.attr("stroke","gray");
		
	d3.select(".chart")
		.append("rect")
		.classed("scene-4-rect",true)
		.attr("x",130)
		.attr("y",460)
		.attr("y",460)
		.attr("width",158)
		.attr("height",60)
		.attr("fill","lightgray")
		.transition().duration(1000);
	
	d3.select(".chart")
		.append("text")
		.classed("scene-4-text",true)
		.attr("x",265)
		.attr("y",475)
		.style("font-size","11px")
		.attr("dy",".35em")
		.text("The frequency of crimes")
		.attr("fill","black");
		
	d3.select(".chart")
		.append("text")
		.classed("scene-4-text-1",true)
		.attr("x",260)
		.attr("y",490)
		.attr("dy",".35em")
		.style("font-size","11px")
		.text("are comparatively low")
		.attr("fill","black");
	
	d3.select(".chart")
		.append("text")
		.classed("scene-4-text-2",true)
		.attr("x",260)
		.attr("y",505)
		.style("font-size","11px")
		.attr("dy",".35em")
		.text("in the morning hours")
		.attr("fill","black");	
		
	d3.select(".chart")
		.append("line")
		.classed("scene-4-line-2",true)
		.attr("x1",581)
		.attr("y1",130)
		.attr("x2",581)
		.attr("y2",240)
		.attr("stroke-width",0.75)
		.attr("stroke","gray");
		
	d3.select(".chart")
		.append("rect")
		.classed("scene-4-rect-2",true)
		.attr("x",580)
		.attr("y",95)
		.attr("width",140)
		.attr("height",40)
		.attr("fill","lightgray")
		.transition().duration(1000);
	
	d3.select(".chart")
		.append("text")
		.classed("scene-4-text-3",true)
		.attr("x",710)
		.attr("y",108)
		.style("font-size","11px")
		.attr("dy",".35em")
		.text("The Frequency of crimes")
		.attr("fill","black");
		
	d3.select(".chart")
		.append("text")
		.classed("scene-4-text-4",true)
		.attr("x",698)
		.attr("y",123)
		.attr("dy",".35em")
		.style("font-size","11px")
		.text("peaks around 6 PM")
		.attr("fill","black");
}

function createOffensesByHourCountAxis() {
    yAxis3.scale(y_offensesByHourCount_axis)
        .tickSize(10).ticks(20);

    d3.select(".chart").append("g")
        .attr("id", "yAxis")
        .classed("y-axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height + margin.bottom) + ")")
        .call(yAxis3);

    d3.select("svg").append("text")
        .attr("id", "yAxisLabel")
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height + margin.bottom + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Records");
}

function showOffensesByHourCountAxis() {
    d3.select("#yAxis")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis3)
        .selectAll("text")
        .attr("x", -50)
        .attr("y", 0)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "start");

    d3.select("#yAxisLabel")
        .transition()
        .duration(1000)
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)");
}

function showHoursAxis() {
    const xAxis = d3.axisBottom().scale(x_hours)
        .ticks(d3.keys(offensesByHour));

    d3.select(".chart").append("g")
        .attr("id", "xAxis")
        .classed("x axis",true)
        .attr("transform", "translate(" + (margin.left) + "," + (margin.top + chart_dimensions.height) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("x", -3)
        .attr("y", 13)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .attr("transform", "rotate(0)")
        .style("text-anchor", "start");

    d3.select(".chart").append("text")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width / 2) + " ," +
            (margin.top + chart_dimensions.height + 50) + ")")
        .style("text-anchor", "middle")
        .text("Hours");
}

function showMonthlyChartInfo(){
	var div = d3.select("body").append("div");

	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("h4").text("Crimes over Months").style("text-anchor", "start");
	d3.select("#chart-div").insert("div").classed("parascenes",true).style('width','300px').style('height','180px');
	d3.select(".parascenes").insert("p").text("The graph shows crimes reported over 3 years and their frequency over the months.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("The winter months of February-April having the lowest crime rates, and the summer/early fall months of June-October having the highest crime rates. There is also a spike in crime rates in the month of January.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("Click on next slide for frequency of crimes happening over days of a week.");
}

function CreateMonthlyDataBars() {
	
    d3.select(".chart")
		.selectAll(".bar-offenseCount")
        .data(d3.values(offensesByMonth))
        .enter()
        .append("g")
        .classed("bar-offenseCount",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + (16 + xScale(d.month)-xScale.bandwidth()/2)) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("bar",true)
        .attr("x", xScale.bandwidth()/2)
        .attr("y", chart_dimensions.height)
		.attr("width", xScale.bandwidth()/2 - 1)
        .attr("height",0);
}

function ShowMonthlyDataBars() {

    d3.selectAll(".bar")
        .transition()
        .duration(1000)
        .attr("height", function (d) {
            return yScale(d.offenseCount);
        })
        .attr("y", function (d) {
            return (chart_dimensions.height - yScale(d.offenseCount));
        });
		
	d3.select(".chart")
		.append("line")
		.classed("scene-2-line",true)
		.attr("x1",470)
		.attr("y1",120)
		.attr("x2",470)
		.attr("y2",210)
		.attr("stroke-width",0.75)
		.attr("stroke","gray");
		
	d3.select(".chart")
		.append("rect")
		.classed("scene-2-rect",true)
		.attr("x",469)
		.attr("y",90)
		.attr("width",140)
		.attr("height",50)
		.attr("fill","lightgray")
		.transition().duration(1000);
	
	d3.select(".chart")
		.append("text")
		.classed("scene-2-text",true)
		.attr("x",600)
		.attr("y",100)
		.style("font-size","11px")
		.attr("dy",".35em")
		.text("The frequency of crimes")
		.attr("fill","black");
		
	d3.select(".chart")
		.append("text")
		.classed("scene-2-text-2",true)
		.attr("x",602)
		.attr("y",115)
		.attr("dy",".35em")
		.style("font-size","11px")
		.text("are higher in summer and")
		.attr("fill","black");
		
	d3.select(".chart")
		.append("text")
		.classed("scene-2-text-3",true)
		.attr("x",560)
		.attr("y",130)
		.attr("dy",".35em")
		.style("font-size","11px")
		.text("early fall")
		.attr("fill","black");
}

function CreateYAxisByMonth() {
    //yAxis4.scale(yScale)
        //.tickSize(10).ticks(20);

    d3.select(".chart").append("g")
        .attr("id", "yAxis")
        .classed("y-axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height + margin.bottom) + ")")
        .call(d3.axisLeft(yScale));

    d3.select("svg").append("text")
        .attr("id", "yAxisLabel")
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height + margin.bottom + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Records");
}

function ShowYAxisByMonth() {
    d3.select("#yAxis")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("text")
        .attr("x", -50)
        .attr("y", 0)
        .attr("dx", 0)
        .attr("dy", "0.35em")
        .style("text-anchor", "start");

    d3.select("#yAxisLabel")
        .transition()
        .duration(1000)
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)");
}

function showMonthsXAxis() {
    //const xAxis = d3.axisBottom().scale(xScale)
        //.ticks(d3.keys(offensesByMonth));

    d3.select(".chart").append("g")
        .attr("id", "xAxis")
        .classed("x-axis",true)
        .attr("transform", "translate(" + (margin.left) + "," + (margin.top + chart_dimensions.height) + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("x", -20)
        .attr("y", 15)
        .attr("dx", 5)
        .attr("dy", "0.45em");

    d3.select(".chart").append("text")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width / 2) + " ," +
            (margin.top + chart_dimensions.height + 50) + ")")
        .style("text-anchor", "middle")
        .text("Months");
}

function prepareAggData(){
	d3.select("#b0").classed("active",false);
	d3.select("#b1").classed("active",false);
	d3.select("#b2").classed("active",false);
	d3.select("#b3").classed("active",false);
	d3.select("#b4").classed("active",false);
	d3.select("#b5").classed("active",true);
	initializeChartArea();

d3.csv("../dataset/agg_crime.csv").then(d => chart(d))

function chart(csv) {
	var keys = csv.columns.slice(1);

	var offenses = [...new Set(csv.map(d => d.Offense_Code_Group))];
	
	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("h4").text("Explore Yourself").style("text-anchor", "start");
	d3.select(".heading").insert("div").classed("parascenes",true).style('width','300px').style('height','180px');
	d3.select(".parascenes").insert("p").text("Select type of a crime to see its frequency over the hours of a day."); 
	d3.select(".heading").insert("br");
	d3.select(".parascenes").insert("p").text("You can select Sorted data checkbox to sort the data in descending order of frequency.");
	
	d3.select(".parascenes").insert("div").classed("selection",true);
	d3.select(".selection").insert("br");
	d3.select(".selection").insert("h4").text("Select Offense:");
	d3.select(".selection").insert("select").classed("offense",true);
	d3.select(".selection").insert("br");
	d3.select(".selection").insert("br");
	d3.select(".selection").insert("input").classed("sort",true).attr("type","checkbox");
	d3.select(".selection").insert("label").text("Sorted data");

	var options = d3.select(".offense").selectAll("option")
		.data(offenses)
		.enter().append("option")
		.text(d => d);

	var svg = d3.select(".chart"),
		margin = {top: 150, bottom: 70, right: 150, left: 70},
		width =  canvas.width - (margin.right + margin.left),
		height = canvas.height - (margin.top + margin.bottom);
		//width = +svg.attr("width") - margin.left - margin.right,
		//height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand()
		.range([0, chart_dimensions.width])
		//.range([margin.left, width - margin.right])
		.padding(0.1);

	var y = d3.scaleLinear()
		.rangeRound([chart_dimensions.height, 0]);
		//.rangeRound([height - margin.bottom, margin.top]);

	var xAxis = svg.append("g")
		.attr("transform", "translate(" + (margin.left) + "," + (margin.top + chart_dimensions.height) + ")")
		//.attr("transform", `translate(0,${height - margin.bottom})`)
		.attr("class", "x-axis");
		
	d3.select(".chart").append("text")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width / 2) + " ," +
            (margin.top + chart_dimensions.height + 50) + ")")
        .style("text-anchor", "middle")
        .text("Hours");

	var yAxis = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		//.attr("transform", `translate(${margin.left},0)`)
		.attr("class", "y-axis");
		
	d3.select(".chart").append("text")
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height + margin.bottom + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Records");

	var z = d3.scaleOrdinal()
		.range(["steelblue"])
		.domain(keys);

	update(d3.select(".offense").property("value"), 0)

	function update(input, speed) {

		var data = csv.filter(f => f.Offense_Code_Group == input)

		data.forEach(function(d) {
			d.total = d3.sum(keys, k => +d[k])
			return d
		});
		
		y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]);

		svg.selectAll(".y-axis").transition().duration(1000)
			//.call(d3.axisLeft(y).ticks(null, "s"))
			.call(d3.axisLeft(y).tickSize(10).ticks(20))
			.selectAll("text")
			.attr("x", -40)
			.attr("y", 0)
			.attr("dx", 0)
			.attr("dy", "0.35em")
			.style("text-anchor", "start");
			
		data.sort(d3.select(".sort").property("checked")
			? (a, b) => b.total - a.total
			: (a, b) => offenses.indexOf(a.Offense_Code_Group) - offenses.indexOf(b.Offense_Code_Group));
		
		x.domain(data.map(d => d.Hour));

		svg.selectAll(".x-axis").transition().duration(1000)
			.call(d3.axisBottom(x).tickSizeOuter(0))
			.selectAll("text")
			.attr("x", -3)
			.attr("y", 13)
			.attr("dx", 0)
			.attr("dy", "0.35em")
			.style("text-anchor", "start");

		var group = svg.selectAll("g.layer")
			.data(d3.stack().keys(keys)(data), d => d.key)
			
		//console.log(group);

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => z(d.key));

		var bars = svg.selectAll("g.layer").selectAll("rect")
			.data(d => d, e => e.data.Hour);

		bars.exit().remove();
		
		bars.enter()
			.append("rect")
			.classed("rect-offenseCount",true)
			//.transition().duration(speed)
			.attr("transform", "translate(" + (6+margin.left) + "," + (margin.top) + ")")
			.attr("width", x.bandwidth()/2 - 1)
			.merge(bars)
			.transition().duration(speed)		
			.attr("x", d => x(d.data.Hour))
			.attr("y", d => y(d[1]))
			.attr("height", d => y(d[0]) - y(d[1]));
	}

	var select = d3.select(".offense")
		.on("change", function() {
			update(this.value, 1000)
		});
	
	var checkbox = d3.select(".sort")
		.on("click", function() {
			update(select.property("value"), 1000)
		});
}
}

function loadChart1() {
	initializeChartArea();
	d3.select("#b1").classed("active",true);
	d3.select("#b2").classed("active",false);
	d3.select("#b3").classed("active",false);
	d3.select("#b4").classed("active",false);
	d3.select("#b5").classed("active",false);
	d3.select(".selection").selectAll("*").remove();

	var svg = d3.select(".chart");

	var xScale = d3.scaleBand().range([0, chart_dimensions.width]),
		ySCale = d.scaleLinear().range([chart_dimensions.height, 0]);

	var g = svg.append("g")
				.attr("transform", "translate(" + 85 + "," + 85 + ")");
	
	const referenceData = d3.values(offenseGroups);
	xScale.domain(d3.keys(offenseGroups));
	ySCale.domain([0, d3.max(referenceData, function(d) { return d.value})]);

	//y_offenseCount_axis.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
		//.range([chart_dimensions.height, 0]);
	g.append("g")
		.attr("transform", "translate(0," + chart_dimensions.height + ")")
		.call(d3.axisBottom(xScale));
	
	g.append("g")
		.call(d3.axisLeft(yScale)
		.tickFormat(function(d){
			return "$" + d;
		})
		.ticks(10)
		.append("text")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("text-anchor", "end")
		.text("value"));

	    d3.select(".chart").append("text")
        .attr("transform",
            "translate(" + (margin.left + chart_dimensions.width / 2) + " ," +
            (margin.top + chart_dimensions.height + 50) + ")")
        .style("text-anchor", "middle")
        .text("Months");
}

function loadMonthlyData() {
	initializeChartArea();
	showMonthlyChartInfo();
    calculateScalesByMonth();

	showMonthsXAxis();
	CreateYAxisByMonth();
	ShowYAxisByMonth();
    CreateMonthlyDataBars();
	ShowMonthlyDataBars();
}

function loadScene3() {
	initializeChartArea();
    calculateScales3();

    createOffensesByDayCountBars();
	showOffensesByDayCountBars();
	createOffensesByDayCountAxis();
	showOffensesByDayCountAxis();
	showDaysAxis();
}

function loadScene4() {
	initializeChartArea();
    calculateScales4();

    createOffensesByHourCountBars();
	showOffensesByHourCountBars();
	createOffensesByHourCountAxis();
	showOffensesByHourCountAxis();
	showHoursAxis();
}

function loadScene5() {
	initializeChartArea();
	prepareAggData();
}	