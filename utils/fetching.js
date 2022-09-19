//Here, I made an unwrap function to get only the desired
//data from the api call
export async function unWrap(response) {
	const json = await response.json();
	const { ok, status, statusText } = response;
	return {
		json,
		ok,
		status,
		statusText,
	};
}

//This function gets called when there is an error
//when trying to make an api call
export function getErrorResponse(error) {
	return {
		ok: false,
		status: 500,
		statusText: error.message,
		json: {},
	};
}
