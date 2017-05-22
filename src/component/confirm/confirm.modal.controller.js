;(function(){
    'use strict';

    angular.module('app').controller('confirmCtrl',['$scope','$uibModalInstance','confirm',
        function($scope,$uibModalInstance,confirm){

            $scope.title = confirm.title;
            $scope.msg = confirm.msg;

            $scope.ok = function () {
                $uibModalInstance.close();
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);



})();
