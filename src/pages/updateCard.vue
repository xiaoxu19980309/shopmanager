<template>
  <div class="home-wrap">
    <van-nav-bar title="会员中心" 
    fixed
    left-arrow
    @click-left="back"
    />

    <div>
      <div class="totalnum">
          <div class="td-33">
              <i class="iconfont icon-geren"></i><br>
              <span>姓名：{{name}} / {{mobile}}</span>
          </div>
      </div>

      <div>
        <van-cell-group class="cellgroup">
            <van-cell title="商家资料"  is-link to=""></van-cell>
            <van-cell title="修改密码"  is-link @click="to_changepsd()" />
        </van-cell-group>
        <van-cell-group class="cellgroup">
          <van-cell title="常见问题"  is-link to=""/>
          <van-cell title="关于我们"  is-link to=""/>
        </van-cell-group>
      </div>

      <div class="bottom">
        <van-button class="logout" type="danger" @click="logout()">退出</van-button>
      </div>
    </div>

  </div>
</template>

<script>
import { API } from '@/utils/api'
import { 
  NavBar, Button,Row,Col,Cell, CellGroup,
  Tabbar,TabbarItem,
} from 'vant'
import md5 from 'md5'
import commonMixin from '@/utils/mixin'
export default {
  name: 'UpdateCard',
  data () {
    return {
      name: '',
      mobile: '',
      loading: false,
      active: 2,
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Row.name]: Row,
    [Col.name]: Col,
    [Cell.name]: Cell,
    [CellGroup.name]:CellGroup,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  mixins: [commonMixin],
  mounted () {
    try {
      let { mobile,name } = JSON.parse(localStorage.getItem('user'))
      this.mobile = mobile
      this.name = name
    } catch (e) {
      this.$toast('您还未登录')
      this.$router.push({name: 'Login'})
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    to_changepsd () {
      const mobile = this.mobile
      this.$router.push( {name: 'ChangePsd', query: { mobile,name }} )
    },
    // submit () {
    //   if (!this.validate()) return
    //   this.loading = true
    //   const { name, password } = this.form
    //   const mobile = this.mobile
    //   let params = { mobile,name, password }
    //   this.axios.post(API.editCard, params).then(data => {
    //     this.loading = false
    //     this.$toast('修改成功')
    //     this.update()
    //     this.$router.push({name: 'Home'})
    //   }).catch(e => {
    //     this.loading = false
    //   })
    // },
    update() {
      // let user = JSON.parse(localStorage.getItem('user'))
      // user.name = this.form.name
      // localStorage.setItem('user', JSON.stringify(user))
    }

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
  height: 4.6rem;
  background-image:-webkit-linear-gradient( 180deg, rgb(32,178,170) 0%, rgb(72,209,204) 90%);
  color: #fff;
  text-align: center;
  box-shadow: 0 1px 6px #fff;
  padding: 10px 0px;
  overflow: hidden;
  margin-bottom: 10px;
}
.td-33 {
  padding: 10px;
  margin: 0 auto;
}
.td-33 i {
  font-size: 77px;
}
.cellgroup {
  margin-bottom: 15px;
}
.forget .van-nav-bar {
  color: #fff;
}
.bottom {
  text-align: center;
}
span {
  font-size: 16px;
}
.logout {
  width:90%;
}
</style>
