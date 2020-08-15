<template>
    <div class="wrapper">
        <div class="titlewrapper">
            <div class="left">
                 <div class="title">限时抢购</div>
                 <span class="num">07:00场</span>
                 <div class="time">已结束</div>
            </div>
            <span class="more">更多</span>
        </div>
    
         <div class="wrapperr">
            <div class="itemss">
              <div class="div">
                <a class="items" v-for="(product) in flash_sale" :key="product.id">
                    <img :src="product.small_image" :alt="product.spec"/>
                    <span class="name">{{product.product_name}}</span>
                    <span class="del">{{product.origin_price|moneyFormate}}</span>
                    <span class="newsales">{{product.price|moneyFormate}}</span>
                    <div class="img" @click="addToCart(product)">
                        <img src="@/images/tabbar/shoppingcart_selected.png" alt="">
                    </div>
                </a>
              </div>  
            </div>
         </div>    
        </div>
</template>
<script>

import PubSub from 'pubsub-js'

export default {
    name:"FlashSale",
    props: {
        flash_sale:Array
    },
    components: {
        // items
    },
    methods: {
        addToCart(goods){
            PubSub.publish("homeAddToCart",goods);
        }
    },
    beforeDestroy () {
        PubSub.unsubscribe("homeAddToCart")
    }
}
</script>
<style lang="less" scoped>
    .wrapper{
        width: 100%;
        background-color: #fff;
        margin-top: 10px;
    }
    .titlewrapper{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
    }
    .left{
        width: 85%;
        height: 50px;
        // margin-left: 20px;
        padding-left: 20px;
        display: flex;
        align-items: center;
       
    }
    .title{
        font-size: 20px;
        font-weight: bolder;
        margin-right: 7px;
    }
    .num{
        color: red;
        margin-right: 7px;
    }
    .time{
        border: 1px solid #666666;
        font-size: 13px;
        color: #666666;
        border-radius: 5px;
    }
    .more{
        color: green;
    }

    .wrapperr{
        width: 100%;
        height: 250px;
        background-color: #fff;
    }
    .itemss{
        width: 100%;
        height: 250px;
        padding-left: 10px;
        overflow-x: scroll;
    }
    .div{
        width: 100%;
        height: 250px;
        display: flex;
    }
    .items{
        width: 300px;
        height: 250px;
        display: flex;
        flex-direction: column;
        margin-left: 6px;
        position: relative;
    }
    .items img{
        width: 150px;
        height: 150px;
    }
    .name{
        font-size:15px;
        font-weight: bold;
        margin-bottom: 11px;
    }
    .del{
        font-size: 13px;
        color: #666666;
        text-decoration:line-through;
        margin-bottom:10px
    }
    .newsales{
        font-size: 14px;
        color: red;
    }
    .img img{
        width: 20px;
        height: 20px;
        position: absolute;
        left: 100px;
        top: 200px;
    }
</style>