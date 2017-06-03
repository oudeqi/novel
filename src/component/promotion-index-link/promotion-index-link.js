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
    angular.module('app').controller('promotion-index-link',['$scope','$http','$state','$uibModal','$timeout','promoTemplate','ngToast',
        function($scope,$http,$state,$uibModal,$timeout,promoTemplate,ngToast){


            var idArr = JSON.parse(decodeURIComponent($state.params.link));
            $scope.link = idArr[4]; //链接id

            $scope.copyLinkError = function(e) {
                ngToast.create({
                    className: 'danger',
                    content: '复制推广链接失败，请手动复制！',
                });
            };
            $scope.copyLinkSuccess = function(e){
                e.clearSelection();
                ngToast.create({
                    className: 'success',
                    content: '复制推广链接成功',
                });
            };

        }
    ]);

})();
