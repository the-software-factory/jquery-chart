# JS Chart
This library provides some custom Chart.JS charts along with some custom charts built from the ground.

## Installation
You'll need [bower](http://bower.io/) to install JS Chart library and its dependencies.
Install the library and save it as a dependency in your project:
```sh
$ bower --save install https://github.com/the-software-factory/js-chart.git
```

## Usage
To use the library you should first include it in your project, define an element that will host the chart,
for example a `<div></div>`, and set its width and height.

```html
<div id="container1" style="width: 500px; height: 500px"></div>
```

Then you should prepare an array of objects holding chart data you want to visualize and a configuration
object holding eventual custom chart settings.

JS Chart provides 2 kinds of charts:

### A Pie Chart
A Pie Chart is created like this:

`Chart.pie(selector, data, options, innerText)`

where

#### selector
* Type: `valid jQuery selector`
* Mandatory: `YES`
* Description: A selector for the element that will host the chart, for example: `#container1`

#### data
* Type: `Array`
* Mandatory: `YES`
* Description: An array of objects holding data for each chart area, for example:
```
[
    {
      value: 300,
      color: "#F7464A",
      highlight: "#FF5A5E",
      label: "Red"
    },
    {
      value: 20,
      color: "#46BFBD",
      highlight: "#5AD3D1",
      label: "Green"
    }
]
```

#### options
* Type: `Object`
* Mandatory: `NO`
* Description: An object with custom chart settings that will overwrite the default ones.
The available options are:
    - tooltipTemplate {string}, default: `<%= value %>`
    - onAnimationComplete {function}, default:
        ```
        function() {
          this.showTooltip(this.segments, true);
        }
        ```
    - tooltipEvents {Array}, default: `[]`
    - showTooltips {boolean}, default: `true`
    - percentageInnerCutout {number}, default: `60`
    - animationEasing {string}, default: `linear`
    - animationSteps {number}, default: `20`
    - tooltipRadialShift {number}, default: `100`

#### innerText
* Type: `stirng`
* Mandatory: `NO`
* Description: If defined, the innerText will be placed inside the Pie Chart

Example usage:
```js
    Chart.pie('#container1', [{
      value: 300,
      color: "#F7464A",
      highlight: "#FF5A5E",
      label: "Red"
    }, {
      value: 20,
      color: "#46BFBD",
      highlight: "#5AD3D1",
      label: "Green"
    }],
        {
          tooltipRadialShift: 140
        },
    'some text and not only'
    );
```

### A Stacked Bars Chart
A Stacked Bar Chart is created like this:

`Chart.stackedBars(selector, data, options)`

where

#### selector
* Type: `valid jQuery selector`
* Mandatory: `YES`
* Description: A selector for the element that will host the chart, for example: `#container1`

#### data
* Type: `Array`
* Mandatory: `YES`
* Description: An array of objects holding data for each chart area, for example:
```
[
    { value: 100, color: "#5AD3D1" },
    { value: 75, color: "#FF5A5E" },
    { value: 50, color: "#FFC870" },
    { value: 333, color: "#abc123" }
]
```

#### options
* Type: `Object`
* Mandatory: `YES`
* Description: An object with custom chart settings that will overwrite the default ones.
The available options are:
    - total {number}
    Total bar length. If not specified, it will be calculated as a sum of bar sections provided in the data array
    - height {number}
    Bar height. If not specified, will assume the value of the container specified in the selector
    - animationTime {number}, default: 400
    Total animation time. If not specified, will assume the default value of 400

Example usage:
```js
    Chart.stackedBars(
        "#container4",
        [
            { value: 100, color: "#5AD3D1" },
            { value: 75, color: "#FF5A5E" },
            { value: 50, color: "#FFC870" },
            { value: 333, color: "#abc123" }
        ],
        {
            total: 1000,
            height: 30,
            animationTime: 750
        }
    );
```

## Development
The project has the following structure:
```
dist/
    *.min.js // The uglified version of source JS files
    *.min.css // The minified version of th esource CSS files
src/
    *.js // Source JS files
    *.css // Source CSS files
test/
    ... // Contains all tests and all needed file to set up a tests environment.
    *.test.js // All tests need to have the "test" suffix before the extension.
...
```

### Installation
This project requires [node](https://nodejs.org/) for the development installation so you can
install its dependencies, build it and test it.

Please run following commands to install all dependencies:
```sh
$ npm install
$ ./node_modules/bower/bin/bower install
$ cd test && npm install
```

### Grunt Tasks
Here is a list of grunt `tasks` => `actions` mappings, see below for a deeper explanation of the actions.

|   *Grunt task*    | *jshint* | *uglify* | *cssmin* | *usebanner* | *devserver* | *watch* | *emptyTheChangelog* | *conventionalChangelog* | *changelogCommit* |
|-------------------|:--------:|:--------:|:--------:|:-----------:|:-----------:|:-------:|:-------------------:|:-----------------------:|:-----------------:|
|      grunt        |    *     |    *     |    *     |      *      |             |         |                     |                         |                   |
| grunt development |    *     |    *     |    *     |      *      |      *      |    *    |                     |                         |                   |
| grunt changelog   |          |          |          |             |             |         |          *          |           *             |         *         |

* *jshint*: Validate files with JSHint
* *uglify*: Create the final \*.min.js
* *cssmin*: Creates the final \*.min.css
* *usebanner*: Prepends a banner to the minified file
* *devserver*: Spawns a web server so you can rapidly test your app in action
* *watch*: Run default task when src or test files are added, changed or deleted
* *emptyTheChangelog*: Truncates the CHANGELOG.md file as conventionalChangelog task will append fully regenerated changelog
* *conventionalChangelog*: Appends Markdown-formatted changelog history to CHANGELOG.md
* *changelogCommit*: Prepares a new commit with updated CHANGELOG.md and commit message "CHANGELOG.md Updated"

## Tests
Take a look at [`test/README.md`](test/README.md) for more details.

## Contributing
Take a look at [`CONTRIBUTING.md`](CONTRIBUTING.md) for more details.
