;(function(){

    'use strict';

    angular.module('app').run(['localStorageService','$state','$rootScope',
        function(localStorageService,$state,$rootScope){
            if(!localStorageService.get('token')){
                $state.go('warpper.login',{},{reload:true});
            }
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                console.log('toState:',toState);
            });
        }
    ]);

    angular.module('app').run(['localStorageService','$http',
        function(localStorageService,$http){

            if(!!localStorageService.get('token')){
                $http.defaults.headers.common.Authorization = localStorageService.get('token');
            }else{
                $http.defaults.headers.common.Authorization = 'no token';
            }

        }
    ]);



})();
