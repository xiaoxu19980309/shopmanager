<template>
  <div class="home-wrap" v-if="shopid">
    <loading :loading="gLoading" :text="loadingText" />
    <!-- 编辑弹框 -->
      <div class="edit-box">
        <van-nav-bar
          title="店铺操作"
          left-arrow
          @click-left="back"
          fixed
        />

        <van-cell-group>
          <van-cell title="店铺资料修改" is-link @click.native="() => editShopname()">
          </van-cell>
          <van-cell title="销售统计管理" is-link @click.native="() => getshopsale()">
          </van-cell>
          <!-- <van-cell title="销售统计" is-link @click.native="() => getshopsale()">
          </van-cell> -->
          <van-cell title="PLU价格设定" is-link @click.native="() => bindplu()">
          </van-cell>
        </van-cell-group>

        <van-popup v-model="showEdit" position="right">
          <div class="edit-box2">
            <van-nav-bar
              title="编辑店铺信息"
              right-text="完成"
              left-arrow
              @click-left="showEdit = false"
              @click-right="submit"
              fixed
            />
            <van-cell-group>
              <van-field
                v-model="shopname"
                label="名称"
                placeholder="请输入店铺名称"
              >
              <van-button slot="button" size="small" type="danger" @click="closeShop()">关店</van-button>
              </van-field>
              <!-- <van-cell title="秤的绑定" is-link @click.native="() => deviceBind()">
              </van-cell>
              <van-cell title="秤的解绑" is-link @click.native="() => deviceDelete()">
              </van-cell> -->
            </van-cell-group>
          </div>
          
        </van-popup>

        <van-popup v-model="showBind" position="right">
          <div class="edit-box2">
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
          <div class="edit-box2">
            <van-nav-bar
              title="秤的解绑"
              left-arrow
              @click-left="showdevices = false"
              fixed
            />
            <!-- 设备列表 -->
            <template v-if="devlist.length > 0">
              <van-swipe-cell
                v-for="(item, i) in devlist"
                :key="item.id"
              >
                <van-cell-group>
                  <van-cell :title="item.pcbid" class="devclass">
                    <van-button class="operate-btn" type="danger" @click="deleteDevice(i)">解绑</van-button>
                  </van-cell>
                </van-cell-group>
              </van-swipe-cell>
            </template>
            <p class="nomore" v-else>这个店铺下目前没有绑定秤!</p>
          </div>
        </van-popup>

      </div>

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
  name: 'ShopCard',
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
      shopid: 0,
      shopname: '',
      name: '',
      pcbid: '',
      devlist: [],
      showEdit: false,
      showBind: false,
      showdevices: false,
    }
  },
  mounted () {
    this.mobile = this.hasLogin()
    if(this.mobile===''){
      this.$toast('您还未登录')
      this.$router.push({name: 'Login'})
    }
    let { shopid, shopname } =this.$route.query
    this.shopid = shopid
    this.shopname = shopname
    this.name = shopname
    localStorage.setItem('currentShop', JSON.stringify({shopid, shopname}))
    this.getDevices(shopid)
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    //修改店铺名
    editShopname () {
      this.showEdit = true
    },
    //秤的绑定
    // deviceBind() {
    //   this.showBind = true
    // },
    // deviceDelete() {
    //   this.showdevices = true
    // },
    // 提交修改
    submit () {
      if (!this.shopname) {
        this.$toast('店铺名称为必填项')
        return false
      }
      if(this.shopname===this.name){
        this.$toast('店铺名与修改前相同')
        return false
      }
      this.axios.post(API.editShop, {
          shopid: this.shopid, shopname: this.shopname
        }).then(data => {
          this.$toast('修改成功')
          this.showEdit = false
          this.update()
        }).catch(e => {
          
      })
    },
    //绑定秤
    submitbind() {
      if (!this.pcbid) {
        this.$toast('pcbid为必填项')
        return false
      }
      this.axios.post(API.bindShop, {
        shopid: this.shopid, pcbid: this.pcbid
      }).then(data => {
        this.$toast('绑定成功')
        this.showBind = false
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
      user.shopinfo.forEach(item => {
        if(item.shopid==this.shopid){
          item.shopname = this.shopname
        }
      });
      localStorage.setItem('user', JSON.stringify(user))
    },
    //获取店铺销售情况
    getshopsale(){
      const shopid = this.shopid
      const shopname = this.shopname
      this.$router.push( { name:'ShopSale',query:{ shopid,shopname } } )
    },
    //获取店铺销售图表
    getshopsaletable(){
      const shopid = this.shopid
      const shopname = this.shopname
      this.$router.push( { name:'ShopSaleTable',query:{ shopid,shopname } } )
    },
    //绑定plu
    bindplu(){
      const shopid = this.shopid
      const shopname = this.shopname
      this.$router.push( { name:'Shop',query:{ shopid,shopname } })
    },
    closeShop () {
      let user = JSON.parse(localStorage.getItem('user'))
      const mobile = user.mobile
      Dialog.confirm({
        message: "确定关闭当前店铺？"
      }).then(()=>{
        this.axios.post(API.closeShop, {
        'shopid': this.shopid,
        'mobile': mobile
        }).then(data => {
          this.$toast(`${this.shopname}已关闭`)
          let user = JSON.parse(localStorage.getItem('user'))
          let num
          user.shopinfo.forEach((item,i) => {
            if(item.shopid==this.shopid){
              num = i
            }
          });
          user.splice(i,1)
          localStorage.setItem('user', JSON.stringify(user))
          this.$router.push({ name: 'Home' })
        })
      }).catch(e=>{

      })
    },
    // 获取设备列表
    getDevices(shopid){
      this.loading = true
      this.axios.post(API.getDevicesByShopid, { 'shop_id': shopid }).then(data => {
        this.loading = false
        if(data.length===0){
          this.$toast('该店铺下没有秤')
        }
        data.map(function (item) {
          return {...item, checked: false}
        })
        this.devlist = this.devlist.concat(data)
        localStorage.setItem('devices', JSON.stringify(this.devlist))
      }).catch(e => {
        this.loading = false
      })
      setTimeout(1000)
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
.devclass {
  height: 1.2rem;
}
.edit-box {
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  padding-top: 20px;
}
.edit-box2 {
  width: 100vw;
  height: 100vh;
  background: #f2f2f2;
  padding-top: 66px;
}
.operate-btn {
  height: 100%;
  line-height: normal;
}
.van-nav-bar {
  background-color: #08979c;
  color: #fff;
}
</style>

