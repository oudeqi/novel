;(function(){
    'use strict';
    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.video',
                url: '^/v',
                templateUrl: './component/video/video.html'
            });

        }
    ]);
    angular.module('app').controller('video',['$scope','$http',
        function($scope,$http){

        }
    ]);
})();
