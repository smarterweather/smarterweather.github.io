function init() 
{
	var input = document.getElementById('pac-input');
	var options = {
	  	types: ['(cities)'],
	  	componentRestrictions: {country: "us"}
	};
	var autocomplete = new google.maps.places.Autocomplete(input, options);

	autocomplete.addListener('place_changed', function() 
	{
	  	analyze(autocomplete.getPlace());
	});
}

function UiInit()
{
	$(analyzedRadar).hide();
}

function analyze(place)
{
	var lat = place.geometry.location.lat();
	var lon = place.geometry.location.lng();
	var name= place.formatted_address;

	var url = "http://smarterweather.mybluemix.net/smarterweather/Snapshot?";
	var query = "action=110&lat=" + lat + "&lon=" + lon + "&name=" + name;
	query = query.split(" ").join("%20");

	url += query;

	$.get(url, analyzeComplete);
}

function analyzeComplete(data)
{
	data = $.parseJSON(data);
	$(analyzedRadar).attr('src', '' + data.analyzedUrl);
}