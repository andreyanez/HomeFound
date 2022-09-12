export default function (context, inject) {
	let isLoaded = false;
	let waiting = [];

	//first it will run the addScript function,
	// to not expose all the functions on this plugin
	// we use inject to set the name of the plugin when its used
	// and what function we want to have available when called.
	addScript();
	inject('maps', {
		showMap,
		makeAutoComplete,
	});

	/*
        The addScript function
        does the same thing the head() scripts[] property in any nuxt component
        the scripts[] adds scripts on the head tag
        here we do the same

        we also create the initGoogleMaps window property
        it will be used to link it to the callback fucntion that
        google fires when the script has finished loading
    */
	function addScript() {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.maps_api}&libraries=places&callback=initGoogleMaps`;
		script.async = true;
		window.initGoogleMaps = initGoogleMaps;
		document.head.appendChild(script);
	}

	/*
        the initGoogleMaps function called from the google script
        gets linked to this function, which sets the
        isLoaded variable to true.

		when initGoogleMaps is loaded, it means that the google library has done
		loading, and calls initGoogleMaps, as the callback.

		So basically, everything that is ran in initGoogleMaps runs when the 
		script has called the necessary scripts successfully 

		Now, initGoogleMaps will change the isLoaded value to true
		and I use a forEach array method to find each function whose arguments
		where stored on the waiting Array, check if they are of type 'fuction'
		and run those functions with their respective arguments

    */
	function initGoogleMaps() {
		isLoaded = true;
		waiting.forEach(item => {
			typeof item.fn === 'function' && item.fn(...item.arguments);
		});
		waiting = [];
	}

	function makeAutoComplete(input) {
		if (!isLoaded) {
			waiting.push({ fn: makeAutoComplete, arguments });
			return;
		}
		const autoCompleteInstance = new google.maps.places.Autocomplete(input, {
			types: ['(cities)'],
		});
		//here, we create a listener to the maps event 'place changed'
		//when the event fires, it wil return the data of the place
		//we create a custom event and send the proper data to the header
		autoCompleteInstance.addListener('place_changed', () => {
			const place = autoCompleteInstance.getPlace();
			input.dispatchEvent(new CustomEvent('changed', { detail: place }));
		});
	}

	/*
        This is the function that will be used in the components
        it will first check if the map has loaded using the
        isLoaded variable, then it will render the map on the dom

        Else, if its not loaded yet, the arguments will be stored
		within the waiting array as an object, adding the showMap
		function as another property 
    */
	function showMap(canvas, lat, lng, markers) {
		if (!isLoaded) {
			waiting.push({
				fn: showMap,
				arguments,
			});
			return;
		}
		// Here I use the google window properties to
		// create a map based on the arguments sent from showMap
		// and renders the map.
		const mapOptions = {
			zoom: 18,
			center: new window.google.maps.LatLng(lat, lng),
			disableDefaultUI: true,
			zoomControl: true,
			//removing business from the rendered map
			styles: [
				{
					featureType: 'poi.business',
					elementType: 'labels.icon',
					stylers: [{ visibility: 'off' }],
				},
			],
		};
		const map = new window.google.maps.Map(canvas, mapOptions);
		if (!markers) {
			const position = new window.google.maps.LatLng(lat, lng);
			const marker = new window.google.maps.Marker({
				position,
				clickable: false,
			});
			marker.setMap(map);
			return;
		}
		//now that the markers are sent, I use bounds to show all the markers
		//per area, using extend and fitbounds to make the map zoom out to
		//fit all markers
		const bounds = new window.google.maps.LatLngBounds();
		markers.forEach(home => {
			const position = new window.google.maps.LatLng(home.lat, home.lng);
			const marker = new window.google.maps.Marker({
				position,
				label: {
					text: `$${home.pricePerNight}`,
					//addding a unique css class with the home id
					className: `marker home-${home.id}`,
				},
				icon: 'https://maps.gstatic.com/mapfiles/transparent.png',
				clickable: false,
			});
			marker.setMap(map);
			bounds.extend(position);
		});

		map.fitBounds(bounds);
	}
}
