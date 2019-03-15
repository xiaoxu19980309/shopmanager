<template>
  <div class="shop-wrap" v-if="shopid">
    <loading :loading="gLoading" :text="loadingText" />
    <van-nav-bar
      :title="shopname"
      fixed
      left-arrow
      @click-right="logout"
      @click-left="back"
      right-text="退出"
    >
    </van-nav-bar>
    <!-- 排序框 -->
    <div class="sort-box line-bottom">
      <span class="sort-title">PLU</span>
      <span class="sort-arrow" @click="changeSort">
        <i :class="['iconfont','icon-up',{ 'arrow-active': sort === 1}]"></i>
        <i :class="['iconfont','icon-down',{ 'arrow-active': sort === -1}]"></i>
      </span>
      <span class="sort-title" @click="changeallplu">重置plu码</span>
      <span class="sort-title" @click="orderplu">自动排序plu</span>
    </div>

    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      
      <p class="nomore" v-if="!loading && numlist.length === 0">暂无数据</p>
      <template>
      <div style="margin-bottom:1.75rem;">
        <table id="table" rules="all" class="table table-bordered" width="100%">
          <thead>
          <tr class="headline">
            <th></th>
            <th>PLU</th>
            <th>货名
              <i class="iconfont icon-dianping"></i>
            </th>
            <th>价格
              <!-- <i class="iconfont icon-dianping"></i> -->
            </th>
            <th>绑定</th>
            <th>解绑</th>
          </tr>
          </thead>
          <tbody id="tbody" v-for="(item,i) in numlist" :key="item.num">
            <tr>
              <td><input type="checkbox" style="margin-left:6px;" v-model="item.checked" @change="changeCheck"></td>
              <td>{{item.num}}</td>
              <td @click="edit(i,item,1)">{{item.stdname}}</td>
              <td>{{item.price}}</td> 
              <!-- @click="edit(i,item,2)" -->
              <td v-if="item.stdname==''">
                  <select  v-model="item.noplugoods" @change="submitplu(i)" style="font-size: 16px;">
                    <option value="-1" >绑定</option>
                    <option v-for="(item3,i3) in types" :key="i3" :value="i3">{{item3.stdname}}</option>
                  </select>
              </td>
              <td v-else>
                已绑定
              </td>
              <td><button  @click="delplu(i)" class="btndel">解绑</button></td>
            </tr>
          </tbody>

        </table>
      </div>
    </template>
    </van-pull-refresh>

    <div v-if="showedit" class="modal">
      <div v-if="showedit" class="dialog">
        <div>
          <van-field
            v-model="form.name"
            label="菜名"
            placeholder="请输入菜名"
          />
          <!-- <van-field
            v-model="form.price"
            label="菜价"
            placeholder="请输入菜价"
          /> -->
        </div>
        <van-button class="ccbtn" @click.stop="showedit=false" size="large">取消</van-button>
        <van-button class="sbbtn" @click.stop="submit()" size="large">确定</van-button>
      </div>
    </div>

    <!-- 返回顶部 -->
    <vm-back-top :bottom="70" :height="100" />

    <!-- 底部操作 -->
    <van-row class="bottom-box line-top">
      <van-col span="5">
        <van-button bottom-action @click.native="closeShop">关店</van-button>
      </van-col>
      <van-col span="7">
        <van-button class="add-btn" bottom-action>
          <van-checkbox v-model="checkAll" @click.native="changeAll">全选</van-checkbox>
        </van-button>
      </van-col>
      <van-col span="5" class="line-left">
        <van-button bottom-action class="add-btn" @click.native="delAll">删除</van-button>
      </van-col>
      <van-col span="7" class="line-left">
        <van-button class="add-btn" bottom-action @click.native="openAdd">新增货物</van-button>
      </van-col>
    </van-row>

  </div>
</template>

