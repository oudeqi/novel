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
        },{
            id:16,
            txt:'男人的心在哪，钱就会花在哪！'
        },{
            id:17,
            txt:'女人的第一次和男人的第一次有什么区别？'
        },{
            id:18,
            txt:'女人最易让男人朝思暮想的特点，你有吗？'
        },{
            id:19,
            txt:'老公出轨，她却比从前更快乐，看到结局的人都哭了.....'
        },{
            id:20,
            txt:'温柔体贴的老公突然提出了离婚，只因为七年前我……'
        },{
            id:21,
            txt:'她让小三流产，老公却更爱她！'
        },{
            id:22,
            txt:'男人出轨,不是为了爱,而是因为….'
        },{
            id:23,
            txt:'有一种陪伴不在身边，却在心间~'
        },{
            id:24,
            txt:'你以为嫁了个没钱的男人，他就一定会对你好？'
        },{
            id:25,
            txt:'男人怎么吻你?,就怎么爱你!估计很少人知道......'
        },{
            id:26,
            txt:'46岁的老板竟说要包养我，我该接受吗？'
        },{
            id:27,
            txt:'做过爱就别做朋友了……'
        },{
            id:28,
            txt:'女生借钱不还，被逼打裸条之后......'
        },{
            id:29,
            txt:'老公出轨，这次她选择不再原谅！'
        },{
            id:30,
            txt:'妻子遭遇不测被侮辱，老公不但不安慰，还立刻拿出一纸离婚协议......'
        },{
            id:31,
            txt:'你的爱情值多少钱？卖给我们就知道了！'
        },{
            id:32,
            txt:'震惊！求爱不成，她和他一起被小三推下楼……'
        },{
            id:33,
            txt:'纯洁少女被鬼压床之后，身体产生了惊人的变化！'
        },{
            id:34,
            txt:'女人做什么都不要做小三！其中辛酸，只有自己知道'
        },{
            id:35,
            txt:'被路人拍到她的不雅视频发上网，清白尽毁，才发现.....'
        },{
            id:36,
            txt:'妻子去世后，丈夫对孩子说了这样的话，看哭了'
        },{
            id:37,
            txt:'都说医生不好做，是因为他们看到不该看到的东西……'
        },{
            id:38,
            txt:'她为救他怀了别人的孩子，被他全家看不起，结局令人唏嘘......'
        },{
            id:39,
            txt:'年薪5万的女人和年薪20万的女人，差别居然这么大！'
        },{
            id:40,
            txt:'最好的闺蜜怀上了我丈夫的孩子，这怎么可能！'
        },{
            id:41,
            txt:'男人大吼：“你不就是嫌我穷吗？要是我有钱你早就扑上来了！”女人回答的太精彩！'
        },{
            id:42,
            txt:'她狠狠给了占他便宜的老男人两巴掌，结果被强......'
        },{
            id:43,
            txt:'她被迫代嫁， 他被迫代娶，当温热的吻袭来.....'
        },{
            id:44,
            txt:'把女人当保姆的男人，该滚了！'
        },{
            id:45,
            txt:'半夜醒来，身边的人不是老公而是小叔子......'
        },{
            id:46,
            txt:'老公给不了的， 或许这种男人能给你……'
        },{
            id:47,
            txt:'要走的人你留不住，装睡的人你叫不醒，不爱你的人你感动不了'
        },{
            id:48,
            txt:'拯救婚姻的从来不是性，但毁掉婚姻的往往是因为性……'
        },{
            id:49,
            txt:'从门缝中窥探到那一刻的呻吟与娇笑，她忽然明白自己才是小三'
        },{
            id:50,
            txt:'婚礼当天她被亲人下药，没想到刚出虎穴，又入狼窝......'
        },{
            id:51,
            txt:'妻子出轨，丈夫默默原谅了她，她居然扬言要离婚！'
        },{
            id:52,
            txt:'“以身抵债，嫁给我。” “……谈好条件再说。”'
        },{
            id:53,
            txt:'如何做一个让男人有冲动的女人？'
        },{
            id:54,
            txt:'你老公不爱你？好巧，我也是'
        },{
            id:55,
            txt:'提前回家，卧室里竟然躺着另一个女人....'
        },{
            id:56,
            txt:'姐夫谢谢你，让我体验到做女人的乐趣！'
        },{
            id:57,
            txt:'男人厌倦一个女人往往从身体开始，女人厌倦一个男人却是从.....'
        },{
            id:58,
            txt:'有种女人 ， 睡过一次就想睡一辈子！'
        },{
            id:59,
            txt:'带着哥嫂去捉小三，踹开门我们都傻了眼……'
        },{
            id:60,
            txt:'结婚一年未孕，老公把情人带回了家……'
        },{
            id:61,
            txt:'男人骨子里最惦记的女人永远是这一种！'
        },{
            id:62,
            txt:'结婚后才发现，老公娶我只是因为他儿子喜欢我'
        },{
            id:63,
            txt:'感情再好，也千万别找男人要这个东西！'
        },{
            id:64,
            txt:'替父还债，嫁给了生活不能自理的男人……'
        },{
            id:65,
            txt:'约炮遇到真爱怎么办？'
        },{
            id:66,
            txt:'怀了孩子，却被出轨老公强行押上人流手术台...'
        },{
            id:67,
            txt:'古代洞房都用了什么骇人听闻的姿势?'
        },{
            id:68,
            txt:'想脱你衣服的人很多，想给你买衣服的有吗'
        },{
            id:69,
            txt:'两大美女校花竟为我争风吃醋，一个出500W，一个要以身相许…'
        },{
            id:70,
            txt:'卧铺车厢的邻座美女，要和我同睡一个被窝…'
        },{
            id:71,
            txt:'被美女开豪车撞伤，为补偿我，她半夜竟……'
        },{
            id:72,
            txt:'用QQ小号捉弄美女老师，竟意外发现了她不为人知的秘密……'
        },{
            id:73,
            txt:'女友跟了高富帅，我只用了一招让她肠子都悔青了……'
        },{
            id:74,
            txt:'出狱后，美女竟用这种方式迎接他……'
        },{
            id:75,
            txt:'我在夜店做男公关，竟撞到表嫂来……'
        },{
            id:76,
            txt:'他一身顶级医术却只给美女看病，因为他可以……'
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
        },{
            id:4,
            pic:'../../assets/image/promo-coverimg-04.jpg'
        },{
            id:5,
            pic:'../../assets/image/promo-coverimg-05.jpg'
        },{
            id:6,
            pic:'../../assets/image/promo-coverimg-06.jpeg'
        },{
            id:7,
            pic:'../../assets/image/promo-coverimg-07.jpg'
        },{
            id:8,
            pic:'../../assets/image/promo-coverimg-08.jpg'
        },{
            id:9,
            pic:'../../assets/image/promo-coverimg-09.jpg'
        },{
            id:10,
            pic:'../../assets/image/promo-coverimg-10.jpeg'
        },{
            id:11,
            pic:'../../assets/image/promo-coverimg-11.jpg'
        },{
            id:12,
            pic:'../../assets/image/promo-coverimg-12.jpg'
        },{
            id:13,
            pic:'../../assets/image/promo-coverimg-13.jpeg'
        },{
            id:14,
            pic:'../../assets/image/promo-coverimg-14.jpg'
        },{
            id:15,
            pic:'../../assets/image/promo-coverimg-15.jpg'
        },{
            id:16,
            pic:'../../assets/image/promo-coverimg-16.jpg'
        },{
            id:17,
            pic:'../../assets/image/promo-coverimg-17.jpg'
        },{
            id:18,
            pic:'../../assets/image/promo-coverimg-18.jpg'
        },{
            id:19,
            pic:'../../assets/image/promo-coverimg-19.jpg'
        },{
            id:20,
            pic:'../../assets/image/promo-coverimg-20.png'
        },{
            id:21,
            pic:'../../assets/image/promo-coverimg-21.png'
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
