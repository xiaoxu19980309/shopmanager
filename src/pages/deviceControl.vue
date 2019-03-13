<template>
  <div class="home-wrap">
    <loading :loading="gLoading" :text="loadingText" />
    
    <van-nav-bar
      title="设备信息"
      left-arrow  
      fixed
      right-text="增加设备"
      @click-left="back()"
      @click-right="addDevice()"
    >
    </van-nav-bar>

    <div class="list">
      <!-- 设备列表 -->
      <template v-if="list.length > 0">
          <van-cell-group 
            v-for="(item, i) in list"
            :key="item.id"
            class="devices"
          >
            <van-field 
              :label="`设备${i+1},ID：`"  
              v-model=item.pcbid
              disabled
            >
              <van-button size="small" slot="button" type="warning"
                @click.native="deleteDevice(i)"
              >解绑
              </van-button>
            </van-field>
          </van-cell-group>
      </template>
      <p class="nomore" v-else>你还没有设备，请点击右上角“增加设备”按钮进行设备添加</p>
    </div>

    <van-popup v-model="add_dev_first" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="新增设备"
          right-text="下一步"
          left-arrow
          @click-left="add_dev_first = false "
          @click-right="submit_first"
          fixed
        />
        <van-field
          v-model="pcbid"
          label="设备ID"
          placeholder="请输入设备ID"
          required
        />
        <van-field
          v-model="area"
          label="区域"
          placeholder="请选择区域"
          @click="showarea = true"
          required
        >
        </van-field>
        <van-field
          v-model="addressfix"
          label="详细地址"
          placeholder="请输入详细地址"
          required
        />
      </div>
    </van-popup>

    <van-popup v-model="showarea" position="bottom">
      <van-area 
      :area-list="areaList" 
      value="110101" 
      @cancel="showarea = false"
      @confirm="(value)=>getarea(value)"
      />
    </van-popup>

    <van-popup v-model="add_dev_second" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="为该设备绑定收款支付宝账号"
          right-text="增加"
          left-arrow
          @click-left="add_dev_second = false"
          @click-right="submit_second"
          fixed
        />
        <div class="list">
          <!-- 支付宝账号列表 -->
          <template v-if="alilist.length > 0">
            <van-radio-group v-model="radio">
              <van-cell-group
                v-for="(item,i) in alilist"
                :key="item.id">
                <van-cell 
                  :title="`收款人姓名：${item.real_name}`"
                  :label="`身份证号：${item.persol_id}\n支付宝PID：${item.ali_PID}`"
                  clickable
                  @click="bind_device(i)"
                >
                  <van-radio :name="i"></van-radio>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </template>
          <p class="nomore" v-else>你还没有收款账号，请点击右上角“增加”按钮进行账号添加</p>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="add_alipay" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="增加收款账号"
          right-text="提交"
          left-arrow
          @click-left="add_alipay = false"
          @click-right="submit_addalipay"
          fixed
        />
        <van-field
          v-model="form.name"
          label="真实姓名"
          placeholder="请输入姓名"
          required
        />
        <van-field
          v-model="form.id"
          label="身份证号"
          placeholder="请输入身份证号码"
          required
        />
        <van-field
          v-model="form.alipay_username"
          label="支付宝账号"
          placeholder="请输入支付宝账号"
          required
        />
        <van-field
          v-model="form.alipayid"
          label="支付宝PID"
          placeholder="请输入支付宝PID"
          required
        >
        </van-field>
      </div>
    </van-popup>

  </div>
</template>

