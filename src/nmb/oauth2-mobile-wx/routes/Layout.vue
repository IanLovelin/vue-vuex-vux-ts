<template>
  <div>
    <p class="loading">
      <spinner type="bubbles" size="40px" style="color:#097FFF;"></spinner>
      <span>登录信息处理中</span>
    </p>
    <router-view/>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Spinner } from "vux";

@Component({
  components: {
    Spinner
  }
})
export default class MainLayout extends Vue {}
</script>

<style lang='less'>
.loading {
  text-align: center;
  top: 40%;
  position: absolute;
  left: 36%;
  span {
    vertical-align: middle;
    display: inline-block;
    font-size: 0.7rem !important;
    color: #666;
  }
  .vux-spinner {
    fill: #097fff;
  }
}
</style>
