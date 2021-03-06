;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    name:''
                },
                name: 'warpper.views.section.novel',
                url: '^/nls/{id}',
                templateUrl: './component/novel/novel.html'
            });

        }
    ]);
    angular.module('app').controller('novel',['$scope','$http','$state','localStorageService','$uibModal','ngToast',
        function($scope,$http,$state,localStorageService,$uibModal,ngToast){

            $scope.level = localStorageService.get('level');

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
            
            $scope.goOnline=function(item){
            	/*上线*/
            	$http.post('/v1/aut/chapter/online',{
            			bookId:item.bookId,
            			cid:item.cid,
            	}).then(function(res){
                if(!res.data.errMessage){
                	ngToast.create({
                        className: 'success',
                        content: '上线成功!'
                    });
                    $scope.getList();
                    
                }

	            }).catch(function(res){
	
	            });
            	
            }

            $scope.del = function(item){
                console.log(item);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: './component/confirm/confirm.modal.html',
                    controller: 'confirmCtrl',
                    openedClass: 'confirm-modal',
                    backdrop:'static',
                    size: 'sm',
                    resolve: {
                        confirm: function () {
                            return {
                                title:'确认删除该章节吗？',
                                msg:'删除后不能恢复'
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $http.post('/v1/aut/delete/chapter',{
                        cid: item.cid,
                        bookId: item.bookId
                    }).then(function(res){
                        console.log('删除',res);
                        if(res.data.errMessage){
                            ngToast.create({
                                className: 'danger',
                                content: res.data.errMessage
                            });
                        }else{
                            location.reload();
                        }
                    }).catch(function(res){
                        ngToast.create({
                            className: 'danger',
                            content: '删除失败！'
                        });
                    });
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };




        }
    ]);
})();
