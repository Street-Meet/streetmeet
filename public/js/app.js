var meetApp = angular.module('sm-meetApp',
    [
        'ui.router',
        'firebase',
        'sm-meetApp.login'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/login.html',
                    controller: 'LoginCtrl'
                })
                .state('index', {
                    url: '/index',
                    templateUrl: 'views/index.html',
                    controller: ''
                })
                .state('createEvent', {
                    url: '/createEvent',
                    templateUrl: 'views/createEvent.html',
                    controller: ''
                })
                .state('joinEvent', {
                    url: '/joinEvent',
                    templateUrl: 'views/joinEvent.html',
                    controller: ''
                });
        });