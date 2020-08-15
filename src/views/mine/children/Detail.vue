<template>
    <div class="Detail">
        <!-- 导航栏 -->
        <van-nav-bar
            title="我的订单"
            left-arrow
            @click-left="$router.back()"
        />
        <!-- 导航栏 -->
        <van-tabs v-model="activeName" 
                  color="green" 
                  line-active-color="green"
                  @click="delTabarClick"
                  >
            <van-tab title="全部" name="a">
                <MineOrderItem v-for="(order) in allOrderArr" :key="order._id" :order="order"/>
            </van-tab>
            <van-tab title="待支付" name="b">
                <MineOrderItem v-for="(order) in allWillArr" :key="order._id" :order="order"/>
            </van-tab>
            <van-tab title="待收货" name="c">
                <MineOrderItem v-for="(order) in allPay" :key="order._id" :order="order"/>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import MineOrderItem from './componens/MineOrderItem'
import {getOrder} from './../../../service/api/index'
import {mapState} from 'vuex'
export default {
    name:"Detail",
     data() {
        return {
           activeName: 'a',
           allOrderArr:null,//所有的订单
           allWillArr:null,//所有待支付订单
           allPay:null,//所有待收货订单
        };
    },
    computed: {
      ...mapState(["userinfo"])  
    },
    mounted () {
        //获取订单数据
        this.initOrder();
    },
    methods: {
       async initOrder(){
           let result =await getOrder(this.userinfo.token);
           if(result.success_code===200){
               this.allOrderArr=result.data
           }
       },
       async delTabarClick(name,title){
           if(name==="a"){
               this.allOrderArr=await this.getTabarOrder();
           }else if(name==="b"){
               this.allWillArr=await this.getTabarOrder("will");
           }else if(name==="c"){
               this.allPay=await this.getTabarOrder("pay");
           }
       },
       async getTabarOrder(status){
           let result=await getOrder(this.userinfo.token,status);
           return result.data;
       }  
    },
    components: {
        MineOrderItem
    }
}
</script>
<style scoped>
    .Detail{
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom:0;
        background-color: #f5f5f5;
        z-index: 200;
    }
</style>