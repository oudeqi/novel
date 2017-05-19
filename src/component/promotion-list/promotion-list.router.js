;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.promolist',
                url: '^/pl',
                templateUrl: './component/promotion-list/promotion-list.html'
            });

        }
    ]);

})();
