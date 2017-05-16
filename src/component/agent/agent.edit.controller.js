;(function(){
    'use strict';
    angular.module('app').controller('agentctl_edit',['$scope','$http',
        function($scope,$http){
			 $scope.items = [
			    '推广链接',
			    '修改资料',
			    '禁止登陆',
			    '查看用户',
			  ];
			  
			  $scope.toggled=function(open){
			  	console.log(open)
			  }



        }
    ]);
})();
