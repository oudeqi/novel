;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.noveladd',
                url: '^/na',
                templateUrl: './component/novel-add/novel-add.html'
            });

        }
    ]);

})();
