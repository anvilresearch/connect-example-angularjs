// Generated on 2014-06-19 using generator-angular 0.9.0-1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var modRewrite = require('connect-modrewrite');

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  var authConfig =
    grunt.option('auth-client') ||
    process.env.GRUNT_AUTH_CLIENT ||
    'authconf.json';
  grunt.log.writeln("Using %s", authConfig);
  var authConfigData = grunt.file.readJSON(authConfig);

  // Define the configuration for all the tasks
  // note this will overwrite previous grunt.config properties
  // with the object literal passed into the function
  grunt.initConfig({
    // Project settings
    yeoman: appConfig,

    auth_config: authConfig,

    auth_config_data: authConfigData,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/{,*/}*.js',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['newer:copy']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: "<%= auth_config_data.APP_PORT %>", // may need to convert to number?
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '<%= auth_config_data.APP_HOST %>',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            'dist/app'
          ],
          middleware: function (connect, options) {
            var middlewares = [];
            middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]']));
            middlewares.push(connect().use(
              '/bower_components',
              connect.static('./bower_components')
            ));
            options.base.forEach(function (base) {
              return middlewares.push(connect['static'](base));
            });
            return middlewares;
          }
        }
      },
    },

    // Empties folders to start fresh
    clean: {
      server: {
          files: [{
            src: ['.tmp', 'dist']
          }]
      }
    },


    // Copies remaining files to places other tasks can use
    copy: {
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      },
      dist: {
        expand: true,
        dest: 'dist',
        src: [
          'register_with_anvil_connect.sh',
          '<%= yeoman.app %>/**'],
        options: {
          process: function( content, srcpath) {
            return grunt.template.process(
              content,
              {data: authConfigData});
          },
        },
      },
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles',
        'copy:dist',
      ]
    },

  });

  grunt.registerTask('chmodScript', 'Makes script executable', function(target) {
    var fs = require('fs');
    fs.chmodSync('dist/register_with_anvil_connect.sh', '755');
  });

  grunt.registerTask('build', function (target) {
    grunt.log.writeln('Build app in dist folder, matching auth server configuration in %s', grunt.config('auth_config'));
    grunt.log.writeln('If not yet done register client using dist/register_with_anvil_connect.sh. See README.md');
    grunt.task.run([
      'clean',
      'copy:dist',
      'chmodScript',
    ]);
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'connect:livereload',
      'watch'
    ]);
  });


};
