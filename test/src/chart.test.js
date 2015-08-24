describe("JS Chart test suite", function() {

  // Fixtures
  var _chartFixture = "<div id='chart' style='width: 300px; height: 300px'></div>";

  var _stackedBarsChartDataset = [
    { value: 100, color: "#5AD3D1" },
    { value: 50, color: "#FF5A5E" },
    { value: 50, color: "#FFC870" },
  ];

  var _stackedBarsChartOptions = {
    type: "stacked-bar",
    animationTime: 100
  };

  beforeEach(function() {
    $("body").empty();
    $("body").append(_chartFixture);
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

  it("stacked bars chart has right number of child divs", function() {
    $("#chart").chart(_stackedBarsChartDataset, _stackedBarsChartOptions);

    expect($("#chart > div").length).toBe(_stackedBarsChartDataset.length);
  });

  it("stacked bars have their parent's height", function() {
    var container = $("#chart").chart(_stackedBarsChartDataset, _stackedBarsChartOptions);
    var rightHeight = true;

    $("#chart > div").each(function() {
      if ($(this).height() !== container.height()) {
        rightHeight = false;
      }
    });

    expect(rightHeight).toBeTruthy();
  });

  it("stacked bars of the chart with no total value specified have the right widths", function(done) {
    $("#chart").chart(_stackedBarsChartDataset, _stackedBarsChartOptions);

    setTimeout(function() {
      var match = true;
      var totalWidth = 0;

      _stackedBarsChartDataset.forEach(function(item) {
        totalWidth += item.value;
      });

      for (var index in _stackedBarsChartDataset) {
        if ((_stackedBarsChartDataset[index].value / totalWidth * 100) !==
            ($("#chart > div").eq(index).width() / $("#chart").width() * 100)) {
          match = false;
        }
      }

      expect(match).toBeTruthy();
      done();
    }, _stackedBarsChartOptions.animationTime + 10);
  });
});
