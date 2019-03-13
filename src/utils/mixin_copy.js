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
      
    }
  }
}
