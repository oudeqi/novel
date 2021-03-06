;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){

            // $urlRouterProvider.when('/s', '^/nls');
            $stateProvider.state({
                name: 'warpper.views.section.novels',
                url: '^/nls',
                templateUrl: './component/novels/novels.html'
            });

        }
    ]);
    angular.module('app').controller('novels',['$scope','$http','localStorageService',
        function($scope,$http,localStorageService){

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.pageCount = 0;//总页数
            $scope.list = [];
            
            /*1 */
            $scope.lev=localStorageService.get('level');
            console.log($scope.lev)
            
            $scope.searchBook='';
            

            $scope.getList = function(){
                $http.get('/v1/aut/backend/books',{
                    params:{
                        pageSize:$scope.pageSize,
                        pageIndex:$scope.currentPage,
                        search:$scope.searchBook,
                    }
                }).then(function(res){
                    console.log('小说列表',res);
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




        }
    ]);
})();
