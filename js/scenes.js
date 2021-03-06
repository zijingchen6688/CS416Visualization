
var svg;

const canvas = {width: 1000, height: 1000};
const margin = {top: 160, bottom: 60, right: 160, left: 80};
const chart_dimensions = {
    width: canvas.width - (margin.right + margin.left),
    height: canvas.height - (margin.top + margin.bottom)
};


const crimeNumberByDay = {};
const crimeNumberByMonth = {};
const crimeNumberByDistrict = {};


const x_district = d3.scaleBand();
const y_offenseCount = d3.scaleLinear();
const y_offenseCount_axis = d3.scaleLinear();
const yAxis = d3.axisLeft();


const x_months = d3.scaleBand();
const y_offensesByMonthCount = d3.scaleLinear();
const y_offensesByMonthCount_axis = d3.scaleLinear();
const yAxis4 = d3.axisLeft();

function initializeVisualization() {
	loadScene0();
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
			street: d.STREET,
			district: d.DISTRICT,
			shooting: d.SHOOTING
        };
		
		if (!crimeNumberByDistrict[dataobj.district])
			crimeNumberByDistrict[dataobj.district] = { district: dataobj.district, offenseCount: 0};

		crimeNumberByDistrict[dataobj.district].offenseCount++;
		

		if (!crimeNumberByDay[dataobj.day])
				crimeNumberByDay[dataobj.day] = { day: dataobj.day, index: dataobj.day_index, offenseCount: 0};

		crimeNumberByDay[dataobj.day].offenseCount++;
		

		if (!crimeNumberByMonth[dataobj.month])
				crimeNumberByMonth[dataobj.month] = { month: dataobj.month, index: dataobj.month_index, offenseCount: 0};

		crimeNumberByMonth[dataobj.month].offenseCount++;
	
        return dataobj;

    }).then(function(data) {
        dataloaded();
    });	
}

function dataloaded() {
    d3.select("#chart-id")
        .classed("invisible",false);
}

function cal1(){
	d3.select("#b1").classed("active",true);
	d3.select(".selection").selectAll("*").remove();
	const referenceData = d3.values(crimeNumberByDistrict);
	x_district.range([0, chart_dimensions.width])
        .domain(d3.keys(crimeNumberByDistrict));
    y_offenseCount.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
        .range([0, chart_dimensions.height]);
	y_offenseCount_axis.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
        .range([chart_dimensions.height, 0]);
}

function cal2(){
	d3.select("#b2").classed("active",true);
	d3.select(".selection").selectAll("*").remove();
	const referenceData4 = d3.values(crimeNumberByMonth);
	x_months.range([0, chart_dimensions.width])
        .domain(d3.keys(crimeNumberByMonth));
    y_offensesByMonthCount.domain([0, d3.max(referenceData4, function(d) { return d.offenseCount; })])
        .range([0, chart_dimensions.height]);
	y_offensesByMonthCount_axis.domain([0, d3.max(referenceData4, function(d) { return d.offenseCount; })])
        .range([chart_dimensions.height, 0]);
}


function chartarea() {
	d3.select(".heading").selectAll("*").remove();	
	d3.select(".para").selectAll("*").remove();
	d3.select(".parascenes").selectAll("*").remove();
	d3.select(".chart").selectAll("*").remove();
	d3.select(".selection").selectAll("*").remove();
    var chart = d3.select(".chart")
        .attr("width", canvas.width)
        .attr("height", canvas.height);
}

// District functions
function createDistrictBars() {
var div = d3.select("body").append("div");

	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("h4").text("Where does crimes happen most often?").style("text-anchor", "start");
	d3.select("#chart-div").insert("div").classed("parascenes",true).style('width','300px').style('height','180px');
	d3.select(".parascenes").insert("p").text("The graph shows the number of crimes happens in different districts");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("We can see that D4 district has the most number of crimes, followed by B2 and A1");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("Click on next button to se more:)");
	
    d3.select(".chart")
		.selectAll(".bar-offenseCount")
        .data(d3.values(crimeNumberByDistrict))
        .enter()
        .append("g")
        .classed("bar-offenseCount",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + (20 + x_district(d.district)-x_district.bandwidth()/2)) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("rect-offenseCount",true)
        .attr("x", x_district.bandwidth()/2)
        .attr("y", chart_dimensions.height)
		.attr("width", x_district.bandwidth()/2 - 1)
        .attr("height",0);
}

