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
        files: ['src/**/*'],
        tasks: ['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-devserver');

  grunt.registerTask('start', ['default', 'devserver', 'watch']);
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);
};
