var totalSvg = dimple.newSvg(".totalpop", 690, 400);  //width, height
var percentageSvg = dimple.newSvg(".totalPercentage", 690, 400);
var over150Svg = dimple.newSvg(".over150Percentage", 690, 400);
var over200Svg = dimple.newSvg(".over200Percentage", 690, 400);

function loadCountyGraphs(countyName){
  console.log("calling /county with", countyName)

  d3.json("/county/"+ countyName, function (data) {
    console.log("data",data);

    // the total population chart------------------------------------------------------------------------------------------------
    // Create the chart
    var totalChart = new dimple.chart(totalSvg, data);
    totalChart.setBounds(60, 30, 510, 330)   // x, y, width, height - does not include legend (x + width = end of chart; start the legend after this)

    // Create a standard bubble of total race population by year
    // We are coloring by race as that will be the key in the legend
    x = totalChart.addTimeAxis("x", "Year", "%Y", "%Y");
    y = totalChart.addMeasureAxis("y", "TotalPopulation");
    totalChart.addSeries(["Year","TotalPopulation", "Race"], dimple.plot.bubble); //i swear i read that the last in the series is what shows in the legend, but i can't find that!
    var myLegend = totalChart.addLegend(570, 75, 100, 400, "Right");  // x, y, width, height, horizontal align
    totalChart.draw();

    // This is a critical step.  By doing this we orphan the legend. This
    // means it will not respond to graph updates.  Without this the legend
    // will redraw when the chart refreshes removing the unchecked item and
    // also dropping the events we define below.
    totalChart.legends = [];

    // This block simply adds the legend title. I put it into a d3 data
    // object to split it onto 2 lines.  This technique works with any
    // number of lines, it isn't dimple specific.
    totalSvg.selectAll("title_text")
      .data(["Click legend to","show/hide races:"])
      .enter()
      .append("text")
        .attr("x", 585)
        .attr("y", function (d, i) { return 40 + i * 14; })
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("color", "Black")
        .text(function (d) { return d; });

    //add a title
    totalSvg.append("text")
    .attr("x", 345)             
    .attr("y", 20)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Population by Year");

    // Get a unique list of race values to use when filtering
    var filterValues = dimple.getUniqueValues(data, "Race");
    // Get all the rectangles from our now orphaned legend
    myLegend.shapes.selectAll("rect")
      // Add a click event to each rectangle
      .on("click", function (e) {
        // This indicates whether the item is already visible or not
        var hide = false;
        var newFilters = [];
        // If the filters contain the clicked shape hide it
        filterValues.forEach(function (f) {
          if (f === e.aggField.slice(-1)[0]) {
            hide = true;
          } else {
            newFilters.push(f);
          }
        });
        // Hide the shape or show it
        if (hide) {
          d3.select(this).style("opacity", 0.2);
        } else {
          newFilters.push(e.aggField.slice(-1)[0]);
          d3.select(this).style("opacity", 0.8);
        }
        // Update the filters
        filterValues = newFilters;
        // Filter the data
        totalChart.data = dimple.filterData(data, "Race", filterValues);
        // Passing a duration parameter makes the chart animate. Without
        // it there is no transition
        totalChart.draw(800);
      });

    // the percentage of total population chart------------------------------------------------------------------------------------------------
    var perentageChart = new dimple.chart(percentageSvg, data);
    // perentageChart.setBounds(50, 30, 390, 330)
    perentageChart.setBounds(60, 30, 510, 330)
    x = perentageChart.addTimeAxis("x", "Year", "%Y", "%Y");
    y = perentageChart.addMeasureAxis("y", "TotalPercentage");
    perentageChart.addSeries(["Year","TotalPercentage", "Race"], dimple.plot.bubble);
    // var myLegend = perentageChart.addLegend(450, 75, 100, 400, "Right");
    var myLegend = perentageChart.addLegend(570, 75, 100, 400, "Right");
    perentageChart.draw();
    perentageChart.legends = [];

    percentageSvg.selectAll("title_text")
      .data(["Click legend to","show/hide races:"])
      .enter()
      .append("text")
        // .attr("x", 460)
        .attr("x", 585)
        .attr("y", function (d, i) { return 40 + i * 14; })
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("color", "Black")
        .text(function (d) { return d; });

        //add a title
    percentageSvg.append("text")
    .attr("x", 345)             
    .attr("y", 20)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Percentage of Population by Year");

    var filterValues = dimple.getUniqueValues(data, "Race");

    myLegend.shapes.selectAll("rect")
      // Add a click event to each rectangle
      .on("click", function (e) {
        // This indicates whether the item is already visible or not
        var hide = false;
        var newFilters = [];
        // If the filters contain the clicked shape hide it
        filterValues.forEach(function (f) {
          if (f === e.aggField.slice(-1)[0]) {
            hide = true;
          } else {
            newFilters.push(f);
          }
        });
        // Hide the shape or show it
        if (hide) {
          d3.select(this).style("opacity", 0.2);
        } else {
          newFilters.push(e.aggField.slice(-1)[0]);
          d3.select(this).style("opacity", 0.8);
        }
        // Update the filters
        filterValues = newFilters;
        // Filter the data
        perentageChart.data = dimple.filterData(data, "Race", filterValues);
        // Passing a duration parameter makes the chart animate. Without it there is no transition
        perentageChart.draw(800);
      });



    // the over 150 percentage chart------------------------------------------------------------------------------------------------
    var over150Chart = new dimple.chart(over150Svg, data);
    over150Chart.setBounds(60, 30, 510, 330)
    x = over150Chart.addTimeAxis("x", "Year", "%Y", "%Y");
    y = over150Chart.addMeasureAxis("y", "Over150Percentage");
    over150Chart.addSeries(["Year","Over150Percentage", "Race"], dimple.plot.bubble);
    var myLegend = over150Chart.addLegend(570, 75, 100, 400, "Right");
    over150Chart.draw();
    over150Chart.legends = [];
  
    over150Svg.selectAll("title_text")
      .data(["Click legend to","show/hide races:"])
      .enter()
      .append("text")
        .attr("x", 585)
        .attr("y", function (d, i) { return 40 + i * 14; })
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("color", "Black")
        .text(function (d) { return d; });

        //add a title
    over150Svg.append("text")
      .attr("x", 345)             
      .attr("y", 20)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("Percentage of Population w Household Income Between $150K and $199K");
  
    var filterValues = dimple.getUniqueValues(data, "Race");

    myLegend.shapes.selectAll("rect")
      // Add a click event to each rectangle
      .on("click", function (e) {
        // This indicates whether the item is already visible or not
        var hide = false;
        var newFilters = [];
        // If the filters contain the clicked shape hide it
        filterValues.forEach(function (f) {
          if (f === e.aggField.slice(-1)[0]) {
            hide = true;
          } else {
            newFilters.push(f);
          }
        });
        // Hide the shape or show it
        if (hide) {
          d3.select(this).style("opacity", 0.2);
        } else {
          newFilters.push(e.aggField.slice(-1)[0]);
          d3.select(this).style("opacity", 0.8);
        }
        // Update the filters
        filterValues = newFilters;
        // Filter the data
        over150Chart.data = dimple.filterData(data, "Race", filterValues);
        // Passing a duration parameter makes the chart animate. Without it there is no transition
        over150Chart.draw(800);
      });

      // the over 200 percentage chart------------------------------------------------------------------------------------------------
    // Create the chart
    var over200Chart = new dimple.chart(over200Svg, data);
    over200Chart.setBounds(60, 30, 510, 330)
  
    // Create a standard bubble of studentCount by year
    // We are coloring by county as that will be the key in the legend
    x = over200Chart.addTimeAxis("x", "Year", "%Y", "%Y");
    y = over200Chart.addMeasureAxis("y", "Over200Percentage");
    over200Chart.addSeries(["Year","Over200Percentage", "Race"], dimple.plot.bubble);
    // myChart.addSeries("TotalPopulation", dimple.plot.bubble);
    var myLegend = over200Chart.addLegend(570, 75, 100, 400, "Right");
    over200Chart.draw();
    over200Chart.legends = [];
  
    over200Svg.selectAll("title_text")
      .data(["Click legend to","show/hide races:"])
      .enter()
      .append("text")
        .attr("x", 585)
        .attr("y", function (d, i) { return 40 + i * 14; })
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("color", "Black")
        .text(function (d) { return d; });

    //add a title
    over200Svg.append("text")
      .attr("x", 345)             
      .attr("y", 20)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("Percentage of Population w Household Income Over $200K");
  
    // Get a unique list of Race values to use when filtering
    var filterValues = dimple.getUniqueValues(data, "Race");
    // Get all the rectangles from our now orphaned legend
    myLegend.shapes.selectAll("rect")
      // Add a click event to each rectangle
      .on("click", function (e) {
        // This indicates whether the item is already visible or not
        var hide = false;
        var newFilters = [];
        // If the filters contain the clicked shape hide it
        filterValues.forEach(function (f) {
          if (f === e.aggField.slice(-1)[0]) {
            hide = true;
          } else {
            newFilters.push(f);
          }
        });
        // Hide the shape or show it
        if (hide) {
          d3.select(this).style("opacity", 0.2);
        } else {
          newFilters.push(e.aggField.slice(-1)[0]);
          d3.select(this).style("opacity", 0.8);
        }
        // Update the filters
        filterValues = newFilters;
        // Filter the data
        over200Chart.data = dimple.filterData(data, "Race", filterValues);
        // Passing a duration parameter makes the chart animate. Without
        // it there is no transition
        over200Chart.draw(800);
      });

  });
}

