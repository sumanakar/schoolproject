$( function() {
    var valMap = [2000,2005,2008,2010,2013,2016];
    $( "#slider-range-min" ).slider({
	  range: "min",
	  orientation: "horizontal",
      value: 0,
	  min: 0,
	  step:1,
	  max: valMap.length-1,
	  animate: false,
      slide: function( event, ui ) {
		console.log(ui.value);
		//alert(valMap[ui.value]);
        $( "#year" ).text(valMap[ui.value]);
        GenerateGraph($( "#year" ).text());
      }
    });
    $( "#year" ).text( valMap[$( "#slider-range-min" ).slider( "value" )] );
    GenerateGraph($( "#year" ).text());
  } );
function GenerateGraph(year)
{

	var width = 960;
	var height = 500;
	// D3 Projection
	var projection = d3.geo.albersUsa()
					.translate([width/2, height/2])    // translate to center of screen
					.scale([1000]);          // scale things down so see entire US
			
	// Define path generator
	var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
				.projection(projection);  // tell path generator to use albersUsa projection

			
	// Define linear scale for output
	var color = d3.scale.linear()
				.range(["rgb(211,211,211)","#377eb8","red"]);
	//  d3.scale.linear()
				//   .range([""]);

	var legendText = ["Top States","StudentsCount","NoUniversity"];

	$("#chart").html('');
	//Create SVG element and append map to the SVG
	var svg = d3.select("#chart")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				
			    
	// Append Div for tooltip to SVG
	var div = d3.select("#chart")
				.append("div")   
				.attr("class", "tooltip svg-map-university")               
				.style("opacity", 0);
	
	// Append Div for tooltip to SVG
	var stateTooltipDiv = d3.select("#chart")
	.append("div")   
	.attr("class", "tooltip svg-map-state")               
	.style("opacity", 0)
				

	// Load in my states data!
	var sample_url="/state-universities/"+year;
	d3.json(sample_url, function(data) {
	color.domain([0,1,2]); // setting the range of the input 
	d3.json("/static/us-states.json", function(json) {

	// Loop through each state data value in the .csv file
	for (var i = 0; i < data.length; i++) {

		// Grab State Name
		var dataState = data[i].State;

		// Grab data value 
		var dataValue = data[i].Count;

		// Find the corresponding state inside the GeoJSON
		for (var j = 0; j < json.features.length; j++)  {
			var jsonState = json.features[j].properties.name;

			if (dataState == jsonState) {

			// Copy the data value into the JSON
			json.features[j].properties.Count = dataValue; 

			// Stop looking through the JSON
			break;
			}
		}
	}
	// Bind the data to the SVG and create one path per GeoJSON feature
	svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "1")
		.attr("opacity", function(d) {
			var value = d.properties.Count;
			if (value) {
				return parseFloat(value)/5;
			}
			else return 1;
		})
		.style("fill", function(d) {

		// Get data value
		var value = d.properties.Count;

		if (value) {
		//If value exists…
		return "rgb(213,22,17)"//color(parseInt(value/5)+1);
		} else {
		//If value is undefined…
		return "rgb(211,211,211)";
		}
	})
	.on("mouseover", function(d) {      
		stateTooltipDiv.transition()        
		.duration(100)      
		.style("opacity", .9);      
		stateTooltipDiv.text(d.properties.name+" ("+d.properties.Count+")")
		.style("left", (d3.event.pageX) + "px")     
		.style("top", (d3.event.pageY) + "px");    
	})


// function(d){tooltip.text(d); return tooltip.style("visibility", "visible");})
	// fade out tooltip on mouse out               
	.on("mouseout", function(d) {       
		stateTooltipDiv.transition()        
		.duration(500)      
		.style("opacity", 0);   
	});;

			
	// Map the studenst  in universities!
	var sample1_url="/university-students/"+year;
	d3.json(sample1_url, function(data) {

	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
		//	console.log(d);
			return projection([d.Lng, d.Lat])[0];
		})
		.attr("cy", function(d) {
			return projection([d.Lng, d.Lat])[1];
		})
		.attr("r", function(d) {
			var count =parseInt(d.StudentsCount.replace(/,/g, ''), 15);
			return count/2000;//Math.sqrt(count) *0.05;
		})
		.style("opacity", .6)
		.style("stroke", "#000")
		.style("fill","#377eb8")	
		
			
		.on("mouseover", function(d) {      
			div.transition()        
			.duration(100)      
			.style("opacity", .9);      
			div.text(d.Place+" ("+d.StudentsCount+")")
			.style("left", (d3.event.pageX) + "px")     
			.style("top", (d3.event.pageY) + "px");    
		})


	// function(d){tooltip.text(d); return tooltip.style("visibility", "visible");})
		// fade out tooltip on mouse out               
		.on("mouseout", function(d) {       
			div.transition()        
			.duration(500)      
			.style("opacity", 0);   
		});
	
	});     
	
	  //add a title
	  svg.append("text")
	  .attr("x", 445)             
	  .attr("y", 20)
	  .attr("text-anchor", "middle")  
	  .style("font-size", "16px") 
	  .style("text-decoration", "underline")  
	  .text("International Universities by State - Analysis");

	// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
	var legend = d3.select("#chart").append("svg")
					.attr("class", "legend")
					.attr("width", 140)
					.attr("height", 200)
					.selectAll("g")
					.data(color.domain().slice().reverse())
					// .style("fill", "red")   
					.enter()
					.append("g")
					.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
			.attr("width", 18)
			.attr("height", 18)
			.style("fill",color);

		legend.append("text")
			.data(legendText)
			.attr("x", 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.text(function(d) { return d; });
		});

	});
}