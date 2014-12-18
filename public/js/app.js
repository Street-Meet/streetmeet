var meetApp = angular.module('sm-meetApp',
    [
        'ui.router';
    ])
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('login', {
                    url: 'login',
                    template: 'views/login.html',
                    controller: ''
                })
                .state('createEvent', {
                    url: 'createEvent',
                    template: 'views/createEvent.html',
                    controller: ''
                })
                .state('joinEvent', {
                    url: 'joinEvent',
                    template: 'views/joinEvent.html',
                    controller: ''
                })
        });