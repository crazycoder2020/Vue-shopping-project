import ajax from './ajax'

//1定义基础路径
const BASE_URL="http://demo.itlike.com/web/xlmc"

export const getHomeData = ()=>ajax(BASE_URL+"/api/homeApi");

//1.1请求左边网络数据
export const getCatgories = ()=>ajax(BASE_URL+"/api/homeApi/categories");

//1.2请求右边网络数据
export const getCatgoriesDetail = (preParams)=>ajax(BASE_URL+"/api/homeApi/categoriesdetail"
+preParams);

// 2. 用户中心接口
//  http://localhost:3000/web/xlmc/api/send_code
const LOCAL_BASE_URL = 'http://demo.itlike.com/web/xlmc';

//跨域操作
// const LOCAL_BASE_URL = '/api';

// 2.1 获取短信验证码(GET)
export const getPhoneCode = (phone) => ajax(LOCAL_BASE_URL + '/api/send_code', {phone});

// 2.2 手机验证码登录(POST)
export const phoneCodeLogin = (phone,code) => ajax(LOCAL_BASE_URL + '/api/login_code', {phone, code}, 'POST');

// 2.2 手机密码登录(POST)
export const phonePwdLogin = (username,pwd,captcha) => ajax(LOCAL_BASE_URL + '/api/login_pwd', {username,pwd,captcha}, 'POST');

//2.3自动登录
export const getUserInfo =()=> ajax(LOCAL_BASE_URL+"/api/userinfo");

//2.4退出登录
export const getLogOut = ()=> ajax(LOCAL_BASE_URL + '/api/logout');



//3.0购物车接口
//3.1添加商品
export const addGoodsToCart = (user_id,goods_id, goods_name, goods_price, small_image)=>ajax(BASE_URL + '/api/cart/add', {user_id,goods_id, goods_name,goods_price,small_image}, 'POST');

//3.2获取当前购物车里的数据
export const getGoodsCart = (user_id)=>ajax(BASE_URL + '/api/cart/search/'+ user_id);

//3.2修改当前购物车里的数量
export const changeCartNum = (user_id,goods_id,type)=>ajax(BASE_URL + '/api/cart/num',{user_id,goods_id,type} ,'POST');

//3.2清空当前购物车里的数量
export const clearAllCart = (user_id) => ajax(LOCAL_BASE_URL+ '/api/cart/clear/'+ user_id);


//4地址接口
//4.1获取当前用户地址
export const getUserAddress = (user_id) => ajax(LOCAL_BASE_URL+ '/api/address/search/'+ user_id);

// 4.2 添加新的地址
export const addUserAddress = ( user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode)=>ajax(LOCAL_BASE_URL + '/api/address/add', {user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode}, 'POST');

// 4.3 编辑用户的地址
export const changeUserAddress = ( address_id, user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode)=>ajax(LOCAL_BASE_URL + '/api/address/edit', {address_id, user_id, address_name, address_phone, address_area, address_area_detail, address_post_code, address_tag, province, city, county, areaCode}, 'POST');

// 4.4 删除用户的地址
export const delUserAddress = (address_id) => ajax(LOCAL_BASE_URL+ '/api/address/del/'+ address_id);

// 4.5 获取单条地址
export const getCurrentUserAddress = ( user_id, address_id)=>ajax(LOCAL_BASE_URL + '/api/address/one', {user_id, address_id}, 'POST');



// 5 单个商品的选中和取消选中
export const singerGoodsSelect = (user_id, goods_id)=>ajax(LOCAL_BASE_URL + '/api/cart/singer_select', {user_id, goods_id}, 'POST');

// 5.1 所有商品的选中和取消选中
export const allGoodsSelect = (user_id, flag)=>ajax(LOCAL_BASE_URL + '/api/cart/all_select', {user_id, flag}, 'POST');

// 5.2 查询所有已经被选中的商品
export const getAllSelectedGoods = (user_id) => ajax(LOCAL_BASE_URL+ '/api/cart/selected/'+ user_id);

// 5.3 删除已经生成订单的商品
export const delAllSelectedGoods = (user_id) => ajax(LOCAL_BASE_URL+ '/api/cart/del_checked/'+ user_id);



// 6. 订单接口
// 6.1 提交订单
export const postOrder = ( user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price)=>ajax(LOCAL_BASE_URL + '/api/order/post', {user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price}, 'POST');

// 6.2 订单支付成功
export const orderPaySuccess = (user_id, order_id)=>ajax(LOCAL_BASE_URL + '/api/order/change_status', {user_id, order_id}, 'POST');

// 6.3 查询订单
export const getOrder = (user_id, status)=>ajax(LOCAL_BASE_URL + '/api/order/get', {user_id, status}, 'POST'); // pay will


// 6. 微信支付接口部署
/*支付接口白名单：demo.itlike.com */
// const PAY_URL = 'http://47.98.157.152/WXPayProject/pay';

const PAY_URL = '/pay';
// 6.1 获取支付的URL
export const getWXCode = (outTradeNo, totalFee) => ajax(PAY_URL+ '/createNative.do', {outTradeNo, totalFee});
// 6.2 查询是否支付成功
export const queryPayStatus = (out_trade_no) => ajax(PAY_URL+ '/queryPayStatus.do', {out_trade_no});