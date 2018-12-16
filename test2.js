var width = 960,
    height = 500;

var projection = d3.geoAlbers()
    .scale(70000)
    .rotate([78.6, 0])
    .center([0, 36.1]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("just_ESAZ.json").then(function(polygon) {
     var coordinates0 = polygon.features.map( function(feature){
        feat = feature.geometry.coordinates[0][0].map(projection);
        //console.log([feat]);
        return [feat];
     });
    //var coordinates0 = polygon.features[0].geometry.coordinates[0][0].map(projection);
    //var coordinates1 = circle(coordinates0);
    var coordinates1 = coordinates0.map( function(shape) {
        console.log(circle(shape));
        return [circle(shape)]
    });
    //var  path = svg.append("path");
    //var d0 = "M" + coordinates0.join("L") + "Z";
    //var d1 = "M" + coordinates1.join("L") + "Z";
    function pointsToPath(shape) {
        return "M" + shape.join("L") + "Z";
    }
    //var d0 = coordinates0.map(pointsToPath);
    var d1 = coordinates1.map(pointsToPath);
  //loop();
  borders = svg.append('g')
  borders.selectAll('path')
  //       .data(d0)
         .data(coordinates0)
         .enter()
         .append('path')
 //        .attr('d', function(d) {return d});
        .attr('d', d3.geoPath());

  borders.selectAll('path')
         .data(d1)
         .transition()
         .duration(500)
         //.attr('d', function(d) {return d});

  function loop() {
    path
        .attr("d", d0)
      .transition()
        .duration(2500)
        .attr("d", d1);
  }
});

function circle(coordinates) {
  var circle = [],
      length = 0,
      lengths = [length],
      //polygon = d3.geom.polygon(coordinates),
      p0 = coordinates[0][0],
      p1 = 0,
      x = 0,
      y = 0,
      i = 0,
      n = coordinates[0].length;

  // Compute the distances of each coordinate.
  while (++i < n) {
    p1 = coordinates[0][i];
    x = p1[0] - p0[0];
    y = p1[1] - p0[1];
    lengths.push(length += Math.sqrt(x * x + y * y));
    p0 = p1;
  }

  var area = d3.polygonArea(coordinates),
  //var area = 10,
      radius = 10,
      // centroid = polygon.centroid(-1 / (6 * area)),
      centroid = d3.polygonCentroid(coordinates) + [10,10]
      //centroid = [10,10]
      angleOffset = -Math.PI / 2, // TODO compute automatically
      angle = 0,
      i = -1,
      k = 2 * Math.PI / lengths[lengths.length - 1];

  // Compute points along the circle’s circumference at equivalent distances.
  while (++i < n) {
    angle = angleOffset + lengths[i] * k;
    circle.push([
      centroid[0] + radius * Math.cos(angle),
      centroid[1] + radius * Math.sin(angle)
    ]);
  }

  return circle;
}
