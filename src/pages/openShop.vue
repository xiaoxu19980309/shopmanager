<template>
  <div class="good-wrap" fixed>
    <loading :loading="gLoading" text="正在提交" />
    <van-nav-bar
      left-arrow
      title="开店"
      right-text="提交"
      @click-left="back"
      @click-right="submit"
    />
    <van-cell-group>
      <!-- 店铺分类 -->
      <van-field
        v-model="type"
        label="分类"
        @focus="(e) => focus(e, 'type')"
        placeholder="请选择店铺分类"
      />

      <van-popup v-model="popup.type" position="bottom">
        <van-picker
          show-toolbar
          title="店铺分类"
          :columns="types"
          value-key="name"
          @cancel="() => onCancel('type')"
          @confirm="(value, index) => onConfirm('type',value, index)"
        />
      </van-popup>

      <!-- 店铺名称 -->
      <van-field
        v-model="form.name"
        label="店铺名称"
        placeholder="请填写店铺名称"
      />

      <!-- 店铺地址 -->
      <van-field
        v-model="form.pcbid"
        label="pcbid"
        placeholder="请填写秤的pcbid"
      />


    </van-cell-group>
  </div>
</template>

<script>
import {
  CellGroup,
  NavBar, Field,
  Picker, Popup
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
export default {
  name: 'OpenShop',
  data () {
    return {
      gLoading: false,
      type: '',
      shopid: '',
      form: {
        name: '',
        // address: '',
        pcbid: '',
        type: 0,
        mobile: ''
      },
      popup: {
        type: false
      },
      types: [],
    }
  },
  components: {
    [CellGroup.name]: CellGroup,
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    Loading
  },
  mounted () {
    this.form.mobile = this.$route.query.mobile
    this.getmodel()
  },
  methods: {
    back () {
      this.$router.go(-1)
    },
    verify () {
      if (!this.form.name) {
        this.$toast('店铺名称为必填项')
        return false
      }
      if (!this.form.pcbid) {
        this.$toast('秤pcbid为必填项')
        return false
      }
      if (!this.form.type) {
        this.$toast('店铺类别为必填项')
        return false
      }
      return true
    },
    submit () {
      if (!this.verify()) return false
      this.gLoading = true
      this.axios.post(API.openShop, this.form).then(data => {
        this.gLoading = false
        this.$toast('开店成功')
        let name = data.name
        let id = data.id
        this.update(name,id)
        this.$router.push({name: 'Home'})
      }).catch(e => {
        this.gLoading = false
      })
    },
    // 更新数据
    update (name, id) {
      let user = JSON.parse(localStorage.getItem('user'))
      if(user.shopinfo==null){
        user.shopinfo=[]
      }
      user.shopinfo.push({shopid: id, shopname: name})
      localStorage.setItem('user', JSON.stringify(user))
    },
    onCancel (key) {
      this.popup[key] = false
    },
    onConfirm (key, value, index) {
      this.form[key] = value.id
      this[key] = value.name
      this.popup[key] = false
    },
    focus (e, key) {
      document.activeElement.blur()
      this.popup[key] = true
    },
    onRead ({content, file}, type) {
      this.picurl = content
      this.form.picurl = file
    },
    getmodel(){
      this.axios.get(API.getType).then(data => {
        this.types=[]
        data.forEach((item)=>{
          this.types = this.types.concat({'name':item.name,'id':item.id})
        })
      }).catch(e => {

      })
    },
  }
}
</script>

<style scoped>
.cell-box {
  display: flex;
  align-items: flex-start;
}
.cell-box span {
  width: 90px;
  display: block;
}
</style>

<style>
.good-wrap .van-cell__value {
  color: #888;
}
.good-wrap .van-cell-swipe__right {
  width: 130Px;
  display: flex;
}
.good-wrap .van-checkbox--checked {
  background-color: #08979c;
  border-color: #08979c;
}
.good-wrap .van-nav-bar {
  background-color: #08979c;
  color: #fff;
}
.good-wrap .van-nav-bar__text {
  color: #fff;
}
.good-wrap .van-nav-bar .van-icon {
  color: #fff;
}
</style>
