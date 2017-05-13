;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    title:'',
                    name:''
                },
                name: 'warpper.views.section.promletters',
                url: '^/nls/{id}/{chapterid}/',
                templateUrl: './component/promotion-letters/promotion-letters.html'
            });

        }
    ]);

})();
