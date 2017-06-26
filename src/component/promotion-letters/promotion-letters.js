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
            $scope.h5Introduction=null;
            $scope.h5coverImg=null;

            $http.get('/v1/aut/backend/book?id='+$scope.id).then(function(res){
                console.log('小说详情',res);
                if(!res.data.errMessage){
                    $scope.name = res.data.data.name; //小说名称
                    $scope.h5Introduction =res.data.data.h5Introduction ;
                    $scope.h5coverImg=res.data.data.coverImg;
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
                        var reg = new RegExp("\<p\/\>","g");
                        var content = item.content.replace(reg, '</p>');
                        $scope.chapters[idx] = {
                            chapterTitle:item.title,
                            chapterContent: content
                            // chapterContent: []
                        };
                        // var content = item.content.replace(/[\r]/g,'').split(/[\n]/g);
                        // var content = item.content.split('<br />');
                        // angular.forEach(content,function(it){
                        //     if(it !== ''){
                        //         $scope.chapters[idx].chapterContent.push(it);
                        //     }
                        // });
                    });
                }
            }).catch(function(res){

            });


            $scope.templateTitles = promoTemplate().titles;
            $scope.templateCoverimgs = promoTemplate().coverimgs;
            $scope.templateBodys = promoTemplate().bodys;
            $scope.templateFooters = promoTemplate().footers;

