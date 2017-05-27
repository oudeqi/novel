;(function(){

    'use strict';

    angular.module('app',[
        'ui.router',
        'app.template',
        'LocalStorageModule',
        'ui.bootstrap',
        'ngclipboard'
    ]);
    // angular.module('app').constant('APP_HOST','http://192.168.10.28:8080');
    angular.module('app').constant('APP_HOST','http://book.zbty8.com/');

})();
