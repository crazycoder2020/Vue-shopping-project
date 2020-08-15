<template>
    <div class="edit">
        <van-nav-bar
            title="编辑地址"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
            :fixed=true
            :border=true
        />
        <van-address-edit
            :area-list="areaList"
            :address-info="addressInfo"
            show-postal
            show-delete
            show-set-default
            show-search-result
            :search-result="searchResult"
            @save="onSave"
            @delete="onDelete"
            @change-detail="onChangeDetail"
            style="margin-top:45px"
        />
    </div>
</template>
<script>
import area from './../../../../config/area'    
import {mapState} from 'vuex'
import {getCurrentUserAddress,changeUserAddress,delUserAddress} from './../../../../service/api/index'
import PubSub from 'pubsub-js'
import {Toast} from 'vant'
export default {
    name:"EditAddress",
    data() {
    return {
        areaList:area,//获取中国地址
        searchResult: [],
        addressInfo:{}
      };
    },
    computed: {
      ...mapState(["userinfo"])  
    },
    mounted () {
        //console.log(this.$route)
        if(this.$route.query.address_id){
          if(this.userinfo.token){
              this.getCurrentAddress(this.userinfo.token,this.$route.query.address_id);
          }
      }  
    },
    methods: {
        onClickLeft(){
            this.$router.back();
        },
        //
        async onSave(content) {
           if(this.userinfo.token){
               let result =await changeUserAddress(this.addressInfo.id,this.userinfo.token,content.name,
                                                   content.tel,content.province+content.city+content.county,
                                                   content.addressDetail,content.postalCode,content.isDefault,
                                                   content.province,content.city,content.county,content.areaCode 
                                                  );
               //console.log(result);
               if(result.success_code===200){
                Toast({
                   message:"修改地址成功!",
                   duration:500     
                });
                //返回上一级
                this.$router.back();
                //发布修改成功
                PubSub.publish("addAddressSuccess");      
              }else{
                  Toast({
                   message:"修改地址失败!",
                   duration:500     
                });
              }                                   
           }
        },
         async onDelete() {
           if(this.userinfo.token){
               let result=await delUserAddress(this.addressInfo.id);
               if(result.success_code===200){
                  Toast({
                   message:"删除地址成功!",
                   duration:500     
                }); 
                this.$router.back();
                 //发布修改成功
                PubSub.publish("addAddressSuccess");
               }else{
                   Toast({
                   message:"删除地址失败!",
                   duration:500     
                });
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
           } else {
              this.searchResult = [];
          }
        },
        //获取要修改的地址
        async getCurrentAddress(user_id,address_id){
            let result =await getCurrentUserAddress(user_id,address_id);
            //console.log(result)
            if(result.success_code===200){
                this.addressInfo={
                    id:result.data._id,
                    name:result.data.address_name,
                    tel:result.data.address_phone,
                    province:result.data.province,
                    city:result.data.city,
                    county:result.data.county,
                    addressDetail:result.data.address_area_detail,
                    areaCode:result.data.areaCode,
                    postalCode:result.data.address_post_code,
                    isDefault:result.data.address_tag
                }
            }
        }
    }
}
</script>
<style scoped>
    .edit{
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 9999;
    }
</style>