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

      var uri = 'http://gtsh.edianlai.com/index/Smzf/GetPID';
      uri = encodeURIComponent(uri);

      window.open("https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2019030763480371&scope=auth_base&redirect_uri=" + uri);
      // window.close()
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