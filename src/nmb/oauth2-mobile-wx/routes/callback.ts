import Vue from 'vue';
import Component from 'vue-class-component';
import rely from '../oauth2rely';
import app from '../../app';

@Component({
  template: ''
})
export default class Callback extends Vue {

  beforeMount() {
    const authResult = rely.resolveAuthCallback();

    // 获取微信用户信息
    if (authResult && authResult.result) {
      rely.wxUserInfo(authResult.code, this.wxSuccess, this.error);
    } else {
      this.error(authResult.error);
    }
  }

  error = (err: any) => {
    app.showError(err);
  }

  wxSuccess = (userName: string) => {
    rely.token(userName, this.tokenSuccess, this.error);
  }

  tokenSuccess = (access_token: string) => {
    rely.userInfo(access_token, this.userInfoSuccess, this.error);
  }

  userInfoSuccess = () => {
    rely.returnToRedirectUrl();
  }
}
