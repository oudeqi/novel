;(function(){
    'use strict';
    angular.module('app').controller('agentctl_edit',['$scope','$http','$timeout',
        function($scope,$http,$timeout){
		var k=$scope;
		k.xdtitle='';
	
		k.xdshow=false;
		k.show=function(e){
			k.xdtitle=e;
			k.xdshow=true;
			$timeout(function(){
				k.xdshow=false;
			},2000)
		}
//		$timeout(function(){
//			k.xdshow=true;
//		},3000)
		
		
		k.m='card';
		k.cg2=false;
		
		k.mChange=function(){
			console.log($scope.m);
		}
		k.cg2Cg=function(){
//			if($scope)
		}
		k.username=''; //基本用户名
		k.userpwd=''; //基本用户密码
		k.userprx_name=''; //代理名称
		k.user_mail=''; //代理邮箱
		k.user_tel=''; //代理手机号
		
		k.scale=null; //抽成比例
		
		
		//k.pay_type=null; //付款方式  银行卡，支付宝，微信   k.m
		k.ggType=1;
//		k.pay_card_company=null; //是否对公账户  k.cg2
		
		k.pay_card_name=null; //非对公账户 持卡人姓名
		k.pay_card_cpname=null; //对公账户 公司名称
		k.pay_card_num=null; //银行卡号
		k.pay_card_num_address=null; //开户行
		
		k.ali_num=null; //支付宝账户
		k.ali_name=null; //支付宝姓名
		
		k.wx_num=null; //微信号
		k.wx_name=null; //微信昵称
		
		k.logtype={
			k:0
		}; //登记类型
		
		k.logmore=null; // 登记备注
		
		k.lnumber=null;
    	k.lname=null;
    	k.lexplain=null; 
		
		
		/*登录这个人*/
		k.regThis=function(){
			if(!k.username){
				k.show('请填写用户名')
				return;
			}
			if(!k.userpwd){
				k.show('请填写密码')
				return;
			}
			if(!k.userprx_name){
				k.show('代理名称')
				return;
			}
			if(!k.scale){
				k.show('请填写 抽成比例')
				return;
			}
			
			if(k.m=='card'){
				if(k.pay_card_num && k.pay_card_num_address){
					if(k.cg2){
						k.lnumber=k.pay_card_num;
				    	k.lname=k.pay_card_cpname;
				    	k.lexplain=k.pay_card_num_address; 
					}else{
						k.lnumber=k.pay_card_num;
				    	k.lname=k.pay_card_name;
				    	k.lexplain=k.pay_card_num_address; 
					}
					k.ggType=1;
					
				}else{
					k.show('请填写 银行卡和开户行')
					return;
				}
			
				
			}else if(k.m=='alipay'){
				if(k.ali_num && k.ali_name){
					k.ggType=2;
					k.lnumber=k.ali_num;
			    	k.lname=k.ali_name;
				}else{
					k.show('请填写支付宝相关信息')
					return;
				}
				
			}else if(k.m=='weixin'){
				if(k.wx_num && k.wx_name){
					k.ggType=3;
					k.lnumber=k.wx_num;
			    	k.lname=k.wx_name;
				}else{
					k.show('请填写微信相关信息')
					return;
				}
			}else{
				return;
			} 
			 $http.post('/v1/aut/user/add',{
                     "account": k.username,
			        "passWorld": k.userpwd,
			        "nickName": k.userprx_name,
			        "phoneNumber": k.user_tel,
			        "scale": k.scale,
			        "email":k.user_mail,
			        "grade":k.logtype.k,
			        "remarks":k.logmore,
			        "payAccount":{
			        	"type":k.ggType,
			        	"isPublic":k.cg2==true?'1':'0',
			        	"number":k.lnumber,
			        	"name":k.lname,
			        	"explain":k.lexplain 
			        }

               }).then(function(res){
                    if(!res.data.errMessage){
                       k.show('添加成功');
                       		k.username=''; //基本用户名
							k.userpwd=''; //基本用户密码
							k.userprx_name=''; //代理名称
							k.user_mail=''; //代理邮箱
							k.user_tel=''; //代理手机号
							
							k.scale=null; //抽成比例
							
							
							//k.pay_type=null; //付款方式  银行卡，支付宝，微信   k.m
							k.ggType=1;
					//		k.pay_card_company=null; //是否对公账户  k.cg2
							
							k.pay_card_name=null; //非对公账户 持卡人姓名
							k.pay_card_cpname=null; //对公账户 公司名称
							k.pay_card_num=null; //银行卡号
							k.pay_card_num_address=null; //开户行
							
							k.ali_num=null; //支付宝账户
							k.ali_name=null; //支付宝姓名
							
							k.wx_num=null; //微信号
							k.wx_name=null; //微信昵称
							
							k.logtype.k=0; //登记类型
							
							k.logmore=null; // 登记备注
							
							k.lnumber=null;
					    	k.lname=null;
					    	k.lexplain=null; 
                    }else{
					   k.show('添加失败，请重试');
                    }
                }).catch(function(res){
					 k.show('添加失败，请重试');
                });
			
			
		}
		
		



        }
    ]);
})();
