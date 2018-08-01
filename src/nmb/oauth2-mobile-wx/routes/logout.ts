import Vue from 'vue';
import Component from 'vue-class-component';
import rely from '../oauth2rely';

@Component({
    template: '<div><p>登出处理中</p><p>请稍候</p></div>'
})
export default class Logout extends Vue {

    mounted() {
        rely.doLogout();
    }

}
