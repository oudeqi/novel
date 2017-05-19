;(function(){
    'use strict';
    angular.module('app').controller('novel',['$scope','$http','$state',
        function($scope,$http,$state){

            $scope.id = $state.params.id;
            $scope.novel = {};
            $scope.novel.name = $state.params.name;

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 20;
            $scope.pageCount = 0;//总页数
            $scope.list = [];

            $scope.getList = function(){
                $http.get('/v1/backend/book/chapter',{
                    params:{
                        id:$scope.id,
                        pageSize:$scope.pageSize,
                        pageIndex:$scope.currentPage,
                    }
                }).then(function(res){
                    console.log('章节列表',res);
                    if(!res.data.errMessage){
                        $scope.list = res.data.data.data;
                        $scope.totalItems = res.data.data.rowCount;
                        $scope.pageCount = res.data.data.pageCount;
                        $scope.currentPage = res.data.data.pageIndex;
                    }else{

                    }
                }).catch(function(res){

                });
            };
            $scope.getList();
            $scope.pageChanged = function(){
                console.log("page to "+$scope.currentPage);
                $scope.getList();
            };

            $http.get('/v1/aut/backend/book?id='+$scope.id).then(function(res){
                console.log('小说详情',res);
                if(!res.data.errMessage){
                    $scope.novel = res.data.data;
                }
            }).catch(function(res){

            });




        }
    ]);
})();
