/**
 * @param {Object} Chart The ChartJS library
 */
var Charts = (function(document, Chart, $) {

  var chartCounter = 0;

  /**
   * Returns a progressive number to be appended to the chart canvas element id.
   *
   * @returns {number}
   */
  var nextId = function() {

    return chartCounter++;
  };


  return {

    pie: function(selector, data, options, innerText) {
      // Setting defaults
      var _defaults = {
        tooltipTemplate: "<%= value %>",
        onAnimationComplete: function() {
          this.showTooltip(this.segments, true);
        },
        tooltipEvents: [],
        showTooltips: true,
        percentageInnerCutout : 60,
        animationEasing: "linear",
        animationSteps: 20,
        tooltipRadialShift: 100
      };

      var _settings = $.extend({}, _defaults, options);

      // Creating a div with position relative. This is because otherwise when new elements are added to the page
      // and the chart moves around, the tooltips would remain in the old place instead of the new one.
      var $canvasHolder = $('<div></div>');
      $canvasHolder.addClass('canvas-holder');
      $canvasHolder.appendTo(selector);

      var canvasId = 'pie-chart-' + nextId();
      $(document.createElement('canvas')).appendTo($canvasHolder).attr('id', canvasId);
      var ctx2 = document.getElementById(canvasId).getContext("2d");
      var $canvas = $('#' + canvasId);

      $canvas.height($(selector).height());
      $canvas.width($(selector).width());
      var radius = $canvas.width() / 2;

      /**
       * Place the tooltip along the radius axis at the specified offset (as percentage). 100 means the default position
       * which is the center of the toroid.
       *
       * @param tooltip
       * @param percentage
       * @returns {{}}
       */
      var place = function(tooltip, percentage) {

        var naturalX = tooltip.chart.canvas.offsetLeft + tooltip.x;
        var naturalY = tooltip.chart.canvas.offsetTop + tooltip.y;
        var deltaX = tooltip.x - $canvas.width() / 2;
        var deltaY = tooltip.y - $canvas.height() / 2;

        var result = {
          left: naturalX + (deltaX * percentage / 100 - deltaX),
          top: naturalY + (deltaY * percentage / 100 - deltaY)
        };

        return result;
      };

      if (innerText) {

        var $mainText = $('<div></div>');
        $mainText.text(innerText);
        $mainText.addClass('chartjs-main-text');
        $mainText.appendTo($canvasHolder);
        $mainText.css({
          left: radius + $canvas.position().left + 'px',
          top: radius + $canvas.position().top + 'px',
        });
      }

      Chart.defaults.global.customTooltips = function(tooltip) {

        // Tooltip Element
        var tooltipEl = $('<div></div>');
        tooltipEl.addClass('chartjs-tooltip');

        $canvasHolder.append(tooltipEl);

        // Hide if no tooltip
        if (!tooltip) {
          tooltipEl.css({
            opacity: 0
          });
          return;
        }

        // Set Text
        tooltipEl.html(tooltip.text);

        var tooltipPosition = place(tooltip, _settings.tooltipRadialShift);

        // Display, position, and set styles for font
        tooltipEl.css({
          opacity: 1,
          left: tooltipPosition.left  + 'px',
          top: tooltipPosition.top + 'px',
          fontFamily: tooltip.fontFamily,
          fontSize: tooltip.fontSize,
          fontStyle: tooltip.fontStyle
        });
      };

      return new Chart(ctx2).Pie(data, _settings);
    },

    stackedBars: function(selector, data, options) {
        // Input data type checks
        if (!($(selector) instanceof jQuery)) {
            throw new Error("Selector supplied is not a valid jQuery selector");
        }

        if (!Array.isArray(data)) {
            throw new Error("Input data for the stacked bars chart must be an Array");
        }

        if(Array.isArray(data) &&
                data.length === 0) {
            throw new Error("The data array can't be empty");
        }

        if (typeof options !== "undefined" &&
                typeof options !== "object") {
            throw new Error("Charts options must be an Object");
        }

        var _data = data.slice();
        var _height = options.height || $(selector).height();
        var _animationTime = options.animationTime || 400;
        var _total = 0;

        if (typeof options !== "object" ||
                typeof options.total !== "number") {
            _data.forEach(function(item) {
                _total += item.value;
            });
        }
        else {
            _total = options.total;
        }

        var allBarsLength = 0;

        // Transforms bar elements' numerical values into % values relative to the total bar width
        // and calculates the effective total bar length in %
        _data.forEach(function(item) {
            item.value = currentWidth = item.value / _total * 100;
            allBarsLength += item.value;
        });

        _total = allBarsLength;

        // Injects a bar div that will be parent to all the bar elements and sets chart's background color
        $(selector)
            .append("<div style='height: 100%; width: 100%'></div>")
            .find("div")
            .css("background-color", "#A8B3C5");
        // And saves a reference to it
        var barContainer = $(selector).children().first();

        // Injects a div for each bar element with the settings supplied in the options and hides it
        _data.forEach(function(element, index) {
            $(barContainer)
                .append("<div></div>")
                .find("div")
                .eq(index)
                .width(0)
                .height(100)
                .css({
                    "float": "left",
                    "background-color": element.color
                })
                .attr("data-bar-elem-value", element.value);
        });

        // Variables used for sequential bar elements animation
        var _alreadyAnimated = 0;
        var _totalToAnimate = $(barContainer).children().length;

        /**
         * Animates bar elements, one by one in the linear mode
         *
         * @return {[type]} [description]
         */
        var _animateBarElements = function() {
            var nextBarItem = $(barContainer).children().eq(_alreadyAnimated);
            var nextValue = nextBarItem.attr("data-bar-elem-value");

            if (_alreadyAnimated < _totalToAnimate) {
                nextBarItem.animate(
                    { width: nextValue + "%" },
                     nextValue * _animationTime / _total,
                    "linear",
                    function() {
                        ++_alreadyAnimated;
                        _animateBarElements(barContainer);
                    }
                );
            }

        };

        _animateBarElements();
    }
  };
})(document, Chart, jQuery);

