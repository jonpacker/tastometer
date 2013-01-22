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

    var currentBobbleLabel = svg.append('svg:text').attr({
      'class': cl('bobble-label'),
      x: 0,
      y: 0,
      'text-anchor': 'middle',
      'baseline-shift': '-30%'
    });

    var stepRadiusIncrement = opts.radius / (opts.steps + 1);
    _.range(1, opts.steps + 1).reverse().forEach(function(step) {
      // WTF didn't I just use a <circle> here. wow. TODO :/
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
    var radianStep = Math.PI * 2 / opts.corners.length;
    opts.corners.forEach(function(label, i) {
      var actuation = i / opts.corners.length;
      var radians = radianStep * i;
      var multiplierX = Math.cos(radians);
      var multiplierY = Math.sin(radians);

      var group = svg.append('g');

      // draw cord
      var cornerCord = group.append('svg:line').attr({
        x1: cordLength * multiplierX,
        y1: cordLength * multiplierY,
        x2: stepRadiusIncrement * multiplierX,
        y2: stepRadiusIncrement * multiplierY,
        'class': cl('corner-cord')
      });

      // draw label
      var rotation = [
        actuation * 360 + 90,
        labelRadius * multiplierX,
        labelRadius * multiplierY
      ];
      var label = group.append('svg:text').attr({
        x: labelRadius * multiplierX,
        y: labelRadius * multiplierY,
        transform: 'rotate(' + rotation + ')',
        'text-anchor': 'middle',
        'class': cl('corner-label')
      }).text(label);

      // hover arc
      var hoverArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(stepRadiusIncrement * (opts.steps + 1))
        .startAngle(Math.PI / 2 + radians - radianStep / 2)
        .endAngle(Math.PI / 2 + radians + radianStep / 2);
      var hoverArcPath = group.append('path')
        .attr({
          d: hoverArc,
          'class': cl('hover-pie-piece')
        });

      group
        .on('mouseover', function() {
          label.classed(cl('active'), true);
          cornerCord.classed(cl('active'), true);
        })
        .on('mouseout', function() {
          label.classed(cl('active'), false);
          cornerCord.classed(cl('active'), false);
        });

      // draw bobbles
      _.range(1, opts.steps + 1).forEach(function(step) {
        var bobble = group.append('circle').attr({
          cx: step * stepRadiusIncrement * multiplierX,
          cy: step * stepRadiusIncrement * multiplierY,
          r: 4,
          'class': cl('bobble')       
        }).on('mouseover', function() {
          bobble.attr('r', 6);
          currentBobbleLabel.text(step);
        }).on('mouseout', function() {
          bobble.attr('r', 4);
          currentBobbleLabel.text('');
        });
      });
      
    });
  };
  renderTastometer();
}, false);
