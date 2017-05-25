;(function(){
    'use strict';
    angular.module('app').controller('promotion-letters',['$scope','$http','$state','$uibModal','$timeout','promoTemplate',
        function($scope,$http,$state,$uibModal,$timeout,promoTemplate){

            $scope.id = $state.params.id; //小说id
            $scope.chapterid = $state.params.chapterid; //章节id
            $scope.name = $state.params.name; //小说名称
            $scope.title = $state.params.title; //章节名称
            $scope.chapters = [];//章节内容

            $http.get('/v1/aut/backend/book?id='+$scope.id).then(function(res){
                console.log('小说详情',res);
                if(!res.data.errMessage){
                    $scope.name = res.data.data.name; //小说名称
                }
            }).catch(function(res){

            });

            //获取当前章节详情
            $http.get('/v1/aut/read/book/chapter',{
                params:{
                    bookid:$scope.id,
                    chapterid:$scope.chapterid
                }
            }).then(function(res){
                console.log('章节详情',res);
                if(!res.data.errMessage){
                    $scope.title = res.data.data.title;//章节名称
                }
            }).catch(function(res){

            });

            $scope.chapters = [];
            $http.get('/v1/backend/book/chapter',{
                params:{
                    id:$scope.id,
                    pageSize:$scope.chapterid,
                    pageIndex:1,
                }
            }).then(function(res){
                console.log('文案章节',res);
                if(!res.data.errMessage){
                    angular.forEach(res.data.data.data,function(item,idx){
                        $scope.chapters[idx] = {
                            chapterTitle:item.title,
                            chapterContent: []
                        };
                        var content = item.content.replace(/[\r]/g,'').split(/[\n]/g);
                        angular.forEach(content,function(it){
                            if(it !== ''){
                                $scope.chapters[idx].chapterContent.push(it);
                            }
                        });
                    });
                }
            }).catch(function(res){

            });


            $scope.templateTitles = promoTemplate().titles;
            $scope.templateCoverimgs = promoTemplate().coverimgs;
            $scope.templateBodys = promoTemplate().bodys;
            $scope.templateFooters = promoTemplate().footers;

            $scope.templateTitle = $scope.templateTitles[0];
            $scope.templateCoverimg = $scope.templateCoverimgs[0];
            $scope.templateBodyStyle = $scope.templateBodys[0];
            $scope.templateFooter = $scope.templateFooters[0];

            var scrollIntoView = function(id){
                document.getElementById(id).scrollIntoView();
            };

            $scope.changeTitle = function(index,id){
                $scope.templateTitle = $scope.templateTitles[index];
                scrollIntoView(id);
            };
            $scope.changeCoverimg = function(index,id){
                $scope.templateCoverimg = $scope.templateCoverimgs[index];
                scrollIntoView(id);
            };
            $scope.changeBody = function(index,id){
                $scope.templateBodyStyle = $scope.templateBodys[index];
                scrollIntoView(id);
            };
            $scope.changeFooter = function(index,id){
                $scope.templateFooter = $scope.templateFooters[index];
                scrollIntoView(id);
            };

            $scope.createLink = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: './component/promotion-letters/promo-letters.modal.html',
                    controller: 'createdLinkCtrl',
                    openedClass: 'create-link-modal',
                    backdrop:'static',
                    size: 'lg',
                    resolve: {
                        promoLinkModal: function () {
                            //标题，封面图，主体，尾，推广链接
                            return {
                                idArr:[
                                    $scope.templateTitle.id,
                                    $scope.templateCoverimg.id,
                                    $scope.templateBodyStyle.id,
                                    $scope.templateFooter.id
                                ],
                                chapter:{
                                    novelId:$scope.id,
                                    chapterId:$scope.chapterid
                                },
                                currChapter:$scope.title
                            };
                        }
                    }
                });
                modalInstance.result.then(function (promoLink) {
                    var idArr = promoLink;
                    $state.go('warpper.views.section.promlink',{
                        id:$scope.id,
                        chapterid:$scope.chapterid,
                        link:encodeURIComponent(JSON.stringify(idArr))
                    },{reload:true});
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };


            $scope.alerts = [];
            $scope.closeAlert = function() {
                $scope.alerts.length = 0;
            };

            $scope.copyContentTitle = 'title';
            $scope.copyTitle = function(){
                $scope.closeAlert();
                $scope.alerts = [{
                    type:'success',
                    msg:'复制标题成功',
                }];
                $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };

            $scope.copyContentBody = 'body';
            $scope.copyBody = function(){
                $scope.closeAlert();
                $scope.alerts = [{
                    type:'success',
                    msg:'复制正文成功',
                }];
                $timeout(function(){
                    $scope.closeAlert();
                },2000);
            };

        }
    ]);

    angular.module('app').controller('createdLinkCtrl',['$scope','$uibModalInstance','$timeout','promoLinkModal','promoTemplate','$http',
        function($scope,$uibModalInstance,$timeout,promoLinkModal,promoTemplate,$http){

            var idArr = promoLinkModal.idArr;
            var chapter = promoLinkModal.chapter;

            $scope.currChapter = promoLinkModal.currChapter;
            console.log(promoLinkModal);
            //标题，封面图，主体，尾，推广链接
            $scope.titleId = idArr[0]; //标题id
            $scope.coverimgId = idArr[1]; //封面图id
            $scope.bodyId = idArr[2]; //主体id
            $scope.footerId = idArr[3]; //尾部id

            $scope.createErrMsg = '';
            $scope.createdLink = function(){
                $http.post('/v1/aut/publish/link',{
                    titleId:$scope.titleId,
                    coverImgId:$scope.coverimgId,
                    bodyId:$scope.bodyId,
                    bottomId:$scope.footerId,
                    bookId:chapter.novelId,
                    cid:chapter.chapterId,
                }).then(function(res){
                    console.log('生成推广链接',res);
                    if(res.data.errMessage){
                        $scope.createErrMsg = res.data.errMessage;
                    }else{
                        promoLinkModal.idArr.push(res.data.data);
                        $uibModalInstance.close(promoLinkModal.idArr);
                    }
                }).catch(function(res){
                    $scope.createErrMsg = '生成推广链接失败';
                });
            };

            var templateTitles = promoTemplate().titles;
            var templateCoverimgs = promoTemplate().coverimgs;
            var templateBodys = promoTemplate().bodys;
            var templateFooters = promoTemplate().footers;

            angular.forEach(templateTitles,function(item){
                if($scope.titleId == item.id){
                    $scope.templateTitle = item;
                }
            });
            angular.forEach(templateCoverimgs,function(item){
                if($scope.coverimgId == item.id){
                    $scope.templateCoverimg = item;
                }
            });
            angular.forEach(templateBodys,function(item){
                if($scope.bodyId == item.id){
                    $scope.templateBodyStyle = item;
                }
            });
            angular.forEach(templateFooters,function(item){
                if($scope.footerId == item.id){
                    $scope.templateFooter = item;
                }
            });

            $scope.ok = function () {
                promoLinkModal.idArr.push($scope.linkId);
                $uibModalInstance.close(promoLinkModal.idArr);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);

    angular.module('app').factory('promoTemplate',function(){

        var titles,coverimgs,bodys,footers;

        titles = [{
            id:1,
            txt:'男人怎么吻你?,就怎么爱你!估计很少人知道......'
        },{
            id:2,
            txt:'一媳妇独自在家忍不住偷偷去找老公，亲眼看到这一幕！'
        },{
            id:3,
            txt:'这是我见过最牛逼的女人！看了没人不服！'
        },{
            id:4,
            txt:'和丈夫结婚多年，直到那一天我才发现，原来丈夫和妹妹早就已经背着我做这些羞耻的勾当！'
        },{
            id:5,
            txt:'新婚当夜，丈夫夜不归宿，隔日还带着情.妇在他们的新房里做那种事[表情][表情]'
        },{
            id:6,
            txt:'结婚六年，老公却和我说，他爱的是我的妹妹[表情][表情]'
        },{
            id:7,
            txt:'你是有多缺爱，出轨的男人你还爱？'
        },{
            id:8,
            txt:'女人最易让男人朝思暮想的特点，你有吗？'
        },{
            id:9,
            txt:'老公出轨，她却比从前更快乐，看到结局的人都哭了.....'
        },{
            id:10,
            txt:'温柔体贴的老公突然提出了离婚，只因为七年前我……'
        },{
            id:11,
            txt:'男人出轨,不是为了爱,而是因为….'
        },{
            id:12,
            txt:'晚上加班巧遇女上司，她竟然让我帮她…'
        },{
            id:13,
            txt:'作为一名称职的男助理，要勇于满足美女总裁的各种需求...'
        },{
            id:14,
            txt:'和老公亲热完，这句话一定不能说！'
        },{
            id:15,
            txt:'“嗯”和“嗯嗯”，就能看出爱和被爱的区别……'
        }];

        coverimgs = [{
            id:1,
            pic:'../../assets/image/promo-coverimg-01.jpg'
        },{
            id:2,
            pic:'../../assets/image/promo-coverimg-02.jpg'
        },{
            id:3,
            pic:'../../assets/image/promo-coverimg-03.jpg'
        }];

        bodys =  [
            {
                id:1,
                pic:'../../assets/image/promo-body-01.jpg',
                templateUrl:'./component/promotion-letters/template-body-style-1.html'
            },
            {
                id:2,
                pic:'../../assets/image/promo-body-02.jpg',
                templateUrl:'./component/promotion-letters/template-body-style-2.html'
            },
            {
                id:3,
                pic:'../../assets/image/promo-body-03.jpg',
                templateUrl:'./component/promotion-letters/template-body-style-3.html'
            }
        ];

        footers = [
            {
                id:1,
                pic:'../../assets/image/promo-look-original-01.gif',
                templateUrl:'./component/promotion-letters/template-footer-style-1.html'
            },
            {
                id:2,
                pic:'../../assets/image/promo-look-original-02.gif',
                templateUrl:'./component/promotion-letters/template-footer-style-2.html'
            },
            {
                id:3,
                pic:'../../assets/image/promo-look-original-03.gif',
                templateUrl:'./component/promotion-letters/template-footer-style-3.html'
            }
        ];
        return function(){
            return {
                titles: titles,
                coverimgs: coverimgs,
                bodys:bodys,
                footers:footers
            };
        };
    });

})();
