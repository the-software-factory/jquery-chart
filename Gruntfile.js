var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var fs = require('fs');

// Defines build process
module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  var cssFiles = [
    'src/chart.css'
  ];
  var jsFiles = [
    'bower_components/Chart.js/Chart.js',
    'bower_components/jquery.boxfit/dist/jquery.boxfit.js',
    'src/chart.js'
  ];

  grunt.initConfig({
    concat: {
      css: {
        src: cssFiles,
        dest: 'dist/chart.css'
      },
      js: {
        src: jsFiles,
        dest: 'dist/chart.js'
      }
    },
    cssmin: {
      style: {
        options: {
          shorthandCompacting: false,
          roundingPrecision: -1,
          keepSpecialComments: 0
        },
        files: { 'dist/chart.min.css': cssFiles }
      }
    },
    usebanner: {
      banner: {
        options: {
          position: 'top',
          linebreak: true,
          process: function() {
            var firstYear = "2015";
            var lastYear = execSync("git log --format='%ai' | head -n 1").toString().split('-')[0];

            return "/*\n" +
              " * JS Chart v" + pkg.version + " (https://github.com/the-software-factory/js-chart)\n" +
              " * Copyright " + ((firstYear === lastYear) ? firstYear : (firstYear + "-" + lastYear)) + " The Software Factory\n" +
              " * Licensed under MIT (https://github.com/the-software-factory/js-chart/blob/master/LICENSE.md)\n" +
              " */";
            }
          },
          files: {
              src: ['dist/chart.min.css', 'dist/chart.css', 'dist/chart.min.js', 'dist/chart.js']
          }
      }
    },
    devserver: {
      options: {
        port: '9090',
        base: './',
        cache: "no-store",
        async: false
      },
      server: {}
    },
    jshint: {
      options: {
        multistr: true
      },
      all: ['Gruntfile.js', 'src/**/*.js', 'test/*.js', 'test/src/**/*.js']
    },
    uglify: {
      minification: {
        files: {
          'dist/chart.min.js': jsFiles
        }
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*', 'test/**/*.js'],
        tasks: ['default']
      }
    },
    conventionalChangelog: {
      options: {
        changelogOpts: {
          preset: 'jshint',
          releaseCount: 0,
          transform: function(commit, cb) {
            if (typeof commit.gitTags === 'string') {
              var rtag = /tag:\s*[v=]?(.+?)[,\)]/gi;
              var match = rtag.exec(commit.gitTags);
              rtag.lastIndex = 0;

              if (match) {
                commit.version = match[1];
              }
            }

            commit.shortDesc += " [" + commit.hash.slice(0, 7) +
            "](https://github.com/the-software-factory/jquery-chart/commit/" + commit.hash + ")";
            delete commit.hash;

            cb(null, commit);
          }
        }
      },
      release: {
        src: 'CHANGELOG.md'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-devserver');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  grunt.registerTask("emptyTheChangelog", function() {
    fs.truncateSync(grunt.config.get("conventionalChangelog.release.src"), 0);
  });

  grunt.registerTask("changelogCommit", function() {
    var done = this.async();

    var gitAdder = exec('git add CHANGELOG.md');

    gitAdder.on("exit", function(exitCode) {
      if (exitCode !== 0) {
        grunt.fail.fatal("changelogCommit task couldn't exec git add command");
      }

      var gitCommitter = exec('git commit -m "CHANGELOG.md Updated"');

      gitCommitter.on("exit", function(exitCode) {
        if (exitCode !== 0) {
          grunt.fail.fatal("changelogCommit task couldn't exec git commit command");
        }

        grunt.log.ok("Changelog commit is ready");
          done();
      });
    });
  });

  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'concat', 'usebanner']);
  grunt.registerTask('development', ['default', 'devserver', 'watch']);
  grunt.registerTask("changelog", ["emptyTheChangelog", "conventionalChangelog", "changelogCommit"]);
};
