;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
            $stateProvider.state({
                name: 'warpper.views.section.agent',
                url: '^/agent',
                templateUrl: './component/agent/agent.html'
            });

        }
    ]);

})();
