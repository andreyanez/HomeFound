export default ({ $config }) => {
	//learned that all plugins created run each time the server runs, lol

	//so NOW we create a new window object that calls the init function
	//this happens before we try to add the script
	window.initAuth = init;
	addScript();
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
		});
		window.gapi.signin2.render('googleButton', {
			onsuccess: parseUser,
		});
	}

	function parseUser(user) {
		const profile = user.getBasicProfile();
		console.log('Name:' + profile.getName());
		console.log('Image Url:' + profile.getImageUrl());
	}
};
