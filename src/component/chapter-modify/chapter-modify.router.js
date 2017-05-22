;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    name:''
                },
                name: 'warpper.views.section.chapterModify',
                url: '^/nls/{id}/ca/{chapterid}',
                templateUrl: './component/chapter-modify/chapter-modify.html'
            });

        }
    ]);

})();
