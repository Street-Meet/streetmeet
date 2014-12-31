// Karma configuration
// Generated on Wed Dec 17 2014 13:49:54 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
        'streetMeet/www/lib/ionic/js/ionic.bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.7/angular-cookies.js',
        'https://cdn.firebase.com/js/client/2.0.4/firebase.js',
        'https://cdn.firebase.com/libs/angularfire/0.9.0/angularfire.min.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'www/lib/ngCordova/dist/ng-cordova.js',
        'streetMeet/www/js/app.js',
        'streetMeet/www/js/createEvent.js',
        'streetMeet/www/js/currentUser.js',
        'streetMeet/www/js/joinEvent.js',
        'streetMeet/www/js/login.js',
        'streetMeet/www/js/userInterfaceController.js',
        'streetMeet/www/js/map.js',
        'spec/*.js'
    ],

    // list of files to exclude
    exclude: [
        'karma.conf.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
