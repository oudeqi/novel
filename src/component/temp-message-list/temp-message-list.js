;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.tplmsglist',
                url: '^/tml',
                templateUrl: './component/temp-message-list/temp-message-list.html'
            });

        }
    ]);
    angular.module('app').controller('temp-message-list',['$scope','$http','$timeout','ngToast','$uibModal',
        function($scope,$http,$timeout,ngToast,$uibModal){

            $scope.maxSize = 5;
			$scope.totalItems = 0;
			$scope.currentPage = 1;
			$scope.pageSize = 17;
			$scope.pageCount = 0; //总页数
			$scope.list = [];

            $scope.getList = function() {
				$http.get('/v1/aut/template/msg', {
					params: {
						pageSize: $scope.pageSize,
						pageIndex: $scope.currentPage
					}
				}).then(function(res) {
					console.log('模板消息列表', res);
					if(!res.data.errMessage) {
						$scope.list = res.data.data.data;
						$scope.totalItems = res.data.data.rowCount;
						$scope.pageCount = res.data.data.pageCount;
						$scope.currentPage = res.data.data.pageIndex;
					} else {

					}
				}).catch(function(res) {

				});
			};
            $scope.getList();
            $scope.pageChanged = function() {
				console.log("page to " + $scope.currentPage);
				$scope.getList();
			};

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
                                title:'确认删除该消息吗？',
                                msg:'删除后不能恢复'
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $http.post('/v1/aut/template/msg/delete',{
                        id: item.id
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
