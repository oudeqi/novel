;(function(){
    'use strict';
    angular.module('app').config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    title:'',
                    name:''
                },
                name: 'warpper.views.section.promletters',
                url: '^/nls/{id}/{chapterid}/plt',
                templateUrl: './component/promotion-letters/promotion-letters.html'
            });

        }
    ]);
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
            $http.get('/v1/aut/book/chapter/before',{
                params:{
                    bookid:$scope.id,
                    cid:$scope.chapterid
                }
            }).then(function(res){
                console.log('文案章节',res);
                if(!res.data.errMessage){
                    angular.forEach(res.data.data,function(item,idx){
                        $scope.chapters[idx] = {
                            chapterTitle:item.title,
                            chapterContent: []
                        };
                        // var content = item.content.replace(/[\r]/g,'').split(/[\n]/g);
                        var content = item.content.split('<br />');
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
            txt:'高层次的女人，才不会去做情人'
        },{
            id:2,
            txt:'不想睡觉，也不想睡你'
        },{
            id:3,
            txt:'我让我男朋友换上女头像，结果...'
        },{
            id:4,
            txt:'把喜欢的人骗上床的方法只有一个！'
        },{
            id:5,
            txt:'前男友在我婚礼上放了我的裸照'
        },{
            id:6,
            txt:'女子监狱的犯人是如何解决生理需求的？'
        },{
            id:7,
            txt:'媳妇玩了一夜，丈夫推开房门看到一幕，吓坏了！'
        },{
            id:8,
            txt:'男人太快和你发生关系，这说明了什么？'
        },{
            id:9,
            txt:'儿媳妇与情人开房，被婆婆抓到，结果让人傻眼了！'
        },{
            id:10,
            txt:'老公洗浴中心被抓,媳妇…'
        },{
            id:11,
            txt:'作为一名称职的男助理，要勇于满足美女总裁的各种需求……'
        },{
            id:12,
            txt:'我在夜店做男公关，竟撞到表嫂来……'
        },{
            id:13,
            txt:'一对才结婚3个月就离婚的小夫妻聊天记录，火了！'
        },{
            id:14,
            txt:'被逼嫁给陌生男人，没想到每天被折磨到下不了床……'
        },{
            id:15,
            txt:'女大学生贪恋美男意外穿越回古代，遭遇英俊王爷后她竟然……'
        },{
            id:16,
            txt:'1次约会看电影，直接把她带回家！'
        },{
            id:17,
            txt:'被养母逼嫁豪门，新婚当晚，小叔子竟要强行和我洞房......'
        },{
            id:18,
            txt:'穷小伙靠漂亮媳妇成为亿万富豪，结果....'
        },{
            id:19,
            txt:'像这种男人，要不要原谅他？'
        },{
            id:20,
            txt:'婚后不孕，老公竟想出这种难以启齿的方法！'
        },{
            id:21,
            txt:'他新娘未到，她新郎落跑，女人轻声道“不如……我们拼个婚？”'
        },{
            id:22,
            txt:'怀孕了老公还一夜7次折腾她,几次拒绝之后,老公竟然.....'
        },{
            id:23,
            txt:'闺蜜的新婚夜，新郎却说要跟我生孩子'
        },{
            id:24,
            txt:'女人为什么会找情人？'
        },{
            id:25,
            txt:'漂亮女徒弟，她竟然让我教她这个…'
        },{
            id:26,
            txt:'老婆和情人在男人眼里最大的区别竟是这个'
        },{
            id:27,
            txt:'离婚前夜，老公却......'
        },{
            id:28,
            txt:'让闺蜜用微信试探老公,竟发现深藏多年的秘密'
        },{
            id:29,
            txt:'女人最易让男人朝思暮想的特点，你有吗'
        },{
            id:30,
            txt:'火车上美女被人下了药，我跟踪她进厕所……'
        },{
            id:31,
            txt:'女人 ，一定要出轨一次 ！'
        },{
            id:32,
            txt:'赌气她嫁给了街边的乞丐， 没想到这个乞丐老公却是个'
        },{
            id:33,
            txt:'正常男人一天想亲热几次？'
        },{
            id:34,
            txt:'男人出轨,不是为了爱,而是因为…'
        },{
            id:35,
            txt:'想给老公惊喜，竟发现闺蜜和他在......'
        },{
            id:36,
            txt:'老公有这种表现，他一定是出轨了'
        },{
            id:37,
            txt:'我和女上司出差，她竟然对我提出奇葩要求！'
        },{
            id:38,
            txt:'这才叫情人，你有吗？'
        },{
            id:39,
            txt:'这样的情人，你有吗？'
        },{
            id:40,
            txt:'恨你，却把一切都给了你，说出了女人的心声……'
        },{
            id:41,
            txt:'我和美女同事出差，她竟然对我提出奇葩要求！'
        },{
            id:42,
            txt:'一夜激情后，再见他时才知道，自己竟把姐夫给睡了…'
        },{
            id:43,
            txt:'老公出轨前，一般都有哪些暗示？'
        },{
            id:44,
            txt:'和老公亲热完，这句话一定不能说！'
        },{
            id:45,
            txt:'相亲一次就领证,婚后的每一晚都让我难以启齿……'
        },{
            id:46,
            txt:'她8年不生孩子,竟是嫌老公长得难看, 老公出场震惊了 ！'
        },{
            id:47,
            txt:'老公在外面夜生活成瘾，我却一次就怀孕了，婆婆竟说……'
        }];

        coverimgs = [{
            id:1,
            pic:'../../assets/image/promo-coverimg-01.png'
        },{
            id:2,
            pic:'../../assets/image/promo-coverimg-02.png'
        },{
            id:3,
            pic:'../../assets/image/promo-coverimg-03.png'
        },{
            id:4,
            pic:'../../assets/image/promo-coverimg-04.png'
        },{
            id:5,
            pic:'../../assets/image/promo-coverimg-05.png'
        },{
            id:6,
            pic:'../../assets/image/promo-coverimg-06.png'
        },{
            id:7,
            pic:'../../assets/image/promo-coverimg-07.png'
        },{
            id:8,
            pic:'../../assets/image/promo-coverimg-08.png'
        },{
            id:9,
            pic:'../../assets/image/promo-coverimg-09.png'
        },{
            id:10,
            pic:'../../assets/image/promo-coverimg-10.png'
        },{
            id:11,
            pic:'../../assets/image/promo-coverimg-11.png'
        },{
            id:12,
            pic:'../../assets/image/promo-coverimg-12.png'
        },{
            id:13,
            pic:'../../assets/image/promo-coverimg-13.png'
        },{
            id:14,
            pic:'../../assets/image/promo-coverimg-14.png'
        },{
            id:15,
            pic:'../../assets/image/promo-coverimg-15.png'
        },{
            id:16,
            pic:'../../assets/image/promo-coverimg-16.png'
        },{
            id:17,
            pic:'../../assets/image/promo-coverimg-17.png'
        },{
            id:18,
            pic:'../../assets/image/promo-coverimg-18.png'
        },{
            id:19,
            pic:'../../assets/image/promo-coverimg-19.png'
        },{
            id:20,
            pic:'../../assets/image/promo-coverimg-20.png'
        },{
            id:21,
            pic:'../../assets/image/promo-coverimg-21.png'
        },{
            id:22,
            pic:'../../assets/image/promo-coverimg-22.png'
        },{
            id:23,
            pic:'../../assets/image/promo-coverimg-23.png'
        },{
            id:24,
            pic:'../../assets/image/promo-coverimg-24.png'
        },{
            id:25,
            pic:'../../assets/image/promo-coverimg-25.png'
        },{
            id:26,
            pic:'../../assets/image/promo-coverimg-26.png'
        },{
            id:27,
            pic:'../../assets/image/promo-coverimg-27.png'
        },{
            id:28,
            pic:'../../assets/image/promo-coverimg-28.png'
        },{
            id:29,
            pic:'../../assets/image/promo-coverimg-29.png'
        },{
            id:30,
            pic:'../../assets/image/promo-coverimg-30.png'
        },{
            id:31,
            pic:'../../assets/image/promo-coverimg-31.png'
        },{
            id:32,
            pic:'../../assets/image/promo-coverimg-32.png'
        }];

        bodys =  [
            {
                id:1,
                pic:'../../assets/image/promo-body-01.jpg',
                templateUrl:'./component/promotion-letters/template-body-style-1.html'
            }
            // ,
            // {
            //     id:2,
            //     pic:'../../assets/image/promo-body-02.jpg',
            //     templateUrl:'./component/promotion-letters/template-body-style-2.html'
            // },
            // {
            //     id:3,
            //     pic:'../../assets/image/promo-body-03.jpg',
            //     templateUrl:'./component/promotion-letters/template-body-style-3.html'
            // }
        ];

        footers = [
            {
                id:1,
                pic:'../../assets/image/promo-look-original-01.gif',
                templateUrl:'./component/promotion-letters/template-footer-style-1.html'
            }
            // ,
            // {
            //     id:2,
            //     pic:'../../assets/image/promo-look-original-02.gif',
            //     templateUrl:'./component/promotion-letters/template-footer-style-2.html'
            // },
            // {
            //     id:3,
            //     pic:'../../assets/image/promo-look-original-03.gif',
            //     templateUrl:'./component/promotion-letters/template-footer-style-3.html'
            // }
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