//this will be selected from dropdown
var county = "Los Angeles County, California"
// var countyName = "New York County, New York"
loadCountyGraphs(county)

function changeCounty(county) {
  console.log("changed county to: ",county)
  // clear the old charts
  totalSvg.selectAll('*').remove();
  percentageSvg.selectAll('*').remove();
  over150Svg.selectAll('*').remove();
  over200Svg.selectAll('*').remove();
  loadCountyGraphs(county)
}


// new data set!
// the origins chart-----------------------------------------------------------------------------------------------
var originSvg = dimple.newSvg(".originChart", 690, 400);
d3.json("/origin", function (data) {

  var myChart = new dimple.chart(originSvg, data);
  console.log(data)
  myChart.setBounds(60, 30, 510, 330)

  x = myChart.addTimeAxis("x", "year", "%Y", "%Y");
  y = myChart.addMeasureAxis("y", "studentcount");
  myChart.addSeries(["year","Origin"], dimple.plot.bubble);
  // var myLegend = myChart.addLegend(630, 45, 75, 300, "Right");
  var myLegend = myChart.addLegend(570, 75, 100, 400, "Right");  // x, y, width, height, horizontal align
  myChart.draw();

  myChart.legends = [];

  originSvg.selectAll("title_text")
    .data(["Click legend to","show/hide origins:"])
    .enter()
    .append("text")
      .attr("x", 585)
      .attr("y", function (d, i) { return 40 + i * 14; })
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("color", "Black")
      .text(function (d) { return d; });

  //add a title
  originSvg.append("text")
    .attr("x", 345)             
    .attr("y", 20)
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Growth of International Students ");


  var filterValues = dimple.getUniqueValues(data, "Origin");
  // Get all the rectangles from our now orphaned legend
  myLegend.shapes.selectAll("rect")
    // Add a click event to each rectangle
    .on("click", function (e) {
      // This indicates whether the item is already visible or not
      var hide = false;
      var newFilters = [];
      // If the filters contain the clicked shape hide it
      filterValues.forEach(function (f) {
        if (f === e.aggField.slice(-1)[0]) {
          hide = true;
        } else {
          newFilters.push(f);
        }
      });
      // Hide the shape or show it
      if (hide) {
        d3.select(this).style("opacity", 0.2);
      } else {
        newFilters.push(e.aggField.slice(-1)[0]);
        d3.select(this).style("opacity", 0.8);
      }
      // Update the filters
      filterValues = newFilters;
      // Filter the data
      myChart.data = dimple.filterData(data, "Origin", filterValues);
      // Passing a duration parameter makes the chart animate. Without
      // it there is no transition
      myChart.draw(800);
    });
});

