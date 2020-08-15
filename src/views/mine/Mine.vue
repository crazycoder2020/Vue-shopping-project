<template>
    <div class="mine" v-if="userinfo.token">
       <van-nav-bar
            title="我的"
            :border=false
            :fixed=true
        />

        <van-cell-group style="margin-top:40px">
           <van-cell style="background-color:#3bba63" 
                     is-link
                     :center=true
                     @click.prevent="$router.push('/dashboard/mine/usercenter')"
                    >
                <!-- 使用 title 插槽来自定义标题 -->
                <template #title>
                        <div class="img">
                            <img :src="userinfo.icon_url" alt="">
                            <div class="item">
                                <span>{{userinfo.real_name}}</span>
                                <span>手机号:{{userinfo.phone}}</span>
                            </div>
                        </div>
                </template>
           </van-cell>
        </van-cell-group>

        <van-cell-group>
           <van-cell title="我的订单" 
                    value="查看全部订单" 
                    icon="label" 
                    is-link
                    @click="$router.push({path:'/dashboard/mine/detail'})"
                    />
        </van-cell-group>
        
        <router-link :to="{path:'/dashboard/mine/detail'}">
            <van-cell-group>
             <van-grid>
               <van-grid-item 
                    v-for="(order,index) in orderData" 
                    :key="index" 
                    :icon="order.icon" 
                    :text="order.text" 
                    :border=false
               />
             </van-grid>
            </van-cell-group>
        </router-link>
         
        <van-cell-group style="margin-top:5px">
            <van-cell icon="cash-back-record" title="我的优惠卷" value="1张" is-link/>
            <van-cell icon="newspaper-o" title="我的收货地址" is-link/>
         </van-cell-group>

         <van-cell-group style="margin-top:5px">
            <van-cell icon="cash-back-record" title="联系客服" value="客服时间07:00-22:00" is-link/>
            <van-cell icon="newspaper-o" title="意见反馈" is-link/>
         </van-cell-group>

         <van-cell-group style="margin-top:5px">
            <van-cell icon="cash-back-record" title="小撩买菜" value="下载App体验更佳" is-link/>
         </van-cell-group>
         
         <!-- 配置用户中心出口-->
         <transition name="router-slide" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>

    <SelectLogin v-else/>
</template>
<script>
import SelectLogin from './../../views/login/SelectLogin'
import {mapState} from "vuex"
export default {
    name:"Mine",
    data () {
        return {
            orderData:[
                {icon:'pending-payment',text:'待支付'},
                {icon:'paid',text:'待收货'},
                {icon:'chat-o',text:'待评价'},
                {icon:'cash-back-record',text:'售后/退款'}
            ]
        }
    },
    computed: {
        ...mapState(["userinfo"])
    },
    components: {
        SelectLogin
    }
    
}
</script>
<style lang="less" scoped>
    .mine{
        width: 100%;
        height: 100%;
        background-color:#f5f5f5;
    }
    .van-nav-bar{
        background-color: #3bba63;
    }
    .van-nav-bar__title{
        color: #fff;
        font-size: 22px;
    }
    .img{
        display: flex;
        flex-direction:row;
    }
    .img img{
        width: 60px;
        height: 60px;
        border: 1px solid #fff;
        border-radius: 30px;
    }
    .item{
        display: flex;
        flex-direction: column;
        margin-left: 0.8rem;
        color: #fff;
        margin-top: 8px;
    }
    .van-cell__left-icon{
        color: orange;
        font-size: 1.2rem;
    }
    .router-slide-enter-active,.router-slide-leave-active{
       transition: all 0.4s;
    }
    .router-slide-enter,.router-slide-leave-active{
       transform: translate3d(2rem,0,0);
       opacity: 0;
    }
</style>