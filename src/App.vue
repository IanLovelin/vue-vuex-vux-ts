<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: "app"
})
export default class App extends Vue {}
</script>

<style lang="less">
@import "~vux/src/styles/1px.less";
@import "~vux/src/styles/reset.less";
html {
  font-size: 16px;
}
</style>