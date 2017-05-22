;(function(){
    'use strict';
    angular.module('app').controller('agentctl',['$scope','$http',
        function($scope,$http){
        	var k=$scope;
			k.items = [
			    '推广链接',
			    '修改资料',
			    '禁止登陆',
			    '查看用户',
			  ];
			  $scope.search={
			  	search:null,
			  };
			  
			  k.toggled=function(open){
			  	console.log(open)
			  }
			  
			  k.pageIndex=1;
			  k.rowCount = null;
              k.pageCount=null;
              k.list=null;
			  
			  k.getList=function(){
//			  	/v1/aut/user/list
				$http.get('/v1/aut/user/list',{
                    params:{
                        pageSize:20,
                        pageIndex:$scope.pageIndex,
                        search:$scope.search.search,
                    }
                }).then(function(res){
                    console.log('小说列表',res);
                    if(!res.data.errMessage){
                        k.list = res.data.data.data;
                        k.rowCount = res.data.data.rowCount;
                        k.pageCount = res.data.data.pageCount;
                        k.pageIndex = res.data.data.pageIndex;
                    }else{

                    }
                }).catch(function(res){

                });

			  }
			  k.getList();



        }
    ]);
})();
