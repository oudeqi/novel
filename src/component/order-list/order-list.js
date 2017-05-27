;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    name:''
                },
                name: 'warpper.views.section.orderList',
                url: '^/ol',
                templateUrl: './component/order-list/order-list.html'
            });

        }
    ]);
    angular.module('app').controller('order-list',['$scope','$http','$state','$provide',
        function($scope,$http,$state,$provide){
			
			var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
			$provide.value("$locale", {"DATETIME_FORMATS":{"MONTH":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],"SHORTMONTH":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],"DAY":["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],"SHORTDAY":["周日","周一","周二","周三","周四","周五","周六"],"AMPMS":["上午","下午"],"medium":"yyyy-M-d ah:mm:ss","short":"yy-M-d ah:mm","fullDate":"y年M月d日EEEE","longDate":"y年M月d日","mediumDate":"yyyy-M-d","shortDate":"yy-M-d","mediumTime":"ah:mm:ss","shortTime":"ah:mm"},"NUMBER_FORMATS":{"DECIMAL_SEP":".","GROUP_SEP":",","PATTERNS":[{"minInt":1,"minFrac":0,"macFrac":0,"posPre":"","posSuf":"","negPre":"-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":3},{"minInt":1,"minFrac":2,"macFrac":0,"posPre":"\u00A4","posSuf":"","negPre":"\u00A4-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":2}],"CURRENCY_SYM":"¥"},"pluralCat":function (n) {  return PLURAL_CATEGORY.OTHER;},"id":"zh-cn"});
            
            
            $scope.maxSize = 5;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 20;
            $scope.pageCount = 0;//总页数
            $scope.list = [];
            
            /*时间筛选相关*/
             $scope.dateOptions = {
//			    dateDisabled: visible,
				language:'cn',
			    formatYear: 'yy',
			    maxDate: new Date(),
			    minDate: new Date(2000,5,22),
			    startingDay: 1
			  };
            $scope.popup2 = {
			    opened: false
			  };
           	$scope.dt = new Date();
           	$scope.open2 = function() {
			    $scope.popup2.opened = true;
			  };
            

            $scope.status = 0;//1待支付，2已支付

            $scope.getList = function(){
                $http.get('/v1/aut/order',{
                    params:{
                        pageSize:$scope.pageSize,
                        pageIndex:$scope.currentPage,
                        status:$scope.status
                    }
                }).then(function(res){
                    console.log('订单列表',res);
                    if(!res.data.errMessage){
                        $scope.list = res.data.data.data;
                        $scope.totalItems = res.data.data.rowCount;
                        $scope.pageCount = res.data.data.pageCount;
                        $scope.currentPage = res.data.data.pageIndex;
                    }else{

                    }
                }).catch(function(res){

                });
            };
            // $scope.getList();
            $scope.pageChanged = function(){
                console.log("page to "+$scope.currentPage);
                $scope.getList();
            };

            $scope.changeType = function(status){
                $scope.status = status;//状态
                $scope.currentPage = 1;
                $scope.getList();
            };






        }
    ]);
})();
