;(function(){
    'use strict';
    angular.module('app').controller('chapter-modify',['$scope','$http','$state',
        function($scope,$http,$state){

            $scope.id = $state.params.id;
            $scope.novel = {};
            $scope.novel.name = $state.params.name;

            $scope.chapterid = $state.params.chapterid;

            $http.get('/v1/aut/backend/book?id='+$scope.id).then(function(res){
                console.log('小说详情',res);
                if(!res.data.errMessage){
                    $scope.novel = res.data.data;
                }
            }).catch(function(res){

            });


            $scope.title = ''; //章节名称
            $scope.gold = null; //章节费用
            $scope.content = '';//章节内容
            $http.get('/v1/aut/read/book/chapter',{
                params:{
                    bookid:$scope.id,
                    chapterid:$scope.chapterid,
                }
            }).then(function(res){
                console.log('章节详情',res);
                if(!res.data.errMessage){
                    $scope.title = res.data.data.title;
                    $scope.gold = res.data.data.gold;
                    $scope.content = res.data.data.content;
                }
            }).catch(function(res){

            });

            $scope.alerts = [];

            $scope.modifyChapterClicked = false;
            $scope.modifyChapter = function(){
                if(!$scope.title || !$scope.content){
                    return false;
                }
                if($scope.modifyChapterClicked){
                    return false;
                }
                $scope.modifyChapterClicked = true;
                $http.post('/v1/aut/update/chapter',{
                    bookId:$scope.id,
                    cid:$scope.chapterid,
                    title:$scope.title,
                    gold:$scope.gold,
                    content:$scope.content
                }).then(function(res){
                    console.log('修改章节',res);
                    $scope.modifyChapterClicked = false;
                    if(res.data.errMessage){
                        $scope.alerts[0] = {
                            type:'warning',
                            msg:res.data.errMessage
                        };
                    }else{
                        location.reload();
                    }
                }).catch(function(res){
                    $scope.modifyChapterClicked = false;
                    $scope.alerts[0] = {
                        type:'warning',
                        msg:'修改失败！'
                    };
                });
            };





        }
    ]);
})();
