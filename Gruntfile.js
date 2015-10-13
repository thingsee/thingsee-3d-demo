module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {

      },
      dist: {
        options: {
          //outputStyle: 'compressed'
        },
        files: {
          'style/site.css': 'style/main.scss'
        }
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },
      sass: {
        files: ['style/main.scss'],
        tasks: ['sass']
      }
    },

    clean: ['dist'],

    copy: {
      main: {
        files: [
          { expand: true, cwd:'.', src:['style/site.css'], dest:'dist' },
          { expand: true, cwd:'.', src:['fonts/*'], dest:'dist' },
          { expand: true, cwd:'.', src:['images/*'], dest:'dist' },
          { expand: true, cwd:'.', src:['objects/*'], dest:'dist' },
          { expand: true, cwd:'.', src:['lib/jquery-2.1.1.min.js'], dest:'dist'},
          { expand: true, cwd:'.', src:['lib/lodash.min.js'], dest:'dist'},
          { expand: true, cwd:'.', src:['lib/TweenMax.min.js'], dest:'dist'},
          { expand: true, cwd:'.', src:['lib/OBJLoader.js'], dest:'dist'},
          { expand: true, cwd:'.', src:['lib/skynet.js'], dest:'dist'},
          { expand: true, cwd:'.', src:['lib/three.min.js'], dest:'dist'}
        ]
      }
    },

    uglify: {
      build: {
        files: {
          'dist/script.min.js': ['script.js']
        }
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: /script.js/g,
              replacement: 'script.min.js'
            }
          ]
        },
        files: [
          { expand: true, flatten: true, src: ['index.html'], dest: 'dist/' }
        ]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    }

  });

  //grunt.loadNpmTasks('grunt-sass');
  //grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass','watch']);
  grunt.registerTask('dist', ['clean', 'sass', 'copy', 'replace', 'htmlmin', 'uglify']);
}
