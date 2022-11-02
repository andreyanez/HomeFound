import Cookie from 'js-cookie';
import { unWrap } from '~/utils/fetching';
export default {
	async onAuthStateChanged({ commit }, { authUser }) {
		if (!authUser) {
			commit('RESET_STORE');
			Cookie.remove(this.$config.auth.cookieName);
			return;
		}

		try {
			const idToken = await authUser.getIdToken(true);
			Cookie.set(this.$config.auth.cookieName, idToken, {
				expires: 1 / 24,
				sameSite: 'lax',
			});

			const response = await unWrap(await fetch('/api/user'));
			const user = response.json;
			commit('SET_AUTH_USER', user);
		} catch (e) {
			console.error(e);
		}
	},
};
