/**
 * @param {Object} Chart The ChartJS library
 */
var Chart = (function(document, Chart, $) {

  return {

    pie: function(selector, data, options) {
      $(document.createElement('canvas')).appendTo(selector).attr('id', 'piechart');
      var ctx2 = document.getElementById('piechart').getContext("2d");
      $('#piechart').height($(selector).height());
      $('#piechart').width($(selector).width());

      Chart.defaults.global.customTooltips = function(tooltip) {
        // Tooltip Element
        var tooltipEl = $('<div></div>');
        tooltipEl.addClass('chartjs-tooltip');

        $(selector).append(tooltipEl);

        // Hide if no tooltip
        if (!tooltip) {
          tooltipEl.css({
            opacity: 0
          });
          return;
        }

        // Set caret Position
        tooltipEl.removeClass('above below');
        tooltipEl.addClass(tooltip.yAlign);

        // Set Text
        tooltipEl.html(tooltip.text);

        // Find Y Location on page
        var top;
        if (tooltip.yAlign == 'above') {
          top = tooltip.y - tooltip.caretHeight - tooltip.caretPadding;
        } else {
          top = tooltip.y + tooltip.caretHeight + tooltip.caretPadding;
        }

        // Display, position, and set styles for font
        tooltipEl.css({
          opacity: 1,
          left: tooltip.chart.canvas.offsetLeft + tooltip.x + 'px',
          top: tooltip.chart.canvas.offsetTop + top + 'px',
          fontFamily: tooltip.fontFamily,
          fontSize: tooltip.fontSize,
          fontStyle: tooltip.fontStyle
        });
      };

      var _defaults = {
        tooltipTemplate: "<%= value %>",
        onAnimationComplete: function() {
          this.showTooltip(this.segments, true);
        },
        tooltipEvents: [],
        showTooltips: true,
        percentageInnerCutout : 60,
        animationEasing: "linear",
        animationSteps: 20
      };

      var _settings = $.extend({}, _defaults, options);

      return new Chart(ctx2).Pie(data, _settings);
    }
  };
})(document, Chart, jQuery);
