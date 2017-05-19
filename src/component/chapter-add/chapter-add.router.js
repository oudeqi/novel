;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    name:''
                },
                name: 'warpper.views.section.chapterAdd',
                url: '^/nls/{id}/ca',
                templateUrl: './component/chapter-add/chapter-add.html'
            });

        }
    ]);

})();
