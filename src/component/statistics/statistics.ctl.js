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
//  .filter('nowu',function(){
//  	return function(num){
////  		if()
//  	}
//  })
    .controller('statisticsx',['$scope','$http','$timeout',
        function($scope,$http,$timeout){
        	var k=$scope;
        	k.xdtitle='';
			k.xdshow=false;
			k.show=function(e){
				k.xdtitle=e;
				k.xdshow=true;
				$timeout(function(){
					k.xdshow=false;
				},2000)
			}
			k.th=null;
			
			k.nt=[{
				title:'今日充值',
				obj:null,
			},{
				title:'昨日充值',
				obj:null,
			},{
				title:'本月充值(不含当日)',
				obj:null,
			},{
				title:'累计充值(不含当日)',
				obj:null,
			},]
			k.ntx=[{
				title:'今日新增',
				obj:null,
			},{
				title:'昨日新增',
				obj:null,
			},{
				title:'本月新增(不含当日)',
				obj:null,
			},{
				title:'所有时间',
				obj:null,
			},]
			
			k.getList=function(){
				$http.get('/v1/aut/report/top',{
                    params:{

                    }
              }).then(function(res){
              			console.log(1111)
//                      k.list = res.data;
//                      allMoney,buyMoney,vipMoney,noPayBuyMoney
                        
//                      console.log(res.data.data.yesterday);
        				try{
                        k.nt[0].obj=res.data.data.today;
                        k.nt[0].obj.allMoney=k.nt[0].obj.allMoney/100;
                         k.nt[0].obj.buyMoney=k.nt[0].obj.buyMoney/100;
                          k.nt[0].obj.vipMoney=k.nt[0].obj.vipMoney/100;
                           k.nt[0].obj.noPayBuyMoney=k.nt[0].obj.noPayBuyMoney/100;
                       }catch(err){
                       	
                       }
                        
                        k.nt[1].obj=res.data.data.yesterday;
                        k.nt[1].obj.allMoney=k.nt[1].obj.allMoney/100;
                         k.nt[1].obj.buyMoney=k.nt[1].obj.buyMoney/100;
                          k.nt[1].obj.vipMoney=k.nt[1].obj.vipMoney/100;
                           k.nt[1].obj.noPayBuyMoney=k.nt[1].obj.noPayBuyMoney/100;
                        
                        k.nt[2].obj=res.data.data.month;
                        k.nt[2].obj.allMoney=k.nt[2].obj.allMoney/100;
                         k.nt[2].obj.buyMoney=k.nt[2].obj.buyMoney/100;
                          k.nt[2].obj.vipMoney=k.nt[2].obj.vipMoney/100;
                           k.nt[2].obj.noPayBuyMoney=k.nt[2].obj.noPayBuyMoney/100;
                           
                        k.nt[3].obj=res.data.data.all;
                        k.nt[3].obj.allMoney=k.nt[3].obj.allMoney/100;
                         k.nt[3].obj.buyMoney=k.nt[3].obj.buyMoney/100;
                          k.nt[3].obj.vipMoney=k.nt[3].obj.vipMoney/100;
                           k.nt[3].obj.noPayBuyMoney=k.nt[3].obj.noPayBuyMoney/100;
                        
                        k.ntx[0].obj=k.nt[0].obj;
                        k.ntx[1].obj=k.nt[1].obj;
                        k.ntx[2].obj=k.nt[2].obj;
                        k.ntx[3].obj=k.nt[3].obj;
                        console.log("k.ntx:",k.ntx)
//                      k.ntx[0].obj=res.data.data.today;
//                      k.ntx[1].obj=res.data.data.yesterday;
//                      k.ntx[2].obj=res.data.data.month;
//                      k.ntx[3].obj=res.data.data.all;
                    	 console.log("k.list:",k.nt);
                }).catch(function(res){
						console.log("k.list:错误");
                });

			  }
			  k.getList();
			  
			k.getTh=function(){
				$http.get('/v1/aut/reports',{
                    params:{
						pageSize:30,
                    }
               }).then(function(res){
               		
                    k.th=res.data.data.data;
                    for(var i=0; i<k.th.length; i++){
                    	 k.th[i].allMoney=k.th[i].allMoney/100;
                          k.th[i].buyMoney=k.th[i].buyMoney/100;
                           k.th[i].vipMoney=k.th[i].vipMoney/100;
                            k.th[i].noPayBuyMoney=k.th[i].noPayBuyMoney/100;
                    }
//                   k.th[0].allMoney=k.th[0].allMoney/100;
//                        k.th[0].buyMoney=k.th[0].buyMoney/100;
//                         k.th[0].vipMoney=k.th[0].vipMoney/100;
//                          k.th[0].noPayBuyMoney=k.th[0].noPayBuyMoney/100;
                    
                    console.log("k.th:",k.th);
                }).catch(function(res){

                });

			}
			k.getTh();
			
			


        }
    ])
    
})();