<script>
import {
  SwipeCell, Cell, CellGroup,
  Tag, Dialog, Checkbox, NavBar,
  Row, Col, Button, Icon, Field,
  Popup, List, Toast,Picker,PullRefresh
} from 'vant'
import Loading from '@/components/Loading'
import { API } from '@/utils/api'
import commonMixin from '@/utils/mixin'
export default {
  name: 'Shop',
  mixins: [commonMixin],
  data () {
    return {
      gLoading: false, // 操作加载
      loadingText: '',
      loading: false, // 加载列表
      shopid: 0,
      shopname: '',
      name: '',
      checkAll: false,
      count: 0, // checked计数
      numlist: [],//plu的列表
      form: {
        name: '',
        price: 0,
      },
      showplu: false, //显示plu弹窗
      currentnum: 0,//显示plu弹窗的位置
      name: '',     //当前plu的货物
      index: 0,     //当前plu对应noplugood中的位置
      showedit: false, // 是否显示编辑弹框
      type: '', // '编辑分类'or '新增分类'
      currentIdx: 0, // 编辑时的标记
      sort: 0,// 0-初始 1-正序 -1-逆序
      types: [],//未绑定plu的菜
      popup:{
        type: false
      },
    }
  },
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
    [Picker.name]: Picker,
    [Toast.name]: Toast,
    [PullRefresh.name]:PullRefresh,
    Loading,
  },
  watch: {
    // 勾选每一项时，检查是否checkAll
    'count' (newVal, oldVal) {
      if (newVal === this.numlist.length) {
        this.$set(this, 'checkAll', true)
      } else {
        this.$set(this, 'checkAll', false)
      }
    },

    'option' (newVal,oldVal) {

    },

    // 如果没有数据，重置checkAll和sort
    'numlist.length' (newVal, oldVal) {
      if (!newVal) {
        this.$set(this, 'checkAll', false)
        this.sort = 0
      }
    }
  },
  mounted () {
    this.mobile = this.hasLogin()
    if(this.mobile===''){
      this.$toast('您还未登录')
      this.$router.push({name: 'Login'})
    }
    let shop = JSON.parse(localStorage.getItem('currentShop'))
    if (shop) {
      this.shopid = shop.shopid
      this.shopname = shop.shopname
      this.getData(shop.shopid)
    } else {
      const { shopid, shopname } = this.$route.query
      this.shopid = shopid
      this.shopname = shopname
      localStorage.setItem('currentShop', JSON.stringify({shopid, shopname}))
      this.getData(shopid)
    }
    // this.getNopluGoods()
  },
  methods: {
    back () {
      this.$router.go(-1)
      localStorage.removeItem('goods')
      localStorage.removeItem('noplugoods')
    },
    // 每项checked变化
    changeCheck (key) {
      let count = this.count
      this.count = key ? count + 1 : count - 1
    },
    // 点击全选按钮
    changeAll () {
      const val = this.checkAll
      for (let i = 0; i < this.numlist.length; i++) {
        this.$set(this.numlist[i], 'checked', val)
      }
    },
    openAdd () {
      this.showedit = true
      this.type = '新增货物'
      this.form.name = ''
      this.form.price = 1
    },
    edit(i,item,index){
      this.showedit = true
      this.currentIdx = i
      this.form.name = this.numlist[i].stdname
      this.form.price = this.numlist[i].price
      this.name=this.form.name
    },
    beforeClose(action,done){
      if(action==='confirm'){
        this.submit()
      }else{
        done()
      }
    },
    submit () {
      this.loadingText = '正在提交中'
      let name = this.form.name
      let price = this.form.price
      if (!name) {
        this.$toast('货物名称为必填项')
        return false
      }
      // if(price===''){
      //   this.$toast('货物价格不能为空')
      //   return false
      // }
      this.gLoading = true
      if (this.type === '新增货物') { //新增货物
        this.axios.post(API.addGood, {
          shopid: this.shopid, name:name,price:price
        }).then(data => {
          this.gLoading = false
          let maxnum=0
          this.numlist.map((item)=>{
            if(item.num>maxnum){
              maxnum=item.num
            }
          })
          this.numlist.push({...data, checked: false,num:maxnum+1,noplugoods: -1})
          this.form = { name: '', price: '' }
          this.showedit = false
          this.updateTypes()
        }).catch(e => {
          this.gLoading = false
        })
      } else {  //编辑货物名或价格
        if(this.name==''){  //未绑定菜的plu
          this.$toast('该PLU还未绑定菜,无法修改')
          this.gLoading = false
          this.showedit = false
          return false
        }
        // if(this.form.name==this.name){//货物名未变
        //   if(this.form.price==this.numlist[this.currentIdx].price){//价格未变
        //       this.$toast('请修改货物名或价格')
        //       this.gLoading=false
        //       return false
        //   }
        //     this.axios.post(API.updateGood, {
        //     'shopid': this.shopid,  'id': this.numlist[this.currentIdx].id, 'price':price, 'name':name
        //   }).then(data => {
        //     this.gLoading = false
        //     this.numlist[this.currentIdx].stdname = data.stdname
        //     this.numlist[this.currentIdx].price = data.price
        //     this.form = { name: '', price: '' }
        //     this.showedit = false
        //     this.$toast('修改成功')
        //     this.updateTypes()
        //   }).catch(e => {
        //     this.gLoading = false
        //   })
        // }else
        if(this.form.name!=this.name){
            this.axios.post(API.updateGood, {
              'shopid': this.shopid,  'id': this.numlist[this.currentIdx].id, 'name':name, 'price': price, 'type':2
            }).then(data => {
              this.gLoading = false
              this.numlist[this.currentIdx].stdname = data.stdname
              this.numlist[this.currentIdx].price = data.price
              this.form = { name: '', price: '' }
              this.showedit = false
              this.$toast('修改成功')
              this.updateTypes()
            }).catch(e => {
              this.gLoading = false
            })
        }

      }
    },

    // // 删除单项
    // del (i) {
    //   this.loadingText = '正在删除中'
    //   let name = this.numlist[i].stdname
    //   let data = []
    //   data=data.concat({'name':name})
    //   console.log(name)
    //   Dialog.confirm({
    //     message: '确定删除此货物吗？'
    //   }).then(() => {
    //     this.gLoading = true
    //     this.axios.post(API.delGood, {
    //       'shopid': this.shopid, 'data': [{'name':name}]
    //     }).then(data => {
    //       this.gLoading = false
    //       if (this.numlist[i].checked) {
    //         this.count -= 1
    //       }
    //       this.numlist.splice(i, 1)
    //       this.updateTypes()
    //     }).catch(e => {
    //       this.gLoading = false
    //     })
    //   })
    // },

    // 删除所选的
    delAll () {
      this.loadingText = '正在删除中'
      const names = []
      const oldlist = this.numlist
      this.numlist.forEach(item => {
        if(item.checked==true){
          names.push(item.stdname)
        }
      })
      Dialog.confirm({
        message: '确定删除所选货物吗？(只能删除绑定了货物的PLU)'
      }).then(() => {
        this.gLoading = true
        this.axios.post(API.delGood, {
            'shopid': this.shopid, 'data': names.toString()
          }).then(data => {
            this.gLoading = false
            for(let i=this.numlist.length-1;i>=0;i--){
              if(this.numlist[i].checked==true){
                this.count -= 1
                oldlist.splice(i,1)
              }
            }
            this.$set(this,'numlist',oldlist)
            this.updateTypes()
          }).catch(e => {
            this.gLoading = false
          })
    }).catch(e => {

    })

  },

    goDetail (e, i) {
      // 如果是点击checkbox，则返回
      if (e.target.className.indexOf('van-icon van-icon-success') > -1) return false
      this.showplu = true
      this.name = this.numlist[i].stdname
      this.currentnum = i
    },

    // 排序
    changeSort () {
      let sort = this.sort
      let list
      if (sort === -1) {
        list = this.numlist.sort((a, b) => {
          return a.num - b.num
        })
        this.sort = 1
      } else {
        list = this.numlist.sort((a, b) => {
          return b.num - a.num
        })
        this.sort = -1
      }
      this.$set(this, 'numlist', list)
    },

    changeallplu(){
      const shopid = this.shopid
      this.axios.post(API.resetPlu,{ 'shopid':shopid }).then(data => {
        this.$toast('重置成功!')
        this.getData(shopid)
      }).catch(e=>{

      })
    },
    orderplu(){
      const shopid = this.shopid
      this.axios.post(API.sortPlu,{ 'shopid':shopid }).then(data=>{
        this.$toast('自动排序成功')
        this.getData(shopid)
        let noplugoods = []
        localStorage.setItem('noplugoods',JSON.stringify(noplugoods))
      }).catch(e=>{
        this.$toast('自动排序失败!')
      })
    },

    // 获取分类列表
    getData (shopid) {
      this.loading = true
      let locdata
      let num = 0
      let newlist=[]
      let noplugoods = []
      this.axios.post(API.getGoods, { 'shopid':shopid }).then(data => {
        this.loading = false
        data.map(function(item){
          if(item.plu!=-1){
            newlist = newlist.concat({'num':item.plu,'plu':item.plu,'price':item.price,'stdname':item.stdname,'id':item.id,'check':false})
            if(item.plu>num)
              num = item.plu
          }
        })
        num+=1
        data.map(function(item){
          if(item.plu==-1){
            newlist = newlist.concat({'num':num,'plu':'','price':'','stdname':'','id':'','check':false})
            num=num+1
            noplugoods = noplugoods.concat({'plu':item.plu,'price':item.price,'stdname':item.stdname,'id':item.id})
          }
        })
        let list = newlist.sort((a,b)=>{
          return a.num-b.num
        })
        let listn = []
        list.map(function(item){
          listn = listn.concat({ ...item,'noplugoods':-1 })
        })
        this.$set(this,'numlist',listn)
        this.types = noplugoods
        localStorage.setItem('goods', JSON.stringify(this.numlist))
        localStorage.setItem('noplugoods', JSON.stringify(this.types))
      }).catch(e => {
        this.loading = false
      })
    },

    //点击分类
    focus (e, key) {
      document.activeElement.blur()
      this.popup[key] = true
    },
    //解除plu的绑定
    delplu(num){
      this.loading = true
      let shopid = this.shopid
      let plu = this.numlist[num].plu
      let name = this.numlist[num].stdname
      if(plu=='')
        return false
      this.axios.post(API.delPlu,{ 'shopid':shopid,'plu':plu,'name':name }).then(data=>{
        this.$toast('解绑成功')
        this.loading = false
        let noplugoods = this.types
        noplugoods = noplugoods.concat({'plu':-1,'price':this.numlist[num].price,'stdname':name,'id':this.numlist[num].id})
        this.types = noplugoods
        this.numlist[num].plu=''
        this.numlist[num].price=''
        this.numlist[num].stdname=''
        this.numlist[num].id=''
        localStorage.setItem('noplugoods', JSON.stringify(this.types))
        this.updateTypes()
      }).catch( e=> {

      })
    },
    //取消弹窗
    onCancel (key) {
      this.popup[key] = false
    },
    onConfirm (value, index) {
      this.name = value.stdname
      this.index = index
      this.popup['type'] = false
    },
    // 关闭店铺
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
          this.update()
          this.$router.push({ name: 'Home' })
        })
      }).catch(e=>{

      })
    },

    submitplu(num){
      const shopid = this.shopid
      const i = this.numlist[num].noplugoods
      if(i==-1)
      return false
      const plu = this.numlist[num].num
      const stdname = this.types[i].stdname
      Dialog.confirm({
        message: '是否确定修改'
      }).then(()=>{
          this.axios.post(API.setPlu,{ 'shopid': shopid, 'plu': plu, 'name': stdname}).then(data => {
          this.$toast('修改成功')
          this.numlist[num].stdname = stdname
          this.numlist[num].plu = plu
          this.numlist[num].id = this.types[i].id
          this.numlist[num].price = this.types[i].price
          this.showplu = false
          this.updateTypes()
          let noplugoods = this.types
          if(this.numlist[num].plu!=null){
            noplugoods.concat({'id':this.types[i].id,'stdname':this.types[i].stdname,'price':this.types[i].price,'plu':-1})
          }
          noplugoods.splice(i,1)
          this.types = noplugoods
          localStorage.setItem('noplugoods', JSON.stringify(noplugoods))
        }).catch(e =>{
          
        })
      }).catch(e => {
        this.numlist[num].noplugoods=-1
      })
      this.numlist[num].noplugoods=-1
    },

    // 更新店铺关闭信息
    update () {
      let user = JSON.parse(localStorage.getItem('user'))
      const idx = user.shopinfo.findIndex(shop => shop.shopid === this.shopid)
      user.shopinfo.splice(idx, 1)
      localStorage.setItem('user', JSON.stringify(user))
    },
    // 更新类别信息
    updateTypes () {
      localStorage.setItem('goods', JSON.stringify(this.numlist))
    },

    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.loading = false;
      }, 500);
      this.getData(this.shopid)
    }
  }
}
</script>

