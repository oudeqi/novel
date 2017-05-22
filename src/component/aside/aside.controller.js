;(function(){
    'use strict';
    angular.module('app').controller('aside',['$scope','$http','$state','localStorageService',
        function($scope,$http,$state,localStorageService){

            $scope.level = localStorageService.get('level');

            console.log('权限',$scope.level);



        }
    ]);
})();
