;
(function() {
	'use strict';
	angular.module('app').config(['$stateProvider',
		function($stateProvider) {

			$stateProvider.state({
				params: {
					name: ''
				},
				name: 'warpper.views.section.orderList',
				url: '^/ol',
				templateUrl: './component/order-list/order-list.html'
			});

		}
	]);
	angular.module('app').controller('order-list', ['$scope', '$http', '$state','$timeout',
		function($scope, $http, $state,$timeout) {
			$scope.maxSize = 5;
			$scope.totalItems = 0;
			$scope.currentPage = 1;
			$scope.pageSize = 20;
			$scope.pageCount = 0; //总页数
			$scope.list = [];
			
			$scope.xdtitle='';
			$scope.xdshow=false;
			$scope.show=function(e){
				$scope.xdtitle=e;
				$scope.xdshow=true;
				$timeout(function(){
					$scope.xdshow=false;
				},2000)
			}

			/*时间筛选相关*/
			$scope.dateOptions = {
				//			    dateDisabled: visible,
				language: 'cn',
				formatYear: 'yy',
				maxDate: new Date(),
				minDate: new Date(2000, 5, 22),
				startingDay: 1
			};
			$scope.popup = {
				opened: false,
				openedend: false,
			};
//			$scope.dt = new Date();
//			$scope.dtx = new Date();
			$scope.dt = null;
			$scope.dtx = null;
			$scope.opendate = function() {
				$scope.popup.opened = true;
			};
			$scope.opendateend = function() {
				$scope.popup.openedend = true;
			};

			$scope.status = 0; //1待支付，2已支付

			$scope.getList = function() {
				var startTime=null;
				var endTime=null;
				if($scope.dt==null && $scope.dtx!=null){
					$scope.show("请选择开始时间");
					return;
				}
				if($scope.dt!=null && $scope.dtx==null){
					$scope.show("请选择结束时间");
					return;
				}
				
				if(Date.parse($scope.dt)>Date.parse($scope.dtx)){
					$scope.show("开始时间大于结束时间");
					return;
				}
				
				if(Date.parse($scope.dt)==Date.parse($scope.dtx)){
					$scope.dtx.setDate($scope.dtx.getDate()+1);
					console.log("時間相同,查询这一天的");
				}
				
				if($scope.dt==null && $scope.dtx==null){
					startTime=null;
					endTime=null;
					console.log("查询所有时间段的")
				}
				
				
				if($scope.dt!=null && $scope.dtx!=null){
					startTime=Date.parse($scope.dt);
					endTime=Date.parse($scope.dtx);
				}
				

				
				
				
				
				
//				console.log(Date.parse($scope.dt)==Date.parse($scope.dtx))
				console.log($scope.dt,$scope.dtx);
//				return;

				
				
				
				
				$http.get('/v1/aut/order', {
					params: {
						startTime:startTime,
						endTime:endTime,
						pageSize: $scope.pageSize,
						pageIndex: $scope.currentPage,
						status: $scope.status
					}
				}).then(function(res) {
					console.log('订单列表', res);
					if(!res.data.errMessage) {
						$scope.list = res.data.data.data;
						$scope.totalItems = res.data.data.rowCount;
						$scope.pageCount = res.data.data.pageCount;
						$scope.currentPage = res.data.data.pageIndex;
					} else {

					}
				}).catch(function(res) {

				});
			};
			// $scope.getList();
			$scope.pageChanged = function() {
				console.log("page to " + $scope.currentPage);
				$scope.getList();
			};

			$scope.changeType = function(status) {
				$scope.status = status; //状态
				$scope.currentPage = 1;
				$scope.getList();
			};

		}
	]);
})();