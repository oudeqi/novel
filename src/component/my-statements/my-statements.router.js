;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    name:''
                },
                name: 'warpper.views.section.myStatements',
                url: '^/ms',
                templateUrl: './component/my-statements/my-statements.html'
            });

        }
    ]);

})();
