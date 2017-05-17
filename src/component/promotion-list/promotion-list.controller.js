;(function(){
    'use strict';
    angular.module('app').controller('promotion-list',['$scope','$http',
        function($scope,$http){

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.pageCount = 0;//总页数
            $scope.list = [];

            $http.get('/v1/aut/publish/link',{
                params:{
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage,
                }
            }).then(function(res){
                console.log('推广链接列表',res);
                if(!res.data.errMessage){
                    $scope.list = res.data.data.data;
                    $scope.totalItems = res.data.data.rowCount;
                    $scope.pageCount = res.data.data.pageCount;
                    $scope.currentPage = res.data.data.pageIndex++;
                }else{

                }
            }).catch(function(res){

            });






        }
    ]);
})();
