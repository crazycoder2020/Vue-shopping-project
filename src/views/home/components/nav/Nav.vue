<template>
    <div class="wrapper">
        <div class="iswrapper">
            <div class="imgs">
                <a class="inner-item" v-for="(nav) in show_list" :key="nav.cid">
                    <img :src="nav.icon_url" :alt="nav.name">
                    <span>{{nav.name}}</span>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"Nav",
    props: {
        show_list:Array
    }
}
</script>
<style lang="less" scoped>
    .wrapper{
        width: 100%;
        height: 190px;
        background-color: #fff;
        position: relative;
    }
    .iswrapper{
        width: 100%;
        height: 190px;
    }
    .imgs{
        width: 100%;
        height: 190px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
    .inner-item{
        width: 70px;
        height: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: #666666;
    }
    .inner-item img{
        width: 60%;
        margin-bottom: 5px;
    }

</style>