//          $scope.templateTitle = $scope.templateTitles[0];
//          $scope.templateCoverimg = $scope.templateCoverimgs[0];
//          $scope.templateBodyStyle = $scope.templateBodys[0];
//          $scope.templateFooter = $scope.templateFooters[0];
			$scope.templateTitle = $scope.templateTitles[parseInt(Math.random()*$scope.templateTitles.length)];
            $scope.templateCoverimg = $scope.templateCoverimgs[parseInt(Math.random()*$scope.templateCoverimgs.length)];
            $scope.templateBodyStyle = $scope.templateBodys[parseInt(Math.random()*$scope.templateBodys.length)];
            $scope.templateFooter = $scope.templateFooters[parseInt(Math.random()*$scope.templateFooters.length)];

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
            	console.log(index);
            	
            	localStorage.ffer_img=$scope.templateFooters[index].pic;
            	console.log(localStorage.ffer_img)
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
            txt:'成年人的分手，是不做仇人也不做朋友'
        },{
            id:2,
            txt:'为什么男人都喜欢这样的女人？'
        },{
            id:3,
            txt:'为什么总有那么多原配斗不过小三？！'
        },{
            id:4,
            txt:'夫妻之间这三件事女人做得越多，男人越不会爱你！'
        },{
            id:5,
            txt:'她不天高地厚的招惹了他，却被他无所顾忌的温柔盛宠'
        },{
            id:6,
            txt:'马上就30岁，男人曾说如果我30岁还未嫁，他就娶我'
        },{
            id:7,
            txt:'公婆骂我生不了，我扔出一张照片，两人看后全傻了'
        },{
            id:8,
            txt:'我重回仙界，便是你等覆灭之时！那些曾经伤害我的人，等着颤抖吧'
        },{
            id:9,
            txt:'男生不想跟你聊天的表现'
        },{
            id:10,
            txt:'“原来大家的男朋友都这样啊！那我不分手了...”'
        },{
            id:11,
            txt:'男生最讨厌女生的十句话，排名第一的是……'
        },{
            id:12,
            txt:'没有完全匹配的爱情，只有不肯放手的爱人'
        },{
            id:13,
            txt:'一个女孩子最重要的是什么？'
        },{
            id:14,
            txt:'“他爱不爱你，吵架见分晓。”'
        },{
            id:15,
            txt:'离婚时她肚里的种子悄悄发芽，三年后带着一对双胞胎归来'
        },{
            id:16,
            txt:'这样的女人在朋友圈最受欢迎。'
        },{
            id:17,
            txt:'你上一段恋爱给你留下了哪些“后遗症”？'
        },{
            id:18,
            txt:'以后和老公吵架了，就这么做！女人都看看。'
        },{
            id:19,
            txt:'为什么说嫁给第二个男人的女人最最幸福？'
        },{
            id:20,
            txt:'5年后再相遇，小萌娃冲着他叫嚣：老腊肉你敢抢我妈咪？'
        },{
            id:21,
            txt:'第一次约会男生会想什么？'
        },{
            id:22,
            txt:'为什么古代有些皇后到死都是处女？'
        },{
            id:23,
            txt:'睡不到小包总的人生还有什么意思！'
        },{
            id:24,
            txt:'怎样才能成为一个情绪成熟的女人'
        },{
            id:25,
            txt:'高层次的女人，才不会去做情人'
        },{
            id:26,
            txt:'你就把自己当成孩子，我宠你'
        },{
            id:27,
            txt:'我让我男朋友换上女头像，结果...'
        },{
            id:28,
            txt:'你这么讨厌邱莹莹，是因为你不敢正视你自己'
        },{
            id:29,
            txt:'婚姻里，有多少女人被炼成了泼妇？'
        },{
            id:30,
            txt:'一个女人的10年，千万不要和她一样…每位妻子看后都泪流满面！'
        },{
            id:31,
            txt:'一对才结婚3个月就离婚的小夫妻聊天记录，火了！'
        },{
            id:32,
            txt:'女大学生贪恋美男意外穿越回古代，遭遇英俊王爷后她竟然……'
        },{
            id:33,
            txt:'穷小伙靠漂亮媳妇成为亿万富豪，结果....'
        },{
            id:34,
            txt:'像这种男人，要不要原谅他？'
        },{
            id:35,
            txt:'他新娘未到，她新郎落跑，女人轻声道“不如……我们拼个婚？”'
        },{
            id:36,
            txt:'老婆和情人在男人眼里最大的区别竟是这个'
        },{
            id:37,
            txt:'让闺蜜用微信试探老公,竟发现深藏多年的秘密'
        },{
            id:38,
            txt:'女人最易让男人朝思暮想的特点，你有吗'
        },{
            id:39,
            txt:'赌气她嫁给了街边的乞丐， 没想到这个乞丐老公却是个'
        },{
            id:40,
            txt:'女人永远戒不掉的4大谎言，你有说过吗？'
        },{
            id:41,
            txt:'7个细节测出男人爱你有多深，很准哦！'
        },{
            id:42,
            txt:'老公有这种表现，他一定是出轨了'
        },{
            id:43,
            txt:'女人，懂得低头，是智慧和成熟！'
        },{
            id:44,
            txt:'懂事的女人最委屈，女人一定要看看'
        },{
            id:45,
            txt:'这样的情人，你有吗？'
        },{
            id:46,
            txt:'恨你，却把一切都给了你，说出了女人的心声……'
        },{
            id:49,
            txt:'她8年不生孩子,竟是嫌老公长得难看, 老公出场震惊了 ！'
        },{
        	id:50,
        	txt:'赫赫有名的商业巨头向寄人篱下的孤女求婚，他不是为了爱情也不是贪图美貌而是……'
        },{
        	id:51,
        	txt:'敢问姑娘，这是什么暗器……'
        },{
        	id:52,
        	txt:'火葬场旁边的Wi-Fi不能连……'
        },{
        	id:53,
        	txt:'为了救我，9岁那年爷爷让我娶了个女鬼……'
        },{
        	id:54,
        	txt:'男寝4楼的铁栅门紧锁着.据说，晚上12点之后，404房间里会传来女孩儿的哭泣声……'
        },{
        	id:55,
        	txt:'含恨而生，她只求父亲一生平安，那对贱人生不如死！'
        },{
        	id:56,
        	txt:'重生不如抱紧奸臣夫君金大腿！'
        },{
        	id:57,
        	txt:'任何人敢挡在我面前，一拳干爆！'
        },{
        	id:58,
        	txt:'回到了毕业季。这辈子他不想看任何人的脸色，更不想被束缚了！'
        },{
        	id:59,
        	txt:'他该怎样绝地反击，成为自己的人生赢家呢？'
        },{
        	id:60,
        	txt:'这里是距离六道轮回最近的世界……'
        },{
        	id:61,
        	txt:'红衣夜女杀人案、枯井中的无脸之人、河中的人形怪物……'
        },{
        	id:62,
        	txt:'从我翻开爷爷笔记的那一刻，我就知道，自己回不了头了……'
        },{
        	id:63,
        	txt:'一只枯皱的手伸到面前……'
        },{
        	id:64,
        	txt:'魑魅魍魉，百鬼夜行，这是一个混乱的世界……'
        },{
        	id:65,
        	txt:'一朝穿越成弃妇，腹黑美男找上门！说好的守寡呢？！'
        },{
        	id:66,
        	txt:'衙内小千金，凶猛更磨人！……'
        },{
        	id:67,
        	txt:'重生只想低调的虐渣！可是某位爷总是想把她宠上天'
        },{
        	id:68,
        	txt:'人生要能重启，谁都能成为人生赢家吧？'
        },{
        	id:69,
        	txt:'刚重生就被睡了，生个儿子还是重生的！'
        },{
        	id:70,
        	txt:'桃花尽开，百鸟来朝，她注定不凡'
        },{
        	id:71,
        	txt:'在解剖过程中，这具尸体活过来了！'
        },{
        	id:72,
        	txt:'大人，娘娘们又送礼物来了，她们想请您算算，今夜皇上会翻哪位娘娘的牌子？'
        },{
        	id:73,
        	txt:'她是孤女，被他收养多年，终于有一日……'
        },{
        	id:74,
        	txt:'五年前，她被迫嫁入北城第一名门……'
        },{
        	id:75,
        	txt:'她被继母骗吃激素药，从一个苗条少女变成一个超级肥婆'
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
        },{
            id:33,
            pic:'../../assets/image/mtxx01.jpg'
        },{
            id:34,
           pic:'../../assets/image/mtxx02.jpg'
        },{
            id:35,
           pic:'../../assets/image/mtxx03.jpg'
        },{
            id:36,
           pic:'../../assets/image/mtxx04.jpg'
        },{
            id:37,
            pic:'../../assets/image/mtxx05.jpg'
        },{
            id:38,
           pic:'../../assets/image/mtxx06.jpg'
        },{
            id:39,
           pic:'../../assets/image/mtxx07.jpg'
        },{
            id:40,
            pic:'../../assets/image/mtxx08.jpg'
        },{
            id:41,
           pic:'../../assets/image/mtxx09.jpg'
        },{
            id:42,
            pic:'../../assets/image/mtxx10.jpg'
        },{
            id:43,
           pic:'../../assets/image/mtxx11.jpg'
        },{
            id:44,
            pic:'../../assets/image/mtxx12.jpg'
        },{
            id:45,
            pic:'../../assets/image/timg (1).jpg'
        },{
            id:46,
            pic:'../../assets/image/timg (2).jpg'
        },{
            id:47,
            pic:'../../assets/image/timg (3).jpg'
        },{
            id:48,
            pic:'../../assets/image/timg (4).jpg'
        },{
            id:49,
            pic:'../../assets/image/timg (5).jpg'
        },{
            id:50,
            pic:'../../assets/image/timg (6).jpg'
        },{
            id:51,
            pic:'../../assets/image/timg (7).jpg'
        },{
            id:52,
            pic:'../../assets/image/timg (8).jpg'
        },{
            id:53,
            pic:'../../assets/image/timg (9).jpg'
        },{
            id:54,
            pic:'../../assets/image/timg (10).jpg'
        },{
            id:55,
            pic:'../../assets/image/timg (11).jpg'
        },{
            id:56,
            pic:'../../assets/image/timg (12).jpg'
        },];

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
            },
