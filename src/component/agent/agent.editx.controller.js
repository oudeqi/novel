;(function(){
    'use strict';
    angular.module('app').controller('agentctl_editx',['$scope','$http','$timeout',
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
    	
    	/*获取详情*/
    	k.getThis=function(){
    		 $http.get('/v1/aut/get/user',{
					params:{
						"uid":localStorage.agenteditxuid,
					}
              }).then(function(res){	
               	var c=res.data.data;
               	k.username=c.account;
               	k.userpwd=c.passWorld;
               	k.userprx_name=c.nickName;
               	k.user_mail=c.email;
               	k.user_tel=c.phoneNumber;
               	k.scale=c.scale;
               	k.logtype.k=c.level.toString();
               	k.logmore=c.remarks;
               	
               	if(c.payAccount){
               		if(c.payAccount.type==1){
               			k.m='card';
               			
               			if(c.isPublic==0){
               			k.cg2=false;
               			k.pay_card_name=c.payAccount.name; //非对公账户 持卡人姓名
						k.pay_card_num=c.payAccount.number; //银行卡号
						k.pay_card_num_address=c.payAccount.explain; //开户行
               			
	               		}
	               		if(c.isPublic==1){
	               			k.cg2=true;	
							k.pay_card_cpname=c.payAccount.name; //对公账户 公司名称
							k.pay_card_num=c.payAccount.number; //银行卡号
							k.pay_card_num_address=c.payAccount.explain; //开户行
	               		}
               			
               			
               		}
               		if(c.payAccount.type==2){
               			k.m='alipay';
               			k.ali_num=c.payAccount.number; //支付宝账户
						k.ali_name=c.payAccount.name; //支付宝姓名
               		}
               		if(c.payAccount.type==3){
               			k.m='weixin';
               			k.wx_num=c.payAccount.number; //微信号
						k.wx_name=c.payAccount.name; //微信昵称
               		}
               		
               		
               		
               	}else{
               		
               	}
               	
               	
               	
                   console.log("获取详情",res.data);
                }).catch(function(res){
					 k.show('网络错误');
                });
    	}
    	k.getThis();
		
		
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
				if(k.ali_num){
					k.ggType=2;
					k.lnumber=k.ali_num;
			    	k.lname=k.ali_name;
				}else{
					k.show('请填写支付宝相关信息')
					return;
				}
				
			}else if(k.m=='weixin'){
				if(k.wx_num){
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
			 $http.post('/v1/aut/user/update',{
			 		"uid":parseInt(localStorage.agenteditxuid),
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
                       k.show('保存成功');
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
					   k.show(res.data.errMessage);
                    }
                }).catch(function(res){
					 k.show('保存失败，请重试');
                });
			
			
		}
		
		



        }
    ]);
})();
