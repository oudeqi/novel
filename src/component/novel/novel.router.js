;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    title:''
                },
                name: 'warpper.views.section.novel',
                url: '^/nls/{id}',
                templateUrl: './component/novel/novel.html'
            });

        }
    ]);

})();
