;(function(){
    'use strict';
    angular.module('app').controller('site-settings',['$scope','$http','$timeout',
        function($scope,$http,$timeout){

            $scope.wx = {};

            $http.get('/v1/aut/user/wxinfo').then(function(res){
                console.log('获取微信公众平台信息',res);
                if(!res.data.errMessage){
                    if(res.data.data === null){
                        $scope.wx = {};
                    }else{
                        $scope.wx = res.data.data;
                    }
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
                $http.post('/v1/aut/user/wxinfo',{
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

            $scope.menuAlerts = [];
            $scope.closeMenuAlert = function() {
                $scope.menuAlerts.length = 0;
            };
            $scope.generateMenuClicked = false;
            $scope.generateMenu = function(){
                if($scope.generateMenuClicked){
                    return false;
                }
                $scope.generateMenuClicked = true;
                $http.get('/v1/aut/wx/user/menu').then(function(res){
                    console.log('生成按钮',res);
                    $scope.generateMenuClicked = false;
                    if(res.data.errMessage){
                        $scope.menuAlerts[0] = {
                            type:'danger',
                            msg: res.data.errMessage
                        };
                    }else{
                        $scope.menuAlerts[0] = {
                            type:'success',
                            msg: '生成菜单成功！'
                        };
                        $timeout(function(){
                            location.reload();
                        },2000);
                    }

                }).catch(function(res){
                    $scope.generateMenuClicked = false;
                    $scope.menuAlerts[0] = {
                        type:'danger',
                        msg: '菜单生成失败！'
                    };
                });
            };





        }
    ]);
})();
