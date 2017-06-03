;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.siteset',
                url: '^/ss',
                templateUrl: './component/site-settings/site-settings.html'
            });

        }
    ]);
    angular.module('app').controller('site-settings',['$scope','$http','$timeout','ngToast',
        function($scope,$http,$timeout,ngToast){

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
                        ngToast.create({
                            className: 'danger',
                            content: res.data.errMessage,
                        });
                    }else{
                        ngToast.create({
                            className: 'success',
                            content: '设置微信公众平台信息成功',
                        });
                    }
                }).catch(function(res){
                    $scope.submitClicked = false;
                    ngToast.create({
                        className: 'danger',
                        content: '操作失败！',
                    });
                });
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
                        ngToast.create({
                            className: 'danger',
                            content: res.data.errMessage,
                        });
                    }else{
                        ngToast.create({
                            className: 'success',
                            content: '生成菜单成功！',
                        });
                    }

                }).catch(function(res){
                    $scope.generateMenuClicked = false;
                    ngToast.create({
                        className: 'danger',
                        content: '菜单生成失败！',
                    });
                });
            };





        }
    ]);
})();
