import Vue from 'vue'

//注册人民币过滤器
Vue.filter("moneyFormate",(values)=>{
    return "￥" +Number(values).toFixed(2);
});