;(function(){
    'use strict';
    angular.module('app').controller('agentctl',['$scope','$http','$timeout','$state',
        function($scope,$http,$timeout,$state){
        	var k=$scope;
			k.items = [
			    '重置密码',
			    '代理统计',
			    "禁止账户",
			    "修改账户",
			  ];
			  
			k.xdtitle='';
			
			k.noww=1;
		
			k.xdshow=false;
			k.show=function(e){
				k.xdtitle=e;
				k.xdshow=true;
				$timeout(function(){
					k.xdshow=false;
				},2500)
			}
				  
			  $scope.search={
			  	search:null,
			  };
			  
			  k.toggled=function(open){
			  	console.log(open)
			  }
			  k.cgIndex=function(index){
			  	k.noww=index;
			  	k.pageIndex=1;
			  	k.getList();
			  }
			  
			  k.pageIndex=1;
			  k.rowCount = null;
              k.pageCount=null;
              k.list=null;
              
              k.goAgentEditx=function(item){
              	console.log("去代理编辑啦");
              	localStorage.agenteditxuid=item.uid;
              	$state.go("warpper.views.section.agenteditx")
              }
              
              k.menuX=function(dd,item){
              	/*item.uid*/
              		if(dd==k.items[0]){
              		console.log("是在重置密码");
              		$http.post('/v1/aut/pwd/reset',{
              			uid:item.uid
              		}).then(function(res){
              			k.show("重置密码为123456")
              		})
              		
              		
              	}
              	if(dd==k.items[1]){
              		localStorage.statisticsuid=item.uid;
              		
              		$state.go('warpper.views.section.statisticsx_user',{},{reload:true});
              		
              		console.log("是在代理统计"); 
              	}
              	
              	if(dd==k.items[3]){	
              		k.goAgentEditx(item)
              	}
              	
              	if(dd==k.items[2]){	
              		console.log("删除账户"); 
              		$http.post('/v1/aut/user/delete',{
              			uid:item.uid
              		}).then(function(res){
              			k.show(res.data.data);
              			k.getList();
              		})
              		
              	}
              	
              	
              }
              
              k.pageGo=function(){
              	k.getList()
              }

			  k.getList=function(){
//			  	/v1/aut/user/list
				$http.get('/v1/aut/user/list',{
                    params:{
                        pageSize:20,
                        pageIndex:$scope.pageIndex,
                        search:$scope.search.search,
                        status:k.noww,
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
