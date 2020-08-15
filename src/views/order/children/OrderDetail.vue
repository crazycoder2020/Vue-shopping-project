<template>
    <div class="OrderDetail">
        <!-- 导航栏 -->
        <van-nav-bar
            title="商品清单"
            left-text="返回"
            left-arrow
            @click-left="$router.go(-1)"
            :fixed=true
            :border=true
        />
        <!-- 内容 -->
        <van-cell-group  style="margin-top:3rem" >
            <van-cell title="商品" :value="`共${checkedshopCount}件`"></van-cell>
            <!-- 卡片选项 -->
            <van-card
                v-for="(goods) in checkedshopCart" :key="goods.id"
                :num="goods.num"
                :price="goods.price"
                :title="goods.name"
                :thumb="goods.small_image"
            ></van-card>
        </van-cell-group>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    name:"OrderDetail",
    computed: {
        ...mapState(["shopCart"]),
        //1.获取选中的商品
        checkedshopCart(){
           let shopCart=[];
                Object.values(this.shopCart).forEach((goods,index)=>{
                    if(goods.checked){
                        shopCart.push(goods);
                    }
                });
                return shopCart;
        },
        //2.计算商品的总件数
        checkedshopCount(){
            return this.checkedshopCart.length;
        }
    }
}
</script>
<style scoped>
   .OrderDetail{
       position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 200; 
   }
</style>