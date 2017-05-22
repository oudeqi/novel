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
               		
                    if(!res.data.errMessage){
                        k.list = res.data.data;
                        k.nt[0].obj=res.data.data.today;
                        k.nt[1].obj=res.data.data.yesterday;
                        k.nt[2].obj=res.data.data.month;
                        k.nt[3].obj=res.data.data.all;
                        k.ntx[0].obj=res.data.data.today;
                        k.ntx[1].obj=res.data.data.yesterday;
                        k.ntx[2].obj=res.data.data.month;
                        k.ntx[3].obj=res.data.data.all;
                    	 console.log("k的list:",k.nt);
                    }else{

                    }
                }).catch(function(res){

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
                    console.log("k.th:",k.th);
                }).catch(function(res){

                });

			}
			k.getTh();
			
			


        }
    ])
    
})();
