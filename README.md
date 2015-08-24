# jQuery Chart
This library is a customization of ChartJS. Furthermore it provides other charts that are missing in ChartJS.

## Installation
You'll need [bower](http://bower.io/) to install jQuery Chart library.
Install the library and save it as a dependency in your project:
```sh
$ bower --save install https://github.com/the-software-factory/js-chart.git
```

## Usage
To use the library you should first include it in your project, define an element that will host the chart and set its
width and height if needed.

NOTE: Its width and height can be also set through a CSS class or inline.

```html
<div id="container1" style="width: 500px; height: 500px"></div>
```

Then you should prepare an array of objects holding chart data you want to visualize and a configuration
object holding eventual custom chart settings.

JS Chart provides 2 kinds of charts:

### A Pie Chart
A Pie Chart is created like this:

`$(selector).chart(data, options)`

where

`data.type = 'pie'` and

#### selector
* Type: `valid jQuery selector`
* Mandatory: `YES`
* Description: A selector for the element that will host the chart, for example: `#container1`

#### data
* Type: `Array`
* Mandatory: `NO`
* Description: An array of objects holding data for each chart area, for example:
```
[
    {
      value: 300,
      color: "#F7464A"
    },
    {
      value: 20,
      color: "#46BFBD"
    }
]
```

#### options
* Type: `Object`
* Mandatory: `NO`
* Description: An object with custom chart settings that will overwrite the default ones.
The available options are:
    - animationTime {number}, default: `300`,
    - animationEasing {string}, default: `linear`,
	- innerTextTemplate {string}, default: ``,
	- showTooltips {boolean}, default: `true`,
	- tooltipTemplate {string}, default: `<%= value %>`

#### innerText
* Type: `stirng`
* Mandatory: `NO`
* Description: If defined, the innerText will be placed inside the Pie Chart

Example usage:
```js
    $(selector).chart(
      [{
        value: 300,
        color: "#F7464A"
      }, {
        value: 20,
        color: "#46BFBD"
      }],
      {
      	type: 'pie',
        animationTime: 1000
      }
    );
```

### A Stacked Bar Chart
A Stacked Bar Chart is created like this:

`$(selector).chart(data, options)`

where

`data.type = 'pie'` and

#### selector
* Type: `valid jQuery selector`
* Mandatory: `YES`
* Description: A selector for the element that will host the chart, for example: `#container1`

#### data
* Type: `Array`
* Mandatory: `NO`
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
* Mandatory: `NO`
* Description: An object with custom chart settings that will overwrite the default ones.
The available options are:
    - animationTime {number}, default: `300`,
	- animationEasing {string}, default: `linear`,
	- innerTextTemplate {string}, default: ``,
	- showTooltips {boolean}, default: `true`,
	- tooltipTemplate {string}, default: `<%= value %>`

Example usage:
```js
    $(selector).chart(
	  [{
        value: 300,
        color: "#F7464A"
      }, {
        value: 20,
        color: "#46BFBD"
      }],
      {
       	type: 'stacked-bar',
        animationTime: 1000
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
