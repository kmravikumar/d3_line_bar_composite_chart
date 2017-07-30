var dataArray = [
                 ['category A',5,2000], ['category B',10,1000], ['Some text ...long C',19,300], ['D',40,50],
                 ['category Q',5,200], ['category R',10,100], ['Some text ...long S',19,3500], ['T',40,5000]                                                   
                ];

plot_bar_line_graph(dataArray, "#bar_line_chart", 600, 300, 'yLabel', 'yLabel2');


// A function to plot D3 line chart - Pass in the data array and the html objectId
// where the chart needs to be.
// Also pass the width, height for the plot
function plot_bar_line_graph (dataArray, htmlObjectId, width, height, yLabel, yLabel2) {

    // set margins for a nice looking bar chart
    var margin = {top: 30, right: 50, bottom: 50, left: 50},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    // Determine max data to set the axis limits
    var maxData = Math.max.apply(Math,dataArray.map(function(d){return d[1];}));
    var minData = Math.min.apply(Math,dataArray.map(function(d){return d[1];}));
    var maxData2 = Math.max.apply(Math,dataArray.map(function(d){return d[2];}));
    var minData2 = Math.min.apply(Math,dataArray.map(function(d){return d[2];}));
    

    // Define linear scale for y-axis
    // Note that the height range is reversed. 
    var heightScale = d3.scaleLinear()
                            .range([height, margin.top])
                            // change 0 to minData is required
                            .domain([0,maxData])
                            ;
    
    // height scale for bar graphs on right
    var heightScale2 = d3.scaleLinear()
                            .range([height, margin.top])
                            .domain([0,maxData2])
                            ;

    // define scale for categorical x-axis
    // NOTE: The range is from margin.left and not 0.
    var widthScale = d3.scaleBand()
                        .range([margin.left, width])
                        .padding(0.4)
                        .domain(dataArray.map(function(d) { return d[0]; }))
                        ;

    // define x,y-axes scale and align them bottom and left
    var yaxis = d3.axisLeft()
                .scale(heightScale)
                .tickSize(3)
                ;

    var yaxis2 = d3.axisRight()
                .scale(heightScale2)
                .tickSize(3)
                ;


    var xaxis = d3.axisBottom()
                .scale(widthScale)
                .tickSize(0)
                ;

    // Define the canvas which will hold the chart
    var canvas = d3.select(htmlObjectId)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    ;

     // Define the line and bind it to the data
    var line = d3.line()
        .x(function(d) {return widthScale(d[0]) + widthScale.bandwidth()/2; })
        .y(function(d) {return heightScale(d[1]); })
        .curve(d3.curveLinear)
        ;

    // add bars to the canvas                
    var bars = canvas.selectAll("rect")
                    .data(dataArray)
                    .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .attr("y", function(d) {return heightScale2(d[2]);})
                        .attr("x", function(d) {return widthScale(d[0]);})
                        .attr("height", function(d) {return height - heightScale2(d[2]);})
                        .attr("width", widthScale.bandwidth())
                        .attr("fill", "seagreen")
                        .style("opacity", 0.7)
                        .on("mouseover", function(d) {
                            d3.select(this).attr("fill","orangered");
                                div.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                div.html(d[1] + ",<br/>" + d[2])
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");

                        })
                        .on("mouseout", function(d) {
                            d3.select(this).attr("fill","seagreen");
                                div.transition()		
                                    .duration(200)		
                                    .style("opacity", 0);                            
                        })                        
                        .on("click", function(d) {
                            console.log(d);
                        })
                        ;        

    // Draw line connecting the data points
    // Do not fill!
    canvas.append("path")
        .data([dataArray])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", line)
        ;

    // Define the div for the tooltip
    // The styling and locations need css definitions.
    var div = d3.select(htmlObjectId)
                .append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);


     // Add dots for data points. 
     // Also includes tooltip
    canvas.selectAll("dot")
        .data(dataArray)
      .enter().append("circle")
        .attr("r", 4)
        .attr("cx", function(d) { return widthScale(d[0]) + widthScale.bandwidth()/2; })
        .attr("cy", function(d) { return heightScale(d[1]); })
        .attr("fill", "steelblue")
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d[1] + ",<br/> " + d[2])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {		
            div.transition()		
                .duration(200)		
                .style("opacity", 0);	
        })
        ;




    // Add x-axis to the bar chart canvas
    canvas.append("g")
                .call(xaxis)
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis x")  
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-4")
                .attr("dy", "4")
                .attr("transform", "rotate(-75)" )
                ;


    // add y-axis to the bar chart canvas
    canvas.append("g")
                .call(yaxis)
                .attr("transform", "translate(" + margin.left +", 0)")
                .attr("class", "axis y")  
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", 0)
                .attr("dy", "1.2em")
                .attr("dx", "-5em")
                .style("text-anchor", "end")
                .text(yLabel)
                .attr("fill", "steelblue");
                ;

    // add y-axis2 to the bar chart canvas
    canvas.append("g")
                .call(yaxis2)
                .attr("transform", "translate(" + width +", 0)")
                .attr("class", "axis y2")  
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0)
                .attr("x", 0)
                .attr("dy", "-0.2em")
                .attr("dx", "-5em")
                .style("text-anchor", "end")
                .text(yLabel2)
                .attr("fill", "seagreen");
                ;
                                
}                            