<template>
    <div class="My">
        <!-- 导航栏 -->
        <van-nav-bar
            title="我的地址"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
            :fixed=true
            :border=true
        />
        <!--  -->
        <van-address-list
            v-model="chosenAddressId"
            :list="list"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            @select="onBackAddress"
            style="margin-top:50px"
        />
        <!-- 出口 -->
        <transition name="router-slide" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import {Toast, AddressEdit, AddressList} from 'vant'
import {getUserAddress} from './../../../service/api/index'
import { mapState } from 'vuex';
import PubSub from 'pubsub-js'

export default {
    name:"MyAddress",
    data() {
    return {
      chosenAddressId: '1',
      list: [
        // {
        //   id: '1',
        //   name: '张三',
        //   tel: '13000000000',
        //   address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
        //   isDefault: true,
        // },
        // {
        //   id: '2',
        //   name: '李四',
        //   tel: '1310000000',
        //   address: '浙江省杭州市拱墅区莫干山路 50 号',
        // },
      ],
    };
  },
  computed: {
    ...mapState(["userinfo"])
  },
  mounted () {
      this.initUserAddredd();
      //订阅添加地址成功
      PubSub.subscribe("addAddressSuccess",(msg)=>{
          if(msg==="addAddressSuccess"){
              this.initUserAddredd();
          }
      })
  },
  methods: {
        onClickLeft(){
            this.$router.back();
        },
        onAdd() {
            //Toast('新增地址');
            this.$router.push({
                path:"/confirmOrder/MyAddress/AddAddress"
            })
        },
        onEdit(item, index) {
            //编辑地址
            this.$router.push({
                path:"/confirmOrder/MyAddress/EditAddress?address_id="+item.address_id
            })
        },
        //获取当前用户地址
        async initUserAddredd(){
            if(this.userinfo.token){
                let result= await getUserAddress(this.userinfo.token);
                //console.log(result);
                if(result.success_code===200){
                    let addAddData=result.data;
                    this.list=[];
                    addAddData.forEach((address,index)=>{
                        let addObj={
                            id:String(index+1),
                            name: address.address_name,
                            tel: address.address_phone,
                            address: address.address_area+address.address_area_detail,
                            address_id:address._id,
                            user_id:address.user_id
                        };
                        //追加到数组
                        this.list.push(addObj);
                    });
                }else{
                   Toast({
                    message:"获取地址失败!",
                    duration:500
                }); 
                }
            }else{
                Toast({
                    message:"登录已经过期,请重新登录",
                    duration:500
                })
            }
        },
        //返回选中地址
        onBackAddress(item,index){
            if(item){
                //发布订阅
                PubSub.publish("userAddress",item);
                //返回上层界面
                this.$router.back();
            }
        }
    },
    beforeDestroy(){
        PubSub.unsubscribe("addAddressSuccess");
    }
}

</script>
<style scoped>
    .My{
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 200;    
    }
    .router-slide-enter-active,.router-slide-leave-active{
       transition: all 0.4s;
   }
   .router-slide-enter,.router-slide-leave-active{
       transform: translate3d(2rem,0,0);
       opacity: 0;
   }
</style>