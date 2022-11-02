import initialState from './state';

export default {
	RESET_STORE: state => {
		Object.assign(state, initialState());
	},

	SET_AUTH_USER(state, authUser) {
		state.authUser = {
			displayName: authUser.name,
			photoURL: authUser.image,
			email: authUser.email,
		};
	},
};
