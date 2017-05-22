;(function(){
    'use strict';
    
    
    angular.module('app').config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
            $stateProvider.state({
                name: 'warpper.views.section.statistics',
                url: '^/statistics',
                templateUrl: './component/statistics/statistics.html'
           });

        }
    ])
    .controller('statisticsx',['$scope','$http','$timeout',
        function($scope,$http,$timeout){     	
        	$scope.xdtitle='';
			$scope.xdshow=false;
			$scope.show=function(e){
				$scope.xdtitle=e;
				$scope.xdshow=true;
				$timeout(function(){
					$scope.xdshow=false;
				},2000)
			}
			
			


        }
    ])
    
})();
