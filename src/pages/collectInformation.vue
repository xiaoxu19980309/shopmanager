<template>
    <!-- 编辑弹框 -->
    <div class="home-wrap">
      <van-nav-bar title="信息采集"
      fixed
      left-arrow
      right-text="添加用户"
      @click-left="back()"
      @click-right="showadd = true"
      />

      <div>
        <div class="totalnum">
          <van-row class="td-33">
            <van-col span="12">
              <span>今日登记用户数</span>
            </van-col>
            <van-col span="12">
              <span>本月累计登记用户数</span>
            </van-col>
          </van-row>
          <van-row class="td-34">
            <van-col span="12">
              <span>0人</span>
            </van-col>
            <van-col span="12">
              <span>0人</span>
            </van-col>
          </van-row>

        </div>
      </div>

      <div>
        <div class="list">
          <van-row class="td-33">
            <van-col span="4">
              <span>序号</span>
            </van-col>
            <van-col span="6">
              <span>摊主姓名</span>
            </van-col>
            <van-col span="7">
              <span>摊主电话</span>
            </van-col>
            <van-col span="6">
              <span>经营类别</span>
            </van-col>
          </van-row>
          
          <template v-if="list.length > 0">
            <van-cell-group
              v-for="(item,i) in list"
              :key="i"
            >
              <div>
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

      <van-popup v-model="showadd" position="right">
        <div class="edit-box">
          <van-nav-bar
            title="添加用户"
            right-text="提交"
            left-arrow
            @click-left="showadd = false"
            @click-right="submitAddUser"
            fixed
          />
          <van-cell-group class="form">

            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>摊主姓名</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.name" placeholder="请输入摊主姓名">
                </div>
              </div>
            </div>

            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>摊主电话</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.mobile" placeholder="请输入摊主电话">
                </div>
              </div>
            </div>

            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>开户人姓名</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.addUserName" placeholder="请输入开户人姓名">
                </div>
              </div>
              <div class="icon">
                <i class="iconfont icon-icon_details" @click="$toast('身份认证栏')"></i>
              </div>
            </div>
            
            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>身份证号</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.id" placeholder="请输入身份证号">
                </div>
              </div>
              <div class="icon">
                <i class="iconfont icon-icon_details" @click="$toast('开户人身份证号')"></i>
              </div>
            </div>

            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>支付宝账号</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.alipayNumber" placeholder="请输入支付宝账号">
                </div>
              </div>
              <div class="icon">
                <i class="iconfont icon-icon_details" @click="$toast('支付宝账号栏')"></i>
              </div>
            </div>

            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>支付宝PID</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.alipayPID" placeholder="请输入支付宝PID">
                </div>
              </div>
              <div class="icon">
                <i class="iconfont icon-icon_details" @click="$toast('扫一扫二维码')"></i>
              </div>
            </div>

            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>经营类别</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.kind" placeholder="请选择经营类别">
                </div>
              </div>
              <div class="icon">
                <van-button size="small" slot="button" type="primary"
                  @click.native="showpicker = true"
                >选择经营类别
                </van-button>
              </div>
            </div>

            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>区域</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.area" placeholder="请选择区域">
                </div>
              </div>
              <div class="icon">
                <van-button size="small" slot="button" type="primary"
                  @click.native="showarea = true"
                >选择区域
                </van-button>
              </div>
            </div>

            <div class="cell">
              <div class="cell-title">
                <label class="require">*</label>
                <label>店铺地址</label>
              </div>
              <div class="cell-value">
                <div class="cell-body">
                  <input type="text" class="field" v-model="form.address" placeholder="请输入店铺地址">
                </div>
              </div>
            </div>

          </van-cell-group>
        </div>

        <van-popup v-model="showpicker" position="bottom">
          <van-picker
            :columns="columns"
            show-toolbar
            title="请选择经营类型"
            @cancel="onCancel"
            @confirm="onConfirm"
            />
        </van-popup>

        <van-popup v-model="showarea" position="bottom">
          <van-area 
          :area-list="areaList" 
          value="110101" 
          @cancel="showarea = false"
          @confirm="(value)=>getarea(value)"
          />
        </van-popup>


      </van-popup>
  </div>
