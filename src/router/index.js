import Vue from 'vue'
import Router from 'vue-router'

//1.在vue中使用路由
Vue.use(Router);

//2.引入一级组件
import DashBoard from './../views/dashboard/DashBoard'

//2.1采用懒加载方式引入其他组件
const Home= ()=> import ("./../views/home/Home.vue");
const Cart= ()=> import ("./../views/cart/Cart.vue");
const CatGory= ()=> import ("./../views/catgory/CatGory.vue");

//2.2.1登录组件
const Mine= ()=> import ("./../views/mine/Mine.vue");
const UserCenter=()=> import ("./../views/mine/children/UserCenter.vue");
const Detail=()=> import ("./../views/mine/children/Detail.vue");

//2.2引入副组件
const Order= ()=> import ("./../views/order/Order.vue");
const OrderDetail= ()=> import ("./../views/order/children/OrderDetail.vue");
const MyAddress= ()=> import("./../views/order/children/MyAddress.vue")
const AddAddress= ()=> import("./../views/order/children/children/AddAddress.vue")
const EditAddress= ()=> import("./../views/order/children/children/EditAddress.vue")

//2.3引入登录组件
const Login= ()=>import("./../views/login/Login.vue")

//3.对外暴露路由供外界使用
export default new Router({
    routes:[
        {path:"/",redirect:"/dashboard"},
        {
            path:"/dashboard",
            name:"dashboard",
            component:DashBoard,
            children:[
                {path:"/dashboard",redirect:"/dashboard/home"},
                {path:"home",name:"home",component:Home,meta:{keepAlive:true}},
                {path:"cart",name:"cart",component:Cart},
                {path:"catgory",name:"catgory",component:CatGory,meta:{keepAlive:true}},
                {
                    path:"mine",
                    name:"mine",
                    component:Mine,
                    children:[
                        {path:"usercenter",name:"usercenter",component:UserCenter},
                        {path:"detail",name:"detail",component:Detail}
                    ]
                }
            ]
        },

        {
            path:"/confirmOrder",
            name:"order",
            component:Order,
            children:[
                {
                    path:"MyAddress",name:"myaddress",component:MyAddress,
                    children:[
                        {path:"AddAddress",name:"addAddress",component:AddAddress},
                        {path:"EditAddress",name:"editAddress",component:EditAddress}
                    ]
                },

                {
                    path:"OrderDetail",name:"orderDetail",component:OrderDetail,
                    
                }
            ]
        },

        //登录路由
        {path:"/login",name:"login",component:Login}

    ]
});