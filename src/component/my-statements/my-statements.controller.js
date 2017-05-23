;(function(){
    'use strict';
    angular.module('app').controller('my-statements',['$scope','$http',
        function($scope,$http){

            $scope.statements = null;
            // {
            //     rechargeMoney: 4000,  //充值总额
            //     money: 3600, //结算总额
            //     count: 40, //充值笔数
            //     okMoney: 2700, //已打款
            //     noMoney: 900, //待打款
            //     cehgn: 2880, //成本
            //     profit: 720, //利润
            //     income: 0 //进账
            // };
            $http.get('/v1/aut/my/balance/top').then(function(res){
                console.log('结算统计',res);
                if(!res.data.errMessage && res.data.data){
                    $scope.statements = res.data.data;
                }
            }).catch(function(res){

            });

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 20;
            $scope.pageCount = 0;//总页数
            $scope.list = [];

            $scope.status = 1;//状态

            $scope.getList = function(){
                $http.get('/v1/aut/my/balance/list',{
                    params:{
                        pageSize:$scope.pageSize,
                        pageIndex:$scope.currentPage,
                        status:$scope.status
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

            $scope.changeType = function(status){
                $scope.status = status;//状态
                $scope.currentPage = 1;
                $scope.getList();
            };





        }
    ]);
})();