function displayDistrictBars() {

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
		.attr("width",280)
		.attr("height",40)
		.attr("fill","lightyellow")
		.transition().duration(1000);
	
	d3.select(".chart")
		.append("text")
		.classed("scene-1-text-3",true)
		.attr("x",770)
		.attr("y",392)
		.style("font-size","15px")
		.attr("dy",".35em")
		.text("A15 has lowest number of crimes")
		.attr("fill","black");
		
	d3.select(".chart")
		.append("text")
		.classed("scene-1-text-4",true)
		.attr("x",770)
		.attr("y",407)
		.attr("dy",".35em")
		.style("font-size","11px")
		.text("E5 district has low crimes as well")
		.attr("fill","black");
}

function DistrictCountAxis() {
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

function displayDistrictCountAxis() {
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

function displayOffenseAxis() {
    const xAxis = d3.axisBottom().scale(x_district)
        .ticks(d3.keys(crimeNumberByDistrict));

    d3.select(".chart").append("g")
        .attr("id", "xAxis")
        .classed("x axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height) + ")")
        .call(xAxis)
        .selectAll("text")
		.call(wrap, x_district.bandwidth())
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
        .text("District");
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


// 2. Month
function OffensesByMonthBars() {
var div = d3.select("body").append("div");

	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("br");
	d3.select(".heading").insert("h4").text("When does crimes usually happen?").style("text-anchor", "start");
	d3.select("#chart-div").insert("div").classed("parascenes",true).style('width','300px').style('height','180px');
	d3.select(".parascenes").insert("p").text("The bar chart shows the number of crimes happened over different months");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("We can see that crimes happen very frequently in Summer, more specifically, in June, July and August. By contrast, the number of crimes decreases dramatically in Winter.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("There is a steady increase in crimes from January to August, and then there is a steady decrease in crimes from August to November");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("We can also find out that in December, the number of crimes increase a little. The reason might be the Christmas.");
	d3.select(".parascenes").insert("br");
	d3.select(".parascenes").insert("p").text("Click on the next button to see more:)");
	
    d3.select(".chart")
		.selectAll(".bar-offenseCount")
        .data(d3.values(crimeNumberByMonth))
        .enter()
        .append("g")
        .classed("bar-offenseCount",true)
        .attr("transform",
            function (d) {
                return "translate(" + (margin.left + (16 + x_months(d.month)-x_months.bandwidth()/2)) + ", " + margin.top + ")";
            })
        .append("rect")
        .classed("rect-offenseCount",true)
        .attr("x", x_months.bandwidth()/2)
        .attr("y", chart_dimensions.height)
		.attr("width", x_months.bandwidth()/2 - 1)
        .attr("height",0);
}

function displayOffensesByMonthBars() {

    d3.selectAll(".rect-offenseCount")
        .transition()
        .duration(1000)
        .attr("height", function (d) {
            return y_offensesByMonthCount(d.offenseCount);
        })
        .attr("y", function (d) {
            return (chart_dimensions.height - y_offensesByMonthCount(d.offenseCount));
        });
		
	d3.select(".chart")
		.append("line")
		.classed("scene-2-line",true)
		.attr("x1",720)
		.attr("y1",200)
		.attr("x2",720)
		.attr("y2",350)
		.attr("stroke-width",0.75)
		.attr("stroke","gray");
		
	d3.select(".chart")
		.append("rect")
		.classed("scene-2-rect",true)
		.attr("x",695)
		.attr("y",200)
		.attr("width",160)
		.attr("height",50)
		.attr("fill","lightgreen")
		.transition().duration(1000);
	
	d3.select(".chart")
		.append("text")
		.classed("scene-2-text",true)
		.attr("x",850)
		.attr("y",210)
		.style("font-size","11px")
		.attr("dy",".35em")
		.text("Low crimes number in Winter")
		.attr("fill","black");
		
	d3.select(".chart")
		.append("text")
		.classed("scene-2-text-2",true)
		.attr("x",850)
		.attr("y",230)
		.attr("dy",".35em")
		.style("font-size","11px")
		.text("Especially in November")
		.attr("fill","black");
		
}

function buildOffensesByMonthAxis() {
    yAxis4.scale(y_offensesByMonthCount_axis)
        .tickSize(10).ticks(20);

    d3.select(".chart").append("g")
        .attr("id", "yAxis")
        .classed("y-axis",true)
        .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_dimensions.height + margin.bottom) + ")")
        .call(yAxis4);

    d3.select("svg").append("text")
        .attr("id", "yAxisLabel")
        .attr("transform",
            "translate(8," + (margin.top + chart_dimensions.height + margin.bottom + chart_dimensions.height / 2) + ")" +
            ", rotate(-90)")
        .style("text-anchor", "middle")
        .text("Number of Records");
}

function displayOffensesByMonthAxis() {
    d3.select("#yAxis")
        .transition()
        .duration(1000)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis4)
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

function displayMonthsAxis() {
    const xAxis = d3.axisBottom().scale(x_months)
        .ticks(d3.keys(crimeNumberByMonth));

    d3.select(".chart").append("g")
        .attr("id", "xAxis")
        .classed("x axis",true)
        .attr("transform", "translate(" + (margin.left) + "," + (margin.top + chart_dimensions.height) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("x", -15)
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
        .text("Months");
}


// Line Plot
function linechart(){
	d3.select("#b5").classed("active",true);
	chartarea();
    d3.select("#chart-div").insert("div").classed("heading",true);
    	d3.select(".heading").insert("br");
    	d3.select(".heading").insert("br");
    	d3.select(".heading").insert("h4").text("When the crimes happen?").style("text-anchor", "start");
    	d3.select(".heading").insert("div").classed("parascenes",true).style('width','300px').style('height','180px');
    	d3.select(".parascenes").insert("p").text("From the line plot, we can see that the number of crime reaches its peak in April 30,2017"); 
        d3.select(".parascenes").insert("p").text("Then follows a steady decrease to May."); 

        // set the dimensions and margins of the graph
    var margin = {top: 100, right: 20, bottom: 50, left: 45},
    width = 950 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");
    // var parseTime = d3.timeParse("%m/%d/%Y");
    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); })
    .curve(d3.curveMonotoneX);


    var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("../dataset/data.csv").then(function(data) {

    // format the data
    data.forEach(function(d) {
    d.date = parseTime(d.date),
    d.close = d.close
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d){return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    svg.append("path")
    .datum(data)
    .attr("class", "chartLine")
    .attr("d", valueline);

    // Add the x Axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
    .call(d3.axisLeft(y));

    });
}



// Functions to load when click button
function loadScene0() {
	chartarea();
	d3.select("#b0").classed("active",true);

	//d3.selectAll("#selection").style("visibility","hidden");
	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("h2").text("Summaries").style("text-anchor", "start");
	d3.select("#chart-div").insert("div").classed("para",true);
	d3.select(".para").insert("p").text("The time range of this crime data is from Records begin in June 14, 2015 and continue to September 3, 2018.");
	d3.select(".para").insert("p").text("This is a dataset containing records from the new crime incident report system, which includes a reduced set of fields focused on capturing the type of incident as well as when and where it occurred.");
	d3.select(".para").insert("p").text("In this crime analysis, you will learn the following:");
	d3.select(".para").insert("p").text("1. Where does most of the crimes most likely to occur?");
	d3.select(".para").insert("p").text("2. When does crimes usually happen?");
	d3.select(".para").insert("p").text("3. Which year has the most number of crimes?");
}

function loadScene1() {
	chartarea();
    cal1();

    createDistrictBars();
	displayDistrictBars();
	DistrictCountAxis();
	displayDistrictCountAxis();
	displayOffenseAxis();
}

function loadScene2() {
	chartarea();
    cal2();

    OffensesByMonthBars();
	displayOffensesByMonthBars();
	buildOffensesByMonthAxis();
	displayOffensesByMonthAxis();
	displayMonthsAxis();
}


function loadScene5() {
	chartarea();
	linechart();
}	