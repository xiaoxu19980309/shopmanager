<template>
  <div class="home-wrap" v-if="mobile">
    <loading :loading="gLoading" :text="loadingText" />
    
    <van-nav-bar
      title="我的店铺"
      left-arrow  
      fixed
      right-text="开店"
      @click-left="back()"
      
    >
    <!-- @click-right="openshop()" -->
    </van-nav-bar>

    <div class="list">
      <!-- 店铺列表 -->
      <template v-if="list.length > 0">
        <van-swipe-cell :right-width="130"
          v-for="(item, i) in list"
          :key="item.shopid"
          @click.native="() => goDetail(item.shopid, item.shopname)"
        >
          <van-cell-group>
            <van-cell  is-link :title="!item.shopname?'未命名':item.shopname" icon="shop">
            </van-cell>
          </van-cell-group>
          <template slot="right">
            <span class="operate-btn edit-btn" @click.stop="() => editShop(i)">编辑</span>
            <span class="operate-btn" @click.stop="() => closeShop(i)">关店</span>
          </template>
        </van-swipe-cell>
      </template>
      <p class="nomore" v-else>你还没有开店，请点击右上角“开店”按钮进行开店</p>
    </div>


  </div>
</template>

<script>
import {
  Cell, CellGroup,SwipeCell,
   Dialog, Checkbox, NavBar,
  Row, Col, Button, Icon, Field,
  Popup, List, Swipe,PullRefresh,
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
export default {
  name: 'ShopList',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
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
    [PullRefresh.name]: PullRefresh,
    [SwipeCell.name]: SwipeCell,
    Loading
  },
  data () {
    return {
      gLoading: false,
      loadingText: '',
      mobile: '',
      nickname: '',
      list: [],
      name: '',
      shopid: '',
      pcbid: '',
      currentIdx: 0, // 当前编辑项
      isLoading: false,
      active: 0,
    }
  },
  mounted () {
    try {
      let { mobile,name,shopinfo } = JSON.parse(localStorage.getItem('user'))
      this.mobile = mobile
      this.nickname = name
      this.list = shopinfo || []
    } catch (e) {
      this.$toast('您还未登录')
      this.$router.push({name: 'Login'})
    }
  },
  methods: {

    back () {
      this.$router.go(-1)
    },
    // 关闭店铺
    closeShop (i) {
      this.loadingText = '正在删除中'
      Dialog.confirm({
        message: '确定关闭店铺？'
      }).then(()=>{
        this.gLoading = true
        let { shopid, shopname } = this.list[i]
        const mobile = this.mobile
        this.axios.post(API.closeShop, {mobile,shopid}).then(data => {
          this.gLoading = false
          this.$toast(`${shopname}已关闭`)
          this.list.splice(i, 1)
          this.update()
        }).catch(e=> {
          this.gLoading = false
        })
      }).catch(e => {

      })
      
    },

    // 编辑店铺
    editShop (i) {
      this.currentIdx = i
      const shopid = this.list[i].shopid
      const shopname = this.list[i].shopname
      this.$router.push({ name: 'ShopCard', query: { shopid, shopname }})
    },

    // 进入店铺详情页
    goDetail (shopid, shopname) {
      this.$router.push({ name: 'ShopCard', query: {shopid, shopname} })
    },

    // 更新操作至localStorage
    update () {
      let user = JSON.parse(localStorage.getItem('user'))
      user.shopinfo = JSON.parse(JSON.stringify(this.list))
      localStorage.setItem('user', JSON.stringify(user))
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

.open-shop {
  background-color: #08979c;
  color: #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
}
.list {
  margin-top: 10px;
}
.operate-btn {
  width: 65Px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-color: #f44;
  color: #fff;
  flex: 1;
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

</style>

<style>
.home-wrap .van-swipe-cell__right {
  width: 65Px;
}
.home-wrap .van-nav-bar {
  background-image:-webkit-linear-gradient( 180deg, rgb(32,178,170) 0%, rgb(72,209,204) 100%);
  color: #fff;
  overflow: hidden;
  box-shadow: 0 1px 6px #ccc;
}
.home-wrap .van-cell__left-icon {
  margin-right: 10px;
}
.home-wrap .van-swipe-cell__right {
  width: 130Px;
  display: flex;
}
</style>
