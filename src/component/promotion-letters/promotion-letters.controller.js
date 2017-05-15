;(function(){
    'use strict';
    angular.module('app').controller('promotion-letters',['$scope','$http','$state','$uibModal','$timeout',
        function($scope,$http,$state,$uibModal,$timeout){

            console.log($state.params);

            $scope.id = $state.params.id; //小说id
            $scope.chapterid = $state.params.chapterid; //章节id
            $scope.name = $state.params.name; //小说名称
            $scope.title = $state.params.title; //章节名称
            $scope.chapters = [];//章节内容

            $http.get('/v1/aut/backend/book?id='+$scope.id).then(function(res){
                console.log('小说详情',res);
                if(!res.data.errMessage){
                    $scope.name = res.data.data.name; //小说名称
                }
            }).catch(function(res){

            });

            $http.get('/v1/aut/read/book/chapter?bookid='+$scope.id+'&chapterid='+$scope.chapterid)
            .then(function(res){
                console.log('章节详情',res);
                if(!res.data.errMessage){
                    $scope.title = res.data.data.title;//章节名称
                    var content = res.data.data.content.replace(/[\r]/g,'').split(/[\n]/g);
                    $scope.chapters=[{
                        chapterTitle: $scope.title,
                        chapterContent: []
                    }];
                    angular.forEach(content,function(item){
                        if(item !== ''){
                            $scope.chapters[0].chapterContent.push(item);
                        }
                    });
                }
            }).catch(function(res){

            });


            $scope.templateTitles = [
                '温柔体贴的老公突然提出了离婚，只因为七年前我……1',
                '温柔体贴的老公突然提出了离婚，只因为七年前我……2',
                '温柔体贴的老公突然提出了离婚，只因为七年前我……3',
            ];

            $scope.templateCoverimgs = [
                '../../assets/image/promo-coverimg-01.jpg',
                '../../assets/image/promo-coverimg-02.jpg',
                '../../assets/image/promo-coverimg-03.jpg',
            ];

            $scope.templateBodys = [
                {
                    id:1,
                    pic:'../../assets/image/promo-body-01.jpg',
                    templateUrl:'./component/promotion-letters/template-body-style-1.html'
                },
                {
                    id:2,
                    pic:'../../assets/image/promo-body-02.jpg',
                    templateUrl:'./component/promotion-letters/template-body-style-2.html'
                },
                {
                    id:3,
                    pic:'../../assets/image/promo-body-03.jpg',
                    templateUrl:'./component/promotion-letters/template-body-style-3.html'
                },
            ];

            $scope.templatefooters = [
                {
                    id:1,
                    pic:'../../assets/image/promo-look-original-01.gif',
                    templateUrl:'./component/promotion-letters/template-footer-style-1.html'
                },
                {
                    id:2,
                    pic:'../../assets/image/promo-look-original-02.gif',
                    templateUrl:'./component/promotion-letters/template-footer-style-2.html'
                },
                {
                    id:3,
                    pic:'../../assets/image/promo-look-original-03.gif',
                    templateUrl:'./component/promotion-letters/template-footer-style-3.html'
                },
            ];

            $scope.templateTitle = $scope.templateTitles[0];
            $scope.templateCoverimg = $scope.templateCoverimgs[0];
            $scope.templateBodyStyle = $scope.templateBodys[0];
            $scope.templatefooter = $scope.templatefooters[0];

            var scrollIntoView = function(id){
                document.getElementById(id).scrollIntoView();
            };

            $scope.changeTitle = function(index,id){
                $scope.templateTitle = $scope.templateTitles[index];
                scrollIntoView(id);
            };
            $scope.changeCoverimg = function(index,id){
                $scope.templateCoverimg = $scope.templateCoverimgs[index];
                scrollIntoView(id);
            };
            $scope.changeBody = function(index,id){
                $scope.templateBodyStyle = $scope.templateBodys[index];
                scrollIntoView(id);
            };
            $scope.changeFooter = function(index,id){
                $scope.templatefooter = $scope.templatefooters[index];
                scrollIntoView(id);
            };

            $scope.createLink = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: './component/promotion-letters/promolink.modal.html',
                    controller: 'createdLinkCtrl',
                    openedClass: 'create-link-modal',
                    backdrop:'static',
                    size: 'lg',
                    resolve: {
                        items: function () {
                            return '';
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {

                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };

            $scope.alerts = [];
            $scope.closeAlert = function() {
                $scope.alerts.length = 0;
            };

            $scope.copyContentTitle = 'title';
            $scope.copyTitle = function(){
                $scope.closeAlert();
                $scope.alerts = [{
                    type:'success',
                    msg:'复制标题成功',
                }];
                $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };

            $scope.copyContentBody = 'body';
            $scope.copyBody = function(){
                $scope.closeAlert();
                $scope.alerts = [{
                    type:'success',
                    msg:'复制正文成功',
                }];
                $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };

        }
    ]);

    angular.module('app').controller('createdLinkCtrl',['$scope','$uibModalInstance','$timeout',
        function($scope,$uibModalInstance,$timeout){

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.copyContent = 'http://www.baidu.com';

            $scope.copyLink = function(){
                $scope.copyLinkMsg = '复制原文链接成功';
                $timeout(function(){
                    $scope.copyLinkMsg = '';
                },2000);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };



        }
    ]);

})();
