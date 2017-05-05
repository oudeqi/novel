;(function(){

    "use strict";

    angular.module("app",[
        "app.router",
        "app.constant",
        "app.directive",
        "app.toast"
    ]);

    angular.module("app").run(["$rootScope", "$location",
        function($rootScope, $location) {

            window.addEventListener("scroll",function(e){
                $rootScope.$broadcast("scroll",e);
            },false);

            var url = $location.$$absUrl,
                start = url.indexOf("?")+1,
                end = url.indexOf("#");
            if(end == -1){
                end = url.length;
            }
            $rootScope.hasHeader = true;
            var paramStr = url.substring(start,end),
                param = paramStr.split("&"),voteId,voteToken;

            for (var i = 0; i < param.length; i++) {
                var p = param[i].split("=");
                if(p[0] == "id"){
                    voteId = p[1];
                }
                if(p[0] == "token"){
                    voteToken = p[1];
                }
                if(p[0] == "nh"){//nh无头
                    $rootScope.hasHeader = false;
                }
            }

            console.log("id+token:",voteId,voteToken);
            if(voteId){
                localStorage.setItem("voteId",voteId);
            }else{
                localStorage.setItem("voteId","");
            }
            if(voteToken){
                localStorage.setItem("voteToken",voteToken);
            }else{
                localStorage.setItem("voteToken","");
            }

            $rootScope.close = function(){
                console.log("close");
                if(typeof h5 == "object"){
                    // h5.backEvent();
                    h5.mallBack();
                }else{
                    alert("缺少h5对象");
                }
            };

            $rootScope.login = function(){
                console.log("未登录");
                if(typeof h5 == "object"){
                    h5.openLogin();
                }else{
                    alert("缺少h5对象");
                }
            };

        }
    ]).factory("device",["$window",function($window){
        var userAgent = $window.navigator.userAgent.toLowerCase();
        function find(needle){
            return userAgent.indexOf(needle) !== -1;
        }
        return {
            screenW : function(){
                return parseInt($window.innerWidth);
            },
            iphone : function(){
                return find('iphone');
            },
            android : function(){
                return find('android');
            }
        };
    }]);
    angular.module("app.router",["ui.router","appTemplate"]);
    angular.module("app.directive",["appTemplate"]);
    angular.module("app.directive").directive('cleanFileValue',function(){
        return {
            restrict:'A',
            link:function(scope,elem,attrs){
                elem.bind("change",function(ev){
                    try{
                        ev.target.value = null;
                    }catch(err){
                        console.log(err);
                    }
                });
            }
        };
    });
    angular.module("app.constant",[]).constant("HOST","https://api.2tai.com");
    // angular.module("app.constant",[]).constant("HOST","http://192.168.10.40:8080");


})();
