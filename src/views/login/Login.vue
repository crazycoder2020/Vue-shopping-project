<template>
    <div class="login-container">
    <!--登录面板内容部分-->
    <div class="login-inner">
        <!--面板头部-->
        <div class="login-header">
            <div class="login-logo">
                <img src="./images/lk_logo_sm.png" alt="" width="300">
            </div>
            <!--面板标题-->
            <div class="login-header-title">
                <a href="javascript:;" :class="{current:loginmodel}" @click="dealLoginmodel(true)">手机登录</a>
                <a href="javascript:;" :class="{current:!loginmodel}" @click="dealLoginmodel(false)">密码登录</a>
            </div>
        </div>
        <!--面板表单部分-->
        <div class="login-content">
            <form>
                <!--手机验证码登录部分-->
                <div :class="{current:loginmodel}">
                    <section class="login-message">
                        <input type="number" maxlength="11" placeholder="手机号" v-model="phone">
                        <button 
                          v-if="!countDown"  
                          class="get-verification" 
                          :class="{phone_right:Right}"
                          @click.prevent="AddMsg()"
                        >
                            获取验证码</button>
                        <button v-else disabled="disabled" class="get-verification">
                            已发送({{countDown}})
                        </button>
                    </section>
                    <section class="login-verification">
                        <input type="number" maxlength="8" placeholder="验证码" v-model="code"/>
                    </section>
                    <section class="login-hint">
                        温馨提示：未注册小撩买菜的手机号，登录时将自动注册，且代表已同意
                        <a href="javascript:;">服务协议与隐私政策</a>
                    </section>
                </div>
                <!--账号登录部分-->
                <div :class="{current:!loginmodel}">
                    <section>
                        <section class="login-message">
                            <input type="tel" maxlength="11" placeholder="用户名" v-model="username">
                        </section>
                        <section class="login-verification">
                            <input v-if="showCaptcha" type="password" maxlength="20" placeholder="密码" 
                              autocomplete="off"
                              v-model="pwd" 
                              />
                            <input v-else type="text" maxlength="20" placeholder="密码" 
                              autocomplete="off"
                              v-model="pwd"
                              />
                            <div class="switch-show">
                                <img src="./images/hide_pwd.png" @click.prevent="dealshowCaptcha(false)" :class="{on:showCaptcha}" alt="" width="20">
                                <img src="./images/show_pwd.png" @click.prevent="dealshowCaptcha(true)" :class="{on:!showCaptcha}" alt="" width="20">
                            </div>
                        </section>
                        <section class="login-message">
                            <input type="text" maxlength="4" placeholder="验证码">
                            <img
                                class="get-verification"
                                src="http://demo.itlike.com/web/xlmc/api/captcha"
                                alt="captcha"
                                @click.prevent="changeCaptcha()"
                                ref="captcha"
                            >
                        </section>
                    </section>
                </div>
                <button class="login-submit"
                    @click.prevent="login()"
                >登录</button>
            </form>
            <button class="login-back"  @click.prevent="$router.back()">返回</button>
        </div>
    </div>
</div>
</template>
<script>
import {getPhoneCode,phoneCodeLogin,phonePwdLogin} from './../../service/api/index'
import {Toast} from "vant"
import { mapActions } from 'vuex'
export default {
    name:"Login",
    data () {
        return {
            //登录模式
            loginmodel:true,
            //手机号码
            phone:null,
            //倒计时
            countDown:0,
            //验证码
            code:null,
            //用户信息
            userinfo:null,

            //用户名
            username:null,
            //密码
            pwd:null,
            //验证码
            captcha:null,
            //密文显示模式
            showCaptcha:true //秘文

        }
    },
    computed: {
      //验证手机号码是否正确
      Right(){
          return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone);
      }  
    },
    methods: {
        ...mapActions(["syncUserInfo"]),
        //处理登录模式
        dealLoginmodel(flag){
            this.loginmodel=flag
        },
        //获取短信验证码
         async AddMsg(){
          //过滤
          if(this.Right){
              this.countDown=60;
              //倒计时
              this.intervalID=setInterval(()=>{
                  this.countDown--;
                  if(this.countDown===0){
                      clearInterval(this.intervalID);
                  }
              },1000);
              //获取短信验证码
              let results=await getPhoneCode(this.phone);
              console.log(results);
          }
        },
        //3.登录
        async login(){
            if(this.loginmodel){//验证码登录
                if(this.phone===null){
                    Toast({
                        message:"请输入手机号!",
                        duration:500
                    });
                    return;
                }else if(!this.Right){
                    Toast({
                        message:"请输入正确的手机号!",
                        duration:500
                    });
                    return; 
                }
                if(this.code===null){
                    Toast({
                        message:"请输入验证码!",
                        duration:500
                    });
                    return;
                }else if((!/^\d{6}$/gi.test(this.code))){
                    Toast({
                        message:"请输入正确的验证码!",
                        duration:500
                    });
                    return;
                }

                // 3.1.2 手机验证码登录
                    let result = await phoneCodeLogin(this.phone, this.code);
                    console.log(result);
                    if(result.success_code === 200){
                        //console.log(result);
                        // 4.1 保存用户信息
                        this.syncUserInfo(result.data);
                        // 4.2 回到主面板
                        this.$router.back();
                    }
            }else{//密码登录
                if(!this.username){
                    Toast({
                        message: '请输入用户名!',
                        duration: 500    
                    });
                    return;
                }else if(!this.pwd){
                    Toast({
                        message: '请输入密码!',
                        duration: 500    
                    });
                    return;
                 }
                 else if(!this.captcha){
                    Toast({
                        message: '请输入验证码!',
                        duration: 500    
                    });
                    return;
                }
                //发起请求
                let result =await phonePwdLogin(this.username,this.pwd,this.captcha);
                console.log(result);
            }
        },

        //处理明文密文切换
        dealshowCaptcha(flag){
            this.showCaptcha=flag
        },
        //获取随机验证码
        changeCaptcha(){
            //1.获取验证码标签
            let captchaEle=this.$refs.captcha;
            this.$set(captchaEle,"src","http://demo.itlike.com/web/xlmc/api/captcha?time="+ new Date());
        }
    },
}

