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
                name: 'warpper.views.section.chapter',
                url: '^/nls/{id}/{chapterid}',
                templateUrl: './component/chapter/chapter.html'
            });

        }
    ]);

})();