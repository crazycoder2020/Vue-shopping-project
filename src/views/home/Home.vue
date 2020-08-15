<template>
    <div class="home">
        <div v-if="!isShow">
            <Head/>
            <!-- 轮播图 -->
            <Sowing :sowing_list="sowing_list"/>
            <!-- 中间导航栏 -->
            <Nav :show_list="show_list"/>
            <!-- 闪购 -->
            <FlashSale :flash_sale="flash_sale"/>
            <!-- 猜你喜欢 -->
            <YouLike :you_like="you_like"/>
            <!-- 返回顶部 -->
            <Mark
             v-if="ShowBackTop" 
             :BackToTop="BackToTop"
             />
        </div>
        <van-loading
         v-else 
         type="spinner" 
         color= white
         style="position:absolute;left:50%;top:40%;transform:translate(-50%)"
        >
            小撩正在疯狂加载中...
        </van-loading>
    </div>
</template>
<script>
//1.引入
import { getHomeData } from './../../service/api/index'

//2.引入组件
import Head from './components/Head'
import Sowing from './components/sowing/Sowing'
import Nav from './components/nav/Nav'
import FlashSale from './components/flashSale/FlashSale'
import YouLike from './components/youlike/YouLike'
import Mark from './components/mark/Mark'

//3.引入滚动组件
import {showBack,animate} from '@/config/glable.js'

//4.引入通知组件
import PubSub from 'pubsub-js'
import { Toast } from 'vant';

//5.引入vuex
import {mapMutations,mapState} from 'vuex'

//6.引入增加组件
import {addGoodsToCart} from './../../service/api/index'
export default {
    name:"Home",
    data () {
        return {
            //是否加载等待图标
            isShow:true, 
            //是否显示返回顶部图标
            ShowBackTop:false,

            //首页轮播图数据
            sowing_list:[],
           
            //中间导航栏数据
            show_list:[],    

            //秒杀数据
            flash_sale:[],

            //猜你喜欢
            you_like:[],

        }
    },
    created () {
        //2.请求网络数据
        this.reqData();
    },
    computed: {
      ...mapState(["userinfo"])  
    },
    mounted () {
       //订阅消息（添加到购物车的消息）
       PubSub.subscribe("homeAddToCart",(msg,goods)=>{
           if(msg === "homeAddToCart"){
               if(this.userinfo.token){ //已经登录
                   this.GoodsAdd(goods);
               }else{ //没有登录
                   this.$router.push("/login");
               }
           }
       });
    },
    components: {
        Head,
        Sowing,
        Nav,
        FlashSale,
        YouLike,
        Mark
    },
    methods: {
        ...mapMutations(["ADD_GOODS"]),
        async reqData() {
                let response = await getHomeData();
                console.log(response);
                if(response.success){
                    this.sowing_list = response.data.list[0].icon_list;
                    this.show_list = response.data.list[2].icon_list;
                    this.flash_sale = response.data.list[3].product_list;
                    this.you_like = response.data.list[12].product_list;
                    // 隐藏加载动画
                       this.isShow=false;
                    // 开始监听滚动, 到达一定位置就显示返回顶部按钮
                     showBack((status)=>{
                       this.ShowBackTop=status;
                     });
                }
            },
        BackToTop(){
            //缓动动画回到顶部
            let docB=document.documentElement||document.body;
            animate(docB,{scrollTop:"0"},400,"ease-out");
        },
         //添加商品到购物车
        async GoodsAdd(goods){
            let result=await addGoodsToCart(this.userinfo.token,goods.id,goods.name,goods.price,goods.small_image);
             console.log(result);
            if(result.success_code===200){
                this.ADD_GOODS({
                    goodsId:goods.id,
                    goodsName:goods.name,
                    smallImage:goods.small_image,
                    goodsPrice:goods.price
                 });
                    //提示用户
                    Toast({
                        message:'添加到购物车成功!',
                        duration:800
                });
            }
        },
        beforeDestroy () {
           PubSub.unsubscribe("homeAddToCart")
        },
        
    },
   
}
</script>
<style lang="less" scoped>
    .home{
        width: 100%;
        background-color:#f5f5f5;
    }
</style>