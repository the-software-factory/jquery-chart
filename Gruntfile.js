var execSync = require('child_process').execSync;

// Defines build process
module.exports = function(grunt) {

  grunt.initConfig({
    cssmin: {
      style: {
        options: {
          shorthandCompacting: false,
          roundingPrecision: -1,
          keepSpecialComments: 0
        },
        files: { 'dist/chart.min.css': 'src/chart.css' }
      }
    },
    usebanner: {
      banner: {
        options: {
          position: 'top',
          linebreak: true,
          process: function() {
            var latestTag = execSync("git describe --tags").toString().split('-')[0].replace("\n", "");
            var firstYear = "2015";
            var lastYear = execSync("git log --format='%ai' | head -n 1").toString().split('-')[0];

            return "/*\n" +
              " * JS Chart v" + latestTag + " (https://github.com/the-software-factory/js-chart)\n" +
              " * Copyright " + ((firstYear === lastYear) ? firstYear : (firstYear + "-" + lastYear)) + " Vendini srl\n" +
              " * Licensed under MIT (https://github.com/the-software-factory/js-chart/blob/master/LICENSE.md)\n" +
              " */";
            }
          },
          files: {
              src: ['dist/chart.min.css', 'dist/chart.min.js']
          }
      }
    },
    devserver: {
      options: {
        port: '9001',
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
          'dist/chart.min.js': ['bower_components/Chart.js/Chart.min.js', 'src/chart.js']
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
        transform: function(commit, cb) {
          // Link commit hash to commit page on GitHub
          commit.shortDesc += " [" + commit.hash.slice(0, 7) +
          "](https://github.com/the-software-factory/js-chart/commit/" + commit.hash + ")";
          // Remove the short hash (as we added one in the link)
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

  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'usebanner']);
  grunt.registerTask('development', ['default', 'devserver', 'watch']);
  grunt.registerTask("changelog", ["emptyTheChangelog", "conventionalChangelog", "changelogCommit"]);
};
