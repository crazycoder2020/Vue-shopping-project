<template>
    <div class="dashboard">
      <van-tabbar v-model="active" active-color="#75a342">
          <van-tabbar-item replace to="/dashboard/home">
               <span>首页</span>
           <template #icon="props">
            <img :src="props.active ? home_icon.active : home_icon.inactive" />
           </template>
          </van-tabbar-item>

          <van-tabbar-item replace to="/dashboard/catgory">
               <span>分类</span>
           <template #icon="props">
            <img :src="props.active ? categort_icon.active : categort_icon.inactive" />
           </template>
          </van-tabbar-item>

          <van-tabbar-item replace to="/dashboard/cart" :info="goodsNum >0 ? goodsNum : ''">
               <span>购物车</span>
           <template #icon="props">
            <img :src="props.active ? cart_icon.active : cart_icon.inactive" />
           </template>
          </van-tabbar-item>

          <van-tabbar-item replace to="/dashboard/mine">
               <span>我的</span>
           <template #icon="props">
            <img :src="props.active ? mine_icon.active : mine_icon.inactive" />
           </template>
          </van-tabbar-item>
      </van-tabbar>
      <keep-alive>
         <router-view v-if="$route.meta.keepAlive"/>
      </keep-alive>
       <router-view v-if="!$route.meta.keepAlive"/>
    </div>
</template>
<script>
import {mapState,mapMutations,mapActions} from 'vuex'
import {getGoodsCart} from './../../service/api/index'
import {setStore} from './../../config/glable'

export default {
    name:"DashBoard",
    data() {
    return {
      active: Number(sessionStorage.getItem("tabBar"))||0,
      home_icon: {
        active: require("@/images/tabbar/home_selected.png"),
        inactive: require("@/images/tabbar/home_default.png"),
      },
      categort_icon:{
        active: require("@/images/tabbar/category_selected.png"),
        inactive: require("@/images/tabbar/category_default.png"),
      },
      cart_icon:{
        active: require("@/images/tabbar/shoppingcart_selected.png"),
        inactive: require("@/images/tabbar/shoppingcart_default.png"),
      },
      mine_icon:{
        active: require("@/images/tabbar/mine_selected.png"),
        inactive: require("@/images/tabbar/mine_default.png"),
      }
       };
    },
    watch: {
      active(value){
        // console.log(value);
        //本地缓存将数据存入
        let tabBar =value > 0 ?value:0;
        //缓存到本地
        sessionStorage.setItem("tabBar",value);
      }
    },
    computed: {
      ...mapState(["shopCart","userinfo"]),
      goodsNum(){
        if(this.shopCart){
          let num =0;//总的购物车商品数量
          Object.values(this.shopCart).forEach((goods,index)=>{
            num+=goods.num;
          });
          return num;
        }else{
          return 0;
        }
      }
    },
    mounted () {
      //1.自动登录
      this.reqUserInfo();
      //2.获取购物车数据
      this.initGoodsCart();
    },
    methods: {
      ...mapMutations(["INIT_SHOP_CART"]),
      ...mapActions(["reqUserInfo"]),
      //初始化服务器购物车数据
      async initGoodsCart(){
        if(this.userinfo.token){ //已经登录
            let result =await getGoodsCart(this.userinfo.token);
            console.log(result);
            if(result.success_code===200){
              let cartArr =result.data;
              let shopCart={};
              //遍历取出数据
              cartArr.forEach((value)=>{
                shopCart[value.goods_id]={
                "num":value.num,
                "id":value.goods_id,
                "name":value.goods_name,
                "small_image":value.small_image,
                "price":value.goods_price,
                "checked":value.checked
                 }
              });
              
              //2.2数据同步到本地
              setStore("shopCart",shopCart);
              this.INIT_SHOP_CART()
            }
        }
      }
    }

}
</script>
<style lang="less" scoped>
    .dashboard{
        width: 100%;
        height: 100%;
        background-color:#f5f5f5;
    }
</style>