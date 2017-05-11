;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){

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

        }
    ]);

})();
