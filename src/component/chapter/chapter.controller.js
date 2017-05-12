;(function(){
    'use strict';
    angular.module('app').controller('chapter',['$scope','$http','$state',
        function($scope,$http,$state){

            console.log($state.params);

            $scope.id = $state.params.id; //小说id
            $scope.chapterid = $state.params.chapterid; //章节id
            $scope.name = $state.params.name; //小说名称
            $scope.title = $state.params.title; //章节名称

            $http.get('/v1/aut/backend/book?id='+$scope.id).then(function(res){
                console.log('小说详情',res);
                if(!res.data.errMessage){
                    $scope.name = res.data.data.name; //小说名称
                }
            }).catch(function(res){

            });

            $http.get('/v1/aut/read/book/chapter?bookid='+$scope.id+'&chapterid='+$scope.chapterid)
            .then(function(res){
                console.log('章节详情',res);
                if(!res.data.errMessage){
                    $scope.title = res.data.data.title;//章节名称
                    $scope.content = res.data.data.content;
                }
            }).catch(function(res){

            });

            $scope.theme = 'primary';


        }
    ]);
})();