// the university chart------------------------------------------------------------------------------------------------
var univSvg = dimple.newSvg(".universityCounty", 690, 400);
d3.json("/univCounty", function (data) {
  // console.log("data",data.universities[0]);

  // var myChart = new dimple.chart(univSvg, data.universities);
  var myChart = new dimple.chart(univSvg, data);
  myChart.setBounds(60, 30, 510, 330)

  // x = myChart.addTimeAxis("x", "year", "%Y", "%Y");
  // y = myChart.addMeasureAxis("y", "students");
  x = myChart.addTimeAxis("x", "Year", "%Y", "%Y");
  y = myChart.addMeasureAxis("y", "Students");
  // myChart.addSeries(["year","university", "county"], dimple.plot.bubble);
  myChart.addSeries(["Year","PlaceofDestination", "County"], dimple.plot.bubble);
  var myLegend = myChart.addLegend(620, 45, 155, 400, "Right");
  myChart.draw();

  myChart.legends = [];

  univSvg.selectAll("title_text")
    .data(["Click legend to","show/hide counties:"])
    .enter()
    .append("text")
      .attr("x", 585)
      .attr("y", function (d, i) { return 40 + i * 14; })
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("color", "Black")
      .text(function (d) { return d; });

    //add a title
    univSvg.append("text")
      .attr("x", 345)             
      .attr("y", 20)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("US University Destinations by County");

  // var filterValues = dimple.getUniqueValues(data.universities, "county");
  var filterValues = dimple.getUniqueValues(data, "County");
  // Get all the rectangles from our now orphaned legend
  myLegend.shapes.selectAll("rect")
    // Add a click event to each rectangle
    .on("click", function (e) {
      // This indicates whether the item is already visible or not
      var hide = false;
      var newFilters = [];
      // If the filters contain the clicked shape hide it
      filterValues.forEach(function (f) {
        if (f === e.aggField.slice(-1)[0]) {
          hide = true;
        } else {
          newFilters.push(f);
        }
      });
      // Hide the shape or show it
      if (hide) {
        d3.select(this).style("opacity", 0.2);
      } else {
        newFilters.push(e.aggField.slice(-1)[0]);
        d3.select(this).style("opacity", 0.8);
      }
      // Update the filters
      filterValues = newFilters;
      // Filter the data
      myChart.data = dimple.filterData(data.universities, "county", filterValues);
      // Passing a duration parameter makes the chart animate. Without
      // it there is no transition
      myChart.draw(800);
    });
});

