import { API } from '@/utils/api'
import { Dialog } from 'vant';
export default {
  methods: {

    // 退出登录
    logout () {
      Dialog.confirm({
        message: '确认退出？'
      }).then(()=>{
        localStorage.clear()
      this.$router.push({ name: 'Login' })
      }).catch(e=>{
        
      })
      
    },

    //判断是否登录
    hasLogin () {
      try{
        let user = JSON.parse(localStorage.getItem('user'))
        const mobile = user.mobile
        return mobile
      }catch (e) {
        return false
      }
    },


    setPID(pid) {
      localStorage.setItem('alipid', pid);
    },

    getPID() {
      return localStorage.getItem('alipid');
    },

    hasPID() {
      if (this.getPID())
        return true;
      else
        return false;
    },

    fetchPID() {
      var pid = this.getPID();
      if (pid) {
        return pid;
      }

      var params = this.getQueryParams();
      var userId = params.userId;
      if (userId) {
        this.setPID(userId);
        return userId;
      }

      var ua = window.navigator.userAgent.toLowerCase();
	    //判断是不是支付宝
	    if (ua.match(/AlipayClient/i) == 'alipayclient') {
        var uri = 'http://gtsh.edianlai.com/index/Smzf/GetPID';
        uri = encodeURIComponent(uri);
        window.open("https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019030763480371&scope=auth_base&redirect_uri=" + uri);
        // window.close()
	    }
	    else{
        alert("请用支付宝扫码!")
        //window.close()
	    }
      
    },

    getQueryParams() {
      var res = {};
      var query = window.location.href;
      var index = query.lastIndexOf('?');
      if(index != -1) {
        query = query.substr(index + 1);
        var pairs = query.split("&");
        for(var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            var kv = pair.split('=');
            var key = kv[0]; var value = kv.length > 1 ? kv[1] : "";
            res[key] = unescape(value);
        }
      }
      return res;
    }
  }
}