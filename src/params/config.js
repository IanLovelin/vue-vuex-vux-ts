export const __DEV__ = process.env.NODE_ENV === 'development';
export const __TEST__ = process.env.NODE_ENV === 'test';

export default {
    client_id: '',
    home: __DEV__ ? 'xxx' : (__TEST__ ? 'xxx' : 'xxx'),
    apiDomain: __DEV__ ? 'xxx' : (__TEST__ ? 'xxx' : 'xxx'),
    apiVersion: 'v1'
};