<style scoped>
.shop-wrap {
  padding: 46px 0;
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
.bottom-box {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.back-top {
  background: #13c2c2;
  color: #fff;
}
.add-btn {
  color: #222;
  background: #fff;
}
/* 编辑弹框 */
.edit-box {
  width: 100vw;
  height: 100vh;
  padding-top: 66px;
  background: #f2f2f2;
}
/* 筛选框 */
.sort-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  font-size: 14px;
}
.sort-arrow {
  width: 10px;
  height: 40px;
  position: relative;
  display: inline-block;
}
.arrow-active {
  color: #08979c;
}
span.sort-title {
    margin-left: 1rem;
}
.icon-up {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  margin-top: -4Px;
}
.icon-down {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  margin-top: 3Px;
}
.delplubutton {
    position: absolute;
    right: 10px;
    margin-top: 10px;
}
table tr td{
            text-align: center;
            font-size: 16px;
         }
.headline {
  font-size: 15px;
}
.noplu{
  background-color: #f2f2f2;
}
.btndel {
  background-color: #f44;
  color: #222;
  border: 0;
  width: 80%;
}
.btnsubmit {
  background-color: #08979c;
  color: #222;
  border: 0;
  width: 35%;
}
.btnedit {
  background-color:#ffd700;
  color: #222;
  border: 0;
  width: 80%;
}
.dialog{
    position: relative;
    top: 50%;
    left: 50%;
    width: 85%;
    font-size: 16px;
    overflow: hidden;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    border-radius: 4px;
    background-color: #fff;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
}
.modal{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
}
.ccbtn{
  width: 50%;
  float: left;
}
.sbbtn{
  color: #08979c;
  width: 50%;
  float: right;
}
</style>

<style>
.shop-wrap .van-cell__value {
  color: #888;
}
.shop-wrap .van-swipe-cell__right {
  width: 130Px;
  display: flex;
}
.shop-wrap .van-checkbox--checked {
  background-color: #08979c;
  border-color: #08979c;
}
.shop-wrap .van-nav-bar {
  background-color: #08979c;
  color: #fff;
}
.shop-wrap .van-button--bottom-action {
  font-size: 14px;
}
</style>
