;(function(){
    'use strict';
    angular.module('app').controller('order-list',['$scope','$http','$state',
        function($scope,$http,$state){

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 20;
            $scope.pageCount = 0;//总页数
            $scope.list = [];

            $scope.status = 0;//1待支付，2已支付

            $scope.getList = function(){
                $http.get('/v1/aut/order',{
                    params:{
                        pageSize:$scope.pageSize,
                        pageIndex:$scope.currentPage,
                        status:$scope.status
                    }
                }).then(function(res){
                    console.log('订单列表',res);
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
            // $scope.getList();
            $scope.pageChanged = function(){
                console.log("page to "+$scope.currentPage);
                $scope.getList();
            };

            $scope.changeType = function(status){
                $scope.status = status;//状态
                $scope.currentPage = 1;
                $scope.getList();
            };






        }
    ]);
})();
