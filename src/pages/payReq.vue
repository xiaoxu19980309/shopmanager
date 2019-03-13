<template>
    <!-- 编辑弹框 -->
    <div class="home-wrap">
      <van-nav-bar title="收款账号"
      fixed
      left-arrow
      right-text="增加"
      @click-left="back()"
      @click-right="add_alipay()"
      />

      <div class="list">
        <!-- 支付宝账号列表 -->
        <template v-if="alilist.length > 0">
            <van-swipe-cell :right-width="130"
              v-for="(item) in alilist"
              :key="item.id"
              
            >
            <van-cell-group>
              <van-cell 
                :label="`身份证号：${item.persol_id}\n支付宝PID：${item.ali_PID}`"
                :title="`收款人姓名：${item.real_name}`"
              >
              </van-cell>
            </van-cell-group>
            </van-swipe-cell>
          </template>
          <p class="nomore" v-else>你还没有收款账号，请点击右上角“增加”按钮进行账号添加</p>
      </div>

    <van-popup v-model="alipay" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="增加收款支付宝账号"
          right-text="提交"
          left-arrow
          @click-left="alipay = false"
          @click-right="submit_addalipay"
          fixed
        />
        <van-field
          v-model="form.name"
          label="真实姓名"
          placeholder="请输入姓名"
          required
        />
        <van-field
          v-model="form.id"
          label="身份证号"
          placeholder="请输入身份证号码"
          required
        />
        <van-field
          v-model="form.alipayusername"
          label="支付宝账号"
          placeholder="请输入支付宝账号"
          required
        />
        <van-field
          v-model="form.alipayid"
          label="支付宝PID"
          placeholder="请输入支付宝PID"
          required
        >
        </van-field>
      </div>
    </van-popup>

  </div>
</template>

<script>
import {
  SwipeCell, Cell, CellGroup,
  Dialog, NavBar,Toast,Area,
  Row, Col, Button, Icon, Field,
  Popup, List, Swipe,NumberKeyboard
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'PayReq',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [SwipeCell.name]: SwipeCell,
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
    [NumberKeyboard.name]: NumberKeyboard,
    Loading
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loadingText: '',
      loading: false, // 加载列表
      mobile: '',//手机号
      alilist: [],//收款账户列表
      alipay: false,//显示增加收款账号表单
      form: {
        id: '',//身份证号
        name: '',//真实姓名
        address: '',//地址
        alipayusername: '',//alipayusername
        alipayid: '',//支付宝id
      },
      ali_PID: '',
    }
  },
  mounted () {
    let { mobile,name } = this.$route.query
    let alipid  = this.fetchPID()
    this.form.alipayid = alipid
    if(mobile){
      this.mobile = mobile
    }else{
      try{
        let user = JSON.parse(localStorage.getItem('user'))
        this.mobile = user.mobile
        const mobile = this.mobile
        this.loading = true
        this.axios.post(API.getAlipay, {mobile}).then(data => {
          this.loading = false
          this.alilist = data
        }).catch(e => {
          this.loading = false
        })
      }catch (e) {
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
      if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.id))) {
        this.$toast('身份证号码不合法！')
        return false
      }
      if (this.form.alipayid.length!==16&&(substr(this.form.alipayid,4)!=='2088')) {
        this.$toast('支付宝PID不正确')
        return false
      }
      return true
    },
    //显示增加收款账号表单
    add_alipay () {
      this.alipay = true
    },
    //获取支付宝PID
    getCode () {
      //window.location.href='https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019030563436991&scope=auth_base&redirect_uri=http%3a%2f%2fzfbsmf.edianlai.com%2findex%2fSmzf%2fget_pid%3fpcbid%3d1234'
      //var ua = window.navigator.userAgent.toLowerCase()
      //if (ua.match(/AlipayClient/i) == 'alipayclient') {
        //window.open("https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019030763480371&scope=auth_base&redirect_uri=http%3a%2f%2fgtsh.edianlai.com%2findex%2fSmzf%2fget_pid%3fpcbid%3d1234")
        // this.ali_PID = this.fetchPID()
        // alert(this.ali_PID)
      //}
      this.ali_PID = this.fetchPID()
    alert(this.ali_PID)
      // else{
	    // 	this.$toast('请用支付宝扫码')
	    // }

    },
    //增加收款账号
    submit_addalipay () {
      if (!this.validate()) return
      this.loading = true
      const name = this.form.name//真实姓名
      const identity = this.form.id//身份证号
      const ali_PID = this.form.alipayid//支付宝账号
      const alipay_username = this.form.alipayusername
      const mobile = this.mobile//手机号
      let params = { mobile, name, identity, ali_PID,alipay_username }
      this.axios.post(API.addAlipay, params).then(data => {
        this.loading = false
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
.form {
  margin-top: 15px;
}
.list {
  margin-top: 10px;
}
.edit-btn {
  width: 100%;
  background: #08979c;
}
.edit-box {
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  padding-top: 66px;
}
.home-wrap .van-nav-bar {
  background-color: #08979c;
  color: #fff;
}
</style>