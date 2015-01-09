average = function (a) {
  var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
  for (var m, s = 0, l = t; l--; s += a[l]);
  for (m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
  return r.deviation = Math.sqrt(r.variance = s / t), r;
};

mapressoproc = {
  classify1: function (d, i) {
    if (d < this.zbot) return this.colorMin;
    if (d > this.ztop) return this.colorMax;
    var interpolate = d3.interpolateHsl(this.colorBot, this.colorTop);
    return interpolate((d - this.zbot) / this.zrange);
  },

  classify2: function (d, i) {
      if (d < this.zbot) return this.colorMin;
      if (d > this.ztop) return this.colorMax;
      var interpolate;
      if (d <= this.zmed) {
        interpolate = d3.interpolateHsl(this.colorBot, this.colorMedBot);
        return interpolate((d - this.zbot) / (this.zmed - this.zbot));
      }
      interpolate = d3.interpolateHsl(this.colorMedTop, this.colorTop);
      return interpolate((d - this.zmed) / (this.ztop - this.zmed));
  }
};

mapressod3.map = function () {
    'use strict';
  var mx = {
    width: 720,
    height: 800,
    geoid: "ID",
    projection: null,
    colors: [        
      d3.hsl(240, 1, 0.96), 
      d3.hsl(240, 1, 0.94),
      d3.hsl(240, 1, 0.06),
      d3.hsl(240, 1, 0.03)
    ],
    colorMissing: d3.rgb('gray'),
    colorBack: d3.rgb('green'),
    colorBorder: d3.rgb('black'),
    colorText: d3.rgb('black'),
    datatxt: '',
    dataid: '',
    datavar: '',
    geo: '',
    zfact: 1.5,
    getToolTip: function (d, alldata, thedata) {
      var txt = d.id + ": " + thedata.get(d.id);
      return txt;
    }),
    mtyp: 1
  };

  var thedata = d3.map();
  var alldata = d3.map();

  function choromap(selection) {
    selection.each(function(data, i) {
      data = data.map(function(d, i) {
        thedata.set(d[mx.dataid], +d[mx.datavar]);
        alldata.set(d[mx.dataid], d);
        return [d[mx.dataid], +d[mx.datavar]]; 
      });
    });

    var r = average(thedata.values());
    var zbot = r.mean - mx.zfact * r.deviation;
    var ztop = r.mean + mx.zfact * r.deviation;
    var zmed = r.mean;
    var zrange = ztop - zbot;
    //  console.log(r.mean + " " + r.variance + " " + r.deviation + " " + zrange + " " + zbot + " " + zmed + " " + ztop);

    var mapresso1 = {
      zfact: 1.5,
      zbot: zbot,
      ztop: ztop,
      zrange: zrange,
      colorMin: mx.colors[0],
      colorBot: mx.colors[1],
      colorTop: mx.colors[2],
      colorMax: mx.colors[3],
      classify: mapressoproc.classify1
    };

    var mapresso2 = {
      zfact: 1.5,
      zbot: zbot,
      zmed: zmed,
      ztop: ztop,
      zrange: zrange,
      colorMin: d3.rgb(200, 0, 0),
      colorBot: d3.rgb(255, 0, 0),
      colorMedBot: d3.rgb(255, 255, 51),
      colorMedTop: d3.rgb(224, 255, 0),
      colorTop: d3.rgb(0, 255, 51),
      colorMax: d3.rgb(0, 136, 85),
      classify: mapressoproc.classify2
    };

    var mapresso = mx.mtyp === 1 ? mapresso1 : mapresso2;

     var div = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);


    var path = d3.geo.path()
      .projection(mx.projection);

    var svg = d3.select("body").append("svg")
      .attr("width", mx.width)
      .attr("height", mx.height);

    d3.json(mx.geo, function (error, geometry) {
      if (error) return console.error(error);

      svg.append("g")
          .attr("class", mx.geoid)
        .selectAll("path")
          .data(topojson.feature(geometry, geometry.objects[mx.geoid]).features)
        .enter().append("path")
          .style('fill', function(d) { 
            var value = thedata.get(d.id);
            if (value) {
              return mapresso.classify(value);
            } else {
              return mx.colorMissing; 
            }})
          .style('stroke', mx.colorBorder)
          .attr("d", path)

          .on("mouseover", function(d) {
            d3.select(this).transition().duration(300).style("opacity", 1);
            div.transition().duration(300)
              .style("opacity", 1);
            div.text(mx.getToolTip(d, alldata, thedata))
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY -30) + "px");
          })

          .on("mouseout", function() {
            d3.select(this)
              .transition().duration(300)
              .style("opacity", 0.8);
            div.transition().duration(300)
              .style("opacity", 0);
          });
    });
  }

  // Create an accessor function for the given attribute
  function createAccessor(attr) {
    function accessor(value) {
      if (!arguments.length) { return mx[attr]; }
      mx[attr] = value;
      return choromap;
    }
    return accessor;
  }

  // Create accessors for each element in mx
  for (var attr in mx) {
    // Avoid overwriting explicitely created accessors
    // and creating accessors for inherited by the prototype
    // chain of the object.
    if ((!choromap[attr]) && (mx.hasOwnProperty(attr))) {
      choromap[attr] = createAccessor(attr);
    }
  }

  return choromap;
};