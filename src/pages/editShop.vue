<template>
  <div class="home-wrap" v-if="shopid">
    <loading :loading="gLoading" :text="loadingText" />
    <!-- 编辑弹框 -->
    <van-popup v-model="showCard" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="编辑"
          left-arrow
          @click-left="back"
          fixed
        />
        <van-cell-group>
          <van-cell title="编辑店铺资料" is-link @click.native="() => editShopname()">
          </van-cell>
          <van-cell title="秤的操作" is-link @click.native="() => goDevices()">
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>

    <van-popup v-model="showEdit" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="编辑店铺信息"
          right-text="完成"
          left-arrow
          @click-left="showEdit = false"
          @click-right="submit"
          fixed
        />
        <van-field
          v-model="shopname"
          label="名称"
          placeholder="请输入店铺名称"
        />
      </div>
    </van-popup>

    <van-popup v-model="showDeviceOp" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="秤的操作"
          left-arrow
          @click-left="showDeviceOp = false"
          fixed
        />
        <van-cell-group>
          <van-cell title="秤的绑定" is-link @click.native="() => deviceBind()">
          </van-cell>
          <van-cell title="秤的删除" is-link @click.native="() => deviceDelete()">
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>

    <van-popup v-model="showBind" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="绑定秤"
          right-text="完成"
          left-arrow
          @click-left="showBind = false"
          @click-right="submitbind"
          fixed
        />
        <van-field
          v-model="pcbid"
          label="pcbid"
          placeholder="请输入pcbid"
        />
      </div>
    </van-popup>

    <van-popup v-model="showdevices" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="秤的删除"
          left-arrow
          @click-left="showdevices = false"
          fixed
        />
        <!-- 设备列表 -->
        <template v-if="devlist.length > 0">
          <van-swipe-cell :right-width="130"
            v-for="(item, i) in devlist"
            :key="item.id"
          >
            <van-cell-group>
              <van-cell value="左滑删除" is-link :title="item.pcbid" icon="iconfont icon-phone">
              </van-cell>
            </van-cell-group>
            <template slot="right">
              <span class="operate-btn" @click.stop="() => deleteDevice(i)">删除</span>
            </template>
          </van-swipe-cell>
        </template>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  SwipeCell, Cell, CellGroup,
  Tag, Dialog, Checkbox, NavBar,
  Row, Col, Button, Icon, Field,
  Popup, List, Swipe
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'EditShop',
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
    Loading
  },
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false,
      loadingText: '',
      loading: false, // 加载列表
      shopid: '',
      shopname: '',
      pcbid: '',
      currentIdx: 0, // 当前编辑项
      list: [],
      devlist: [],
      showCard: true,
      showEdit: false,
      showBind: false,
      showDeviceOp: false,
      showdevices: false,
    }
  },
  mounted () {
    try {
      let { mobile } = JSON.parse(localStorage.getItem('user'))
      this.mobile = mobile
    } catch (e) {
      this.$toast('您还未登录')
      this.$router.push({name: 'Login'})
    }
    let shop = JSON.parse(localStorage.getItem('currentShop'))
    if(shop){
      this.shopid = shop.shopid
      this.shopname = shop.shopname
      this.getDevices(this.shopid)
    }else{
      const { shopid, shopname } = this.$route.query
      this.shopid = shopid
      this.shopname = shopname
      localStorage.setItem('currentShop', JSON.stringify({shopid, shopname}))
      this.getDevices(shopid)
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    //修改店铺名
    editShopname () {
      this.showEdit = true
    },
    //进入秤的操作
    goDevices() {
      this.showDeviceOp = true
    },
    //秤的绑定
    deviceBind() {
      this.showBind = true
    },
    deviceDelete() {
      this.showdevices = true
    },
    // 提交修改
    submit () {
      if (!this.name) {
        this.$toast('店铺名称为必填项')
        return false
      }
      let shop = this.list[this.currentIdx]
      this.axios.post(API.editShop, {
        shopid: shop.shopid, shopname: this.shopname
      }).then(data => {
        this.$toast('修改成功')
        this.list[this.currentIdx].shopname = this.shopname
        this.showEdit = false
        this.update()
      })
    },
    //绑定秤
    submitbind() {
      if (!this.pcbid) {
        this.$toast('pcbid为必填项')
        return false
      }
      let shop = this.list[this.currentIdx]
      this.axios.post(API.bindShop, {
        shopid: shop.shopid, pcbid: this.pcbid
      }).then(data => {
        this.$toast('绑定成功')
        this.showBind = false
      })
    },
    // 获取分类列表
    getDevices (shopid) {
      this.loading = true
      this.axios.post(API.get_Devices, { shopid: shopid }).then(data => {
        this.loading = false
        localStorage.setItem('devices', JSON.stringify(data))
        data.map(function (item) {
          return {...item, checked: false}
        })
        this.devlist = this.devlist.concat(data)
      }).catch(e => {
        this.loading = false
      })
    },
    //删除秤
    deleteDevice(i) {
      const deviceid = this.devlist[i].id
      this.axios.post(API.deleteDevice, { deviceid:deviceid }).then(data => {
        this.$toast('解除绑定成功')
        this.showdevices = false
        this.devlist.splice(i)
        localStorage.setItem('devices', JSON.stringify(this.devlist))
      }).catch(e => {

      })
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
.edit-box {
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  padding-top: 66px;
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
