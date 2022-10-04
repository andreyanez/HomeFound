import cookie from 'cookie';
import { OAuth2Client } from 'google-auth-library';

export default function () {
	// we get the auth object we instanced on the runtime config
	const authConfig = this.options.publicRuntimeConfig.auth;

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

	//this handler function finds the cookie and parses it
	//using the cookie library

	async function handler(req, res, next) {
		const idToken = cookie.parse(req.headers.cookie)[authConfig.cookieName];
		//if the handler doesn't find any cookie stored, it will fire the rejectHit function
		if (!idToken) return rejectHit(res);

		//IG there's a token, we will fire the getUser function
		//which usese the google auth library to verify the token
		const ticket = await getUser(idToken);
		//if the token wasn't vaild it won't return anything,
		//so we'll fire rejectHit again.
		if (!ticket) return rejectHit(res);
		//else, we'll add a object to the request
		//with basic data coming from the ticket
		req.identity = {
			id: ticket.sub,
			email: ticket.email,
			name: ticket.name,
			image: ticket.picture,
		};
		next();
	}

	//the getUser function will validate the token given
	// and it will return a payload, if successful
	async function getUser(idToken) {
		// initializing a OAuth instance and sending the client Id
		//from the runtime config
		const client = new OAuth2Client(authConfig.clientId);
		try {
			// running the verifyIdToken fucntion from the oauth instance
			// sending the idToken passed and the cliend Id
			const ticket = await client.verifyIdToken({
				idToken,
				audience: authConfig.clientId,
			});
			//if successful, it will return the data from the getPayload function
			return ticket.getPayload();
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
