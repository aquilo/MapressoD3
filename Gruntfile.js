module.exports = function(grunt) {

    // Initialize the grunt configuration
    grunt.initConfig({
        // Import the package configuration
        pkg: grunt.file.readJSON('package.json'),

        // Configure the concat task
        concat: {
            js: {
                src: [
                    'src/start.js',
                    'src/svg/svg.js',
                    'src/svg/transform.js',
                    'src/map/map.js',
                    'src/map/mapresso.js',
                    'src/end.js'
                ],
                dest: 'mapressod3.js'
            }
        },

        // Uglify Configuration
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    'mapressod3.min.js': ['mapressod3.js']
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'src/map/*.js',
                'src/svg/*.js',
                'src/layout/*.js',
                'test/*.js',
                'test/*/*.js'
            ]
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: '',
                    ext: '.min.css'
                }]
            }
        }
    });

    // Enable the grunt plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-vows");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // Register Tasks

    // Test Task
    grunt.registerTask('test', ['jshint', 'concat']);
 //   grunt.registerTask('test', ['jshint', 'concat', 'vows']);
    grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'cssmin']);
//    grunt.registerTask('build', ['jshint', 'vows', 'concat', 'uglify']);
    grunt.registerTask('default', ['build']);

};