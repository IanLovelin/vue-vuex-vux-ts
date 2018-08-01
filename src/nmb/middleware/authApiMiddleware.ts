import rely from '../oauth2-mobile-wx/oauth2rely';
import { modalTip } from '../ModalTip';

interface IActionPayload {
    type: string;
    payload: any;
}

const error = (err: any) => {
    modalTip.error(err);
};

const actionWidthAuthorization = (action: IActionPayload, accessToken: string) => {
    action.payload.headers = { Authorization: `Bearer ${accessToken}` };
};

export default async (action: IActionPayload, state: any) => {
    // 只有api请求才去做验证
    if (action.type.endsWith('Api')) {
        if (!action.payload) action.payload = {};
        action.payload.data = { ...action.payload };
        // 获取 store 中的tokens
        const tokens = rely.getTokens();
        if (rely.isTokenValid(tokens)) {
            actionWidthAuthorization(action, tokens.access_token);
        } else {
            // 刷新token
            rely.prepareRefresh(
                () => {
                    rely.refresh((newAccessToken: string) => {
                        actionWidthAuthorization(action, newAccessToken);
                    }, error);
                },
                () => {
                    const newTokens = rely.getTokens();
                    actionWidthAuthorization(action, newTokens.access_token);
                }
            );
        }
    }
};

export const authApiBefore = async (payload: any) => {
    if (payload) payload = payload.data = { ...payload };
    let headers = {};
    // 获取 store 中的tokens
    const tokens = rely.getTokens();
    if (rely.isTokenValid(tokens)) {
        headers = { Authorization: `Bearer ${tokens.access_token}` };
    } else {
        // 刷新token
        await rely.prepareRefresh(
            async () => {
                await rely.refresh((newAccessToken: string) => {
                    headers = { Authorization: `Bearer ${newAccessToken}` };
                }, error);
            },
            () => {
                const newTokens = rely.getTokens();
                headers = { Authorization: `Bearer ${newTokens.access_token}` };
            }
        );
    }

    return { headers };
};
