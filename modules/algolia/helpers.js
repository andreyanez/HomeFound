export function getHeaders(algoliaConfig) {
	return {
		'X-Algolia-API-Key': algoliaConfig.algolia_api_key,
		'X-Algolia-Application-Id': algoliaConfig.algolia_app_id,
	};
}

//sendJSON sets the response headers to json,
// stringifies the data sent
// and sends the response with the data
export function sendJSON(data, res) {
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(data));
}

export function rejectHitBadRequest(res) {
	res.statusCode = 400;
	res.end();
}

export function hasBadBody(req) {
	return !req.body || Object.keys(req.body).length === 0;
}
