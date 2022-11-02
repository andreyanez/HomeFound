import cookie from 'cookie';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export default function () {
	// we get the auth object we instanced on the runtime config
	const authConfig = this.options.publicRuntimeConfig.auth;
	const firebaseConfig = this.options.firebase.config;
	//we use a nuxt server hook to setup middleware, and
	//atach the handler function when we hit the /api route
	this.nuxt.hook('render:setupMiddleware', app => {
		app.use('/api', handler);
	});

	this.nuxt.hook('render:setupMiddleware', app => {
		app.use('/admin', (req, res, next) => {
			res.spa = true;
			next();
		});
	});

	this.nuxt.hook('render:setupMiddleware', app => {
		app.use('/booking', (req, res, next) => {
			res.spa = true;
			next();
		});
	});

	//this handler function finds the cookie and parses it
	//using the cookie library
	async function handler(req, res, next) {
		if (!req.headers.cookie) return rejectHit(res);
		const idToken = cookie.parse(req.headers.cookie)[authConfig.cookieName];

		const userIdentity = await getUser(idToken);

		if (!userIdentity) return rejectHit(res);

		req.identity = userIdentity;
		next();
	}

	//the getUser function will validate the token given
	// and it will return a payload, if successful
	async function getUser(idToken) {
		const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
		try {
			const ticket = await getAuth(firebaseApp).verifyIdToken(idToken);

			const identity = {
				id: ticket.uid,
				email: ticket.email,
				name: ticket.name,
				image: ticket.picture,
			};

			return identity;
		} catch (error) {
			console.error(error);
		}
	}

	//rejectHit will take the response
	//and add a code of 401 (unauthorized)
	// ending the response
	function rejectHit(res) {
		res.statusCode = 401;
		res.end();
	}
}
