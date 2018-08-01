import Mock from 'mockjs'
import demoAPI from './demo'

Mock.setup({
    timeout: '1000-6000'
})

// 本地运行时启用
if (process.env.NODE_ENV === 'development') {
    // demo
    Mock.mock(/\/demo\/get/, 'get', demoAPI.demoData)
}

export default Mock
