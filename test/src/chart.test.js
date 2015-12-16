describe("JS Chart test suite", function() {

  // Fixtures
  var _chartFixture = "<div id='chart' style='width: 300px; height: 300px'></div>";

  var _chartDataset = [
    { value: 100, color: "#5AD3D1" },
    { value: 50, color: "#FF5A5E" },
    { value: 50, color: "#FFC870" },
  ];

  var _chartOptions = {
    type: "stacked-bar",
    animationTime: 100
  };

  beforeEach(function() {
    $("body").empty();
    $("body").append(_chartFixture);

    $.fn.boxfit = function() {};
  });

  it("fires and exception if data supplied is not an array", function() {
    expect(function() {
      $("#chart").chart({});
    }).toThrow();
  });

  it("fires and exception if supplied data array is empty", function() {
    expect(function() {
      $("#chart").chart([]);
    }).toThrow();
  });


  describe("stacked bars chart", function() {
    it("has right number of child divs", function() {
      $("#chart").chart(_chartDataset, _chartOptions);
      expect($("#chart > div").length).toBe(_chartDataset.length);
    });

    it("has the bars with their parent's height", function() {
      var container = $("#chart").chart(_chartDataset, _chartOptions);
      var rightHeight = true;
      $("#chart > div").each(function() {
        if ($(this).height() !== container.height()) {
          rightHeight = false;
        }
      });
      expect(rightHeight).toBeTruthy();
    });

    it("with no total value specified has bars of the correct width", function(done) {
      $("#chart").chart(_chartDataset, _chartOptions);
      setTimeout(function() {
        var match = true;
        var totalWidth = 0;
        _chartDataset.forEach(function(item) {
          totalWidth += item.value;
        });
        for (var index in _chartDataset) {
          if ((_chartDataset[index].value / totalWidth * 100) !==
              ($("#chart > div").eq(index).width() / $("#chart").width() * 100)) {
            match = false;
          }
        }
        expect(match).toBeTruthy();
        done();
      }, _chartOptions.animationTime + 10);
    });

    it("uses the specfied color for background and borders", function() {
      _chartOptions.backgroundColor = "rgb(1, 2, 3)";
      var chart = $("#chart");
      chart.chart(_chartDataset, _chartOptions);
      expect(chart.css("background-color")).toBe("rgb(1, 2, 3)");
      expect(chart.children().first().css("border-right-color")).toBe("rgb(1, 2, 3)");
    });

    it("uses container's color for borders if no custom one is specified", function() {
      var chart = $("#chart");
      chart.css("background-color", "rgb(1, 2, 3");
      chart.chart(_chartDataset, _chartOptions);
      expect(chart.children().first().css("border-right-color")).toBe("rgb(1, 2, 3)");
    });
  });

  describe("pie chart", function() {
    beforeEach(function() {
      _chartOptions.type = "pie";
    });

    it("creates a wrapper div with a canvas inside", function() {
      var chart = $("#chart");
      chart.chart(_chartDataset, _chartOptions);
      var wrapper = chart.children().first();
      expect(wrapper.prop("tagName")).toBe("DIV");
      expect(wrapper.find("canvas").length).toBe(1);
    });

    it("uses container's color for background if no custom one is specified", function() {
      var chart = $("#chart");
      chart.css("background-color", "rgb(1, 2, 3)");
      chart.chart(_chartDataset, _chartOptions);
      expect(chart.find("canvas").css("background-color")).toBe("rgb(1, 2, 3)");
    });
  });
});
