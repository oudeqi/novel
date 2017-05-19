;(function(){
    'use strict';
    angular.module('app').controller('promotion-link',['$scope','$http','$state','$uibModal','$timeout','promoTemplate',
        function($scope,$http,$state,$uibModal,$timeout,promoTemplate){

            $scope.id = $state.params.id; //小说id
            $scope.chapterid = $state.params.chapterid; //章节id

            var idArr = JSON.parse(decodeURIComponent($state.params.link));

            $scope.titleId = idArr[0]; //标题id
            $scope.coverimgId = idArr[1]; //封面图id
            $scope.bodyId = idArr[2]; //主体id
            $scope.footerId = idArr[3]; //尾部id
            $scope.link = idArr[4]; //链接id

            $http.get('/v1/aut/backend/book?id='+$scope.id).then(function(res){
                console.log('小说详情',res);
                if(!res.data.errMessage){
                    $scope.name = res.data.data.name; //小说名称
                }
            }).catch(function(res){

            });

            $scope.chapters = [];
            $http.get('/v1/backend/book/chapter',{
                params:{
                    id:$scope.id,
                    pageSize:$scope.chapterid,
                    pageIndex:1,
                }
            }).then(function(res){
                console.log('文案章节',res);
                if(!res.data.errMessage){
                    angular.forEach(res.data.data.data,function(item,idx){
                        $scope.chapters[idx] = {
                            chapterTitle:item.title,
                            chapterContent: []
                        };
                        var content = item.content.replace(/[\r]/g,'').split(/[\n]/g);
                        angular.forEach(content,function(it){
                            if(it !== ''){
                                $scope.chapters[idx].chapterContent.push(it);
                            }
                        });
                    });
                }
            }).catch(function(res){

            });


            var templateTitles = promoTemplate().titles;
            var templateCoverimgs = promoTemplate().coverimgs;
            var templateBodys = promoTemplate().bodys;
            var templateFooters = promoTemplate().footers;

            angular.forEach(templateTitles,function(item){
                if($scope.titleId == item.id){
                    $scope.templateTitle = item;
                }
            });
            angular.forEach(templateCoverimgs,function(item){
                if($scope.coverimgId == item.id){
                    $scope.templateCoverimg = item;
                }
            });
            angular.forEach(templateBodys,function(item){
                if($scope.bodyId == item.id){
                    $scope.templateBodyStyle = item;
                }
            });
            angular.forEach(templateFooters,function(item){
                if($scope.footerId == item.id){
                    $scope.templateFooter = item;
                }
            });




            $scope.alerts = [];
            $scope.closeAlert = function() {
                $scope.alerts.length = 0;
            };

            var timer;
            $scope.copyTitleError = function(e) {
                $timeout.cancel(timer);
                $scope.alerts = [{
                    type:'error',
                    msg:'复制标题失败，请手动复制！',
                }];
                timer = $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };
            $scope.copyBodyError = function(e) {
                $timeout.cancel(timer);
                $scope.alerts = [{
                    type:'error',
                    msg:'复制正文失败，请手动复制！',
                }];
                timer = $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };
            $scope.copyLinkError = function(e) {
                $timeout.cancel(timer);
                $scope.alerts = [{
                    type:'error',
                    msg:'复制推广链接失败，请手动复制！',
                }];
                timer = $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };

            $scope.copyTitleSuccess = function(e){
                e.clearSelection();
                $timeout.cancel(timer);
                $scope.alerts = [{
                    type:'success',
                    msg:'复制标题成功',
                }];
                timer = $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };


            $scope.copyBodySuccess = function(e){
                e.clearSelection();
                $timeout.cancel(timer);
                $scope.alerts = [{
                    type:'success',
                    msg:'复制正文成功',
                }];
                timer = $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };


            $scope.copyLinkSuccess = function(e){
                e.clearSelection();
                $timeout.cancel(timer);
                $scope.alerts = [{
                    type:'success',
                    msg:'复制推广链接成功',
                }];
                timer = $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };
        }
    ]);

})();
