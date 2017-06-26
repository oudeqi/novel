;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    title:'',
                    name:'',
                    bottomId:'',
                },
                name: 'warpper.views.section.bookintro',
                url: '^/book_intro/{bookid}/{cid}',
                templateUrl: './component/book-intro/book-intro.html'
            });

        }
    ]);
    angular.module('app').controller('book-intro',['$scope','$http','$state','$uibModal','$timeout','ngToast',
        function($scope,$http,$state,$uibModal,$timeout,ngToast){
			$scope.name=$state.params.name;
			$scope.cid=$state.params.cid;
			$scope.bookid=$state.params.bookid;
			
			
			
			$scope.bottomId=2;
			$scope.createShow=false;
			
			if($state.params.bottomId){
				console.log('bottomId',$state.params.bottomId)
				$scope.bottomId=$state.params.bottomId;
				$scope.justread=false;
				
//				$scope.createShow=true;
				
			}else{
				$scope.justread=true;
				
			}
			
			
			
			$scope.bookinfo=null;
			
			
			$http.get('/v1/aut/backend/book',{
			 	params:{
			 		id:$scope.bookid,
			 	}
                    
                }).then(function(res){
                    $scope.bookinfo=res.data.data;
                    $scope.ctall=res.data.data.h5Introduction;
                    $scope.ctall=$scope.ctall.split("<br />")
                    console.log($scope.ctall);
                    
                }).catch(function(res){
                });
			
			$scope.footers = [
            {
                id:1,
                pic:'../../assets/image/promo-look-original-01.gif',
                templateUrl:'./component/promotion-letters/template-footer-style-1.html'
            },
            {
                id:2,
                pic:'../../assets/image/footer1.jpg',
                templateUrl:"./component/promotion-letters/template-footer-style-2.html"
            },
            {
                id:3,
                pic:'../../assets/image/footer2.jpg',
                templateUrl:'./component/promotion-letters/template-footer-style-3.html'
            },
            {
                id:4,
                pic:'../../assets/image/footer3.jpg',
                templateUrl:'./component/promotion-letters/template-footer-style-4.html'
            },
            
            {
                id:5,
                pic:'../../assets/image/footer_animated1.jpg',
                templateUrl:'./component/promotion-letters/template-footer-style-5.html'
            },
            {
                id:6,
                pic:'../../assets/image/footer_animated3.jpg',
                templateUrl:'./component/promotion-letters/template-footer-style-6.html'
            },
        ];
			
			
			$scope.footerimg=$scope.footers[parseInt($scope.bottomId-1)].pic;
			
			$scope.generalize='';
			
			$scope.copySuccess=function(){
				ngToast.create({
                        className: 'success',
                        content: '成功复制!'
                    });
			}
			$scope.copyErr=function(){
				ngToast.create({
                        className: 'danger',
                        content: '复制失败'
                    });
			}
			
			$scope.createLink=function(){
			   $http.post('/v1/aut/publish/link',{
                    bookId:$scope.bookid,
                    cid:$scope.cid,
                    bottomId:$scope.bottomId,
                }).then(function(res){
                    console.log('生成推广链接',res);
                    if(res.data.errMessage){
                        ngToast.create({
                        className: 'danger',
                        content: res.data.errMessage
                    });
                    }else{
                    	$scope.createShow=true;
                       ngToast.create({
                        className: 'success',
                        content: '成功生成!'
                    	});
                    	$scope.generalize=res.data.data;
                    }
                }).catch(function(res){
                    ngToast.create({
                        className: 'danger',
                        content: '生成失败'
                    });
                });
				
				
				
				
			}
			
			$scope.changeFooter=function(index,e){
				$scope.footerimg=$scope.footers[index].pic;
				$scope.bottomId=e;
				console.log($scope.footers[index],index,$scope.bottomId)
			}
			
			if($scope.justread){}else{
				$scope.createLink();
			}
			
            
           

        }
    ]);




})();
