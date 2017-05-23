;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    name:''
                },
                name: 'warpper.views.section.agentStatements',
                url: '^/as',
                templateUrl: './component/agent-statements/agent-statements.html'
            });

        }
    ]);

})();