// the university ranking chart------------------------------------------------------------------------------------------------
var univRankSvg = dimple.newSvg(".universityRanking", 690, 400);
d3.json("/univRanking", function (data) {
  // console.log("data",data.rankings[0]);

  // var univRankChart = new dimple.chart(univRankSvg, data.rankings);
  var univRankChart = new dimple.chart(univRankSvg, data);
  univRankChart.setBounds(60, 30, 510, 330)

  x = univRankChart.addTimeAxis("x", "year", "%Y", "%Y");
  y = univRankChart.addMeasureAxis("y", "world_rank");
  univRankChart.addSeries(["year","university_name"], dimple.plot.bubble);
  var myLegend = univRankChart.addLegend(620, 45, 155, 400, "Right");
  univRankChart.draw();

  univRankChart.legends = [];

  univRankSvg.selectAll("title_text")
    .data(["Click legend to","show/hide universities:"])
    .enter()
    .append("text")
      .attr("x", 585)
      .attr("y", function (d, i) { return 40 + i * 14; })
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("color", "Black")
      .text(function (d) { return d; });

    //add a title
    univRankSvg.append("text")
      .attr("x", 275)             
      .attr("y", 20)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("University Ranking");

  // var filterValues = dimple.getUniqueValues(data.rankings, "university");
  var filterValues = dimple.getUniqueValues(data, "university_name");
  // Get all the rectangles from our now orphaned legend
  myLegend.shapes.selectAll("rect")
    // Add a click event to each rectangle
    .on("click", function (e) {
      // This indicates whether the item is already visible or not
      var hide = false;
      var newFilters = [];
      // If the filters contain the clicked shape hide it
      filterValues.forEach(function (f) {
        if (f === e.aggField.slice(-1)[0]) {
          hide = true;
        } else {
          newFilters.push(f);
        }
      });
      // Hide the shape or show it
      if (hide) {
        d3.select(this).style("opacity", 0.2);
      } else {
        newFilters.push(e.aggField.slice(-1)[0]);
        d3.select(this).style("opacity", 0.8);
      }
      // Update the filters
      filterValues = newFilters;
      // Filter the data
      univRankChart.data = dimple.filterData(data.rankings, "university_name", filterValues);
      // Passing a duration parameter makes the chart animate. Without
      // it there is no transition
      univRankChart.draw(800);
    });
});

