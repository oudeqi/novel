;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
            $stateProvider.state({
                name: 'warpper.views.section.agenteditx',
                url: '^/agent_editx',
                templateUrl: './component/agent/agent.editx.html'
            });

        }
    ]);

})();
