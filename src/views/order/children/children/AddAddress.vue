<template>
    <div class="add">
        <van-nav-bar
            title="添加地址"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
            :fixed=true
            :border=true
        />

        <van-address-edit
            :area-list="areaList"
            show-postal
            show-set-default
            :search-result="searchResult"
            @save="onSave"
            @change-detail="onChangeDetail"
            style="margin-top:45px"
        />
        
    </div>
</template>
<script>
import {Toast} from 'vant'
import areaList from './../../../../config/area' 
import {addUserAddress} from './../../../../service/api/index'
import {mapState} from 'vuex'
import PubSub from 'pubsub-js'
export default {
    name:"AddAddress",
    data() {
    return {
      areaList: areaList,
      searchResult: [],
    };
    },
    computed: {
      ...mapState(["userinfo"])
    },
    methods: {
        onClickLeft(){
           this.$router.back();
        },
        async onSave(content){
          // console.log(content);
          if(this.userinfo.token){
            let result=await addUserAddress(this.userinfo.token, content.name, content.tel,
                                            content.province+content.city+content.county,
                                            content.addressDetail, 
                                            content.postalCode, content.isDefault, content.province, 
                                            content.city, content.county, content.areaCode);
            console.log(result);
            if(result.success_code===200){//成功
                Toast({
                message:"添加地址成功!",
                duration:500
                });
                //回去
                this.$router.back();
                //发起通知
                PubSub.publish("addAddressSuccess");
            } else{
              Toast({
                message:"添加地址失败!",
                duration:500
              })
            }                               
          }
        },
        onChangeDetail(val) {
          if (val) {
            this.searchResult = [
              {
                name: '黄龙万科中心',
                address: '杭州市西湖区',
              },
            ];
          }else {
            this.searchResult = [];
          }
        },
    }
}
</script>
<style scoped>
  .add{
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 9999;
  }
   .router-slide-enter-active,.router-slide-leave-active{
       transition: all 0.4s;
   }
   .router-slide-enter,.router-slide-leave-active{
       transform: translate3d(2rem,0,0);
       opacity: 0;
   }
</style>