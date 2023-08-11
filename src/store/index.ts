import { createStore } from 'vuex';
interface State {
	ticket: string;
}
let state: State = {
	ticket: ''
};

export default createStore({
	state,
	mutations: {
		// 定义mutations，用于修改状态(同步)
		update_ticket(state: State, payload: string) {
			state.ticket = payload;
		}
	},
	actions: {},
	getters: {},
	modules: {}
});