/**
 * @param {Object} $ The jQuery library
 * @param {Object} Chart The ChartJS library
 * @param {Object} document
 */
(function($, Chart, document) {

  /**
   * @param {Object} options (Optional)
   * @return {selector}
   */
  $.fn.chart = function(data, options) {

    /**
     * @type {Object}
     * @private
     */
    var _settings = $.extend({}, $.fn.chart.defaults, options);

    if (options.type == 'pie') {
      return this.each(function() {
        var target = this;

        // Set some default settings for the pie chart
        _settings.animationSteps = _settings.animationTime * 60 / 300;
        _settings.onAnimationComplete = function() {
          if (_settings.showTooltips) {
            this.showTooltip(this.segments, true);
          }
        };
        _settings.percentageInnerCutout = 60;
        _settings.tooltipEvents = [];
        _settings.tooltipRadialShift = 140;

        // Creating a div with position relative. This is because otherwise when new elements are added to the page
        // and the chart moves around, the tooltips would remain in the old place instead of the new one.
        var $wrapper = $('<div></div>').css('position', 'relative');
        var $canvas = $(document.createElement('canvas')).appendTo(
          $wrapper.appendTo(target)
        );

        $canvas.height(_settings.height ? _settings.height : $(target).height());
        $canvas.width(_settings.width ? _settings.width : $(target).width());

        // TODO the max font-size should depend by the content to avoid overflow
        if (_settings.innerTextTemplate) {
          var $innerText = $('<div />')
            .text(_settings.innerTextTemplate)
            .addClass('chartjs-inner-text')
            .appendTo($wrapper)
            .css({
              left: $canvas.width() / 2 + $canvas.position().left + 'px',
              top: $canvas.width() / 2 + $canvas.position().top + 'px'
          });
        }

        Chart.defaults.global.customTooltips = function(tooltip) {
          if (!tooltip) {
            return;
          }

          // TODO The position of the tooltip should be inside the chart size, so we need to resize the chart itself
          // TODO to match this request
          // Tooltip Element
          var $tooltip = $('<div />');
          $tooltip.addClass('chartjs-tooltip').html(tooltip.text).appendTo($wrapper);
          var deltaX = tooltip.x - $canvas.width() / 2;
          var deltaY = tooltip.y - $canvas.height() / 2;
          var tooltipPosition = {
            left: tooltip.chart.canvas.offsetLeft + tooltip.x + (deltaX * _settings.tooltipRadialShift / 100 - deltaX),
            top: tooltip.chart.canvas.offsetTop + tooltip.y + (deltaY * _settings.tooltipRadialShift / 100 - deltaY)
          };console.log(tooltip);

          // Display, position, and set styles for font
          $tooltip.css({
            left: tooltipPosition.left  + 'px',
            top: tooltipPosition.top + 'px'
          });
        };

        return new Chart($canvas[0].getContext("2d")).Pie(data, _settings);
      });
    }

    if (options.type == 'sticked-bar') {
      return this.each(function() {
        var target = this;
        var total = 0;
        var height;

        if (!Array.isArray(data)) {
            throw new Error("Input data for the stacked bars chart must be an Array");
        }

        if(Array.isArray(data) &&
                data.length === 0) {
            throw new Error("The data array can't be empty");
        }

        if (typeof _settings.total === "number") {
          total = _settings.total;
        }
        else {
          data.forEach(function(item) {
              total += item.value;
          });
        }

        if (typeof _settings.height === "number") {
          height = _settings.height;
        }
        else {
          height = $(target).height();
        }

        var allBarsLength = 0;

        // Transforms bar elements' numerical values into % values relative to the total bar width
        // and calculates the effective total bar length in %
        data.forEach(function(item) {
            item.value = currentWidth = item.value / total * 100;
            allBarsLength += item.value;
        });

        total = allBarsLength;

        // Injects a bar div that will be parent to all the bar elements and sets chart's background color
        $(target)
            .append("<div style='height: " + height + "px; width: 100%'></div>")
            .find("div");
        // And saves a reference to it
        var barContainer = $(target).children().first();

        // Injects a div for each bar element with the settings supplied in the options and hides it
        data.forEach(function(element, index) {
            $(barContainer)
                .append("<div></div>")
                .find("div")
                .eq(index)
                .width(0)
                .height($(barContainer).height())
                .css({
                    "float": "left",
                    "background-color": element.color
                })
                .attr("data-bar-elem-value", element.value);
        });

        // Variables used for sequential bar elements animation
        var alreadyAnimated = 0;
        var totalToAnimate = $(barContainer).children().length;

        /**
         * Animates bar elements, one by one in the linear mode
         *
         * @return {[type]} [description]
         */
        var animateBarElements = function() {
            var nextBarItem = $(barContainer).children().eq(alreadyAnimated);
            var nextValue = nextBarItem.attr("data-bar-elem-value");

            if (alreadyAnimated < totalToAnimate) {
                nextBarItem.animate(
                    { width: nextValue + "%" },
                     nextValue * _settings.animationTime / total,
                    _settings.animationEasing,
                    function() {
                        ++alreadyAnimated;
                        animateBarElements(barContainer);
                    }
                );
            }

        };

        animateBarElements();
      });
    }
  };

  /**
   * Plugin defaults - added as a property on our plugin function.
   *
   * @type {Object}
   */
  $.fn.chart.defaults = {

    /**
     * Time (in milliseconds) of chart animation
     *
     * @type {number}
     */
    animationTime: 120,

    /**
     * Animation easing effect
     *
     * @type {string}
     */
    animationEasing: "linear",

    /**
     * Template string within chart
     *
     * @type {string}
     */
    innerTextTemplate: "",

    /**
     * Determines whether to draw tooltips on the canvas or not
     *
     * @type {boolean}
     */
    showTooltips: true,

    /**
     * Template string for single tooltips
     *
     * @type {string}
     */
    tooltipTemplate: "<%= value %>"
  };
}(jQuery, Chart, document));
