<template>
    <div class="order">
        <!-- 导航栏 -->
        <van-nav-bar
            title="标题"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        
        <!-- 收货地址 -->
        <van-contact-card
            :type="addressType"
            :name="address_name"
            :tel="address_phone"
            add-text="收货地址"
            @click="addDdress()"
            style="margin-top:6px"
        />

        <!-- 日期选择 -->
        <van-popup v-model="isShow" round position="bottom">
                <van-datetime-picker
                type="datetime"
                title="选择完整时间"
                :min-date="minDate"
                :max-date="maxDate"
                v-model="currentDate"
                @cancel="Oncancel"
                @confirm="Onconfirm"
            />
        </van-popup>   

        <!-- 送达时间 -->
        <van-cell-group style="margin-top:10px" >
            <van-cell title="送达时间" :value="arriveTime" @click="Time" is-link />
            <router-link :to="{path:'/confirmOrder/OrderDetail'}">
                <van-cell :value="`共${CountShop}件`" is-link :center=true>
                <!-- 使用 title 插槽来自定义标题 -->
                 <template slot="title">
                    <img v-for="(goods,index) in threeShopCart" :key="index" 
                         :src="goods.small_image"  
                         style="width:50px"
                        >
                 </template>
                </van-cell>
            </router-link>
        </van-cell-group>

        <van-cell-group style="margin-top:10px">
            <van-cell title="支付方式" value="微信"/>
        </van-cell-group>

        <van-cell-group style="margin-top:10px">
            <van-cell title="备注">
                <input type="text" style="text-align:right" placeholder="选填, 备注您的特殊需求" v-model="notice">
            </van-cell>
        </van-cell-group>

        <van-cell-group style="margin-top:10px">
            <van-cell title="商品金额" :value="`￥${totalPrice}`"></van-cell>
            <van-cell title="配送费" :value="`￥${disPrice}`"></van-cell>
        </van-cell-group>

        <!-- 底部结算 -->
        <van-submit-bar 
            :price="totalPrice*100 + disPrice*100" 
            button-text="提交订单" 
            @submit="onSubmit" 
            label="实付"
        />

        <!-- 支付二维码 -->
        <van-popup v-model="isPay" round position="center">
            <qriously :value="qrcode" :size="200" />
        </van-popup>

        <!-- 配置出口 -->
        <transition name="router-slide" mode="out-in">
            <router-view></router-view>
        </transition>
        
    </div>
