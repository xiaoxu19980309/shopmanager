<template>
  <div class="msglogin">
    <van-nav-bar title="登录" fixed left-arrow @click-left="back"/>
    <div class="form">
      <li>
        <i class="iconfont icon-phone"></i>
        <input type="tel" placeholder="请输入手机号" v-model="form.username">
      </li>
      <li>
        <i class="iconfont icon-code"></i>
        <input type="tel" placeholder="请输入验证码" v-model="form.code">
        <van-button size="small" style="margin-top: 0.1rem;"
          @click.native="getCode"
          :disabled="timer > 0"
        >
          <template v-if="!timer">
            获取验证码
          </template>
          <template v-else>{{timecount}}s</template>
        </van-button>
      </li>
      <van-button class="login-btn" size="large" @click.native="login" :loading="loading">登录</van-button>
      <div class="bottom">
        <span>没有账号？
          <strong><router-link to="/register" tag="span">点此注册</router-link></strong>
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
  name: 'Forget1',
  data () {
    return {
      form: {
        username: '',
        code: '',
      },
      loading: false,
      timer: 0,
      timecount: 60,
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Button.name]: Button
  },
  mounted () {
    localStorage.clear()
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    validate () {
      if (!this.form.username) {
        this.$toast('手机号不能为空')
        return false
      }
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.username))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      return true
    },
    // 获取验证码
    getCode () {
      if (!this.form.username) {
        this.$toast('请输入手机号')
        return false
      }
      if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.username))) {
        this.$toast('请输入正确的手机号')
        return false
      }
      this.axios.post(API.getCode, {
        type: 2,
        mobile: this.form.username
      }).then(data => {
        this.$toast('验证码已发送，请在5分钟内输入')
      }).catch(e=>{

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
    login () {
      if (!this.validate()) return
      this.loading = true
      this.axios.post(API.login, {
        mobile: this.form.username,
        code: this.form.code,
      }).then(data => {
        this.loading = false
        localStorage.setItem('user', JSON.stringify(data))
        this.$toast('登录成功')
        if(data.type===0){
          this.$router.push({name: 'Home'})
        }
        else if(data.type===1){
          this.$router.push({name: 'HomeDealer'})
        }
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.msglogin {
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
.msglogin .van-nav-bar {
  background-color: #08979c;
  color: #fff;
}
.van-button--default{
  background-color: #08979c;
  color: #fff;
}
.van-button--disabled {
  color: #999 !important;
  background-color: #eee !important;
  border: 1px solid #e5e5e5 !important;
}
</style>
