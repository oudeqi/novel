;(function(){
    'use strict';
    angular.module('app').controller('site-settings',['$scope','$http',
        function($scope,$http){

            $scope.wx = {};

            $http.get('/v1/aut/user/wxinfo').then(function(res){
                console.log('获取微信公众平台信息',res);
                if(!res.data.errMessage){
                    $scope.wx = res.data.data;
                }
            }).catch(function(res){

            });

            $scope.refresh = function(){
                location.reload();
            };

            $scope.alerts = [];
            $scope.closeAlert = function() {
                $scope.alerts.length = 0;
            };

            $scope.submitClicked = false;
            $scope.submit = function(){
                if(!$scope.wx.appId || !$scope.wx.appsecret || !$scope.wx.name || !$scope.wx.wechat || !$scope.wx.baseId){
                    return false;
                }
                if($scope.submitClicked){
                    return false;
                }
                $scope.submitClicked = true;
                $http.get('/v1/aut/user/wxinfo',{
                    appId: $scope.wx.appId,
                    appsecret: $scope.wx.appsecret,
                    name: $scope.wx.name,
                    wechat: $scope.wx.wechat,
                    baseId: $scope.wx.baseId
                }).then(function(res){
                    $scope.submitClicked = false;
                    console.log('设置微信公众平台信息',res);
                    if(res.data.errMessage){
                        $scope.alerts[0] = {msg: res.data.errMessage};
                    }else{
                        $scope.refresh();
                    }
                }).catch(function(res){
                    $scope.submitClicked = false;
                    $scope.alerts[0] = {msg: '保存失败！'};
                });
            };

            $scope.generateMenu = function(){
                console.log('generateMenu');
            };





        }
    ]);
})();
