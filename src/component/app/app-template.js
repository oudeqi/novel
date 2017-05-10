;(function(){

'use strict';

angular.module('app.template', []).run(['$templateCache', function($templateCache) {

  $templateCache.put('./component/body/body.html', '<div id="body" class="clearfix"><ui-view name="aside"></ui-view><ui-view name="section"></ui-view></div>');

  $templateCache.put('./component/header/header.html', '<div id="header" ng-controller="header"><nav class="navbar navbar-inverse navbar-fixed-top"><div class="container-fluid"><a class="navbar-brand" href="./index.html"><span class="glyphicon glyphicon-book"></span> <span>2台小说分销系统</span></a><div class="dropdown" uib-dropdown ng-show="userInfo.token"><a class="dropdown-toggle" type="button" uib-dropdown-toggle><div class="pic"><img ng-src="{{userInfo.headIconUrl}}" alt=""></div><div class="txt"><small>你好，</small> <span>{{userInfo.nickName}}</span></div><span class="caret"></span></a><ul class="dropdown-menu" uib-dropdown-menu><li><a href="javascript:void(0);"><i class="glyphicon glyphicon-user"></i> <span>个人资料</span></a></li><li><a href="javascript:void(0);"><i class="glyphicon glyphicon-pencil"></i> <span>修改密码</span></a></li><li role="separator" class="divider"></li><li><a href="javascript:void(0);"><i class="glyphicon glyphicon-off"></i> <span>安全退出</span></a></li></ul></div></div></nav></div>');

  $templateCache.put('./component/login/login.html', '<div id="login" ng-controller="login"><div class="container"><div class="row"><div class="col-xs-12"><div class="page-header"><h1>用户登录</h1></div></div></div><div class="row"><div class="col-xs-12 col-sm-4 col-sm-offset-4"><div uib-alert ng-repeat="alert in alerts" ng-class="\'alert-\' + (alert.type || \'warning\')" close="closeAlert()">{{alert.msg}}</div></div></div></div><div class="form-horizontal container login-form"><div class="form-group"><label for="username" class="col-xs-12 col-sm-4 control-label">用户名</label><div class="col-xs-12 col-sm-4"><input type="text" class="form-control" id="username" placeholder="用户名" ng-model="user.name"></div></div><div class="form-group"><label for="password" class="col-xs-12 col-sm-4 control-label">密码</label><div class="col-xs-12 col-sm-4"><input type="password" class="form-control" id="password" placeholder="密码" ng-model="user.password"></div></div><div class="form-group"><div class="col-xs-12 col-sm-offset-4 col-sm-4"><div class="checkbox"><label><input type="checkbox" checked>记住账号</label></div></div></div><div class="form-group"><div class="col-xs-12 col-sm-offset-4 col-sm-4"><button type="submit" class="btn btn-default" ng-disabled="flag" ng-click="login()">登录</button></div></div></div></div>');

  $templateCache.put('./component/section/section.html', '<div id="section"><ui-view></ui-view></div>');

  $templateCache.put('./component/warpper/warpper.html', '<div id="warpper" ng-controller="warpper"><ui-view name="header"></ui-view><ui-view name="body"></ui-view></div>');

  $templateCache.put('./component/aside/aside.html', '<div id="aside"><div class="container-fluid"><ul class="nav nav-pills nav-stacked"><li role="presentation" class="active"><a href="#"><i class="glyphicon glyphicon-home"></i> <span>首页</span></a></li><li role="presentation"><a href="#"><i class="glyphicon glyphicon-bullhorn"></i> <span>通知</span></a></li><li role="presentation"><a href="#"><i class="glyphicon glyphicon-stats"></i> <span>统计</span></a></li><li role="presentation"><a href="#"><i class="glyphicon glyphicon-home"></i> <span>首页</span></a></li><li role="presentation"><a href="#"><i class="glyphicon glyphicon-bullhorn"></i> <span>通知</span></a></li><li role="presentation"><a href="#"><i class="glyphicon glyphicon-stats"></i> <span>统计</span></a></li><li role="presentation"><a href="#"><i class="glyphicon glyphicon-home"></i> <span>首页</span></a></li><li role="presentation"><a href="#"><i class="glyphicon glyphicon-bullhorn"></i> <span>通知</span></a></li><li role="presentation"><a href="#"><i class="glyphicon glyphicon-stats"></i> <span>统计</span></a></li></ul></div></div>');

  $templateCache.put('./component/home/home.html', '<div class="container-fluid"><ol class="breadcrumb"><li><a href="#">Home</a></li><li><a href="#">Library</a></li><li class="active">Data</li></ol><div>wpshi zhuye</div></div>');

}]);

})();