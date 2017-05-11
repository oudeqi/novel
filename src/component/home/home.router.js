;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: "warpper.views.section.home",
                url: "^/home",
                templateUrl: './component/home/home.html'
            });

        }
    ]);

})();
