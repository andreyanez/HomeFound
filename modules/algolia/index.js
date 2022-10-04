import { getHeaders } from './helpers';
import userRouter from './routers/user';
export default function () {
	//instance of the algolia private config
	const algoliaConfig = this.options.privateRuntimeConfig.algolia;
	const headers = getHeaders(algoliaConfig);

	//Auth flow part 2: setting the route to hit and the function that will
	//fire when its hit
	this.nuxt.hook('render:setupMiddleware', app => {
		app.use('/api/user', userRouter(headers));
	});
}
