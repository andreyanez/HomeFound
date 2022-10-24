import getApis from '../algolia/apis';
import stripeLib from 'stripe';
import bodyParser from 'body-parser';
import { rejectHitBadRequest, sendJSON } from '../helpers';
export default function () {
	//instance of the algolia private config
	const algoliaConfig = this.options.privateRuntimeConfig.algolia;
	const apis = getApis(algoliaConfig);
	const secretKey = this.options.privateRuntimeConfig.stripe.secretKey;
	const stripe = stripeLib(secretKey);
	const cloudName = this.options.cloudinary.cloudName;
	//adding dynamic url depending on dev or prod enviroment
	const rootUrl = this.options.publicRuntimeConfig.rootUrl;

	this.nuxt.hook('render:setupMiddleware', app => {
		app.use(bodyParser.json());
		app.use('/api/stripe/create-session', createSession);
	});

	this.nuxt.hook('render:setupMiddleware', app => {
		app.use('/hooks/stripe', async (req, res, next) => {
			const meta = req.body.data.object.metadata;
			await apis.user.bookHome(meta.identityId, meta.homeId, meta.start, meta.end);
			res.end(`${meta.identityId} booked ${meta.homeId}!!!!`);
		});
	});

	async function createSession(req, res) {
		const body = req.body;
		//Here we check if there's any key properyu missing on the req body
		if (!body || !body.homeId || !body.start || !body.end) {
			return rejectHitBadRequest(res);
		}

		//creating a session and passing data to frontend

		//fetching the home using home get api
		const home = (await apis.homes.get(body.homeId)).json;
		//calculating nights
		const nights = (body.end - body.start) / 86400;
		const session = await stripe.checkout.sessions.create({
			metadata: {
				identityId: req.identity.id,
				homeId: body.homeId,
				start: body.start,
				end: body.end,
			},
			payment_method_types: ['card'],
			mode: 'payment',
			success_url: `${rootUrl}/booking/success?result=success&id=${body.homeId}`,
			cancel_url: `${rootUrl}/home/${body.homeId}`,
			line_items: [
				{
					quantity: 1,
					price_data: {
						currency: 'USD',
						unit_amount: home.pricePerNight * nights * 100,
						product_data: {
							name: 'Reservation for ' + home.title,
							images: [`https://res.cloudinary.com/${cloudName}/image/upload/${home.images[0]}`],
						},
					},
				},
			],
		});

		sendJSON({ id: session.id }, res);
	}
}
