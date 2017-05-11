;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){

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

        }
    ]);

})();
