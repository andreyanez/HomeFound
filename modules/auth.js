import cookie from 'cookie';

export default function () {
	// we get the auth object we instanced on the runtime config
	const authConfig = this.options.publicRuntimeConfig.auth;

	//we use a nuxt server hook to setup middleware, and
	//atach the handler function when we hit the /api route
	this.nuxt.hook('render:setupMiddleware', app => {
		app.use('/api', handler);
	});

	//this handler function finds the cookie and parses it
	//using the cookie library
	function handler(req, res, next) {
		const idToken = cookie.parse(req.headers.cookie)[authConfig.cookieName];
		console.log(req.originalUrl);
		console.log(idToken);
		next();
	}
}
