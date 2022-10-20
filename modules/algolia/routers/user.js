import { sendJSON } from '../../helpers';
export default apis => {
	//Auth flow part 3: The getUserRoute function
	//gets the request which has the data sent from
	//the auth module (/api)
	return async function getUserRoute(req, res, next) {
		const identity = req.identity;
		//auth flow part 4: we check if the data sent
		//exists within the database
		const userData = await apis.user.getById(identity);
		// console.log(userData, 'user data ');
		if (userData.status == 200) {
			//if theres an user, we fire the
			//sendJSON function which sets the headers
			//and resolves the response
			sendJSON(userData.json, res);
			return;
		}

		const payload = makeUserPayload(identity);
		//if there' no user registerd on algolia
		//we fire createUser with the identity object
		//which has our data
		apis.user.create(identity, payload);
		//then we send back the data to the client
		//using makeUserPayload, which jsuts
		//creates an object to be sent as payload
		// WE USE THIS BECAUSE WE NEED TO WAIT SOME MS
		// BEFORE THE DATA IS SUCCESSFULY STORED ON ALGOLIA
		//BEFORE RETURNING THE DATA TO THE CLIENT
		sendJSON(payload, res);
	};

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
};
