;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.notice',
                url: '^/nt',
                templateUrl: './component/notice/notice.html'
            });

        }
    ]);
    angular.module('app').controller('notice',['$scope','$http','$state','localStorageService','$uibModal',
        function($scope,$http,$state,localStorageService,$uibModal){





        }
    ]);
})();
