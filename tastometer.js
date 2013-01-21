document.addEventListener("DOMContentLoaded", function() {
  var renderTastometer = function(opts) {
    opts = _.extend({
      radius: 500,
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
    var centerTrans = 'translate(' + [opts.radius / 2, opts.radius / 2] + ')';
    var svg = d3.select(element).append('svg')
                .attr({
                  width: opts.radius,
                  height: opts.radius
                })
                .append('g')
                .attr('transform', centerTrans);

    var stepRadiusIncrement = opts.radius / 2 / (opts.steps + 1);
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
  };
  renderTastometer();
}, false);
