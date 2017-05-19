;(function(){
    'use strict';
    angular.module('app').controller('novel-add',['$scope','$http','$timeout',
        function($scope,$http,$timeout){

            $scope.alerts = [];
            $scope.closeAlert = function() {
                $scope.alerts.length = 0;
            };

            $scope.name = '';
            $scope.type = '1';
            $scope.sex = '0';
            $scope.coverImgBase64 = '';
            $scope.author = '';
            $scope.words = '';
            $scope.introduction = '';

            $scope.addBookClicked = false;
            $scope.addBook = function(){
                if(!$scope.name || !$scope.author || !$scope.introduction){
                    return false;
                }
                if($scope.addBookClicked){
                    return false;
                }
                $scope.addBookClicked = true;
                $http.post('/v1/aut/add/book',{
                    name:$scope.name,
                    type:$scope.type,
                    sex:$scope.sex,
                    author:$scope.author,
                    words:$scope.words,
                    introduction:$scope.introduction,
                    coverImgBase64:$scope.coverImgBase64.substring($scope.coverImgBase64.indexOf(',')+1)
                }).then(function(res){
                    console.log('添加图书',res);
                    $scope.addBookClicked = false;
                    $timeout(function(){
                        location.reload();
                    },2000);
                    if(res.data.errMessage){
                        $scope.alerts[0] = {
                            type:'warning',
                            msg:res.data.errMessage
                        };
                    }else{
                        $scope.alerts[0] = {
                            type:'success',
                            msg:res.data.data
                        };
                    }
                }).catch(function(res){
                    $scope.addBookClicked = false;
                    $scope.alerts[0] = {
                        type:'warning',
                        msg:'添加失败！'
                    };
                });
            };


        }
    ]);

    angular.module('app').directive('fileBindPic',function(){
        return {
            ristrict:'A',
            scope:{
                coverImgBase64:'=fileBindPic'
            },
            link:function(scope,elem,attrs){
                elem.bind('change',function(e){
                    var file = e.target.files[0];
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        scope.$apply(function(){
                            scope.coverImgBase64 = reader.result;
                            try{
                                e.target.value = null;
                            }catch(err){
                                console.log(err);
                            }
                        });
                    };
                    if (file) {
                        reader.readAsDataURL(file);
                    } else {
                        scope.$apply(function(){
                            scope.coverImgBase64 = '';
                        });
                    }

                });
            }
        };
    });
})();