</template>
<script>
import PubSub from 'pubsub-js'
import Moment from 'moment'
import {mapState} from 'vuex'
import {Toast} from 'vant'
import {postOrder,orderPaySuccess,delAllSelectedGoods,getWXCode,queryPayStatus,getAllSelectedGoods} from './../../service/api/index'
export default {
    name:"Order",
    data () {
        return {
            //1.收货
            addressType:"add", //收获卡片的类型
            address_name:null, //收货人
            address_phone:null, //收获人电话
            address_id:null,     //收货人id

            //2.日期
            isShow:false,
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            currentDate: new Date(),

            //3.送达时间
            arriveTime:"请选择送达时间",

            //4.备注
            notice:null,

            isPay:false,  //显示二维码的蒙版
            qrcode:null  //生成二维码的URL地址
        }
    },
    computed: {
      ...mapState(["shopCart","userinfo"]),
        //计算商品的总件数
        CountShop(){
            let selectedGoodsCount=0;
            Object.values(this.shopCart).forEach((goods,index)=>{
                if(goods.checked){
                    selectedGoodsCount+=1
                }
            });
            return selectedGoodsCount;
        },
        //计算商品总价
        totalPrice(){
            let totalPrice=0;
            Object.values(this.shopCart).forEach((goods,index)=>{
                if(goods.checked){
                    totalPrice+=parseFloat(goods.price * goods.num);
                }
            });
            return totalPrice;
        },
        //取购物车的前三件
        threeShopCart(){
            let shopCart=[];
                Object.values(this.shopCart).forEach((goods,index)=>{
                    if(goods.checked){
                        shopCart.push(goods);
                    }
                });
                return shopCart.slice(0,3);
        },
        //配送费
        disPrice(){
            if(this.totalPrice > 40){
                return 0;
            }else{
                return 6;
            }
        }
    },
    mounted () {
       //接收收货地址
       PubSub.subscribe("userAddress",(msg,address)=>{
           if(msg==="userAddress"){
            //    console.log(address);
             //修改卡片类型
             this.addressType="eidt";
             this.address_name=address.name;
             this.address_phone=address.tel;
             this.address_id=address.address_id;
           }
       })
    },
    methods: {
        //1.点击了左边
        onClickLeft(){
            this.$router.back();
        },
        //2.点击跳转到收货地址页面
        addDdress(){
            this.$router.push("/confirmOrder/MyAddress")
        },
        //3.提交订单支付
        async onSubmit(){
            //3.1判断数据
            if(!this.address_id){
                Toast({
                    message:"请输入地址!",
                    duration:500
                });
                return;
            }
            if(this.arriveTime==="请选择送达时间"){
                Toast({
                    message:"请输入送达时间!",
                    duration:500
                });
                return;
            }
            if(!this.notice){
                Toast({
                    message:"请输入备注信息!",
                    duration:500
                });
                return;
            }

            //3.2处理订单的相关信息
            if(this.userinfo.token){
                //3.3查询购物车订单
                let goodsResult=await getAllSelectedGoods(this.userinfo.token);
                //console.log(goodsResult);
                if(goodsResult.success_code===200){
                    let orderResult=await postOrder(this.userinfo.token,this.address_id,this.arrive_time,
                                                goodsResult.data,this.notice,this.totalPrice,
                                                this.disPrice
                                                );
                    console.log(orderResult)  
                //3.4删除购物车中已经生成订单的商品
                if(orderResult.success_code===200){
                    let delResult= await delAllSelectedGoods(this.userinfo.token);
                    //3.5发起微信支付
                    if(delResult.success_code===200){
                        let urlResult =await getWXCode(orderResult.data.order_id,1);
                        console.log(urlResult);
                        if(urlResult.code_url){
                            this.isPay=true;
                            this.qrcode=urlResult.code_url;
                            //3.6用户是否扫码成功
                            let payResult=await queryPayStatus(orderResult.data.order_id);
                            console.log(payResult);
                            if(payResult.success){
                                Toast({
                                    message:"支付成功!",
                                    duration:500
                                });
                                this.isPay=false;
                                //3.7通知自己服务器的订单支付成功
                                let myResult=await orderPaySuccess(this.userinfo.token,orderResult.data.order_id);
                                if(myResult.success_code===200){
                                    //跳转到我的
                                    this.$router.replace('/dashboard/mine');
                                    window.sessionStorage.setItem("tabBar","3");
                                }
                            }
                        } 
                    }else{
                        Toast({
                        message:"订单处理出现问题!",
                        duration:500
                        });
                    }
                }                              
                }else{
                    Toast({
                        message:"获取订单失败!",
                        duration:500
                    });
                }
            }
        },
        //4.展示日期组件
        Time(){
            this.isShow=true;
        },
        //5.取消日期
        Oncancel(){
            this.isShow=false;
        },
        //6.确认日期组件
        Onconfirm(value){
            this.isShow=false;
            this.arriveTime=Moment(value).format('YYYY-MM-DD hh:mm');;
        },
        
    },
    beforeDestroy () {
        PubSub.unsubscribe("userAddress");
    }
}
</script>
<style scoped>
   .order{
       width: 100%;
       height: 100%;
       background-color: #f5f5f5;
   }
   .router-slide-enter-active,.router-slide-leave-active{
       transition: all 0.4s;
   }
   .router-slide-enter,.router-slide-leave-active{
       transform: translate3d(2rem,0,0);
       opacity: 0;
   }
</style>