;(function() {

    'use strict';

    angular.module('app').config(['localStorageServiceProvider',
        function(localStorageServiceProvider) {
            localStorageServiceProvider.setPrefix('2tai.novel');
        }
    ]);

    angular.module('app').config(['$httpProvider','APP_HOST',
        function($httpProvider,APP_HOST){
            function HttpInterceptor($q){
                return {
                    request: function(config) {
                        if(!!config.url && config.url[0] === '/'){
                            config.url = APP_HOST + config.url;
                        }
                        return config;
                    },
                    requestError: function(err) {
                        return $q.reject(err);
                    },
                    response: function(res) {
                        return res;
                    },
                    responseError: function(err) {
                        if (-1 === err.status) {
                            // 远程服务器无响应
                        } else if (500 === err.status) {
                            // 处理各类自定义错误
                        } else if (501 === err.status) {
                            // ...
                        }
                        return $q.reject(err);
                    }
                };
            }
            $httpProvider.interceptors.push(HttpInterceptor);
        }
    ]);



})();
