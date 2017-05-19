;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.promlink',
                url: '^/nls/{id}/{chapterid}/lt/{link}',
                templateUrl: './component/promotion-link/promotion-link.html'
            });

        }
    ]);

})();
