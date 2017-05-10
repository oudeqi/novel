;(function(){

    'use strict';

    var app = angular.module('app');
    app.controller('login',loginFn);
    loginFn.$inject = ['$scope','$http','$timeout','localStorageService','$state'];

    function loginFn($scope,$http,$timeout,localStorageService,$state){

        localStorageService.clearAll();

        $scope.alerts = [];
        $scope.closeAlert = function() {
            $scope.alerts.length = 0;
        };

        $scope.user = {
            name:'',
            password:''
        };

        $scope.flag = false;
        $scope.login = function(){
            if(!$scope.user.name || !$scope.user.password){
                return;
            }
            if($scope.flag){
                return;
            }
            $scope.flag = true;
            $http.post('/v1/book/user/login',{
                account:$scope.user.name,
                passWorld:$scope.user.password
            }).then(function(res){
                $scope.flag = false;
                if(!!res.data.errMessage){
                    $scope.alerts[0] = { type: 'danger', msg: res.data.errMessage};
                    $timeout(function(){
                        $scope.closeAlert();
                    },2000);
                }else{
                    localStorageService.set('token',res.data.data.token);
                    if(!!localStorageService.get('token')){
                        $http.defaults.headers.common.Authorization = localStorageService.get('token');
                    }else{
                        $http.defaults.headers.common.Authorization = 'no token';
                    }
                    $state.go('warpper.views.section.home',{},{reload:true});
                    $scope.$emit('login', res.data.data);
                }
            }).catch(function(res){
                $scope.flag = false;
            });
        };


    }
})();