</template>

<script>
import {
  Cell, CellGroup,
  Dialog, NavBar,Toast,Area,
  Row, Col, Button, Icon, Field,
  Popup, List,Picker
} from 'vant'
import { areaList } from '@/utils/area'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'CollectInformation',
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
    [Area.name]: Area,
    [Picker.name]: Picker,
    Loading
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loadingText: '',
      loading: false, // 加载列表
      mobile: '',//手机号
      form: {
        name: '',//真实姓名
        mobile: '',//联系电话
        addUserName: '',//开户人姓名
        id: '',//开户人身份证号
        alipayNumber: '',//支付宝账号
        alipayPID: '',//支付宝PID
        kind: '',//经营类别
        area: '',//地区
        address: '',//准确地址
      },
      list: '',//列表
      areacode: '',//地区code
      showadd: false,//显示增加用户的表单
      showpicker: false,//显示选择经营类别的弹窗
      showarea: false,//显示选择区域的弹窗
      columns: ['猪肉', '牛羊肉', '蔬菜','水果','海鲜','豆制品','活禽','冻品','其它'],
      areaList: '',
    }
  },
  mounted () {
    this.areaList = areaList
    let { mobile,name } = this.$route.query
    if(mobile){
      this.mobile = mobile
    }else{
      try {
        let { mobile } = JSON.parse(localStorage.getItem('user'))
        this.mobile = mobile
      } catch (e) {
        this.$toast('您还未登录')
        this.$router.push({name: 'Login'})
      }
    }

  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    //检查表单内容
    validate () {
      if (!this.form.name) {
        this.$toast('请输入姓名！')
        return false
      }
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.mobile))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!this.form.number) {
        this.$toast('请输入预订数量！')
        return false
      }
      if (!this.form.address) {
        this.$toast('请输入邮寄地址！')
        return false
      }
      return true
    },
    onConfirm(value, index) {
      this.form.kind = this.columns[index]
      this.showpicker = false
    },
    onCancel() {
      this.showpicker = false
    },
    //获取地区
    getarea (value) {
      this.form.area = value[0].name+value[1].name+value[2].name
      this.areacode = value[2].code
      this.showarea = false
    },
    //提交表单
    submitAddUser () {
      if (!this.validate()) return
      this.loading = true
      const { name, mobile, number, address, model } = this.form
      let params = { name, mobile, number, address, model }
      this.axios.post(API.bookDevice, params).then(data => {
        this.loading = false
        this.$toast('预订成功')
        this.back()
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
.totalnum {
  width: 100%;
  height: 4rem;
  background-image:-webkit-linear-gradient( 180deg, rgb(32,178,170) 0%, rgb(72,209,204) 70%);
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  box-shadow: 0 1px 6px #fff;
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
span {
  font-size: 16px;
}
.list {
  width: 100%;
  background-color: #fff;
  color: black;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 1px 6px #f2f2f2;
  margin-bottom: 10px;
}
.edit-box {
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  padding-top: 66px;
}
.require {
  color: red;
}
.cell {
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 10px 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 24px;
    position: relative;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    overflow: hidden;
}
.cell-title {
  max-width: 90px;
  -ms-flex: 1;
  flex: 1;
}
.cell-value {
    overflow: hidden;
    text-align: right;
    position: relative;
    vertical-align: middle;
    width: 70%;
}
.cell-body {
    display: flex;
    align-items: center;
}
.field {
  border: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  resize: none;
  display: block;
  box-sizing: border-box;
  background-color: transparent;
}
.icon {
    right: 10px;
    position: absolute;
}
</style>