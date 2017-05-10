;(function(){
    'use strict';
    angular.module('app').controller('warpper',['$scope','$rootScope',
        function($scope,$rootScope){

            $scope.$on('login', function(event,data) {
                $scope.$broadcast('warpperlogin', data);
        	});

        }
    ]);
})();
