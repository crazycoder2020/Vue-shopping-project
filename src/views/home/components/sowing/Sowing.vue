<template>
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="green">
      <van-swipe-item v-for="(sowing) in sowing_list" :key="sowing.public_id">
          <img :src="sowing.icon_url" :alt="sowing.public_name">
      </van-swipe-item>
  </van-swipe>
</template>
<script>
export default {
    name:"Sowing",
    props: {
        sowing_list:Array
    }
}
</script>
<style lang="less" scoped>
    .my-swipe{
        width: 100%;
        height: 200px;
    }
   .my-swipe img{
      width: 100%;
      height: 100%;
   }
</style>