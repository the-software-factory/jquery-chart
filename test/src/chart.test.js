describe("JS Chart test suite", function() {

    // Fixtures
    var _pieChartFixture = "<div id='pieContainer' style='width: 500px; height: 500px'></div>";
    var _stackedBarsChartFixture = "<div id='barsContainer' style='width: 700px; height: 30px;'></div>";

    var _stackedBarsChartDataset = [
        { value: 100, color: "#5AD3D1" },
        { value: 75, color: "#FF5A5E" },
        { value: 50, color: "#FFC870" },
    ];

    beforeEach(function() {
        $("body").empty();
        $("body").append(_pieChartFixture);
        $("body").append(_stackedBarsChartFixture);
    });

    it("fires an exception if an invalid selector was supplied", function() {
        expect(function() {
            Chart.stackedBars(123);
        }).toThrow();
    });

    it("fires and exception if data supplied is not an array", function() {
        expect(function() {
            Chart.stackedBars("#barsContainer", {});
        }).toThrow();
    });

    it("fires an exception if custom options are not an object", function() {
            expect(function() {
                Chart.stackedBars("#barsContainer", [], 123);
            }).toThrow();
    });
});
