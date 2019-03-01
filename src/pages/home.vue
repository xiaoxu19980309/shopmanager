<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
  <div class="home-wrap" v-if="mobile">
    <loading :loading="gLoading" :text="loadingText" />
    
    <van-nav-bar
      title="开店"
      fixed
      right-text="退出"
      @click-right="logout"
    >
      <!-- <i class="iconfont icon-logout" slot="right"></i> -->
    </van-nav-bar>
    <div>

      <!-- 用户信息 -->
      <div class="user">
        <p class="nickname">
          昵称: {{nickname}}
        </p>
        <p class="mobile">手机号: {{mobile}}</p>
        <router-link :to="{name: 'UpdateCard', query: {mobile}}">
          <van-button class="change_card" size="small">修改个人信息</van-button>
        </router-link>
        <router-link :to="{name: 'OpenShop', query: {mobile}}">
          <van-button class="open-shop" size="small">开店</van-button>
        </router-link>
      </div>

      <!-- 店铺列表 -->
        <template v-if="list.length > 0">
          <van-swipe-cell :right-width="130"
            v-for="(item, i) in list"
            :key="item.shopid"
            @click.native="() => goDetail(item.shopid, item.shopname)"
          >
            <van-cell-group>
              <van-cell :value="item.notes" is-link :title="item.shopname" icon="shop">
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
  </van-pull-refresh>
</template>

<script>
import {
  SwipeCell, Cell, CellGroup,
  Tag, Dialog, Checkbox, NavBar,
  Row, Col, Button, Icon, Field,
  Popup, List, Swipe,PullRefresh,
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'Home',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [SwipeCell.name]: SwipeCell,
    [Tag.name]: Tag,
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
    Loading
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loadingText: '',
      mobile: '',
      nickname: '',
      list: [],
      name: '',
      pcbid: '',
      currentIdx: 0, // 当前编辑项
      isLoading: false,
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

    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
      }, 500);
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
.user {
  margin: 20px 0;
  width: 100%;
  padding: 15px;
  background-color: #fff;
  font-size: 14px;
  position: relative;
}
.nickname {
  margin-bottom: 10px;
}
.open-shop {
  background-color: #08979c;
  color: #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
}
.change_card{
  background-color: #f44;
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
.icon-edit {
  color: #555;
  margin-left: 8px;
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
  background-color: #08979c;
  color: #fff;
}
.home-wrap .van-cell__left-icon {
  margin-right: 10px;
}
.home-wrap .van-swipe-cell__right {
  width: 130Px;
  display: flex;
}
</style>
