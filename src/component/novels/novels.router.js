;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){

            // $urlRouterProvider.when('/s', '^/nls');
            $stateProvider.state({
                name: 'warpper.views.section.novels',
                url: '^/nls',
                templateUrl: './component/novels/novels.html'
            });

        }
    ]);

})();
