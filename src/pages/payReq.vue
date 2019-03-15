<template>
    <!-- 编辑弹框 -->
    <div class="home-wrap">
      <van-nav-bar title="收款账号"
      fixed
      left-arrow
      right-text="增加"
      @click-left="back()"
      @click-right="add_alipay()"
      />

      <div class="list">
        <!-- 支付宝账号列表 -->
        <template v-if="alilist.length > 0">
            <van-cell-group
              v-for="(item,i) in alilist"
              :key="i"
            
            >
              <van-cell 
                :label="`身份证号：${item.persol_id}\n支付宝PID：${item.ali_PID}`"
                :title="`收款人姓名：${item.real_name}`"
                @click="toast(i)"
              >
              </van-cell>
            </van-cell-group>
          </template>
          <p class="nomore" v-else>你还没有收款账号，请点击右上角“增加”按钮进行账号添加</p>
      </div>

    <van-popup v-model="alipay" position="right">
      <div class="edit-box">
        <van-nav-bar
          title="增加收款支付宝账号"
          right-text="提交"
          left-arrow
          @click-left="alipay = false"
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
          v-model="form.alipayusername"
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
  Cell, CellGroup,
  Dialog, NavBar,Toast,Area,
  Button, Icon, Field,
  Popup,NumberKeyboard
} from 'vant'
import { API } from '@/utils/api'
import Loading from '@/components/Loading'
import commonMixin from '@/utils/mixin'
export default {
  name: 'PayReq',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Icon.name]: Icon,
    VanDialog: Dialog,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Toast.name]: Toast,
    [Area.name]: Area,
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
      alilist: [],//收款账户列表
      alipay: false,//显示增加收款账号表单
      form: {
        id: '',//身份证号
        name: '',//真实姓名
        address: '',//地址
        alipayusername: '',//alipayusername
        alipayid: '',//支付宝id
      },
      ali_PID: '',
    }
  },
  mounted () {
    let { mobile,name } = this.$route.query
    let alipid  = this.fetchPID()
    this.form.alipayid = alipid
    if(mobile){
      this.mobile = mobile
    }else{
      this.mobile = this.hasLogin()
      if(this.mobile===''){
        this.$toast('您还未登录')
        this.$router.push({name: 'Login'})
      }
      this.loading = true
      this.axios.post(API.getAlipay, {mobile}).then(data => {
        this.loading = false
        this.alilist = data
      }).catch(e => {
        this.loading = false
      })
      
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    validateIdCard(idCard){
      //15位和18位身份证号码的正则表达式
      var regIdCard=/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

      //如果通过该验证，说明身份证格式正确，但准确性还需计算
      if(regIdCard.test(idCard)){
          if(idCard.length==18){
              var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
              var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
              var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
              for(var i=0;i<17;i++){
                  idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
              }
              var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
              var idCardLast=idCard.substring(17);//得到最后一位身份证号码
              //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
              if(idCardMod==2){
                  if(idCardLast=="X"||idCardLast=="x"){
                      //alert("恭喜通过验证啦！");
                      return true
                  }else{
                      // alert("身份证号码错误！");
                      return false
                  }
              }else{
                  //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                  if(idCardLast==idCardY[idCardMod]){
                      // alert("恭喜通过验证啦！");
                      return true
                  }else{
                      // alert("身份证号码错误！");
                      return false
                  }
              }
          }
      }else{
          // alert("身份证格式不正确!");
          return false
      }
    },
    //检查表单内容
    validate () {
      if (!this.form.name) {
        this.$toast('请输入姓名！')
        return false
      }
      if(!this.validateIdCard(this.form.id)) {
        this.$toast('身份证号码不合法！')
        return false
      }
      if (this.form.alipayid.length!==16&&(substr(this.form.alipayid,4)!=='2088')) {
        this.$toast('支付宝PID不正确')
        return false
      }
      return true
    },
    //显示增加收款账号表单
    add_alipay () {
      this.alipay = true
    },
    toast (i) {
      let msg = "收款人姓名：" + this.alilist[i].real_name + "，身份证号：" + this.alilist[i].persol_id + "，支付宝PID：" + this.alilist[i].ali_PID
      this.$toast(msg)
    },
    //增加收款账号
    submit_addalipay () {
      if (!this.validate()) return
      this.loading = true
      const name = this.form.name//真实姓名
      const identity = this.form.id//身份证号
      const ali_PID = this.form.alipayid//支付宝账号
      const alipay_username = this.form.alipayusername
      const mobile = this.mobile//手机号
      let params = { mobile, name, identity, ali_PID,alipay_username }
      this.axios.post(API.addAlipay, params).then(data => {
        this.$toast('收款账号添加成功！')
        this.loading = false
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
.list {
  margin-top: 10px;
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
.home-wrap .van-nav-bar {
  background-color: #08979c;
  color: #fff;
}
</style>