// the k12 score chart------------------------------------------------------------------------------------------------
var k12Svg = dimple.newSvg(".K12Scores", 790, 400);
d3.json("/k12Scores", function (data) {
  console.log("data",data.k12Scores[0]);
  // console.log("data",data);

  var k12Chart = new dimple.chart(k12Svg, data.k12Scores);
  k12Chart.setBounds(60, 30, 510, 330)

  x = k12Chart.addTimeAxis("x", "year", "%Y", "%Y");
  y = k12Chart.addMeasureAxis("y", "value");
  k12Chart.addSeries(["year","country"], dimple.plot.bubble);
  var myLegend = k12Chart.addLegend(620, 45, 155, 400, "Right");
  k12Chart.draw();

  k12Chart.legends = [];

  k12Svg.selectAll("title_text")
    .data(["Click legend to","show/hide countries:"])
    .enter()
    .append("text")
      .attr("x", 585)
      .attr("y", function (d, i) { return 40 + i * 14; })
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("color", "Black")
      .text(function (d) { return d; });

    //add a title
    k12Svg.append("text")
      .attr("x", 275)             
      .attr("y", 20)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("K-12 PISA Scores");

  var filterValues = dimple.getUniqueValues(data.k12Scores, "country");
  // Get all the rectangles from our now orphaned legend
  myLegend.shapes.selectAll("rect")
    // Add a click event to each rectangle
    .on("click", function (e) {
      // This indicates whether the item is already visible or not
      var hide = false;
      var newFilters = [];
      // If the filters contain the clicked shape hide it
      filterValues.forEach(function (f) {
        if (f === e.aggField.slice(-1)[0]) {
          hide = true;
        } else {
          newFilters.push(f);
        }
      });
      // Hide the shape or show it
      if (hide) {
        d3.select(this).style("opacity", 0.2);
      } else {
        newFilters.push(e.aggField.slice(-1)[0]);
        d3.select(this).style("opacity", 0.8);
      }
      // Update the filters
      filterValues = newFilters;
      // Filter the data
      k12Chart.data = dimple.filterData(data.k12Scores, "country", filterValues);
      // Passing a duration parameter makes the chart animate. Without
      // it there is no transition
      k12Chart.draw(800);
    });
});

