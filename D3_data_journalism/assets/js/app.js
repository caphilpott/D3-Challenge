// @TODO: YOUR CODE HERE!
// Set chart measurements and margins
let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
let svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";


// function used for updating x-scale upon click on axis label 

function xScale(healthData, chosenXAxis) {
  // create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis])*.90,
      d3.max(healthData, d => d[chosenXAxis])*1.05

    ])
    .range([0, width]);

  return xLinearScale;
}

  // function used for updating y-scale upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.max(healthData, d => d[chosenYAxis])*1.05,
      d3.min(healthData, d => d[chosenYAxis])*.90

    ])
    .range([0, height]);

  return yLinearScale;
}

// function used for updating render xAxis upon click on axis label
function renderAxesX(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating render yAxis upon click on axis label 
function renderAxesY(newYScale, yAxis) {
  let leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles X 
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circle labels group with a transition to
// new circle labels X 
function renderCircleX(circleLabels, newXScale, chosenXAxis) {

  circleLabels.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

  return circleLabels;
}

// function used for updating circles group with a transition to
// new circles Y 
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with a transition to
// new circles X
function renderCircleY(circleLabels, newYScale, chosenYAxis) {

  circleLabels.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis]));

  return circleLabels;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var labelX, labelY;

  if (chosenXAxis === "poverty") {
      labelX = "Poverty";
  }
  
  else if (chosenXAxis === "age") {
    labelX = "Age";
  }  
  
  else {
    labelX = "Income";
  }

  if (chosenYAxis === "healthcare") {
    labelY = "Healthcare";
  }
  else if (chosenYAxis === "smokes") {
    labelY = "Smokes";
  }  

  else {
    labelY = "Obese";
  }


  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  // on mouse over event
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below

d3.csv("assets/data/data.csv").then(function(healthData, err) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(healthData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".5")
  
  // define circle labels to all state text to be place in each circle
  var circleLabels = chartGroup.selectAll(null).data(healthData).enter().append("text");

    circleLabels
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "9px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

  // Create group for three x-axis labels
  var labelsGroupX = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age Median");

  var incomeLabel = labelsGroupX.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

// Create group for three y-axis labels
var labelsGroupY = chartGroup.append("g")

var healthcareLabel = labelsGroupY.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 40 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("value", "healthcare") // value to grab for event listener
  .classed("active", true)
  .text("Lacks Healthcare (%)");

var smokesLabel = labelsGroupY.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 20 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smokes (%)");

var obesityLabel = labelsGroupY.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("value", "obesity") // value to grab for event listener
  .classed("inactive", true)
  .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis,circlesGroup);

  // x axis labels event listener
  labelsGroupX.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxesX(xLinearScale, xAxis);

        // updates circles groups and labels with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);
        circleLabels = renderCircleX(circleLabels, xLinearScale, chosenXAxis);    
        
        // updates circle groups and labelstooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        circleLabels = updateToolTip(chosenXAxis, chosenYAxis, circleLabels);    
        
        // changes classes to change bold text
        
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);

          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);

          povertyLabel
            .classed("active", false)
            .classed("inactive", true);

          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);

          povertyLabel
            .classed("active", false)
            .classed("inactive", true);

          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });


  // y axis labels event listener
  labelsGroupY.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderAxesY(yLinearScale, yAxis);

        // updates circle groups and labels with new y values
        circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
        circleLabels = renderCircleY(circleLabels, yLinearScale, chosenYAxis);    
        
        // updates circle groups and labels tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        circleLabels = updateToolTip(chosenXAxis, chosenYAxis, circleLabels);     
        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);

          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        
        else if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);

          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);

          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
})

// .catch(function(error) {
//   console.log(error);
// });

