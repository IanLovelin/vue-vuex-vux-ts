export interface IBaseState {
    loading: boolean;
    data: any;
}
export interface IState {
    demo: IBaseState;
}

const state: IState = {
    demo: {
        loading: false,
        data: {}
    }
};

export default state;
