;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
            $stateProvider.state({
                name: 'warpper.views.section.agentedit',
                url: '^/agent_edit',
                templateUrl: './component/agent/agent.edit.html'
            });

        }
    ]);

})();
