;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
    
            $urlRouterProvider.otherwise("/home");

            $stateProvider.state({
                abstract: true,
                name: "warpper.views",
                // url: "/v",
                views: {
                    'header': {
                        templateUrl: './component/header/header.html'
                    },
                    'body': {
                        templateUrl: './component/body/body.html',
                    }
                }
            });

        }
    ]);

})();
