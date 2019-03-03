var w = 400;
var h = 580;

var svg = d3.select('#col1')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

var proj = d3.geoAlbers()
             .scale(75000)
             .rotate([78.57, 0])
             .center([0, 36.1]);

borders = svg.append('g')


var geoPath = d3.geoPath()
                .projection(proj);

var colors = d3.scaleSequential(d3.interpolatePurples).domain([1,0]);

var tooltip = d3.select("body")
                .append("div")
                .attr('class', 'ttip')
				.style("position", "absolute")
				.style("z-index", "10")
				.style("opacity" , 0)
                .text("tooltip");
                
// var scoreBar_g =  d3.selectAll("div#score_bar")
//                   .append('svg')
//                   .attr('width', 300)
//                   .attr('height', 20)
//                   .append('g')

                  

d3.json("/ESAZ.geojson").then(function(elem_zones){
    // var coordinates0 = elem_zones.features[0].map(proj);
    // var coordinates1 = circle(coordinates0);
    // var path = svg.append("path");
    // var d0 = "M" + coordinates0.join("L") + "Z";
    // var d1 = "M" + coordinates1.join("L") + "Z";

    // loop; 

    // function loop() {
    //     path
    //         .attr("d", d0)
    //       .transition()
    //         .duration(5000)
    //         .attr("d", d1)
    //       .transition()
    //         .delay(5000)
    //         .attr("d", d0)
    //         .each("end", loop);
    //   }

    function updateInfo(d){
        $('#school_name')[0].innerHTML = d.properties.SchoolName;
        $('#school_address')[0].innerHTML = d.properties.ADDRESS;
        $('#score_num')[0].innerHTML = d.properties.perf;

        $('#score_bar').width(d.properties.perf * 3)
        // var scoreBar = scoreBar_g.selectAll('rect')
        // .data(d.properties.perf)

        // scoreBar.enter()
        //         .append('rect')
        //         .attr('x', 0)
        //         .attr('y', 0)
        //         .attr('height', 20)
        //         .attr('width)', function(d){
        //             return d.properties.perf
        //           })
        //         .style('fill', '#3f007d')
        //         .exit()
        //         .remove();

        // // .enter()
        // .append('rect')
        // .attr('height', 10)
    
        //   .transition()
        //   .duration(500)
        //   .attr('width', function(d){
        //       return d.properties.perf
        //     })

        var zone_vals = [
            d.properties.zone_nonhis_white_perc,
            d.properties.zone_black_perc,
            d.properties.zone_hispanic_perc,
            d.properties.zone_asian_perc,
            d.properties.zone_amerindian_perc,
            d.properties.zone_nonhis_nhpi_perc,
            d.properties.zone_multiple_perc,
        ]

        var school_vals = [
            d.properties.school_white_perc,
            d.properties.school_black_perc,
            d.properties.school_hispanic_perc,
            d.properties.school_asian_perc,
            d.properties.school_amerindian_perc,
            d.properties.school_nonhis_nhpi_perc,
            d.properties.school_multiple_perc,
        ]

    }

    borders.selectAll('path')
           .data(elem_zones.features)
           .enter()
           .append('path')
           .style('fill', function(d) {
                return colors(d.properties.zone_nonhis_white_perc)
            })
           .attr('d', geoPath)
           .attr('class' , 'ESAZ')
           .on('mouseover', function(d) {
//               d3.select(this).style('fill', 'purple')
                d3.select(this).style('fill', function(d){
                    return d3.rgb(colors(d.properties.zone_nonhis_white_perc)).darker(1)
                })
           })
           .on('mousemove', function(d) {
                tooltip.style("opacity", 0.9)
                       .style("top", (d3.event.pageY - 50) + "px")
                       .style("left", (d3.event.pageX + 5) + "px")
                       .html("<b>"+d.properties.DISTRICT+"</b>" + "<br/>" + 
                            "School: " + 
                            (d.properties.school_white_perc*100).toFixed(1) + 
                            '% White' + "<br/>" +
                            "Zone: " + 
                            (d.properties.zone_nonhis_white_perc*100).toFixed(1) + 
                            '% White');
           })
           .on('mouseout', function(d) {
               d3.select(this).style('fill', function(d){
                   return colors(d.properties.zone_nonhis_white_perc)
               })
           })
           .on('click', function(d) {
                d3.selectAll(".ESAZ").classed('clicked', false);
                d3.select(this).classed('clicked', true);
                updateInfo(d);
           });

    
    // var svg2 = d3.select('body')
    //              .append('svg')
    //              .attr('width', w)
    //              .attr('height', h);
        
    // bubbles =  svg2.append('g');

    // bubbles_x = d3.scaleLinear()
    //               .domain([0,1])
    //               .range([10, w-10]);
    
    // bubbles_y = d3.scaleLinear()
    //               .domain([1,0])
    //               .range([10,h-10]);

    // bubbles_r = d3.scaleSqrt()
    //               .domain([0,889])
    //               .range([0,20]);

    // var xAxis = d3.axisBottom()
    //                   .scale(bubbles_x);
    // var yAxis = d3.axisLeft()
    //               .scale(bubbles_y);
    
    // svg2.append('g').attr('class','axis').call(xAxis).attr("transform", "translate(20," + (h-20) + ")");
    // svg2.append('g').attr('class','axis').call(yAxis).attr("transform", "translate(20,-20)");

    // bubbles.selectAll("circle")
    //        .data(elem_zones.features)
    //        .enter()
    //        .append("circle")
    //        .attr('cx', function(d){
    //            return bubbles_x(d.properties.zone_nonhis_white_perc);
    //        })
    //        .attr('cy', function(d){
    //            return bubbles_y(d.properties.school_white_perc);
    //        })
    //        .attr("r", function(d){
    //            return bubbles_r(d.properties.tot)
    //        })
        

});

function circle(coordinates){
    var circle = [];
    var length = 0;
    var lengths = [length];
    polygon = d3.geom.polygon(coordinates);
    p0 = coordinates[0],
    p1 = 0;
    x = 0;
    y = 0;
    i = 0;
    n = coordinates.length;

    while (++i < n){
        p1 = coordinates[i];
        x = p1[0] - po[0];
        y = p1[1] - p0[1];
        lengths.push(length += Math.sqrt(x*x + y*y));
        p0 = p1;
    }

    var area = poygon.area(),
        radius = Math.sqrt(Math.abs(area) / Math.PI),
        centroid = polygon.centroid(-1/(6 * area)),
        angleOffset = -Math.PI / 2,
        angle,
        angle = -1,
        k = 2 * Math.PI / lengths[lengths.length - 1];
    
    while (++i < n) {
        angle = angleOffset + lengths[i] * k;
        circle.push([
            centroid[0] + radius * Math.cos(angle),
            centroid[1] + radius * Math.sin(angle)
        ]);
    }

    return circle;
}