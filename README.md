vue 

vuex

vux（ui）

typescript

mockjs

包含了企业微信登录的接入



运行命令： 

```
yarn run build:dev

yarn run build:test

yarn run build:deploy

( npm run build:test --report )
```



使用注意：

###### node_moudles 手动修改的位置 [vux 暂无ts type]

```
/node_modules/vux/src/plugins/alert/module.js
line - 12 
export const AlertModule = {
  show (options) {
    return show.call(manager, $vm, options)
  },
  hide () {
    return hide.call(manager, $vm)
  }
}
```

/src/nmb/oauth2-mobile-wx/oatuth2relay.ts 中

```
defaultParams: {
        client_id: '需要修改 pas 授权 内部的',
        client_secret: '需要修改 pas 授权 内部的',
        // 企业微信登录
        qywx: {
            qywx_auth_svr: 'https://open.weixin.qq.com/connect/oauth2/authorize',
            appid: 'xxx',
            scope: 'snsapi_base',
            agentid: process.env.NODE_ENV === 'production' ? '' : process.env.NODE_ENV === 'test' ? '133' : ''
        },
        auth_svr: 'xxx',
        token_svr: 'xxx',
        refresh_svr: 'xxx',
        user_info_svr: 'xxx',
        logout_svr: 'xxx',
        local_mode: 'localStorage',
        cookie_duration: 129600,
        cookie_domain: '.xxx.com',
        // 微信登录信息 统一使用 mp 后台
        wxGetUserInfoUrl: 'xxx'
    },
```

/src/params/config.js 中为接口地址