import { unWrap, getErrorResponse } from '~/utils/fetching';

export default function ({ $config }, inject) {
	//createing blank variable
	let stripe;
	addScript();

	inject('stripe', {
		checkout,
	});

	//adding script on load, calling initStripe when done
	function addScript() {
		const script = document.createElement('script');
		script.src = 'https://js.stripe.com/v3/';
		script.onload = initStripe;
		document.head.appendChild(script);
	}

	//initStripe sets the stripe object fetched from the
	//script to the new stripe variable, passing the key
	function initStripe() {
		stripe = window.Stripe($config.stripe.key);
	}

	// createSession uses the stripe module api
	// return an id from the session created
	async function createSession(homeId, start, end) {
		try {
			return unWrap(
				await fetch(`/api/stripe/create-session`, {
					method: 'POST',
					body: JSON.stringify({
						homeId,
						start,
						end,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				})
			);
		} catch (error) {
			return getErrorResponse(error);
		}
	}

	//checkout is called from the user
	//redirects to the stripe checkout page, sending the session id
	async function checkout(homeId, start, end) {
		const id = (await createSession(homeId, start, end)).json.id;
		await stripe.redirectToCheckout({ sessionId: id });
	}
}
