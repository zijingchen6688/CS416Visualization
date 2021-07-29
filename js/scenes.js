var dataSet;
var svg;

const canvas = {width: 900, height: 900};
const margin = {top: 150, bottom: 70, right: 150, left: 70};
const chart_dimensions = {
    width: canvas.width - (margin.right + margin.left),
    height: canvas.height - (margin.top + margin.bottom)
};


const offensesByDay = {};
const offensesByHour = {};
const offensesByMonth = {};
const offensesByDistrict = {};


const x_district = d3.scaleBand();
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

const x_months = d3.scaleBand();
const y_offensesByMonthCount = d3.scaleLinear();
const y_offensesByMonthCount_axis = d3.scaleLinear();
const yAxis4 = d3.axisLeft();

function initializeVisualization() {
	loadScene0();
	d3.select("#b0").classed("active",true);
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
			district: d.DISTRICT
        };
		
		if (!offensesByDistrict[dataobj.district])
			offensesByDistrict[dataobj.district] = { district: dataobj.district, offenseCount: 0};

		offensesByDistrict[dataobj.district].offenseCount++;
		
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
	d3.select("#b0").classed("active",false);
	d3.select("#b1").classed("active",true);
	d3.select("#b2").classed("active",false);
	d3.select("#b3").classed("active",false);
	d3.select("#b4").classed("active",false);
	d3.select("#b5").classed("active",false);
	d3.select(".selection").selectAll("*").remove();
	const referenceData = d3.values(offensesByDistrict);
	x_district.range([0, chart_dimensions.width])
        .domain(d3.keys(offensesByDistrict));
    y_offenseCount.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
        .range([0, chart_dimensions.height]);
	y_offenseCount_axis.domain([0, d3.max(referenceData, function(d) { return d.offenseCount; })])
        .range([chart_dimensions.height, 0]);
}

function calculateScales2(){
	d3.select("#b0").classed("active",false);
	d3.select("#b1").classed("active",false);
	d3.select("#b2").classed("active",true);
	d3.select("#b3").classed("active",false);
	d3.select("#b4").classed("active",false);
	d3.select("#b5").classed("active",false);
	d3.select(".selection").selectAll("*").remove();
	const referenceData4 = d3.values(offensesByMonth);
	x_months.range([0, chart_dimensions.width])
        .domain(d3.keys(offensesByMonth));
    y_offensesByMonthCount.domain([0, d3.max(referenceData4, function(d) { return d.offenseCount; })])
        .range([0, chart_dimensions.height]);
	y_offensesByMonthCount_axis.domain([0, d3.max(referenceData4, function(d) { return d.offenseCount; })])
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

// District functions
function createDistrictCountBars() {
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
        .data(d3.values(offensesByDistrict))
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

function showDistrictCountBars() {

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

function createDistrictCountAxis() {
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

function showDistrictCountAxis() {
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
    const xAxis = d3.axisBottom().scale(x_district)
        .ticks(d3.keys(offensesByDistrict));

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
function createOffensesByMonthCountBars() {
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
        .data(d3.values(offensesByMonth))
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

function showOffensesByMonthCountBars() {

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

function createOffensesByMonthCountAxis() {
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

function showOffensesByMonthCountAxis() {
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

function showMonthsAxis() {
    const xAxis = d3.axisBottom().scale(x_months)
        .ticks(d3.keys(offensesByMonth));

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

function loadScene0() {
	initializeChartArea();
	d3.select("#b0").classed("active",true);
	d3.select("#b1").classed("active",false);
	d3.select("#b2").classed("active",false);
	d3.select("#b3").classed("active",false);
	d3.select("#b4").classed("active",false);
	d3.select("#b5").classed("active",false);
	//d3.selectAll("#selection").style("visibility","hidden");
	d3.select("#chart-div").insert("div").classed("heading",true);
	d3.select(".heading").insert("h2").text("Summary").style("text-anchor", "start");
	d3.select("#chart-div").insert("div").classed("para",true);
	d3.select(".para").insert("p").text("The time range of this crime data is from Records begin in June 14, 2015 and continue to September 3, 2018.");
	d3.select(".para").insert("p").text("Crime incident reports are provided by Boston Police Department (BPD) to document the initial details surrounding an incident to which BPD officers respond. This is a dataset containing records from the new crime incident report system, which includes a reduced set of fields focused on capturing the type of incident as well as when and where it occurred.");
	d3.select(".para").insert("p").text("In this crime analysis, you will learn the following:");
	d3.select(".para").insert("p").text("1. Where does most of the crimes most likely to occur?");
	d3.select(".para").insert("p").text("2. When does crimes usually happen?");
	d3.select(".para").insert("p").text("3. What types of offenses happens the most?");
}

function loadScene1() {
	initializeChartArea();
    calculateScales1();

    createDistrictCountBars();
	showDistrictCountBars();
	createDistrictCountAxis();
	showDistrictCountAxis();
	showOffenseAxis();
}

function loadScene2() {
	initializeChartArea();
    calculateScales2();

    createOffensesByMonthCountBars();
	showOffensesByMonthCountBars();
	createOffensesByMonthCountAxis();
	showOffensesByMonthCountAxis();
	showMonthsAxis();
}

// function loadScene3() {
// 	initializeChartArea();
//     calculateScales3();

//     createOffensesByDayCountBars();
// 	showOffensesByDayCountBars();
// 	createOffensesByDayCountAxis();
// 	showOffensesByDayCountAxis();
// 	showDaysAxis();
// }

// function loadScene4() {
// 	initializeChartArea();
//     calculateScales4();

//     createOffensesByHourCountBars();
// 	showOffensesByHourCountBars();
// 	createOffensesByHourCountAxis();
// 	showOffensesByHourCountAxis();
// 	showHoursAxis();
// }

function loadScene5() {
	initializeChartArea();
	prepareAggData();
}	