<template>
    <div class="Center">
       <!-- 导航条 -->
       <van-nav-bar
            title="个人中心"
            :border=true
            :fixed=true
            @click-left="$router.go(-1)"
            :left-arrow=true
        />
        <div class="button">
            <button @click="logOut()">退出登录</button>
        </div>
    </div>
</template>
<script>
 import {getLogOut} from './../../../service/api/index'
import {mapMutations} from 'vuex'
import {Toast} from 'vant'

export default {
    name:"UserCenter",
    methods: {
        ...mapMutations(["RESET_USER_INFO","CLEAR_CART"]),
        async logOut(){
            let result = await getLogOut();
            if(result.success_code === 200){
                //清空本地数据
                this.RESET_USER_INFO();
                //清空购物车数据
                this.CLEAR_CART({});
                Toast({
                     message:"退出登录成功!",
                     duration:500
                });
            }
        }
    },
}
</script>
<style scoped>
    .Center{
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom:0;
        background-color: #f5f5f5;
        z-index: 200;
    }
    .button{
        width: 100%;
        height: 50px;
        background-color: #fff;
        margin-top: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    .button button{
        text-align: center;
        background: transparent;
        font-size: 18px;
        font-weight: bold;
    }

</style>