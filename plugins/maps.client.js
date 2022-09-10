export default function (context, inject) {
	let mapLoaded = false;
	let mapWaiting = null;

	//first it will run the addScript function,
	// to not expose all the functions on this plugin
	// we use inject to set the name of the plugin when its used
	// and what function we want to have available when called.
	addScript();
	inject('maps', {
		showMap,
	});

	/*
        The addScript function
        does the same thing the head() scripts[] property in any nuxt component
        the scripts[] adds scripts on the head tag
        here we do the same

        we also create the initMap window property
        it will be used to link it to the callback fucntion that
        google fires when the script has finished loading
    */
	function addScript() {
		const script = document.createElement('script');
		script.src =
			'https://maps.googleapis.com/maps/api/js?key=AIzaSyB0mLe8UU8lZG23ags6WL87LWN6NpK5-T0&libraries=places&callback=initMap';
		script.async = true;
		window.initMap = initMap;
		document.head.appendChild(script);
	}

	/*
        the initMap function called from the google script
        gets linked to this function, which sets the
        mapLoaded variable to true.

        If the maps script wasn't done loading when calling showMap(), it
        stored the arguments in the mapWaiting variable
        and now it will use those arguments to render the map
        with the renderMap function, and reseting the value of
        mapWaiting to null.
    */
	function initMap() {
		mapLoaded = true;
		if (mapWaiting) {
			const { canvas, lat, lng } = mapWaiting;
			renderMap(canvas, lat, lng);
			mapWaiting = null;
		}
	}

	/*
        This is the function that will be used in the components
        it will first check if the map has loaded using the
        mapLoaded variable, then it will call the renderMap function
        with the arguments from the component

        Else, if its now loaded yet, it will store the arguments
        inside the mapWaiting variable
    */
	function showMap(canvas, lat, lng) {
		if (mapLoaded) renderMap(canvas, lat, lng);
		else mapWaiting = { canvas, lat, lng };
	}

	// this functios just uses the google window properties to
	// create a map based on the arguments sent from showMap
	// and renders the map.
	function renderMap(canvas, lat, lng) {
		console.log('mounted');
		const mapOptions = {
			zoom: 18,
			center: new window.google.maps.LatLng(lat, lng),
			disableDefaultUI: true,
			zoomControl: true,
		};
		const map = new window.google.maps.Map(canvas, mapOptions);
		const position = new window.google.maps.LatLng(lat, lng);
		const marker = new window.google.maps.Marker({ position });
		marker.setMap(map);
	}
}
