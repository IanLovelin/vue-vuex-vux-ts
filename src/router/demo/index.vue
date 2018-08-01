<template>
  <div>
    <p style="text-align:center;">
      <inline-loading></inline-loading>
    </p>
    <x-button @click.native="clickItem()">submit</x-button>
    <p>
      {{demoGetter.data}}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { Getter, Action } from "vuex-class";
import { InlineLoading, XButton } from "vux";
import oauthRely from "../../nmb/oauth2-mobile-wx/oauth2rely";
import { modalTip } from "../../nmb/ModalTip";
import { IBaseState } from "../../store/moudules/demo/states";

@Component({
  components: {
    InlineLoading,
    XButton
  }
})
export default class Demo extends Vue {
  @Action getDemoApi: () => void;
  @Getter demoGetter: IBaseState;
  @Watch("demoGetter.loading")
  demoLoading(n: any, o: any) {
    if (!n && o) {
      console.log(this.demoGetter.data);
    }
  }
  created() {
    const userInfo = oauthRely.getLogonUser();

    console.log(userInfo);
  }
  clickItem() {
    console.log("click");
    modalTip.info("123");
  }
  mounted() {
    this.getDemoApi();
  }
}
</script>

<style lang="less" scoped>
p {
  font-size: 1rem;
}
</style>
