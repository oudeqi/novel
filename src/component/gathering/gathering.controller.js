;(function(){
    'use strict';
    
    
    angular.module('app').controller('gathering',['$scope','$http','$timeout',
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
			
        	$scope.oldPwd=null;
        	$scope.nowPwd=null;
        	$scope.nowPwdYes=null;
        	
        	$scope.cgPwd=function(){
        		console.log($scope.oldPwd,$scope.nowPwd,$scope.nowPwdYes)
				if($scope.nowPwd==null || $scope.nowPwd==''){
					$scope.show('密码不能为空');
        			return;
				}
				if($scope.oldPwd==null || $scope.oldPwd==''){
					$scope.show('密码不能为空');
        			return;
				}
				if($scope.nowPwdYes==null || $scope.nowPwdYes==''){
					$scope.show('密码不能为空');
        			return;
				}
        		if($scope.nowPwd!=$scope.nowPwdYes){
        			$scope.show('新密码不一致');
        			return;
        		}
        		$http.post('/v1/aut/user/password',{
							"password":$scope.oldPwd,
							"newPassword":$scope.nowPwdYes
               }).then(function(res){
                    if(!res.data.errMessage){
					
                    }else{
					   $scope.show(res.data.errMessage);
                    }
                }).catch(function(res){
					 $scope.show('网络错误');
                });
        		
        	}
			


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
