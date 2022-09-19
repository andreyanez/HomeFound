import fetch from 'node-fetch';
import { unWrap, getErrorResponse } from '../utils/fetching';

export default function () {
	//instance of the algolia private config
	const algoliaConfig = this.options.privateRuntimeConfig.algolia;
	const headers = {
		'X-Algolia-API-Key': algoliaConfig.algolia_api_key,
		'X-Algolia-Application-Id': algoliaConfig.algolia_app_id,
	};

	//Auth flow part 2: setting the route to hit and the function that will
	//fire when its hit
	this.nuxt.hook('render:setupMiddleware', app => {
		app.use('/api/user', getUserRoute);
	});

	//Auth flow part 3: The getUserRoute function
	//gets the request which has the data sent from
	//the auth module (/api)
	async function getUserRoute(req, res, next) {
		const identity = req.identity;
		//auth flow part 4: we check if the data sent
		//exists within the database
		const userData = await getUserById(identity);
		if (userData.status == 200) {
			//if theres an user, we fire the
			//sendJSON function which sets the headers
			//and resolves the response
			sendJSON(userData.json, res);
			return;
		}

		//if there' no user registerd on algolia
		//we fire createUser with the identity object
		//which has our data
		createUser(identity);
		//then we send back the data to the client
		//using makeUserPayload, which jsuts
		//creates an object to be sent as payload
		// WE USE THIS BECAUSE WE NEED TO WAIT SOME MS
		// BEFORE THE DATA IS SUCCESSFULY STORED ON ALGOLIA
		//BEFORE RETURNING THE DATA TO THE CLIENT
		sendJSON(makeUserPayload(identity), res);
	}

	async function createUser(identity) {
		try {
			return unWrap(
				//Auth flow part 5: the create user function
				//calls to create a user using node-fetch and its
				//fetch function
				//The body of this call is the identity object
				//passed through the makeUserPayload funcion
				//to format it correctly for algolia
				await fetch(
					`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/users/${identity.id}`,
					{
						headers,
						method: 'PUT',
						body: JSON.stringify(makeUserPayload(identity)),
					}
				)
			);
		} catch (error) {
			return getErrorResponse(error);
		}
	}

	//this function just checks if the user that has logged in is on Algolia's records
	async function getUserById(identity) {
		try {
			return unWrap(
				await fetch(
					`https://${algoliaConfig.algolia_app_id}-dsn.algolia.net/1/indexes/users/${identity.id}`,
					{
						headers,
					}
				)
			);
		} catch (error) {
			return getErrorResponse(error);
		}
	}

	//sendJSON sets the response headers to json,
	// stringifies the data sent
	// and sends the response with the data
	function sendJSON(data, res) {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data));
	}

	//makeUserPayload returns an object
	//with Algolia's user sturcture,
	//so algolia will accept it
	function makeUserPayload(identity) {
		return {
			name: identity.name,
			email: identity.email,
			image: identity.image,
			homeId: [],
			reviewCount: 0,
			description: '',
			joined: new Date().toISOString(),
		};
	}
}
