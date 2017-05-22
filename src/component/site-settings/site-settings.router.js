;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.siteset',
                url: '^/ss',
                templateUrl: './component/site-settings/site-settings.html'
            });

        }
    ]);

})();
