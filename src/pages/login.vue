<template>
  <div class="login">
    <van-nav-bar title="登录" fixed/>
    <div class="form">
      <li>
        <i class="iconfont icon-phone"></i>
        <input type="tel" placeholder="请输入手机号" v-model="form.username">
      </li>
      <li>
        <i class="iconfont icon-lock"></i>
        <input type="password" placeholder="请输入密码" v-model="form.password">
      </li>
      <van-button class="login-btn" size="large" @click.native="login" :loading="loading">登录</van-button>
      <div class="bottom">
        <span>没有账号？
          <strong><router-link to="/register" tag="span">点此注册</router-link></strong>
        </span>
        <span><router-link to="/msgLogin" tag="span">验证码登录</router-link></span>
      </div>
    </div>
  </div>
</template>

<script>
import { API } from '@/utils/api'
import { NavBar, Button } from 'vant'
import md5 from 'md5'
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: '',
        code: '',
      },
      loading: false,
      timer: 0,
      timecount: 30,
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Button.name]: Button
  },
  mounted () {
    localStorage.clear()
    // try{
    //   let ali_PID = JSON.parse(localStorage.getItem('ali_PID'))
    // }catch (e) {
    //   window.open='https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019030763480371&scope=auth_base&redirect_uri=http%3a%2f%2fbalala.edianlai.com%2findex%2fvue%2fnew_login%3fpcbid%3d1234'
    //   alert(1)
    // }
    
  },
  methods: {
    validate () {
      if (!this.form.username) {
        this.$toast('手机号不能为空')
        return false
      }
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.username))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!(/^[0-9]{6,}$/.test(this.form.password))) {
        this.$toast('密码为至少6位的纯数字')
        return false
      }
      return true
    },
    login () {
      if (!this.validate()) return
      this.loading = true
      this.axios.post(API.login, {
        mobile: this.form.username,
        password: this.form.password
      }).then(data => {
        this.loading = false
        localStorage.setItem('user', JSON.stringify(data))
        this.$router.push({name: 'Home'})
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.login {
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
  height: 40px;
  padding: 0 10px;
}
li i {
  line-height: 40px;
}
input {
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
.iconfont {
  font-size: 16px;
}
.login-btn {
  background-color: #08979c;
  color: #fff;
}
.bottom {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
strong {
  color: #08979c;
  font-weight: normal;
}
</style>
