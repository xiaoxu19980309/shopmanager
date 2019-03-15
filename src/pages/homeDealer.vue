<template>
  <div class="home-wrap" v-if="mobile">
    <loading :loading="gLoading" :text="loadingText" />
    
    <van-nav-bar
      title="首页"
      fixed
      right-text="退出"
      @click-right="logout"
    >
      <!-- <i class="iconfont icon-logout" slot="right"></i> -->
    </van-nav-bar>

    <div>
      <div class="totalnum">
        <van-row class="td-33">
          <van-col span="12">
            <span>本月商户数</span>
          </van-col>
          <van-col span="12">
            <span>有效人数</span>
          </van-col>
        </van-row>
        <van-row class="td-34">
          <van-col span="12">
            <span>0元</span>
          </van-col>
          <van-col span="12">
            <span>0笔</span>
          </van-col>
        </van-row>

        <div class="td-33">
            <span>昨日新增（有效人数）</span>
            <span class="td-35">0人</span>
        </div>
      </div>

      <div class="panel">
        <van-row class="iconitem">
          <van-col span="6">
            <router-link to="">
              <i class="iconfont icon-bianji" style="color:#8db6cd"></i><br>
              <span>信息采集</span>
            </router-link>
          </van-col>

        </van-row>
      </div>
    </div>

    <div class="bottom">
      <van-tabbar v-model="active">
        <van-tabbar-item icon="home">
          <router-link to="/home" tag="span">首页</router-link>
        </van-tabbar-item>
        <van-tabbar-item icon="search">
          <div @click="to_sale" class="salesearch">交易查询</div>
        </van-tabbar-item>  
        <van-tabbar-item icon="contact">
          <!-- <router-link to="/updatecard" tag="span">我的</router-link> -->
          <div @click="to_mine" class="salesearch">我的</div>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import {
  SwipeCell, Cell, CellGroup,
  Tag, Dialog, Checkbox, NavBar,
  Row, Col, Button, Icon, Field,
  Popup, List, Swipe,PullRefresh,
  Tabbar,TabbarItem
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'HomeDealer',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [SwipeCell.name]: SwipeCell,
    [Tag.name]: Tag,
    [Checkbox.name]: Checkbox,
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Icon.name]: Icon,
    VanDialog: Dialog,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    Loading
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loadingText: '',
      mobile: '',
      isLoading: false,
      active: 0,
      alipid: '',//aliPID
    }
  },
  mounted () {
    try{
      let user_id = JSON.parse(localStorage.getItem('alipid'))
      if(user_id){
        this.alipid = user_id
      }else{
        //this.alipid = this.fetchPID()
        //alert(this.alipid)
      }
    }catch (e) {

    }
    
    try {
      let { mobile,name,shopinfo } = JSON.parse(localStorage.getItem('user'))
      this.mobile = mobile
      this.list = shopinfo || []
      this.getsalenum()
    } catch (e) {
      this.$toast('您还未登录')
      this.$router.push({name: 'Login'})
    }
  },
  methods: {
    //销售统计页面
    to_sale () {
      const mobile = this.mobile
      this.axios.post(API.get_Devices, { mobile }).then(status => {
        if(status===0){

          Dialog.confirm({
              message: '您还没有绑定秤？是否去绑定'
            }).then(() => {
              this.gLoading = true
              this.$router.push({ name: 'DeviceControl', query: { mobile }})
          }).catch(e => {

          })

        }else{
          this.$router.push({ name: 'ShopOrder', query: { mobile }})
        }
      }).catch(e => {

      })
    },
    to_mine () {
      const mobile = this.mobile
      this.$router.push({ name: 'UpdateCard', query: { mobile }})
    },
    getsalenum () {
      const mobile = this.mobile
      this.axios.post(API.todaySale,{ mobile }).then(data => {
        this.loading = false
        this.today_income = data.all_income
        this.today_order = data.all_goodnum
        this.people = data.people
        this.zfb_income = data.zfb_incom
        this.zfb_order = data.zfb_goodnum
      }).catch(e => {
        this.loading = false
      })
    },

  }
}
</script>

<style scoped>
.home-wrap {
  background-color: #f2f2f2;
  min-height: 100vh;
  padding-top: 46px;
}
.user {
  margin: 20px 0;
  width: 100%;
  padding: 15px;
  background-color: #fff;
  font-size: 14px;
  position: relative;
}
.totalnum {
  width: 100%;
  height: 5rem;
  background-image:-webkit-linear-gradient( 180deg, rgb(32,178,170) 0%, rgb(72,209,204) 70%);
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 1px 2px 0px #fff;
  padding: 10px 0px;
}
.td-33 {
  padding: 10px;
  margin: 15px auto;
}
.td-34 {
  padding: 10px;
  margin: 0 auto;
  color: #ffd700;
}
.td-35 {
  color: #ffd700;
  margin-left: 10px;
}
.salesearch {
  font-size: 16px;
}
.panel {
  background: #fff;
  text-align: center;
  padding: 10px 0px;
}
.iconitem {
  margin-bottom: 7px;
}
.iconitem .iconfont{
  margin-bottom: 10px;
  font-size: 42px;
}
span {
  font-size: 16px;
}
.iconitem span {
  color: #8f8f94;
}
</style>

<style>
.home-wrap .van-swipe-cell__right {
  width: 65Px;
}
.home-wrap .van-nav-bar {
  background-image:-webkit-linear-gradient( 180deg, rgb(32,178,170) 0%, rgb(72,209,204) 100%);
  color: #fff;
  overflow: hidden;
  box-shadow: 0 1px 6px #ccc;
}
.home-wrap .van-cell__left-icon {
  margin-right: 10px;
}
</style>
