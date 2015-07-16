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
  var serveStatic = require('serve-static');

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
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
    // to rebundle browserify bundle use watchify of npm...
    watch: {
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          'app/{,*/}*.html',
          'app/styles/{,*/}*.css',
          'app/scripts/{,*/}*.js'
        ],
        tasks: ['newer:copy:browser']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: "<%= auth_config_data.APP_PORT %>", // may need to convert to number?
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '<%= auth_config_data.APP_HOST %>',
        open: false,
        base: [
          'app.browser'
        ],
        middleware: function (connect, options) {
          var middlewares = [];
          middlewares.push(connect().use(
              '/node_modules',
              serveStatic('./node_modules')
          ));
          middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]']));
          middlewares.push(connect().use(
              '/bower_components',
              serveStatic('./bower_components')
          ));
          options.base.forEach(function (base) {
            return middlewares.push(serveStatic(base));
          });
          return middlewares;
        },
      },
      livereload: {
        options: {
          open: true,
        }
      },
      dist: {
        options: {
          livereload: false,
          base: [
            'dist'
          ],
          keepalive: true,

        }
      },
    },

    // Empties folders to start fresh
    clean: {
      browser: {
          files: [{
            src: ['app.browser']
          }]
      },
      dist: {
        files: [{
          src: ['dist']
        }]
      }
    },


    // Copies remaining files to places other tasks can use
    copy: {
      styles: {
        expand: true,
        cwd: 'app/styles',
        src: '{,*/}*.css'
      },
      browser: {
        options: {
          process: function (content, srcpath) {
            return grunt.template.process(
                content,
                {data: authConfigData});
          },
        },
        expand: true,
        cwd: 'app',
        dest: 'app.browser',
        src: ['**/*'],
      },
      browserscript: {
        dest: 'app.browser/',
        src: ['register_with_anvil_connect.sh'],
        options: {
          process: function (content, srcpath) {
            return grunt.template.process(
                content,
                {data: authConfigData});
          },
        },
      },
      dist: {
        expand: true,
        cwd: 'app.browser',
        dest: 'dist',
        src: ['**/*'],
      },
    },

    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        }
      },
      // having lib and and browser to split bundles does not
      // seem to buy much if one can use watchify also
      //lib: {
      //  options: {
      //    alias: [
      //      'angular:',
      //      'angular-animate:',
      //      'angular-cookies:',
      //      'angular-resource:',
      //      'angular-route:',
      //      'angular-sanitize:',
      //      'angular-touch:',
      //      'bows:'
      //    ]
      //  },
      //  src: ['.'],
      //  dest: 'app.browser/scripts/dev-vendor-bundle.js'
      //},
      browser: {
        //options: {
        //  external: [
        //    'angular',
        //    'angular-animate',
        //    'angular-cookies',
        //    'angular-resource',
        //    'angular-route',
        //    'angular-sanitize',
        //    'angular-touch',
        //    'bows'
        //  ]
        //},
        files: {
          'app.browser/scripts/dev-bundle.js':
            ['app.browser/scripts/app.js'],
          'app.browser/scripts/rp-dev-bundle.js':
            ['app.browser/scripts/rp.js']
        }
      },
      dist: {
        options: {
          browserifyOptions: {
            debug: false
          }
        },
        files: {
          'dist/scripts/app-bundle.js': ['dist/scripts/app.js'],
          'dist/scripts/rp-bundle.js': ['dist/scripts/rp.js']
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'dist/scripts/app-bundle.min.js': [
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/json3/lib/json3.min.js',
            'bower_components/promiz/promiz.js',
            'bower_components/webcrypto-shim/webcrypto-shim.js',
            'node_modules/text-encoder-lite/index.js',
            'dist/scripts/app-bundle.js'
          ],
          'dist/scripts/rp-bundle.min.js': [
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/json3/lib/json3.min.js',
            'bower_components/promiz/promiz.js',
            'bower_components/webcrypto-shim/webcrypto-shim.js',
            'node_modules/text-encoder-lite/index.js',
            'dist/scripts/rp-bundle.js'
          ]

        }
      }
    },

    processhtml: {
      dist: {
        files: {
          'dist/index.html': ['app.browser/index.html'],
          'dist/rp.html': ['app.browser/rp.html']
        }
      }
    }
  });

  grunt.registerTask('chmodScript', 'Makes script executable', function(target) {
    var fs = require('fs');
    fs.chmodSync('app.browser/register_with_anvil_connect.sh', '755');
  });


  grunt.registerTask('build_browser', function (target) {
    grunt.log.writeln('Build app in app.browser folder, matching auth server configuration in %s', grunt.config('auth_config'));
    grunt.log.writeln('If not yet done register client using app.browser/register_with_anvil_connect.sh. See README.md');
    grunt.task.run([
      'clean:browser',
      'copy:browser',
      'browserify:browser',
      'copy:browserscript',
      'chmodScript',
    ]);
  });

  grunt.registerTask('build', function (target) {
    grunt.log.writeln('Build app in dist folder, matching auth server configuration in %s', grunt.config('auth_config'));
    grunt.log.writeln('If not yet done register client using dist/register_with_anvil_connect.sh. See README.md');
    grunt.task.run([
      'build_browser',
      'clean:dist',
      'copy:dist',
      'browserify:dist',
      'uglify:dist',
      'processhtml:dist',
      'chmodScript',
    ]);
  });

  grunt.registerTask('serve_dist', 'serve already build files from dist', function (target) {
    grunt.task.run([
      'connect:dist'
    ]);
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist']);
    }

    grunt.task.run([
        'build_browser',
        'connect:livereload',
        'watch'
      ]);
  });


};
