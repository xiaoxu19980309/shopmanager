<template>
  <div class="home-wrap">
    <loading :loading="gLoading" :text="loadingText" />
    <!-- 编辑弹框 -->
    <van-nav-bar
      :title="shopname"
      fixed
      left-arrow
      @click-left="back"
    >
    </van-nav-bar>
    <div class="edit-box">
      <van-field
        v-model="sdate"
        label="选择开始时间"
        @focus="(e) => focus(e, 'sdate')"
        placeholder="请选择时间"
      />
      <van-field
        v-model="edate"
        label="选择结束时间"
        @focus="(e) => focus(e, 'edate')"
        placeholder="请选择时间"
      />
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
      <van-popup v-model="popup.edate" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="(value) => confirm(value,'edate')"
          @cancel="cancel('edate')"
        />
    </van-popup>
    </div>
    
    <div class="total">
      <font style="18px;">总成交额:{{totalamount}}元</font>
      <font style="18px;">总订单数:{{totalorder}}笔</font>
    </div>
    <div id="myChart" ref="myChart"></div>
    
    <template>
      <div >
        <table id="table" rules="all" width="100%" style="height: 10px;margin-right: 200px;background-color: #fff;">
          <tr>
            <th>交易时间</th>
            <th>交易项</th>
            <th>总交易重量/kg</th>
            <th>总交易金额/元</th>
          </tr>
          <tbody id="tbody" v-for="item in list" :key="item.goodid" style="text-align:center;">
            <tr>
              <td>{{item.intime}}</td>
              <td>{{item.name}}</td>
              <td>{{item.weight}}</td>
              <td>{{item.income}}</td>
            </tr>
          </tbody>

        </table>
      </div>
    </template>

  </div>
</template>

<script>
import {
  SwipeCell, Cell, CellGroup,
  Tag, Dialog, Checkbox, NavBar,
  Row, Col, Button, Icon, Field,
  Popup, List, Swipe,DatetimePicker
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
export default {
  name: 'ShopSale',
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
    [DatetimePicker.name]: DatetimePicker,
    Loading,
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loading: false, // 加载列表
      loadingText: '加载中',
      shopid: 0,
      shopname: '',
      currentDate: new Date(),//当前时间
      minDate: new Date(2018,0,1),//可获取的最小时间
      maxDate: new Date(),//可获取的最大时间
      sdate: '',//选择开始时间
      edate: '',//结束时间
      totalamount: 0,
      totalorder: 0,
      popup: {
        sdate: false,
        edate: false
      },
      timedate: [],//折线图时间
      salelist: [],//折线图数据
      list: [],
    }
  },
  mounted () {
    let { shopid, shopname } =this.$route.query
    this.shopid = shopid
    this.shopname = shopname
    this.getsalegraph()
    this.getsaletable()
  },
  watch: {
    'list' (newVal, oldVal) {

    },
  },
  methods: {
    back() {
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
      let Y = endvalue.getFullYear()+'-';
      let M = (endvalue.getMonth()+1 < 10 ? '0'+(endvalue.getMonth()+1): endvalue.getMonth()+1);
      M = M + '-'
      let D = endvalue.getDate()
      this.popup[type] = false
      if(type=='sdate'){
        this.sdate = Y+M+D
        this.submittime()
      }else{
        this.edate = Y+M+D
        this.submittime()
      }
    },
    //选择时间提交
    submittime(){
      const sday = this.sdate
      const eday = this.edate
      const shopid = this.shopid
      this.loading = true
      this.axios.post(API.getsalegraph,{ 'shopid':shopid, 'beginDate': sday, 'endDate': eday }).then(data =>{
        this.loading = false
        this.timedate = data.timedata
        this.salelist = data.data
        this.totalamount = 0
        this.totalorder  = 0
        let amount = 0
        let order = 0
        data.data[0].data.map(function(item){
          amount += item
        })
        data.data[1].data.map(function(item){
          order  += item
        })
        this.totalamount = amount
        this.totalorder  = order
        let myChart = echarts.init(document.getElementById('myChart'))
        const salelist = this.salelist
        // 绘制图表
        myChart.setOption({
          title: { text: '销售统计' },
          tooltip: {},
          xAxis: {
            data: this.timedate
          },
          legend: {
            data:['金额/元','订单数/笔'],
            x: 150
          },
          yAxis: {},
          series: salelist
        });

        }).catch( e => {

      })
      setTimeout(() => {
        //获取统计数据
      this.axios.post(API.getsaletable,{ 'shopid':shopid, 'sday': sday, 'eday': eday }).then(data =>{
        this.loading = false
        this.list = data
        this.set(this,'list',data)
        }).catch( e => {

      })
      }, 1000);
    },
    //获取数据折线图
    getsalegraph(){
      const shopid = this.shopid
      this.loading = true
      this.axios.post(API.getsalegraph, { 'shopid':shopid }).then(data => {
        this.loading = false
        this.timedate = data.timedata
        this.salelist = data.data
        this.totalamount = data.data[0].data[6]
        this.totalorder  = data.data[1].data[6]
        let myChart = echarts.init(document.getElementById('myChart'))
        const salelist = this.salelist
        // 绘制图表
        myChart.setOption({
          title: { text: '销售统计' },
          tooltip: {},
          xAxis: {
            data: this.timedate
          },
          legend: {
            data:['金额/元','订单数/笔'],
            x: 150
          },
          yAxis: {},
          series: salelist
        });
        }).catch( e=> {
          
      })
    },

    //获取统计数据
    getsaletable(){
      const shopid = this.shopid
      this.loading = true
      this.axios.post(API.getsaletable,{ 'shopid':shopid }).then(data =>{
        this.loading = false
        this.list = data
        this.set(this,'list',data)
        }).catch( e => {

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
.home-wrap .van-nav-bar {
  background-color: #08979c;
  color: #fff;
}
.total{
  margin-top: 20px;
  font-size: 16px;
  text-align: center;
}
#myChart{
  margin-top: 20px;
  width: 100%;
  height: 300px;
}
</style>


