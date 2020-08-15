import {
    ADD_GOODS,
    INIT_SHOP_CART,
    REMOVE_SHOPCART,
    SELECETED_SHOPCART,
    SELECTED_ALL,
    CLEAR_CART,
    USER_INFO,
    INIT_USER_INFO,
    RESET_USER_INFO
} from './mutation-type'

import {setStore,getStore, removeStore} from './../config/glable'
import Vue from 'vue'

export default{
    //1.添加商品到购物车
    [ADD_GOODS](state,{goodsId,goodsName,smallImage,goodsPrice}){
        let shopCart=state.shopCart;
        //判断是否存在该商品
        if(shopCart[goodsId]){
            //存在
            shopCart[goodsId]["num"]++;
        }else{
            shopCart[goodsId]={
                "num":1,
                "id":goodsId,
                "name":goodsName,
                "small_image":smallImage,
                "price":goodsPrice,
                "checked":true
            }
        }
        //1.2产生新对象
        state.shopCart={...shopCart};
        //1.3存入数据
        setStore("shopCart",state.shopCart);
    },

    //2.页面初始化，获取本地购物车数据
    [INIT_SHOP_CART](state){
        let initCart=getStore("shopCart");
        if(initCart){
            state.shopCart=JSON.parse(initCart);
        }
    },

    //3.从购物车中移出商品
    [REMOVE_SHOPCART](state,{goodsId}){
        let shopCart =state.shopCart;
        let goods=shopCart[goodsId];
        if(goods){
            //3.1找到该商品
            if(goods["num"]){
                goods["num"]--;
                //3.2判断是否0个
                if(goods["num"]===0){
                    delete shopCart[goodsId];
                }
            }else{
                goods=null;
            }
            //3.3同步数据到本地
            state.shopCart={...shopCart};
            setStore("shopCart",state.shopCart);
        }
    },

    //4.处理购物车中选中样式
    [SELECETED_SHOPCART](state,{goodsId}){
        let shopCart =state.shopCart;
        let goods=shopCart[goodsId];
        if(goods){
            if(goods.checked){
                goods.checked=!goods.checked;
            }else{
                Vue.set(goods,"checked",true);
            }
            //4.1同步数据
            state.shopCart={...shopCart};
            setStore("shopCart",state.shopCart);
        }
    },
    //5.处理购物车中全选与取消全选样式
    [SELECTED_ALL](state,{isSelected}){
        let shopCart =state.shopCart;
        //遍历
        Object.values(shopCart).forEach((goods,index)=>{
            if(goods){
              if(goods.checked){
                goods.checked=!isSelected;
              }else{
                Vue.set(goods,"checked",!isSelected)
            } 
          }
        });
        //4.1同步数据
        state.shopCart={...shopCart};
    },
    //6.清空购物车
    [CLEAR_CART](state){
        state.shopCart=null;
        state.shopCart={...state.shopCart}
        setStore("shopCart",state.shopCart);
    },
    //7.保存用户信息到本地
    [USER_INFO](state, {userinfo}){
        state.userinfo = userinfo;
        setStore('userinfo', state.userinfo);
    },
    //8.获取用户信息
    [INIT_USER_INFO](state){
        // 8.1 获取用户信息
        let userinfo = getStore('userinfo');
        // 8.2 判断
        if(userinfo){
            state.userinfo = JSON.parse(userinfo);
        }
    },
    //9.重置用户信息
    [RESET_USER_INFO](state){
        state.userinfo={};
        removeStore("userinfo");
    }    
}
