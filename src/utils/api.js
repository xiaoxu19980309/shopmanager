
const API = {
  login: '/shop/login',//登录
  register: '/shop/register',//注册
  getCode: '/shop/mobile_code',//获取手机验证码
  logout: '/shop/logout',//登出
  editCard: '/shop/update_ident',//修改个人信息
  openShop: '/shop/openshop',//开店
  getType: '/shop/get_type',//获取模板分类
  closeShop: '/shop/closeshop',//关店
  bindShop: '/shop/bindShop',//绑定秤
  get_Devices: '/shop/get_devices',//获取这个店下所有秤
  deleteDevice: '/shop/deviceDel',//解除秤的绑定
  getGoods: '/shop/get_goods',//获取店铺货物信息
  delGood: '/shop/del_goods',//删除货物
  addGood: '/shop/add_goods',//增加货物
  updateGood: '/shop/update_goods',//修改货物信息
  resetPlu: '/shop/ResetPlu',//重置plu
  sortPlu: '/shop/sort',//自动排序plu
  setPlu: '/shop/setPlu',//设置plu
  delPlu: '/shop/del_plu',//解除plu绑定
  getnopluGoods: '/shop/noplu_goods',//获取没有plu的菜
  getsaletable: '/shop/vue_getShopSales',//获取销售统计表
  getsalegraph: '/shop/marketpayinfo',//获取销售折线图
  editShop: '/shop/edit_shopname',  //修改店铺名
  // getCategories: '/web_get_category',
  // modifyCategory: '/web_set_category',
  // addCategory: '/web_set_category',
  // getGoods: '/web_get_goods',
  // modifyGood: '/web_modify_good',
  // addGood: '/web_add_good',
  // changePassword: '/web_change_pwd'
}

export { API }
