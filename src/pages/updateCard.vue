<template>
  <div class="forget">
    <van-nav-bar title="修改个人信息" 
    fixed
    left-arrow 
    @click-left="back"
    right-text="提交"
    @click-right="submit"
    />
    <div class="form">
      <li>
        <i class="iconfont icon-user">昵称:</i>
        <input type="text" placeholder="请输入昵称" v-model="form.name">
      </li>
      <li>
        <i class="iconfont icon-lock"></i>
        <input type="password" placeholder="请输入新密码" v-model="form.password">
      </li>
      <li>
        <i class="iconfont icon-confirm"></i>
        <input type="password" placeholder="请再次输入密码" v-model="psdConfirm">
      </li>
      <div class="bottom">
      </div>
    </div>
  </div>
</template>

<script>
import { API } from '@/utils/api'
import { NavBar, Button } from 'vant'
import md5 from 'md5'
export default {
  name: 'UpdateCard',
  data () {
    return {
      form: {
        name: '',
        password: '',
      },
      mobile: '',
      psdConfirm: '',
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
    try {
      let { mobile,name } = JSON.parse(localStorage.getItem('user'))
      this.mobile = mobile
      this.form.name = name
      // this.nickname = nickname
      // this.list = shopinfo || []
    } catch (e) {
      this.$toast('您还未登录')
      this.$router.push({name: 'Login'})
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    validate () {
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
    submit () {
      if (!this.validate()) return
      this.loading = true
      const { name, password } = this.form
      const mobile = this.mobile
      let params = { mobile,name, password }
      this.axios.post(API.editCard, params).then(data => {
        this.loading = false
        this.$toast('修改成功')
        this.update()
        this.$router.push({name: 'Home'})
      }).catch(e => {
        this.loading = false
      })
    },
    update() {
      let user = JSON.parse(localStorage.getItem('user'))
      user.name = this.form.name
      localStorage.setItem('user', JSON.stringify(user))
    }

  }
}
</script>

<style scoped>
.forget {
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
.forget .van-nav-bar {
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
