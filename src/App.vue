<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
import { Cell, CellGroup, Button, Card } from 'vant'
export default {
  name: 'App',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Card.name]: Card
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 字体 */
/* div {
  font-size: 12px !important;
}
[data-dpr="2"] div {
  font-size: 24px !important;
}
[data-dpr="3"] div {
  font-size: 36px !important;
} */
.van-nav-bar {
  background-image:-webkit-linear-gradient( 180deg, rgb(32,178,170) 0%, rgb(72,209,204) 100%) 
}
.van-nav-bar .van-icon {
  color: #fff !important;
}
.van-nav-bar__text {
  color: #fff !important;
}
.van-dialog__confirm, .van-dialog__confirm:active {
  color: #08979c !important;
}
.van-picker__cancel, .van-picker__confirm {
  color: #08979c !important;
}
.nomore {
  text-align: center;
  color: #555;
  height: 40px;
  line-height: 40px;
}
.line-bottom {
  border-bottom: 1px solid #e5e5e5;
}
.line-top {
  border-top: 1px solid #e5e5e5;
}
.line-right {
  border-right: 1px solid #e5e5e5;
}
.line-left {
  border-left: 1px solid #e5e5e5;
}
/* 一行省略号 */
.ellipsis-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space: nowrap;
}

/* 两行省略号 */
.ellipsis-2 {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>