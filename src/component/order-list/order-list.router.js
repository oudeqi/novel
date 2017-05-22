;(function(){

    'use strict';

    angular.module('app')
    .config(['$stateProvider',
        function($stateProvider){

            $stateProvider.state({
                params:{
                    name:''
                },
                name: 'warpper.views.section.orderList',
                url: '^/ol',
                templateUrl: './component/order-list/order-list.html'
            });

        }
    ]);

})();
