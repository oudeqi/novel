;(function(){
    'use strict';
    angular.module('app').controller('agentctl',['$scope','$http','$stateProvider','$urlRouterProvider'
        function($scope,$http,$stateProvider,$urlRouterProvider){
        	$stateProvider.state({
                name: 'warpper.views.section.gathering',
                url: '^/gathering',
                templateUrl: './component/gathering/gathering.html'
           });
        	var k=$scope;
			


        }
    ]);
})();
