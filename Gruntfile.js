
module.exports = function(grunt) {
 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');

    var gruntConfig = {

        watch: {
            py: {
                files: ['*/*.py', '**/*.py'],
                tasks: ['shell']
            }
        },
        shell: {
            options: {
                stderr: false
            },
            target: {
                command: 'touch reload'
            }
        }
    };

    /**
     * I moved all of the config items out of grunt.initConfig()
     * this way we can add stuff dynamically,
     * like the above gruntConfig.uglify.dist.files
     * if we need to.
     */
    grunt.initConfig(gruntConfig); 

    //grunt tasks
    grunt.registerTask('monitorpy', 'watch:py');
};