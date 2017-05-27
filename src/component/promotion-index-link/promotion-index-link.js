;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.promIndexlink',
                url: '^/nls/{id}/{chapterid}/pil/{link}',
                templateUrl: './component/promotion-index-link/promotion-index-link.html'
            });

        }
    ]);
    angular.module('app').controller('promotion-index-link',['$scope','$http','$state','$uibModal','$timeout','promoTemplate',
        function($scope,$http,$state,$uibModal,$timeout,promoTemplate){


            var idArr = JSON.parse(decodeURIComponent($state.params.link));
            $scope.link = idArr[4]; //链接id

            $scope.alerts = [];
            $scope.closeAlert = function() {
                $scope.alerts.length = 0;
            };

            var timer;
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
