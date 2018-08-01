import { MutationPayload } from 'vuex';
import { modalTip } from '../ModalTip';

export default (mutation: MutationPayload, state: any) => {
    try {
        const type = mutation.type;
        if (type.endsWith('_FAILED')) {
            const payload = mutation.payload;
            if (payload) {
                if (mutation.payload.code === 'ECONNABORTED') {
                    modalTip.error({
                        message: '网络连接失败',
                        name: '网络好像在犯迷糊',
                        code: payload.code || 0
                    });
                } else {
                    modalTip.error({
                        message: payload.data ? payload.data.code : payload.message,
                        name: '服务器异常',
                        code: payload.code || 0
                    });
                }
            }
        }
    } catch (err) {
        modalTip.error({
            message: '页面异常',
            name: err.message,
            code: 10001
        });
    }
};
