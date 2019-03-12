<template>
    <!-- 编辑弹框 -->
    <div class="home-wrap">
      <van-nav-bar title="本月销售统计"
      fixed
      left-arrow
      @click-left="back"
      />

      <!-- <div class="list">
        <template v-if="list.length > 0">
          <van-swipe-cell :right-width="130"
            v-for="(item, i) in list"
            :key="item.shopid"
            @click.native="() => goDetail(item.shopid, item.shopname)"
          >
            <van-cell-group>
              <van-cell :value="item.notes" is-link :title="item.shopname" icon="shop">
              </van-cell>
            </van-cell-group>
            <template slot="right">
              <span class="operate-btn edit-btn" @click.stop="() => editShop(i)">编辑</span>
              <span class="operate-btn" @click.stop="() => closeShop(i)">关店</span>
            </template>
          </van-swipe-cell>
        </template>
        <p class="nomore" v-else>你还没有开店，请点击右上角“开店”按钮进行开店</p>
      </div> -->

      <div>
        <div class="totalnum">
          <van-row class="td-33">
            <van-col span="12">
              <span>收款</span>
            </van-col>
            <van-col span="12">
              <span>订单</span>
            </van-col>
          </van-row>
          <van-row class="td-34">
            <van-col span="12">
              <span>{{today_income}}元</span>
            </van-col>
            <van-col span="12">
              <span>{{today_goodnum}}笔</span>
            </van-col>
          </van-row>

          <van-row class="td-33">
            <van-col span="8">
              <span>微信</span>
              <span></span>
            </van-col>
            <van-col span="8">
              <span>支付宝</span>
            </van-col>
            <van-col span="8">
              <span>云支付</span>
            </van-col>
          </van-row>
          <van-row class="td-34">
            <van-col span="8">
              <span>{{wx_income}}元/{{wx_order}}笔</span>
              <span></span>
            </van-col>
            <van-col span="8">
              <span>{{zfb_income}}元/{{zfb_order}}笔</span>
            </van-col>
            <van-col span="8">
              <span>{{yun_income}}元/{{yun_order}}笔</span>
            </van-col>
          </van-row>

          <div class="td-33">
              <span>{{month}}月累计有效人数</span>
              <span class="td-35">{{people}}人</span>
          </div>
        </div>
      </div>

      <van-field  
        v-model="sdate"
        label="选择时间"
        @focus="(e) => focus(e, 'sdate')"
        placeholder="请选择时间"
      />
      <van-popup v-model="popup.sdate" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="year-month"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="(value) => confirm(value,'sdate')"
          @cancel="cancel('sdate')"
        />
      </van-popup>

  </div>
</template>

<script>
import {
  Cell, CellGroup,
  Dialog, NavBar,Toast,Collapse, CollapseItem,
  Row, Col, Button, Icon, Field,
  Popup, List,DatetimePicker,Tabbar,TabbarItem
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'ShopOrder',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Icon.name]: Icon,
    VanDialog: Dialog,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Toast.name]: Toast,
    [List.name]: List,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [DatetimePicker.name]: DatetimePicker,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    Loading
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loadingText: '',
      loading: false, // 加载列表
      mobile: '',//手机号
      list: '',//收款账户列表
      time: '选择时间',
      currentDate: new Date(),//当前时间
      month: '',//显示月份
      minDate: new Date(2018,0,1),//可获取的最小时间
      maxDate: new Date(),//可获取的最大时间
      sdate: '',//开始时间
      edate: '',//结束时间
      popup: {
        sdate: false,
        edate: false
      },
      today_income: 0,
      today_goodnum: 0,
      yun_income: 0,
      yun_order: 0,
      zfb_income: 0,
      zfb_order: 0,
      wx_income: 0,
      wx_order: 0,
      people: 0,//有效人数
    }
  },
  mounted () {
    // this.LopTime()
    let { mobile,name } = this.$route.query
    if(mobile){
      this.mobile = mobile
    }else{
      let user = JSON.parse(localStorage.getItem('user'))
      this.mobile = user.mobile
    }
    this.month = this.currentDate.getMonth()+1
    this.getOrder()
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    focus (e, key) {
      document.activeElement.blur()
      this.popup[key] = true
    },
    cancel(type){
      this.popup[type] = false
    },
    confirm(v,type){
      var endvalue = new Date(v)
      let Y = endvalue.getFullYear()+'-'
      let M = (endvalue.getMonth()+1 < 10 ? '0'+(endvalue.getMonth()+1): endvalue.getMonth()+1)
      this.popup[type] = false
      this.month = endvalue.getMonth()+1
      if(type=='sdate'){
        this.sdate = Y+M
        this.getOrder()
      }
    },
    getOrder () {
      this.loading = true
      const time = this.sdate
      const mobile = this.mobile
      this.axios.post(API.getsale,{ mobile, time }).then(data => {
        this.loading = false
        this.today_income = data.all_income
        this.today_goodnum = data.all_goodnum
        this.zfb_income = data.zfb_income
        this.zfb_order = data.zfb_goodnum
        this.people   = data.people
      }).catch(e => {
        this.loading = false
      })
    },
    // 更新操作至localStorage
    update () {
      // let user = JSON.parse(localStorage.getItem('user'))
      // user.shopinfo = JSON.parse(JSON.stringify(this.list))
      // localStorage.setItem('user', JSON.stringify(user))
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
.van-collapse-item__content{
  padding: 0;
}
.totalnum {
  width: 100%;
  /* height: 5rem; */
  background-image:-webkit-linear-gradient( 180deg, rgb(32,178,170) 0%, rgb(72,209,204) 70%);
  /* background-image:radial-gradient( #20B2AA, #48D1CC ); */
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  box-shadow: 0 1px 6px #fff;
  padding: 10px 0px;
}
.td-33 {
  padding: 10px;
  margin: 0 auto;
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
span {
  font-size: 16px;
}
.home-wrap .van-nav-bar {
  /* background-color: #08979c; */
  color: #fff;
}
</style>