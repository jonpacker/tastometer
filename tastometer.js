document.addEventListener("DOMContentLoaded", function() {
  var renderTastometer = function(opts) {
    opts = _.extend({
      radius: 250,
      corners: [
        'Linger/finish',
        'Sweet',
        'Sour/tart',
        'Floral',
        'Spicy',
        'Salty',
        'Berry fruit',
        'Citrus fruit',
        'Stone fruit',
        'Chocolate',
        'Caramel',
        'Smoky',
        'Bitter',
        'Savoury',
        'Body',
        'Clean'
      ],
      steps: 5,
      element: '#tastometer',
      cssprefix: 'tastometer'
    }, opts || {});

    //prefixer
    var cl = function(name) { return opts.cssprefix + '-' + name; };
    
    var element = document.querySelector(opts.element);
    var centerTrans = 'translate(' + [opts.radius, opts.radius] + ')';
    var svg = d3.select(element).append('svg')
                .attr({
                  width: opts.radius * 2,
                  height: opts.radius * 2
                })
                .append('g')
                .attr('transform', centerTrans);

    var stepRadiusIncrement = opts.radius / (opts.steps + 1);
    _.range(1, opts.steps + 1).reverse().forEach(function(step) {
      var stepCircle = d3.svg.arc()
        .outerRadius(step * stepRadiusIncrement)
        .innerRadius(0)
        .startAngle(0)
        .endAngle(Math.PI * 2);
      svg.append('path').attr({
        d: stepCircle,
        'class': cl('step-circle')
      });
    });
    
    var cordLength = opts.radius - stepRadiusIncrement;
    var labelRadius = opts.radius - stepRadiusIncrement * 0.75;
    opts.corners.forEach(function(label, i) {
      var actuation = i / opts.corners.length;
      var multiplierX = Math.cos(Math.PI * 2 * actuation);
      var multiplierY = Math.sin(Math.PI * 2 * actuation);

      // draw cord
      var cornerCord = svg.append('svg:line').attr({
        x1: cordLength * multiplierX,
        y1: cordLength * multiplierY,
        x2: 0, y2: 0,
        'class': cl('corner-cord')
      });

      // draw label
      var rotation = [
        actuation * 360 + 90,
        labelRadius * multiplierX,
        labelRadius * multiplierY
      ];
      var label = svg.append('svg:text').attr({
        x: labelRadius * multiplierX,
        y: labelRadius * multiplierY,
        transform: 'rotate(' + rotation + ')',
        'text-anchor': 'middle',
        'class': cl('corner-label')
      }).text(label);
      
    });
  };
  renderTastometer();
}, false);
