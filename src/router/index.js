import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import(/* webpackChunkName: "login" */'@/pages/login')
const UpdateCard= () => import(/* webpackChunkName: "forget" */'@/pages/updateCard')
const MsgLogin= () => import(/* webpackChunkName: "forget1" */'@/pages/msgLogin')
const Register = () => import(/* webpackChunkName: "register" */'@/pages/register')
const Home = () => import(/* webpackChunkName: "register" */'@/pages/home')
const OpenShop = () => import(/* webpackChunkName: "openshop" */'@/pages/openShop')
const Shop = () => import(/* webpackChunkName: "shop" */'@/pages/shop')
const EditShop = () => import(/* webpackChunkName: "editShop" */'@/pages/editShop')
const ShopSale = () => import(/* webpackChunkName: "shopSale" */'@/pages/shopSale')
const ShopCard = () => import(/* webpackChunkName: "shopCard" */'@/pages/shopCard')
const ShopList = () => import(/* webpackChunkName: "ShopList" */'@/pages/ShopList')//店铺列表
const ChangePsd =() => import(/* webpackChunkName: "ChangePsd" */'@/pages/ChangePsd')//修改密码
const PayReq   = () => import(/* webpackChunkName: "PayReq" */'@/pages/PayReq')//支付申请
const DeviceControl = () => import(/* webpackChunkName: "DeviceControl" */'@/pages/DeviceControl')//设备管理
const ShopOrder = () => import(/* webpackChunkName: "ShopOrder" */'@/pages/ShopOrder')//销售详情
const CheckBill = () => import(/* webpackChunkName: "CheckBill" */'@/pages/CheckBill')//对账
const BookDevice = () => import(/* webpackChunkName: "BookDevice" */'@/pages/BookDevice')//产品预订
// const ShopSaleTable = () => import(/* webpackChunkName: "shopSaleTable" */'@/pages/shopSaleTable')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Home,
      meta: { requireAuth: true }
    },
    //密码登录
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    //短信登录
    {
      path: '/msgLogin',
      name: 'MsgLogin',
      component: MsgLogin
    },
    //注册
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    //主界面
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { requireAuth: true }
    },
    //个人信息
    {
      path: '/updateCard',
      name: 'UpdateCard',
      component: UpdateCard,
      meta: { requireAuth: true }
    },
    //设备管理
    {
      path: '/deviceControl',
      name: 'DeviceControl',
      component: DeviceControl,
      meta: { requireAuth: true }
    },
    //收款账号
    {
      path: '/payReq',
      name: 'PayReq',
      component: PayReq,
      meta: { requireAuth: true }
    },
    //销售统计
    {
      path: '/shopOrder',
      name: 'ShopOrder',
      component: ShopOrder,
      meta: { requireAuth: true }
    },
    //对账
    {
      path: '/checkBill',
      name: 'CheckBill',
      component: CheckBill,
      meta: { requireAuth: true }
    },
    //产品预订
    {
      path: '/bookDevice',
      name: 'BookDevice',
      component: BookDevice,
      meta: { requireAuth: true }
    },
    //修改密码
    {
      path: '/changePsd',
      name: 'ChangePsd',
      component: ChangePsd,
      meta: { requireAuth: true }
    },
    //店铺管理
    {
      path: '/shopList',
      name: 'ShopList',
      component: ShopList,
      meta: { requireAuth: true }
    },
    //开店
    {
      path: '/openShop',
      name: 'OpenShop',
      component: OpenShop,
      meta: { requireAuth: true }
    },
    //店铺详情
    {
      path: '/shop',
      name: 'Shop',
      component: Shop,
      meta: { requireAuth: true }
    },
    //编辑店铺
    {
      path: '/editShop',
      name: 'EditShop',
      component: EditShop,
      meta: { requireAuth: true }
    },
    //店铺销售情况
    {
      path: '/shopSale',
      name: 'ShopSale',
      component: ShopSale,
      meta: { requireAuth: true }
    },
    //店铺操作
    {
      path: '/shopCard',
      name: 'ShopCard',
      component: ShopCard,
      meta: { requireAuth: true }
    },
    //店铺销售图表
    // {
    //   path: '/shopSaleTable',
    //   name: 'ShopSaleTable',
    //   component: ShopSaleTable,
    //   meta: { requireAuth: true }
    // },
  ]
})
