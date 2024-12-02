fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(response => response.json())
  .then(data => drawChart(data.data));

function drawChart(data) {
  // Dimensions and margins
  const width = 800;
  const height = 400;
  const margin = { top: 50, right: 20, bottom: 50, left: 60 };

  // Create SVG container
  const svg = d3.select("svg")
                .attr("width", width)
                .attr("height", height);

  // Parse dates
  const parseDate = d3.timeParse("%Y-%m-%d");

  // Scales
  const xScale = d3.scaleTime()
                   .domain([new Date(data[0][0]), new Date(data[data.length - 1][0])]) // First and last dates
                   .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, d => d[1])])
                   .range([height - margin.bottom, margin.top]);

  // Axes
  const xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.timeFormat("%Y")); // Display years only

  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
     .attr("id", "x-axis")
     .attr("transform", `translate(0, ${height - margin.bottom})`)
     .call(xAxis);

  svg.append("g")
     .attr("id", "y-axis")
     .attr("transform", `translate(${margin.left}, 0)`)
     .call(yAxis);

  // Bars
  svg.selectAll(".bar")
     .data(data)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("x", d => xScale(new Date(d[0]))) // Scale the date
     .attr("y", d => yScale(d[1]))
     .attr("width", (width - margin.left - margin.right) / data.length) // Fixed bar width
     .attr("height", d => height - margin.bottom - yScale(d[1]))
     .attr("data-date", d => d[0])
     .attr("data-gdp", d => d[1])
     .on("mouseover", (event, d) => {
       d3.select("#tooltip")
         .style("opacity", 1)
         .attr("data-date", d[0])
         .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
         .style("left", `${event.pageX + 10}px`)
         .style("top", `${event.pageY - 30}px`);
     })
     .on("mouseout", () => {
       d3.select("#tooltip").style("opacity", 0);
     });
}
