import {USER_INFO} from './mutation-type'
import {getStore} from './../config/glable'
import {getUserInfo} from './../service/api/index'
export default{
    // 1. 同步用户信息
    syncUserInfo({commit}, userinfo) {
     commit(USER_INFO, {userinfo})
    },

    //2.自动登录
    async reqUserInfo({commit}){
        //1.从本地获取数据
        let userinfo=JSON.parse(getStore("userinfo"));
        if(userinfo){
            commit(USER_INFO,{userinfo});
        }else{
            //2.2从服务器端验证
            let result =await getUserInfo();
            if(200===result.success_code){
                commit(USER_INFO,{userinfo:result.data});
            }
        }
    }
}