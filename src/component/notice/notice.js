;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.notice',
                url: '^/nt',
                templateUrl: './component/notice/notice.html'
            });

        }
    ]);
    angular.module('app').controller('notice',['$scope','$http','$state','localStorageService','$uibModal',
        function($scope,$http,$state,localStorageService,$uibModal){

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 20;
            $scope.pageCount = 0;//总页数
            $scope.list = [];

            $scope.getList = function(){
                $http.get('/v1/aut/notices',{
                    params:{
                        pageSize:$scope.pageSize,
                        pageIndex:$scope.currentPage,
                    }
                }).then(function(res){
                    console.log('通知列表',res);
                    if(!res.data.errMessage){
                        $scope.list = res.data.data.allNotices.data;
                        $scope.totalItems = res.data.data.allNotices.rowCount;
                        $scope.pageCount = res.data.data.allNotices.pageCount;
                        $scope.currentPage = res.data.data.allNotices.pageIndex;
                        var noReadNotices = res.data.data.noReadNotices;
                        if(noReadNotices.length!==0){
                            openModal(0,noReadNotices);
                        }
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

            $scope.lookNotice = function(item){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: './component/notice/notice.modal.html',
                    controller: 'lookNoticeCtrl',
                    openedClass: 'notice-modal',
                    backdrop:'static',
                    size: 'lg',
                    resolve: {
                        notice: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function () {

                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };

            var openModal = function(curr,array){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: './component/notice/unlooked-notice.modal.html',
                    controller: 'unLookedNoticeCtrl',
                    openedClass: 'notice-modal',
                    backdrop:'static',
                    size: 'lg',
                    resolve: {
                        unLookedNotice: function () {
                            return {
                                notice:array,
                                index:curr
                            };
                        }
                    }
                });
                modalInstance.result.then(function (current) {
                    if(!!array[current]){
                        openModal(current,array);
                    }
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };


        }
    ]);

    angular.module('app').controller('lookNoticeCtrl',['$scope','$uibModalInstance','notice',
        function($scope,$uibModalInstance,notice){

            console.log('notice:',notice);

            $scope.notice = notice;

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);

    angular.module('app').controller('unLookedNoticeCtrl',['$scope','$uibModalInstance','unLookedNotice',
        function($scope,$uibModalInstance,unLookedNotice){

            console.log('unLookedNotice:',unLookedNotice);

            $scope.notice = {};
            $scope.notice = unLookedNotice.notice[unLookedNotice.index];
            var i = unLookedNotice.index + 1;

            $scope.ok = function () {
                $uibModalInstance.close(i);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);

})();