</script>
<style scoped>
 .login-container {
            width: 100%;
            height: 100%;
            background: #fff;
        }

        .login-container .login-inner {
            padding-top: 60px;
            width: 80%;
            margin: 0 auto;
        }

        .login-container .login-inner .login-header .login-logo {
            font-size: 40px;
            font-weight: bold;
            color: #75a342;
            text-align: center
        }

        .login-container .login-inner .login-header .login-header-title {
            padding-top: 40px;
            padding-bottom: 10px;
            text-align: center;
        }

        .login-container .login-inner .login-header .login-header-title > a {
            color: #333;
            font-size: 14px;
            padding-bottom: 4px;
            text-decoration: none;
        }

        .login-container .login-inner .login-header .login-header-title > a:first-child {
            margin-right: 40px
        }

        .login-container .login-inner .login-header .login-header-title > a.current {
            color: #75a342;
            font-weight: 700;
            border-bottom: 2px solid #75a342
        }

        .login-container .login-inner .login-content > form > div {
            display: none;
        }

        .login-container .login-inner .login-content > form > div.current {
            display: block
        }

        .login-container .login-inner .login-content > form > div input {
            width: 100%;
            height: 100%;
            padding-left: 8px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            outline: 0;
            font: 400 14px Arial;
        }

        .login-container .login-inner .login-content > form > div input:focus {
            border: 1px solid #75a342
        }

        .login-container .login-inner .login-content > form > div .login-message {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;
        }

        .login-container .login-inner .login-content > form > div .login-message .get-verification {
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            border: 0;
            color: #ccc;
            font-size: 14px;
            background: transparent;
        }

        .login-container .login-inner .login-content > form > div .login-message .get-verification.phone_right {
            color: #75a342
        }

        .login-container .login-inner .login-content > form > div .login-verification {
            position: relative;
            margin-top: 16px;
            height: 48px;
            font-size: 14px;
            background: #fff;
        }

        .login-container .login-inner .login-content > form > div .login-verification .switch-show {
            position: absolute;
            right: 10px;
            top: 12px;
        }

        .login-container .login-inner .login-content > form > div .login-verification .switch-show img {
            display: none
        }

        .login-container .login-inner .login-content > form > div .login-verification .switch-show img.on {
            display: block
        }

        .login-container .login-inner .login-content > form > div .login-hint {
            margin-top: 12px;
            color: #999;
            font-size: 12px;
            line-height: 20px;
        }

        .login-container .login-inner .login-content > form > div .login-hint > a {
            color: #75a342
        }

        .login-container .login-inner .login-content > form .login-submit {
            display: block;
            width: 100%;
            height: 42px;
            margin-top: 30px;
            border-radius: 4px;
            background: #75a342;
            color: #fff;
            text-align: center;
            font-size: 16px;
            line-height: 42px;
            border: 0
        }

        .login-container .login-inner .login-content .login-back {
            display: block;
            width: 100%;
            height: 42px;
            margin-top: 15px;
            border-radius: 4px;
            background: transparent;
            border: 1px solid #75a342;
            color: #75a342;
            text-align: center;
            font-size: 16px;
            line-height: 42px
        }
</style>