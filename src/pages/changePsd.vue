<template>
    <!-- 编辑弹框 -->
    <div class="home-wrap">
      <van-nav-bar title="修改密码"
      fixed
      left-arrow
      right-text="提交"
      @click-left="back()"
      @click-right="submit()"
      />

    <van-cell-group class="form">
      <van-field
        v-model="mobile"
        type="tel"
        required
        clearable
        label="手机号"
        placeholder="请输入手机号"
        @clear="clear3"
      />
      <van-field
        v-model="sms"
        type="number"
        required
        clearable
        label="验证码"
        placeholder="请输入验证码"
      >
        <van-button size="small" slot="button" type="primary"
          @click.native="getCode"
          :disabled="timer > 0"
        >
          <template v-if="!timer">
            获取验证码
          </template>
          <template v-else>{{timecount}}s</template>
        </van-button>
      </van-field>
      <van-field
        v-model="psd"
        type="password"
        required
        clearable
        label="密码"
        placeholder="请输入新密码"
        @clear="clear1"
      />
      <van-field
        v-model="psdconfirm"
        type="password"
        label="确认密码"
        placeholder="请再次输入密码"
        required
        @clear="clear2"
      />
    </van-cell-group>

    </div>
</template>

<script>
import {
  SwipeCell, Cell, CellGroup,
  Dialog, NavBar,Toast,
  Row, Col, Button, Icon, Field,
  Popup, List, Swipe,NumberKeyboard
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'ChangePsd',
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
    [NumberKeyboard.name]: NumberKeyboard,
    Loading
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loadingText: '',
      loading: false, // 加载列表
      mobile: '',//登录手机号
      sms: '',//短信验证码
      psd: '',//密码
      psdconfirm: '',//确认密码
      timer: 0,
      timecount: 60,
    }
  },
  mounted () {
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
    //获取验证码
    getCode () {
      if (!this.mobile) {
        this.$toast('请输入手机号')
        return false
      }
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobile))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      this.axios.post(API.getCode, {
        type: 3,
        mobile: this.mobile
      }).then(data => {
        this.$toast('验证码已发送，请在5分钟内输入')
      })
      this.timer = setInterval(() => {
        const timecount = this.timecount
        if (timecount < 1) {
          this.timecount = 60
          this.timer = 0
        } else {
          this.timecount = timecount - 1
        }
      }, 1000)
    },
    //检查密码
    validate () {
      if (!this.mobile) {
        this.$toast('请输入手机号')
        return false
      }
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.mobile))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!this.sms) {
        this.$toast('请输入验证码')
        return false
      }
      if (!this.psd) {
        this.$toast('请输入密码')
        return false
      }
      if (!(/^[0-9]{6,}$/.test(this.psd))) {
        this.$toast('密码为至少6位的纯数字')
        return false
      }
      if (this.psd !== this.psdconfirm) {
        this.$toast('两次输入的密码不一致')
        return false
      }
      return true
    },
    clear1 () {
      this.psd = ''
    },
    clear2 () {
      this.psdconfirm = ''
    },
    clear3 () {
      this.mobile = ''
    },
    // 提交修改
    submit () {
      if (!this.validate()) return
      this.loading = true
      const psd  = this.psd
      const mobile = this.mobile
      const sms = this.sms
      let params = { mobile, psd, sms }
      this.axios.post(API.changePsd, params).then(data => {
        this.loading = false
        this.$toast('修改成功')
        this.$router.push({name: 'Login'})
        localStorage.clear()
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
.home-wrap .van-nav-bar {
  background-color: #08979c;
  color: #fff;
}
</style>