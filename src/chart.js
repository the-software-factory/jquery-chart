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

    if (typeof data === 'undefined') {
      throw new Error('jQuery Chart requries a data array');
    }

    if (data &&
        !Array.isArray(data)) {
      throw new Error("'data' parameter must be an Array");
    }

    if (typeof options !== 'object' ||
        typeof options.type !== 'string') {
      throw new Error('jQuery Chart requires a chart type option to be set');
    }

    // TODO Add control on data values

    /**
     * @type {Object}
     * @private
     */
    var _settings = $.extend({}, $.fn.chart.defaults, options);

    /**
     * The sum of the values of all the chart's sections
     *
     * @type {Number}
     */
    var _total = 0;

    data.forEach(function(item) {
      _total += item.value;
    });

    // If the chart is empty and skipIfEmpty options is set to 'true' then don't do anything
    if (_total === 0 && _settings.skipIfEmpty) {
      return this;
    }

    if (options.type == 'pie') {
      return this.each(function() {
        var target = this;

        // Set some default settings for the pie chart
        _settings.animationSteps = _settings.animationTime / 18;
        _settings.onAnimationComplete = function() {
          if (_settings.showTooltips) {
            var chartOptions = this;
            // Remove tooltips for segments with zero value

            $.each(chartOptions.segments, function(segmentIndex) {
              if (this.value === 0) {
                chartOptions.segments.splice(segmentIndex, 1);
              }
            });

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

        // // Set the background color of the chart
        $canvas.css('background-color', _settings.backgroundColor);

        $canvas.height(_settings.height ? _settings.height : $(target).height());
        $canvas.width(_settings.width ? _settings.width : $(target).width());

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
          if (!tooltip || Number.parseInt(tooltip.text.replace('%', '')) === 0) {
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
          };

          // Display, position, and set styles for font
          $tooltip.css({
            left: tooltipPosition.left  + 'px',
            top: tooltipPosition.top + 'px'
          });
        };

        // Automatically adapts the font-size to make the inner text fit the space inside the doughnut

        // Maximum (and default) font size
        var maxFontSize = 30;

        // Calculates the width of the space inside the doughnut
        var innerTextContainerMaxWidth = $(this).width() / 100 * _settings.percentageInnerCutout;
        // Gets the inner text DIV container
        var innerTextContainer = $(this).find(".chartjs-inner-text");
        // Sets the width of the innerTextContainer to which the font size will be adaptated
        innerTextContainer.width(innerTextContainerMaxWidth);
        // Set the height of the innerTextContainer so the text with max font size would fit it
        innerTextContainer.height(maxFontSize);
        // Apply the font size adaptation plugin to the inner text container DIV
        innerTextContainer.boxfit({
          maximum_font_size: maxFontSize + "px",
          minimum_font_size: '5px'
        });

        // Center the inner text
        innerTextContainer.css({
          left: "50%",
          top: "50%",
          "margin-top": "-" + innerTextContainer.height()/2 + "px",
          "margin-left": -(innerTextContainerMaxWidth / 2)
        });

        return new Chart($canvas[0].getContext("2d")).Pie(data, _settings);
      });
    }

    if (options.type == 'stacked-bar') {
      return this.each(function() {
        var target = this;

        $(target).attr('data-pie-chart', '');

        // Total chart value
        var total = 0;

        if (typeof _settings.total === "number") {
          total = _settings.total;
        }
        else {
          data.forEach(function(item) {
            total += item.value;
          });
        }

        // Set the background color of the chart
        $(target).css('background-color', _settings.backgroundColor);

        // Set the height of the parent of all bar elements
        $(target).height(typeof _settings.height === "number" ? _settings.height : $(target).height());

        // NOTE: it could be a value less than 100%
        var allBarsPercentageLength = 0;

        data.forEach(function(item) {
          // Transforms bar elements' numerical values into % values relative to the total bar width and calculates the
          // effective total bar length in %
          var barPercentageValue = item.value / total * 100;
          allBarsPercentageLength += barPercentageValue;

          // Inject a div for the current bar
          $(target).append(
            $(document.createElement('div')).height('100%')
              .css({
                "background-color": item.color,
                "display": "inline-block",
                "vertical-align": "top"
              })
              .data("stacked-bar-percentage-value", barPercentageValue)
          );
        });

        /**
         * Animate Bar at position index
         *
         * @param {Object} container
         * @param {number} index
         */
        var _animateBar = function(container, index) {
          var bars = $(container).children();
          if (index < bars.length) {
            var bar = bars.get(index);
            $(bar).animate(
              {
                width: $(bar).data("stacked-bar-percentage-value") + '%'
              },
              {
                duration: $(bar).data("stacked-bar-percentage-value") * _settings.animationTime / allBarsPercentageLength,
                easing: _settings.animationEasing,
                complete: function() {
                  _animateBar(container, index + 1);
                }
              }
            );
          }
        };

        _animateBar(target, 0);
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
     * Background color of the chart (HTML name or HEX RGB code)
     *
     * @type {String}
     */
    backgroundColor: '#fff',

    /**
     * Time (in milliseconds) of chart animation
     *
     * @type {number}
     */
    animationTime: 300,

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
    tooltipTemplate: "<%= value %>",

    /**
     * Determines whether to skip or not empty charts. When the chart is skipped,
     * no DOM manipulations happens at all - the plugin simply return the result set.
     *
     * @type {boolean}
     */
    skipIfEmpty: true
  };
}(jQuery, Chart, document));
