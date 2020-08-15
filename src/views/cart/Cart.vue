<template>
    <div class="cart" v-if="userinfo.token">
       <!--头部区域-->
    <header class="titleWrapper">
        <span><strong>购物车</strong></span>
        <button class="button"
          @click="clearcart()"
        >
        清空购物车</button>
    </header>
    <div class="contentWrapper">
        <!--中间内容-->
        <main class="contentWrapperList">
            <section>
                <div class="shopCartListCon" v-for="(goods) in shopCart" :key="goods.id">
                    <div class="left">
                        <a href="javascript:;" 
                           class="cartCheckBox" 
                           :checked="goods.checked"
                           @click.stop="singgoodsselected(goods.id)" 
                        >
                        </a>
                    </div>
                    <div class="center">
                        <img :src="goods.small_image" alt="">
                    </div>
                    <div class="right">
                        <a href="#">
                            {{goods.name}}
                        </a>
                        <div class="bottomContent">
                            <p class="shopPrice">&yen;{{goods.price}}</p>
                            <div class="shopDeal">
                                <span @click="removeTocart(goods.id,goods.num)">-</span>
                                <input disabled type="number" v-model="goods.num">
                                <span @click="addCart(goods.id,goods.name,goods.small_image,goods.price)">+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <!--底部通栏-->
        <div class="tabBar">
            <div class="tabBarLeft">
                <a 
                   href="javascript:;" 
                   class="cartCheckBox"
                   @click.stop="Selected(selectedAll)"
                   :checked="selectedAll"
                >
                </a>
                <span style="font-size: 16px;">全选</span>
                <div class="selectAll">
                    合计：<span class="totalPrice">{{totalPrice|moneyFormate}}</span>
                </div>
            </div>
            <div class="tabBarRight">
                <!-- 配置路由出口 -->
                <button class="pay" @click.prevent="ToPay">
                    去结算({{CountShop}})
                </button>
            </div>
        </div>
      </div>
    </div>

    <SelectedLogin v-else/>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import { Dialog, Toast } from 'vant'
