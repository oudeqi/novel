;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                name: 'warpper.views.section.tplmsgadd',
                url: '^/tma',
                templateUrl: './component/temp-message-add/temp-message-add.html'
            });

        }
    ]);
    angular.module('app').controller('temp-message-add',['$scope','$http','$timeout','ngToast','$state','$uibModal',
        function($scope,$http,$timeout,ngToast,$state,$uibModal){

            $scope.taskName = '';
            $scope.taskUrl = '';
            $scope.pushTime = Date.parse(new Date()) + 1000*60*10;
            $scope.taskType = '1';
            $scope.first = '';
            $scope.keyword1 = '';
            $scope.keyword2 = '';
            $scope.remark = '';
            $scope.testBuid = '';

            $scope.addMsgClicked = false;
            $scope.addMsg = function () {

                if(typeof $scope.pushTime === 'number'){
                    console.log($scope.pushTime);
                }else{
                    console.log(Date.parse($scope.pushTime));
                }

                var err = '';
                if(!$scope.taskName){
                    err = '任务名称不能为空';
                }else if(!$scope.taskUrl){
                    err = '点击跳转链接不能为空';
                }else if(!$scope.pushTime){
                    err = '发送时间不能为空';
                }else if(!$scope.first){
                    err = '描述1不能为空';
                }else if(!$scope.keyword1){
                    err = '会员卡号不能为空';
                }else if(!$scope.keyword2){
                    err = '有效期不能为空';
                }else if(!$scope.remark){
                    err = '描述2不能为空';
                }
                if(!$scope.taskName || !$scope.taskUrl || !$scope.pushTime || !$scope.first || !$scope.keyword1 || !$scope.keyword2 || !$scope.remark){
                    ngToast.create({
                        className: 'danger',
                        content: err
                    });
                    return false;
                }
                if($scope.addMsgClicked){
                    return false;
                }
                $scope.addMsgClicked = true;
                var t = null;
                if(typeof $scope.pushTime === 'number'){
                    t = $scope.pushTime;
                }else{
                    t = Date.parse($scope.pushTime);
                }
                $http.post('/v1/aut/template/msg',{
                    taskName:$scope.taskName,
                    taskUrl:$scope.taskUrl,
                    pushTime:t,
                    taskType:$scope.taskType,
                    first:$scope.first,
                    keyword1:$scope.keyword1,
                    keyword2:$scope.keyword2,
                    remark:$scope.remark,
                    testBuid:$scope.testBuid
                }).then(function(res){
                    console.log('新增模板消息',res);
                    $scope.addMsgClicked = false;
                    if(res.data.errMessage){
                        ngToast.create({
                            className: 'danger',
                            content: res.data.errMessage
                        });
                    }else{
                        $state.go('warpper.views.section.tplmsglist',{},{reload:true});
                    }
                }).catch(function(res){
                    $scope.addMsgClicked = false;
                    ngToast.create({
                        className: 'danger',
                        content: '新增模板消息失败'
                    });
                });
            };

            $scope.addMsgTestClicked = false;
            $scope.addMsgTest = function(){
                var err = '';
                if(!$scope.taskName){
                    err = '任务名称不能为空';
                }else if(!$scope.taskUrl){
                    err = '点击跳转链接不能为空';
                }else if(!$scope.first){
                    err = '描述1不能为空';
                }else if(!$scope.keyword1){
                    err = '会员卡号不能为空';
                }else if(!$scope.keyword2){
                    err = '有效期不能为空';
                }else if(!$scope.remark){
                    err = '描述2不能为空';
                }else if(!$scope.testBuid){
                    err = '测试粉丝ID不能为空';
                }
                if(!$scope.taskName || !$scope.taskUrl || !$scope.testBuid || !$scope.first || !$scope.keyword1 || !$scope.keyword2 || !$scope.remark){
                    ngToast.create({
                        className: 'danger',
                        content: err
                    });
                    return false;
                }
                if($scope.addMsgTestClicked){
                    return false;
                }
                $scope.addMsgTestClicked = true;
                var t = null;
                if(typeof $scope.pushTime === 'number'){
                    t = $scope.pushTime;
                }else{
                    t = Date.parse($scope.pushTime);
                }
                $http.post('/v1/aut/template/msg',{
                    taskName:$scope.taskName,
                    taskUrl:$scope.taskUrl,
                    pushTime:t,
                    taskType:$scope.taskType,
                    first:$scope.first,
                    keyword1:$scope.keyword1,
                    keyword2:$scope.keyword2,
                    remark:$scope.remark,
                    testBuid:$scope.testBuid
                }).then(function(res){
                    console.log('测试模板消息',res);
                    $scope.addMsgTestClicked = false;
                    if(res.data.errMessage){
                        ngToast.create({
                            className: 'danger',
                            content: res.data.errMessage
                        });
                    }else{
                        ngToast.create({
                            className: 'success',
                            content: '发送测试模板消息成功'
                        });
                    }
                }).catch(function(res){
                    $scope.addMsgTestClicked = false;
                    ngToast.create({
                        className: 'danger',
                        content: '发送测试模板消息失败'
                    });
                });
            };

            $scope.setMinute = function(i){
                $scope.pushTime = Date.parse(new Date()) + 1000*60*i;
            };
            $scope.setHour = function(i){
                $scope.pushTime = Date.parse(new Date()) + 1000*60*60*i;
            };

            $scope.open = false;
            $scope.dateOptions = {
                minDate: new Date(),
                datepickerMode :'day'
            };

            $scope.setTplMsg = function(k,msg){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: './component/temp-message-add/set-tpl-msg.modal.html',
                    controller: 'setTplMsgCtrl',
                    openedClass: 'setTplMsg-modal',
                    backdrop:'static',
                    size: 'md',
                    resolve: {
                        msg: function () {
                            return msg;
                        }
                    }
                });
                modalInstance.result.then(function (msg) {
                    $scope[k] = msg;
                    if(!msg){
                        var errMsg = '';
                        if(k == 'first'){
                            errMsg = '描述1不能为空';
                        }else if(k == 'keyword1'){
                            errMsg = '会员卡号不能为空';
                        }else if(k == 'keyword2'){
                            errMsg = '有效期不能为空';
                        }else if(k == 'remark'){
                            errMsg = '描述2不能为空';
                        }
                        ngToast.create({
                            className: 'danger',
                            content: errMsg
                        });
                    }
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                    var errMsg = '';
                    if(k == 'first'){
                        errMsg = '描述1不能为空';
                    }else if(k == 'keyword1'){
                        errMsg = '会员卡号不能为空';
                    }else if(k == 'keyword2'){
                        errMsg = '有效期不能为空';
                    }else if(k == 'remark'){
                        errMsg = '描述2不能为空';
                    }
                    ngToast.create({
                        className: 'danger',
                        content: errMsg
                    });
                });
            };



        }
    ]);

    angular.module('app').controller('setTplMsgCtrl',['$scope','$uibModalInstance','msg',
        function($scope,$uibModalInstance,msg){

            console.log('msg:',msg);
            $scope.msg = msg;
            $scope.ok = function () {
                $uibModalInstance.close($scope.msg);
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);
})();
