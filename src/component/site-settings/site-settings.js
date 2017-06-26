;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.siteset',
                url: '^/ss',
                templateUrl: './component/site-settings/site-settings.html'
            });

        }
    ]);

    
    angular.module('app').controller('site-settings',['$scope','$http','$timeout','ngToast',
        function($scope,$http,$timeout,ngToast){

            $scope.wx = {};
	
            $http.get('/v1/aut/user/wxinfo').then(function(res){
                console.log('获取微信公众平台信息',res);
                if(!res.data.errMessage){
                    if(res.data.data === null){
                        $scope.wx = {};
                    }else{
                        $scope.wx = res.data.data;
                        document.getElementById("coverImimg").display="block";
						document.getElementById("coverImimg").setAttribute("src",res.data.data.kefuImg);
                    }
                }
            }).catch(function(res){

            });
            
            $scope.refresh = function(){
                location.reload();
            };
            $scope.picChange=function(){
            	console.log($scope.wx.kefuImgBase64,'：我是图片');
            }
            $scope.coverImgBase64 = '';
            $scope.nohotbase='';
            
            $scope.handleFileSelect= function(files) {
				console.info(files);
				var file = files[0];
                var reader = new FileReader();
                var kk=$scope;
                reader.onloadend = function () {
					$scope.nohotbase=reader.result;
					kk.nohotbase=reader.result;
					document.getElementById("coverImimg").display="block";
					document.getElementById("coverImimg").setAttribute("src",reader.result);
					
					
                };
                reader.readAsDataURL(file);
				};
            
//          var myi=document.getElementById("coverIm");
//          angular.element(myi).on("change",function(e){
//          		console.log("变化了")
////          		var file = e.target.files[0];
////                  var reader = new FileReader();
////                  reader.onloadend = function () {
////						$scope.nohotbase=reader.result;
////						console.log($scope.nohotbase)
////                  };
////                  if (file) {
////                      reader.readAsDataURL(file);
////                  } else {
////                      $scope.nohotbase = '';
////                  }
//          })

            $scope.submitClicked = false;
            $scope.submit = function(){
            	console.log($scope.nohotbase)
                if(!$scope.wx.appId || !$scope.wx.appsecret || !$scope.wx.name || !$scope.wx.wechat || !$scope.wx.baseId){
                    return false;
                }
                if($scope.submitClicked){
                    return false;
                }
                $scope.submitClicked = true;
                $http.post('/v1/aut/user/wxinfo',{
                    appId: $scope.wx.appId,
                    appsecret: $scope.wx.appsecret,
                    name: $scope.wx.name,
                    wechat: $scope.wx.wechat,
                    baseId: $scope.wx.baseId,
                    kefuImgBase64:$scope.nohotbase.substring($scope.nohotbase.indexOf(',')+1)
                }).then(function(res){
                    $scope.submitClicked = false;
                    console.log('设置微信公众平台信息',res);
                    if(res.data.errMessage){
                        ngToast.create({
                            className: 'danger',
                            content: res.data.errMessage,
                        });
                    }else{
                        ngToast.create({
                            className: 'success',
                            content: '设置微信公众平台信息成功',
                        });
                    }
                }).catch(function(res){
                    $scope.submitClicked = false;
                    ngToast.create({
                        className: 'danger',
                        content: '操作失败！',
                    });
                });
            };

            $scope.generateMenuClicked = false;
            $scope.generateMenu = function(){
                if($scope.generateMenuClicked){
                    return false;
                }
                $scope.generateMenuClicked = true;
                $http.get('/v1/aut/wx/user/menu').then(function(res){
                    console.log('生成按钮',res);
                    $scope.generateMenuClicked = false;
                    if(res.data.errMessage){
                        ngToast.create({
                            className: 'danger',
                            content: res.data.errMessage,
                        });
                    }else{
                        ngToast.create({
                            className: 'success',
                            content: '生成菜单成功！',
                        });
                    }

                }).catch(function(res){
                    $scope.generateMenuClicked = false;
                    ngToast.create({
                        className: 'danger',
                        content: '菜单生成失败！',
                    });
                });
            };





        }
    ]);
    
    
    
    
})();
