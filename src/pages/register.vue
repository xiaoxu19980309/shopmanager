<template>
  <div class="register">
    <van-nav-bar title="注册" 
    fixed 
    left-arrow
    @click-left="back"
    />

    <div class="form">
      <li>
        <i class="iconfont icon-phone"></i>
        <input type="tel" placeholder="请输入手机号" v-model="form.mobile">
      </li>
      <li>
        <i class="iconfont icon-user"></i>
        <input type="text" placeholder="请输入用户名" v-model="form.name">
      </li>
      <li>
        <i class="iconfont icon-code"></i>
        <input type="tel" placeholder="请输入短信验证码" v-model="form.code">
        <van-button size="small"
          @click.native="getCode"
          :disabled="timer > 0"
        >
          <template v-if="!timer">
            获取验证码
          </template>
          <template v-else>{{timecount}}s</template>
        </van-button>
      </li>
      <li>
        <i class="iconfont icon-lock"></i>
        <input type="password" placeholder="请输入密码" v-model="form.password">
      </li>
      <li>
        <i class="iconfont icon-confirm"></i>
        <input type="password" placeholder="请再次输入密码" v-model="psdConfirm">
      </li>
      <van-button size="large" @click.native="register" :loading="loading">注册</van-button>
      <div class="bottom">
        <span>已有帐号 ？
          <strong><router-link to="/login" tag="span">点此登录</router-link></strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { API } from '@/utils/api'
import { NavBar, Button } from 'vant'
import md5 from 'md5'
export default {
  name: 'Register',
  data () {
    return {
      form: {
        mobile: '',
        code: '',
        password: '',
        name: ''
      },
      psdConfirm: '',
      timer: 0,
      timecount: 60,
      loading: false
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Button.name]: Button
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    validate () {
      if (!this.form.mobile) {
        this.$toast('请输入手机号')
        return false
      }
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.mobile))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!this.form.code) {
        this.$toast('请输入验证码')
        return false
      }
      if (!this.form.password) {
        this.$toast('请输入密码')
        return false
      }
      if (!(/^[0-9]{6,}$/.test(this.form.password))) {
        this.$toast('密码为至少6位的纯数字')
        return false
      }
      if (this.form.password !== this.psdConfirm) {
        this.$toast('两次输入的密码不一致')
        return false
      }
      return true
    },
    // 获取验证码
    getCode () {
      if (!this.form.mobile) {
        this.$toast('请输入手机号')
        return false
      }
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.mobile))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      this.axios.post(API.getCode, {
        type: 1,
        mobile: this.form.mobile
      }).then(data => {
        this.$toast(data.msg)
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
    register () {
      if (!this.validate()) return
      this.loading = true
      const { mobile, password, type, code } = this.form
      let params = { mobile, password, type: 1, code }
      if (name) {
        params = { ...params, nickname }
      }
      this.axios.post(API.register, params).then(data => {
        this.loading = false
        this.$toast('注册成功，快去登录吧')
        this.$router.push({name: 'Login'})
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.register {
  padding: 96px 15px 15px 15px;
  min-height: 100vh;
  font-size: 14px;
  background: #f2f2f2;
}
li {
  display: flex;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 15px;
  align-items: center;
  padding: 0 10px;
  line-height: 40px;
}
li input {
  border: none;
  flex: 1;
  margin: 10px 0 10px 4px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
}

.bottom {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
strong {
  color: #08979c;
  font-weight: normal;
}

</style>

<style>
.register .van-button--default{
  background-color: #08979c;
  color: #fff;
}
.register .van-button--disabled {
  color: #999 !important;
  background-color: #eee !important;
  border: 1px solid #e5e5e5 !important;
}
</style>
