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
    angular.module('app').controller('video',['$scope','$http','localStorageService',
        function($scope,$http,localStorageService){
            var level = localStorageService.get('level');
            if(level == 1 || level == 2){
                $scope.videoUrl = 'http://cdn.2tai.net/book/jiaocheng2ji.mp4';
            }else{
                $scope.videoUrl = 'http://cdn.2tai.net/book/jiaocheng3ji.mp4';
            }
        }
    ]);
})();
