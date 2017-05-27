;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.promolist',
                url: '^/pl',
                templateUrl: './component/promotion-list/promotion-list.html'
            });

        }
    ]);
    angular.module('app').controller('promotion-list',['$scope','$http','$state','$uibModal',
        function($scope,$http,$state,$uibModal){

            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.pageCount = 0;//总页数
            $scope.list = [];

            $scope.getList = function(){
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

            $scope.promotionLetters = function(item){
                var idArr = [item.titleId,item.coverImgId,item.bodyId,item.bottomId,item.link];
                console.log(idArr);
                $state.go('warpper.views.section.promlink',{
                    id:item.bookId,
                    chapterid:item.cid,
                    link:encodeURIComponent(JSON.stringify(idArr))
                },{reload:true});
            };

            $scope.indexLink = function(item){
                var idArr = [item.titleId,item.coverImgId,item.bodyId,item.bottomId,item.link];
                console.log(idArr);
                $state.go('warpper.views.section.promIndexlink',{
                    id:item.bookId,
                    chapterid:item.cid,
                    link:encodeURIComponent(JSON.stringify(idArr))
                },{reload:true});
            };

            $scope.copyLinkSuccess = function(e){
                console.log(e);
                alert('复制成功：'+e.text);
            };

            $scope.copyLinkError = function(e){
                alert('复制失败！');
            };

            $scope.addIndexLink = function(){
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
                                title:'确认创建首页链接吗？',
                                msg:'首页链接是对书城首页的推广'
                            };
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $http.post('/v1/aut/publish/link',{
                        bookId:0
                    }).then(function(res){
                        console.log('生成首页推广链接',res);
                        if(res.data.errMessage){
                            $scope.createErrMsg = res.data.errMessage;
                        }else{
                            location.reload();
                        }
                    }).catch(function(res){
                        $scope.createErrMsg = '生成推广链接失败';
                    });
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };







        }
    ]);
})();
