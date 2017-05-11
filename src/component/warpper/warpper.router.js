;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){

            $stateProvider.state({
                abstract: true,
                name: "warpper",
                // url: "/w",
                templateUrl: './component/warpper/warpper.html',
            });

        }
    ]);

})();
