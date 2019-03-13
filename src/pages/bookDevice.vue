<template>
    <!-- 编辑弹框 -->
    <div class="home-wrap">
      <van-nav-bar title="产品预订"
      fixed
      left-arrow
      right-text="提交"
      @click-left="back()"
      @click-right="submit()"
      />
      <van-cell-group class="form">
        <van-field
          v-model="form.name"
          label="姓名"
          placeholder="请输入姓名"
          required
        />
        <van-field
          v-model="form.mobile"
          label="手机号"
          placeholder="请输入手机号码"
          required
        />
        <van-field
          v-model="form.model"
          label="产品型号"
          placeholder="请输入产品型号"
          required
        />
        <van-field
          v-model="form.number"
          label="预订数量"
          placeholder="请输入预订数量"
          required
        />
        <!-- <van-field
          v-model="form.number"
          label="产品类型"
          placeholder="请输入预订数量"
          required
        /> -->
        <van-field
          v-model="form.address"
          label="地址"
          placeholder="请输入邮寄地址"
          required
        >
        </van-field>
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
  name: 'BookDevice',
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
      mobile: '',//手机号
      form: {
        name: '',//真实姓名
        mobile: '',//联系电话
        number: '',//预订数量
        address: '',//地址
        model: '',//产品型号
      }
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
    //提交表单
    submit () {
      if (!this.validate()) return
      this.loading = true
      // const name = this.form.name//真实姓名
      // const mobile = this.form.mobile//手机号
      // const number = this.form.number//数量
      // const address = this.address//地址
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
.form {
  margin-top: 15px;
}
</style>