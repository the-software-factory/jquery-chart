describe("JS Chart test suite", function() {

    // Fixtures
    var _chartFixture = "<div class='chart_container' style='width: 300px; height: 300px'></div>";

    var _stackedBarsChartDataset = [
        { value: 100, color: "#5AD3D1" },
        { value: 75, color: "#FF5A5E" },
        { value: 50, color: "#FFC870" },
    ];

    beforeEach(function() {
        $("body").empty();
        $("body").append(_chartFixture);
    });

    it("fires and exception if data supplied is not an array", function() {
        expect(function() {
            Chart.stackedBars("#barsContainer", {});
        }).toThrow();
    });

    it("fires and exception if supplied data array is empty", function() {
        expect(function() {
            Chart.stackedBars("#barsContainer", []);
        }).toThrow();
    });
});