import SelectedLogin from './../../views/login/SelectLogin'
import {changeCartNum,clearAllCart,singerGoodsSelect,allGoodsSelect} from './../../service/api/index'
export default {
    name:"Cart",
    computed: {
        ...mapState(["shopCart","userinfo"]),
        //0.计算商品数量
        CountShop(){
            let selectedGoodsCount=0;
            Object.values(this.shopCart).forEach((goods,index)=>{
                if(goods.checked){
                    selectedGoodsCount+=1
                }
            });
            return selectedGoodsCount;
        },

        //1.商品是否全选
        selectedAll(){
            let CountShop=Object.values(this.shopCart).length;
            let tag=this.CountShop>0;
            Object.values(this.shopCart).forEach((goods,index)=>{
                if(!goods.checked){
                    tag=false
                }
            });
            return tag;
        },

        //2.计算商品总价
        totalPrice(){
            let totalPrice=0;
            Object.values(this.shopCart).forEach((goods,index)=>{
                if(goods.checked){
                    totalPrice+=goods.price * goods.num;
                }
            });
            return totalPrice;
        }
    },
    methods: {
        ...mapMutations(["REMOVE_SHOPCART","ADD_GOODS","SELECETED_SHOPCART","SELECTED_ALL","CLEAR_CART"]),
        //1.移出购物车
        async removeTocart(goodsId,goodsNum){
            if(goodsNum>1){
                let result =await changeCartNum(this.userinfo.token,goodsId,"reduce");
                console.log(result);
                if(result.success_code===200){
                    this.REMOVE_SHOPCART({goodsId});
                }else{
                    Toast({
                        message:"修改失败!",
                        duration:500
                    });
                }
            }else if(goodsNum===1){//挽留
              Dialog.confirm({
                title: '温馨提示',
                message: '您确定要移除该商品吗？',
                })
                .then(async() => {
                    let result =await changeCartNum(this.userinfo.token,goodsId,"reduce");
                    console.log(result);
                    if(result.success_code===200){
                       this.REMOVE_SHOPCART({goodsId});
                    }else{
                        Toast({
                        message:"修改失败!",
                        duration:500
                      });
                    }
                })
                .catch(() => {
                    // do nothing
                });
            }
        },

        //2.增加商品
        async addCart(goodsId,goodsName,smallImage,goodsPrice){
            let result =await changeCartNum(this.userinfo.token,goodsId,"add");
                    console.log(result);
                    if(result.success_code===200){
                        this.ADD_GOODS({
                            goodsId,
                            goodsName,
                            smallImage,
                            goodsPrice
                        });
                    }else{
                        Toast({
                        message:"修改失败!",
                        duration:500
                      });
                    }
        },

        //3.单个商品的选中和取消选中
        async singgoodsselected(goodsId){
            let result =await singerGoodsSelect(this.userinfo.token,goodsId);
            if(result.success_code===200){
                this.SELECETED_SHOPCART({goodsId});
            }else{
                Toast({
                        message:"选择失败!",
                        duration:500
                 });
            }
        },

        //4.全选和取消全选
        async Selected(isSelected){
            let result =await allGoodsSelect(this.userinfo.token,isSelected);
            if(result.success_code===200){
                this.SELECTED_ALL({isSelected})
            }
        },

        //5.清空购物车
        clearcart(){
          Dialog.confirm({
            title: '温馨提示',
            message: '您确定要清空购物车吗？',
            })
            .then(async () => {
                let result =await clearAllCart(this.userinfo.token);
                console.log(result);
                if(result.success_code===200){
                    this.CLEAR_CART({});
                }else{
                    Toast({
                        message:"修改失败!",
                        duration:500
                    });
                }
            })
            .catch(() => {
                // do nothing
            });
        },

        //6.商品结算
        ToPay(){
            if(this.totalPrice>0){
                this.$router.push("/confirmOrder")
            }else{
                Toast({
                    message:"请选择商品后再结算!",
                    duration:1000
                })
            }
        },
    },
    components: {
       SelectedLogin  
    },
}
</script>
<style lang="less" scoped>
    .titleWrapper span{
        width: 50px;
        height: 20px;  
        margin-left: 130px;
        font-size: 16px;
    }
    .button{
        background: transparent;
        padding-left: 60px;
        color: red;
        font-size: 13px;
    }
    .cart{
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }
    .titleWrapper{
        width: 100%;
        height: 2.6rem;
        background: #fff;
        -webkit-background-size: 0.1rem 4.4rem;
        background-size: 0.1rem 4.4rem;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
        }

    .contentWrapper{
        padding-top: 3.5rem;
    }

        /*列表内容*/
        .contentWrapperList{
            padding-bottom: 6rem;
        }

        .contentWrapperList section{
            background-color: #fff;
        }

        .cartCheckBox{
            background: url("./images/shop-icon.png") no-repeat;
            -webkit-background-size: 2.5rem 5rem;
            background-size: 2.5rem 5rem;
            width: 1rem;
            height: 1rem;
        }

        .cartCheckBox[checked]{
            background-position: -1.2rem 0;
        }

        .shopCartListCon{
            display: flex;
            height: 6rem;
            border-bottom:  0.01rem solid #e0e0e0;
            margin-bottom: 0.7rem;
            padding: 0.5rem 0;
        }

        .shopCartListCon .left{
            flex: 1;
            display: flex;
        }

        .shopCartListCon .left a{
            display: inline-block;
            margin-top: 0.8rem;
            margin-left: 0.5rem;
        }


        .shopCartListCon .center{
            flex: 3;
        }

        .shopCartListCon .center img{
            width: 100%;
            height: 100%;
        }

        .shopCartListCon .right{
            /*background: orangered;*/
            flex: 6;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 0.5rem;
            margin-right: 0.5rem;

            position: relative;
        }

        .shopCartListCon .right a{
            height: 2.2rem;
            line-height: 1.2rem;
            overflow: hidden;
            margin-bottom: 0.3rem;
            font-size: 0.8rem;
            color: #000;
        }

        .shopCartListCon .bottomContent{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
        }

        .shopCartListCon .bottomContent .shopPrice{
            font-size: 0.8rem;
        }

        .shopCartListCon .right .shopDeal span{
            width: 1rem;
            height: 1.2rem;
            line-height: 1.2rem;
            text-align: center;
            float:left;
        }

        .shopCartListCon .right .shopDeal input{
            float: left;
            width: 2rem;
            height: 1.2rem;
            text-align: center;
            margin: 0 0.2rem;
            font-size: 0.8rem;
        }

        /*底部通栏*/
        .tabBar{
            position: fixed;
            left:0;
            bottom:2.7rem;
            width:100%;
            height: 2.5rem;
            background-color: #fff;

            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 0.01rem solid #e0e0e0;
        }

        .tabBarLeft{
            display: flex;
            align-items: center;
            margin-left: 0.5rem;
        }

        .tabBarLeft .selectAll{
            margin-left: 1rem;
            font-size: 1rem;
        }

        .totalPrice{
            color: #E9232C;
        }


        .tabBarRight .pay{
            width:5rem;
            height: 2rem;
            background-color: #E9232C;
            border-radius: 1rem;
            margin-right: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1rem;
            color: #fff;
        }
</style>