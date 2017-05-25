;(function(){
    'use strict';

    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    name:''
                },
                name: 'warpper.views.section.chapterAdd',
                url: '^/nls/{id}/ca',
                templateUrl: './component/chapter-add/chapter-add.html'
            });

        }
    ]);

    angular.module('app').controller('chapter-add',['$scope','$http','$state',
        function($scope,$http,$state){

            $scope.id = $state.params.id;
            $scope.novel = {};
            $scope.novel.name = $state.params.name;

            $http.get('/v1/aut/backend/book?id='+$scope.id).then(function(res){
                console.log('小说详情',res);
                if(!res.data.errMessage){
                    $scope.novel = res.data.data;
                }
            }).catch(function(res){

            });

            $scope.alerts = [];
            $scope.chapters = [];

            $scope.title = '';
            $scope.gold = null;
            $scope.content = '';

            $scope.addChapterClicked = false;
            $scope.addChapter = function(){
                if(!$scope.title || !$scope.content){
                    return false;
                }
                if($scope.addChapterClicked){
                    return false;
                }
                $scope.addChapterClicked = true;
                $http.post('/v1/aut/add/book/chapter',{
                    bookId:$scope.id,
                    title:$scope.title,
                    gold:$scope.gold,
                    content:$scope.content
                }).then(function(res){
                    console.log('添加章节',res);
                    $scope.addChapterClicked = false;
                    if(res.data.errMessage){
                        $scope.alerts[0] = {
                            type:'warning',
                            msg:res.data.errMessage
                        };
                    }else{
                        $scope.chapters.push(res.data.data);
                        $scope.title = '';
                        $scope.gold = null;
                        $scope.content = '';
                    }
                }).catch(function(res){
                    $scope.addChapterClicked = false;
                    $scope.alerts[0] = {
                        type:'warning',
                        msg:'添加章节失败！'
                    };
                });
            };





        }
    ]);
})();