<script>
import {
  Cell, CellGroup,Area,
   Dialog, NavBar,RadioGroup, Radio,
  Row, Col, Button, Icon, Field,
  Popup, List,PullRefresh,
} from 'vant'
import { areaList } from '@/utils/area'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'DeviceControl',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [NavBar.name]: NavBar,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Row.name]: Row,
    [Col.name]: Col,
    [Area.name]: Area,
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
      mobile: '',//本地手机号
      list: [],//设备列表
      alilist: [],//支付宝账号列表
      currentIdx: 0, // 当前编辑项
      isLoading: false,
      radio: '',//单选器
      add_dev_first: false,//第一步
      add_dev_second: false,//第二步
      add_alipay: false,//第三步
      pcbid: '',//设备pcbid
      area: '',//选择地址
      showarea: false,
      addressfix: '',//详细地址
      form: {
        id: '',//身份证号
        name: '',//真实姓名
        alipay_username: '',//支付宝账号
        alipayid: '',//支付宝id
      },
      areaList: '',
    }
  },
  mounted () {
    this.areaList = areaList
    try {
      let { mobile,name,shopinfo } = JSON.parse(localStorage.getItem('user'))
      this.mobile = mobile
    } catch (e) {
      this.$toast('您还未登录')
      this.$router.push({name: 'Login'})
    }
    let alipid = this.fetchPID()
    this.form.alipid = alipid
    const mobile = this.mobile
    this.axios.post(API.get_Devices, { mobile }).then(data => {
      this.list = data.data
      localStorage.setItem('list', JSON.stringify(this.list))
    }).catch(e => {
      this.loading = false
    })
  },
  methods: {

    back () {
      this.$router.go(-1)
    },
    validate_fir () {
      if (!this.pcbid) {
        this.$toast('请输入设备ID！')
        return false
      }
      if (!this.area) {
        this.$toast('请选择区域！')
        return false
      }
      if (!this.addressfix) {
        this.$toast('请输入详细地址')
        return false
      }
      return true
    },
    //检查表单内容
    validate () {
      if (!this.form.name) {
        this.$toast('请输入姓名！')
        return false
      }
      if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form.id))) {
        this.$toast('身份证号码不合法！')
        return false
      }
      if (this.form.alipayid.length!==16&&(substr(this.form.alipayid,4)!=='2088')) {
        this.$toast('支付宝PID不正确')
        return false
      }
      return true
    },
    //增加设备
    addDevice () {
      this.add_dev_first = true
    },
    getarea (value) {
      this.area = value[0].name+value[1].name+value[2].name
      this.showarea = false
    },
    submit_first () {
      //要通过接口确认ID有效，没有绑定，不能重复。
      if(!this.validate_fir()) return
      const pcbid = this.pcbid.toLowerCase()
      this.axios.post(API.checkDevice, {pcbid}).then(data => {
          this.gLoading = false
          this.add_dev_second = true
        }).catch(e=> {
          this.$toast('设备ID不正确')
          this.gLoading = false
      })
      setTimeout(() => {
        const mobile = this.mobile
        this.loading = true
        this.axios.post(API.getAlipay, {mobile}).then(data => {
          this.alilist = data
          this.loading = false
        }).catch(e => {
          this.loading = false
        })
      }, 1000);
    },
    //获取支付宝PID
    getCode () {
      //window.location.href='https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019030563436991&scope=auth_base&redirect_uri=http%3a%2f%2fzfbsmf.edianlai.com%2findex%2fSmzf%2fget_pid%3fpcbid%3d1234'
      // var ua = window.navigator.userAgent.toLowerCase()
      // if (ua.match(/AlipayClient/i) == 'alipayclient') {
      //   //window.open("https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019030763480371&scope=auth_base&redirect_uri=http%3a%2f%2fgtsh.edianlai.com%2findex%2fSmzf%2fget_pid%3fpcbid%3d1234")
      //   this.ali_PID = this.fetchPID()
      //   alert(this.ali_PID)
      // }else{
	    // 	this.$toast('请用支付宝扫码')
	    // }

    },
    //解绑设备
    deleteDevice (i) {
      const pcbid = this.list[i].pcbid
      this.axios.post(API.deleteDevice, { pcbid }).then(data => {
        let user = JSON.parse(localStorage.getItem('user'))
        this.list.splice(i, 1)
        user.shopinfo = JSON.parse(JSON.stringify(this.list))
        localStorage.setItem('user', JSON.stringify(user))
        this.$toast('设备解绑成功')
        this.back()
      }).catch(e => {

      })
    },
    //为该设备绑定已有的收款账户,i为收款账户列表的下标
    bind_device(i){
      const ali_PID = this.alilist[i].ali_PID
      const pcbid = this.pcbid//设备号
      const mobile = this.mobile//手机号
      const area = this.area//区域
      const address = this.addressfix//详细地址
      this.axios.post(API.addDevice, { ali_PID, pcbid, mobile, area, address }).then(data => {
        this.back()
      }).catch(e => {

      })
    },
    //显示增加收款账户页面
    submit_second () {
      this.add_alipay = true
    },
    submit_addalipay () {
      //增加收款账户
      if(this.validate()) return 
      const mobile = this.mobile
      const name = this.form.name
      const identity = this.form.id
      const ali_PID = this.form.alipayid
      const alipay_username = this.form.alipay_username
      this.axios.post(API.addAlipay, { name, mobile, identity, ali_PID, alipay_username }).then(data => {
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
      this.add_alipay = false
    },
    // 关闭店铺
    // closeShop (i) {
    //   this.loadingText = '正在删除中'
    //   Dialog.confirm({
    //     message: '确定关闭店铺？'
    //   }).then(()=>{
    //     this.gLoading = true
    //     let { shopid, shopname } = this.list[i]
    //     const mobile = this.mobile
    //     this.axios.post(API.closeShop, {mobile,shopid}).then(data => {
    //       this.gLoading = false
    //       this.$toast(`${shopname}已关闭`)
    //       this.list.splice(i, 1)
    //       this.update()
    //     }).catch(e=> {
    //       this.gLoading = false
    //     })
    //   }).catch(e => {

    //   })
      
    // },

    // 编辑店铺
    // editShop (i) {
    //   this.currentIdx = i
    //   const shopid = this.list[i].shopid
    //   const shopname = this.list[i].shopname
    //   this.$router.push({ name: 'ShopCard', query: { shopid, shopname }})
    // },

    // 进入店铺详情页
    // goDetail (shopid, shopname) {
    //   this.$router.push({ name: 'ShopCard', query: {shopid, shopname} })
    // },

    // 更新操作至localStorage
    // update () {
    //   let user = JSON.parse(localStorage.getItem('user'))
    //   user.shopinfo = JSON.parse(JSON.stringify(this.list))
    //   localStorage.setItem('user', JSON.stringify(user))
    // },

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
.devices {
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
