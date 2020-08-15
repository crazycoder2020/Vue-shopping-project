<template>
    <div class="catgory">
        <!-- 1.头部组件 -->
        <Header/>
        <!-- 中间内容区 -->
        <div class="Wrapper" v-if="!isShow">
            <!-- 左边 -->
            <div class="LeftWrappper">
                <ul class="wrapper">
                    <li 
                      class="categoryItem" 
                      v-for="(cate,index) in catgories" 
                      :key="cate.id"
                      :class="{selected:currentindex===index}"
                      @click="clickLefli(index)"
                      ref="menue"
                    >
                      <span class="textWrapper">{{cate.name}}</span>
                    </li>
                </ul>
            </div>

            <!-- 右边 -->
            <Title :CatgoriesDetail="CatgoriesDetail"/>
        </div>
        <van-loading
         v-else 
         type="spinner" 
         color= white
         style="position:absolute;left:50%;top:40%;transform:translate(-50%)"
        >
            小撩正在疯狂加载中...
        </van-loading>
    </div>
</template>
<script>
//1.引入组件
import Header from './components/Header'
import Title from './components/Title'

//2引入滚动组件
import BScroll from 'better-scroll'

//3.引入接口
import {getCatgories,getCatgoriesDetail} from '@/service/api/index'

//4.引入通知组件
import PubSub from 'pubsub-js'
import { Toast } from 'vant';

export default {
    name:"CatGory",
    components: {
        Header,
        Title
    },
    data () {
        return {
            //是否加载等待图标
            isShow:true, 
            //左边数据
            catgories:[],
            //右边数据
            CatgoriesDetail:[],
            //左边item选中与否
            currentindex:0
        }
    },
    created () {
        this.initData();
    },
    methods: {
        //1.初始化操作以及数据请求
        async initData(){
            //获取左边的数据
            let leftData = await getCatgories();
            if(leftData.success){
                this.catgories=leftData.data.cate;
            }
            console.log(this.catgories);

            //获取右边的数据
            let rightData =await getCatgoriesDetail("/lk001");
            if(rightData.success){
                this.CatgoriesDetail=rightData.data.cate;
            }
            console.log(this.CatgoriesDetail);

            //3.隐藏加载框
            this.isShow=false;

            //4.初始化滚动框架
            this.$nextTick(()=>{
                this.leftScroll=new BScroll(".LeftWrappper",{
                    probeType:3,
                    click:true,
                    scrollY:true,
                    tap:true,
                    mouseWheel:true
                    })
            });
        },

        //2.处理左边点击
        async clickLefli(index){
            //2.1改变索引
            this.currentindex=index;

            //2.2滚动到对应的位置
            //2.3拿到所有的li标签
            let munue=this.$refs.menue;
            //2.4拿到当前点击的li标签
            let li =munue[index];

            //2.5滑动到固定位置
            this.leftScroll.scrollToElement(li,300);

            //获取右边的数据
            let rightData =await getCatgoriesDetail(`/lk00${index+1}`);
            if(rightData.success){
                this.CatgoriesDetail=rightData.data.cate;
                console.log(this.CatgoriesDetail)
            } 
        }
    },
    beforeDestroy () {
        PubSub.unsubscribe("homeAddToCart")
    }
}
</script>
<style lang="less" scoped>
    .catgory{
        width: 100%;
        background-color: #f5f5f5;
        overflow: hidden;
    }
    .Wrapper{
        display: flex;
        position: absolute;
        top: 46px;
        bottom: 30px;
        overflow: hidden;
        width: 100%;
    }
    .LeftWrappper{
        background-color:#f5f5f5;
        width: 26%;
    }
    .wrapper{
        width: 100%;
    }
    .categoryItem{
       width: 100%;
       height: 50px;
       padding: 11px 10px 10px 13px;
    }
    .selected::before{
        content: "";
        background-color: green;
        width: 4px;
        height: 30px;
        position: absolute;
        left: 0;
    }
    .selected{
        background-color: #fff;
    }
    .selected span{
        font-size: 17px;
        font-weight: bold;
    }
    .textWrapper{
        font-size: 16px;
        color: #666666;
    }
</style>