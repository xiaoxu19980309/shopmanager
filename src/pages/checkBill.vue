<template>
    <!-- 编辑弹框 -->
    <div class="home-wrap">
      <van-nav-bar title="账单"
      fixed
      left-arrow
      @click-left="back()"
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
      <div class="totalnum">
          <van-row class="td-33">
              <van-col span="12">当日总订单数</van-col>
              <van-col span="12">总金额</van-col>
          </van-row>
          <van-row class="td-35">
              <van-col span="12">{{all_goodnum}}笔</van-col>
              <van-col span="12">¥{{all_income}}</van-col>
          </van-row>
      </div>

      <van-field  
        v-model="sdate"
        label="选择时间"
        @focus="(e) => focus(e, 'sdate')"
        placeholder="请选择时间"
      />

      <div>
        <div class="totalnum">
          <van-row class="td-33">
            <van-col span="4">
              <span>序号</span>
            </van-col>
            <van-col span="11">
              <span>订单编号</span>
            </van-col>
            <van-col span="4">
              <span>金额</span>
            </van-col>
            <van-col span="5">
              <span>支付方式</span>
            </van-col>
          </van-row>
          
          <template v-if="orderlist.length > 0">
            <van-cell-group
              v-for="(item,i) in orderlist"
              :key="i"
            >
              <div class="list">
                <van-row class="td-34">
                  <van-col span="4">
                    <span>{{(i+1)+15*(page-1)}}</span>
                  </van-col>
                  <van-col span="11">
                    <span>{{item.out_trade_no}}</span>
                  </van-col>
                  <van-col span="4">
                    <span>¥{{item.totalamount}}</span>
                  </van-col>
                  <van-col span="5">
                    <span v-if="item.paymenttypeid==1">现金</span>
                    <span v-else>支付宝</span>
                  </van-col>
                </van-row>
              </div>
            </van-cell-group>

            <div>
              <van-button size="small" slot="button" type="primary"
                @click.native="lastpage"
              >上一页
              </van-button>
              <span>当前第{{page}}页/共{{allpage}}页</span>
              <van-button size="small" slot="button" type="primary"
                @click.native="nextpage"
              >下一页
              </van-button>
            </div>
          </template>
          
        </div>
      </div>

      <vm-back-top :bottom="70" :height="100" />

      <van-popup v-model="popup.sdate" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
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
  Dialog, NavBar,Toast,
  Row, Col, Button, Icon, Field,
  Popup, List,DatetimePicker
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
let moment = require('moment')
export default {
  name: 'CheckBill',
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
    [DatetimePicker.name]: DatetimePicker,
    Loading
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loadingText: '',
      loading: false, // 加载列表
      mobile: '',//手机号
      orderlist: '',//收款账户列表
      time: '选择时间',
      currentDate: new Date(),//当前时间
      month: '',//显示月份
      minDate: new Date(2018,0,1),//可获取的最小时间
      maxDate: new Date(),//可获取的最大时间
      sdate: '',//开始时间
      edate: '',//结束时间
      popup: {
        sdate: false,
      },
      all_goodnum: 0,//总订单数
      all_income: 0,//总收入
      page: 1,//当前页数
      allpage: 1,//共几页
    }
  },
  mounted () {
    // this.LopTime()
    let { mobile,name } = this.$route.query
    if(mobile){
      this.mobile = mobile
    }else{
      try {
        let { mobile } = JSON.parse(localStorage.getItem('user'))
        this.mobile = mobile
        this.month = this.currentDate.getMonth()+1
        this.getBill()
      } catch (e) {
        this.$toast('您还未登录')
        this.$router.push({name: 'Login'})
      }
    }
    
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
      let D = endvalue.getDate()
      this.popup[type] = false
      this.month = endvalue.getMonth()+1
      this.day = D
      if(type=='sdate'){
        this.sdate = Y+M+'-'+D
        this.getBill()
      }
    },
    //上一页
    lastpage () {
      if(this.page!==1){
        this.page = this.page - 1
        this.getBill()
      }else{
        
      }
    },
    //下一页
    nextpage () {
      if(this.page!==this.allpage){
        this.page = this.page + 1
        this.getBill()
      }else{
        
      }
    },
    getBill () {
      this.loading = true
      const mobile = this.mobile//time
      const time = this.sdate
      const page = this.page
      this.axios.post(API.bill,{ mobile,time,page }).then(data => {
        this.loading = false
        this.all_goodnum = data.all_goodnum
        this.all_income = data.all_income
        this.orderlist = data.order
        this.allpage = data.ordernum
        //this.$toast('接口访问成功')
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
  height: 100vh;
  padding-top: 46px;
}
.totalnum {
  width: 100%;
  background-color: #fff;
  color: black;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 1px 6px #fff;
  padding: 10px 0px;
  margin-bottom: 10px;
}
.td-33 {
  margin: 0 auto;
  color: #8f8f94;
}
.td-34 {
  margin: 0 auto;
  color: black;
  font-size: 14px;
}
.td-35 {
  color: black;
  font-size: 19px;
}
.list {
  margin-bottom: 5px;
}
</style>