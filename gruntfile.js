module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({

    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // target.css file: source.less file
          "public/css/styles.css": "public/less/style.less"
        }
      }
    },

    watch: {
      styles: {
        files: ['public/less/**/*.less'], // which files to watch
        tasks: [ 'less' ],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask( 'build', [ 'less' ] );
  grunt.registerTask( 'default', [ 'build', 'watch' ] );
};