//          {
//          	id:3,
//          	pic:'../../assets/image/promo-body-03.jpg',
//          	templateUrl:'./component/promotion-letters/template-body-style-2.html'
//          }
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
            },
            {
                id:2,
                pic:'../../assets/image/footer1.jpg',
                templateUrl:"./component/promotion-letters/template-footer-style-2.html"
            },
            {
                id:3,
                pic:'../../assets/image/footer2.jpg',
                templateUrl:'./component/promotion-letters/template-footer-style-3.html'
            },
            {
                id:4,
                pic:'../../assets/image/footer3.jpg',
                templateUrl:'./component/promotion-letters/template-footer-style-4.html'
            },
            
            {
                id:5,
                pic:'../../assets/image/footer_animated1.jpg',
                templateUrl:'./component/promotion-letters/template-footer-style-5.html'
            },
            {
                id:6,
                pic:'../../assets/image/footer_animated3.jpg',
                templateUrl:'./component/promotion-letters/template-footer-style-6.html'
            },
            
            
//             ,
//             {
//                 id:2,
//                 pic:'../../assets/image/promo-look-original-02.gif',
//                 templateUrl:'./component/promotion-letters/template-footer-style-2.html'
//             },
//             {
//                 id:3,
//                 pic:'../../assets/image/promo-look-original-03.gif',
//                 templateUrl:'./component/promotion-letters/template-footer-style-3.html'
//             }
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
