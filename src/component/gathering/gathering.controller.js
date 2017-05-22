;(function(){
    'use strict';
    
    
    angular.module('app').config(['$stateProvider','$urlRouterProvider',
        function($stateProvider,$urlRouterProvider){
            $stateProvider.state({
                name: 'warpper.views.section.gathering',
                url: '^/gathering',
                templateUrl: './component/gathering/gathering.html'
           });

        }
    ])
    .controller('gathering',['$scope','$http','$timeout',
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
			$scope.prw={
				oldPwd:null,
				nowPwd:null,
				nowPwdYes:null,
			}
        	
        	$scope.cgPwd=function(){
//      		console.log($scope.prw.oldPwd,$scope.prw.nowPwd,$scope.prw.nowPwdYes)
				if($scope.prw.nowPwd==null || $scope.prw.nowPwd==''){
					$scope.show('密码不能为空');
        			return;
				}
				if($scope.prw.oldPwd==null || $scope.prw.oldPwd==''){
					$scope.show('密码不能为空');
        			return;
				}
				if($scope.prw.nowPwdYes==null || $scope.prw.nowPwdYes==''){
					$scope.show('密码不能为空');
        			return;
				}
        		if($scope.prw.nowPwd!=$scope.prw.nowPwdYes){
        			$scope.show('新密码不一致');
        			return;
        		}
        		$http.post('/v1/aut/user/password',{
							"password":$scope.prw.oldPwd,
							"newPassword":$scope.prw.nowPwdYes
               }).then(function(res){
                    if(!res.data.errMessage){
					
                    }else{
					   $scope.show(res.data.errMessage);
                    }
                }).catch(function(res){
					 $scope.show('网络错误');
                });
        		
        	}
        	
        	/*获取收款信息*/
        	$scope.payEnd=function(){
        		
        	}
        	
        	/*返回个人信息*/
        	$scope.callInfo=function(){
        		
        	}
        	
			


        }
    ])
    
})();
