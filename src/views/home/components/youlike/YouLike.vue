<template>
    <div class="wrapper">
        <div class="Titlewrapper">
            <div class="Line"></div>
            <div class="center">猜你喜欢</div>
        </div>
       <div class="contentwrapper">
           <YouLikeItem 
                v-for="(product) in you_like" 
                :key="product.id"
                :product="product"
                />
       </div>
    </div>
</template>
<script>
import YouLikeItem from './YouLikeItem'
export default {
    name:"YouLike",
    props: {
        you_like:Array || []
    },
    components: {
        YouLikeItem
    }
}
</script>
<style lang="less" scoped>
    .wrapper{
        margin-top: 10px;       
    }
    .Titlewrapper{
        position: relative;
        padding: 0 0.625rem;
        height: 2.1875rem;
        text-align: center;
    }
    .Line{
        padding-top: 1.09375rem;
        border-bottom: solid 1px #D8D8D8;
    }
    .center{
         position: relative;
            display: inline-block;
            top: -1.09375rem;
            padding: 0 1.25rem;
            line-height: 2.1875rem;
            font-size: 1rem;
            background: #F5F5F5;
            color: #666666;
    }
    .contentwrapper{
        margin-bottom: 50px;
    }
</style>