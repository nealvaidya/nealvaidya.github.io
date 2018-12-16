var w = 700;
var h = 580;

var svg = d3.select('body')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

var proj = d3.geoAlbers()
             .scale(70000)
             .rotate([78.6, 0])
             .center([0, 36.1]);

borders = svg.append('g')

var geoPath = d3.geoPath()
                .projection(proj);

var colors = d3.scaleSequential(d3.interpolatePurples).domain([1,0]);

d3.json("/elem_zones.geojson").then(function(elem_zones){
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

    borders.selectAll('path')
           .data(elem_zones.features)
           .enter()
           .append('path')
           .attr('fill', function(d) {
                return colors(d.properties.zone_white_perc)
            })
           .attr('d', geoPath)
           .attr('class' , 'ESAZ')
           .on('mouseover', function(d) {
               console.log(d.properties.zone_white_perc)
           })
           .on('click', function(d) {
            document.getElementById("school_name")
            .innerHTML = d.properties.SchoolName;
           });
    svg.append("path")
       .attr("class", "borders")
       .attr("stroke", "white")
       .attr("stroke-width", 1)
       .attr("d", geoPath(topojson.mesh(borders, (a,b) => a!==b)));

    var svg2 = d3.select('body')
                 .append('svg')
                 .attr('width', w)
                 .attr('height', h);
        
    bubbles =  svg2.append('g');

    bubbles_x = d3.scaleLinear()
                  .domain([0,1])
                  .range([10, w-10]);
    
    bubbles_y = d3.scaleLinear()
                  .domain([1,0])
                  .range([10,h-10]);

    bubbles_r = d3.scaleSqrt()
                  .domain([0,889])
                  .range([0,20]);

    var xAxis = d3.axisBottom()
                      .scale(bubbles_x);
    var yAxis = d3.axisLeft()
                  .scale(bubbles_y);
    
    svg2.append('g').attr('class','axis').call(xAxis).attr("transform", "translate(20," + (h-20) + ")");
    svg2.append('g').attr('class','axis').call(yAxis).attr("transform", "translate(20,-20)");

    bubbles.selectAll("circle")
           .data(elem_zones.features)
           .enter()
           .append("circle")
           .attr('cx', function(d){
               return bubbles_x(d.properties.zone_white_perc);
           })
           .attr('cy', function(d){
               return bubbles_y(d.properties.white_perc);
           })
           .attr("r", function(d){
               return bubbles_r(d.properties.tot)
           })

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