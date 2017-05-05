;(function(){
    "use strict";
    angular.module("app.router")
    .config(["$stateProvider","$urlRouterProvider",
        function($stateProvider,$urlRouterProvider) {
            $urlRouterProvider.otherwise("/home/index");
            $stateProvider.state({
                name: "home",
                url: "/home",
                templateUrl: "../warpper/warpper.html"
            });
            $stateProvider.state({
                name: "home.index",
                url: "/index",
                templateUrl: "../index/index.html"
            });
            $stateProvider.state({
                name: "home.ranking",
                url: "/ranking",
                templateUrl: "../ranking/ranking.html"
            });
            $stateProvider.state({
                name: "signup",
                url: "/signup",
                templateUrl: "../signup/signup.html",
                resolve: {
                    isLogin: ["$q",function($q){
                        var deferred = $q.defer();
                        if(!!localStorage.getItem("voteToken")){
                            deferred.resolve("已经登录");
                        }else{
                            console.log("未登录");
                            if(typeof h5 == "object"){
                                h5.openLogin();
                            }else{
                                alert("未登录");
                            }
                            deferred.reject("未登录");
                        }
                        return deferred.promise;
                    }]
                }
            });
            $stateProvider.state({
                name: "vote",
                url: "/vote/:id",
                templateUrl: "../vote/vote.html"
            });
            $stateProvider.state({
                name: "player",
                url: "/player/:id",
                templateUrl: "../player/player.html"
            });
            $stateProvider.state({
                name: "succ",
                url: "/succ/:id",
                templateUrl: "../succ/succ.html"
            });
        }
    ]);

})();
