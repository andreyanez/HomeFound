import Cookie from 'js-cookie';
import { unWrap } from '~/utils/fetching';
export default ({ $config, store }, inject) => {
	//learned that all plugins created run each time the server runs, lol

	//so NOW we create a new window object that calls the init function
	//this happens before we try to add the script
	window.initAuth = init;
	addScript();
	inject('auth', {
		signOut,
	});
	function addScript() {
		const script = document.createElement('script');
		script.src = 'https://apis.google.com/js/platform.js?onload=initAuth';
		script.async = true;
		document.head.appendChild(script);
	}

	//this init func calls the auth service, renders the button and uses a
	//callback sending the user object
	//this will probably change due to google deprecating this method
	function init() {
		window.gapi.load('auth2', async function () {
			const auth2 = await window.gapi.auth2.init({
				client_id: $config.auth.clientId,
			});
			auth2.currentUser.listen(parseUser);
		});
		window.gapi.signin2.render('googleButton', {
			onsuccess: parseUser,
		});
	}

	async function parseUser(user) {
		if (!user.isSignedIn()) {
			Cookie.remove($config.auth.cookieName);
			store.commit('auth/user', null);
			return;
		}

		const idToken = user.getAuthResponse().id_token;
		Cookie.set($config.auth.cookieName, idToken, { expires: 1 / 24, sameSite: 'Lax' });

		try {
			//The new auth flow gives an extra layer of security
			//after google log in, it will hit an endpoint
			//which will authenticate the user, and save it to the database

			// Auth flow part 1: using fetch to call to a api endpoint
			// i use await twice, once to fetch the response from the api
			//and the other to unwrap the response
			const response = await unWrap(await fetch('/api/user'));
			// I store the json response on a constant
			const user = response.json;

			//then I use the data from the constant to
			//commit and save to global state
			store.commit('auth/user', {
				fullName: user.name,
				profileUrl: user.image,
			});
		} catch (error) {
			console.error(error);
		}
	}

	function signOut() {
		const auth2 = window.gapi.auth2.getAuthInstance();
		auth2.signOut();
	}
};
