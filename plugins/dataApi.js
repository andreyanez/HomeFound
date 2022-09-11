export default function (context, inject) {
	const appId = process.env.algolia_app_id
	const apiKey = process.env.algolia_search_api;
	const headers= {
		'X-Algolia-API-Key': apiKey,
		'X-Algolia-Application-Id': appId,
	}
	inject('dataApi', {
		getHome,
	});

	async function getHome(homeId) {
		try {
			return unWrap(await fetch(`https://${appId}-dsn.algolia.net/1/indexes/home/${homeId}`, {headers}));
		} catch (error) {
			return getErrorResponse(error)
		}
	}

	//Here, I made an unwrap function to get only the desired
	//data from the api call
	const unWrap = async(response) =>{
		const json = await response.json()
		const { ok, status, statusText } = response
		return{
			json,
			ok,
			status,
			statusText
		}
	}

	//This function gets called when there is an error
	//when trying to make an api call
	const getErrorResponse = error =>{
		return{
			ok: false,
			status: 500,
			statusText:error.message
		}
	}


}
