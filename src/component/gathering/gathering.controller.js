;(function(){
    'use strict';
    
    
    angular.module('app').controller('gathering',['$scope','$http',
        function($scope,$http){
        	
        	var k=$scope;
			


        }
    ])
    .config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
            $stateProvider.state({
                name: 'warpper.views.section.gathering',
                url: '^/gathering',
                templateUrl: './component/gathering/gathering.html'
           });

        }
    ]);
})();
