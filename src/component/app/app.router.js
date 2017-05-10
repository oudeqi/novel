;(function(){

    'use strict';

    angular.module('app')
    .config(routerConfig);
    routerConfig.$inject = ['$stateProvider','$urlRouterProvider'];
    function routerConfig($stateProvider,$urlRouterProvider){

        $urlRouterProvider.otherwise("/home");

        $stateProvider.state({
            abstract: true,
            name: "warpper",
            // url: "/w",
            templateUrl: './component/warpper/warpper.html',
        });

        $stateProvider.state({
            name: "warpper.login",
            url: "^/login",
            views: {
                'header': {
                    templateUrl: './component/header/header.html'
                },
                'body': {
                    templateUrl: './component/login/login.html'
                }
            }
        });

        $stateProvider.state({
            abstract: true,
            name: "warpper.views",
            // url: "/v",
            views: {
                'header': {
                    templateUrl: './component/header/header.html'
                },
                'body': {
                    templateUrl: './component/body/body.html'
                }
            }
        });

        $stateProvider.state({
            abstract: true,
            name: "warpper.views.section",
            // url: "/s",
            views: {
                'aside': {
                    templateUrl: './component/aside/aside.html'
                },
                 'section': {
                    templateUrl: './component/section/section.html'
                }
            }
        });

        $stateProvider.state({
            name: "warpper.views.section.home",
            url: "^/home",
            templateUrl: './component/home/home.html'
        });
    }

})();
