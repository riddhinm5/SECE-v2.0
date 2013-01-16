var geocoder;
var map;
var panorama;
var objName;
var markersArray = [];

$(function(){
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 10,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	map = new google.maps.Map(document.getElementById("map"), myOptions);
	var id = document.getElementById('soid').value;
	var lat = parseFloat(document.getElementById('lat').value);
	var lng = parseFloat(document.getElementById('lng').value);
	var latlng = new google.maps.LatLng(lat, lng);
    initApp(id, latlng);
});

function initApp(id, latLng){
	//Check if street view is available for the location where the user is palcing the smart object	
	var marker = new google.maps.Marker({
		map: map, 
		position: latLng,
		title: "mapMarker",
		draggable: true,
		animation: google.maps.Animation.DROP
	});
	
	updateMarkerPosition(id, latLng);
	geocodePosition(latLng);	
	//for normal marker movement		
	google.maps.event.addListener(marker, 'dragstart', function() {
		//do nothing
	});

	google.maps.event.addListener(marker, 'drag', function() {
		//updating marker position
		updateMarkerPosition(id, marker.getPosition());
		//streetMarker.position = marker.getPosition();
	});

	google.maps.event.addListener(marker, 'dragend', function() {
		//updating marker position
		geocodePosition(marker.getPosition());
		map.setCenter(marker.getPosition());
		//panorama.setPosition(marker.getPosition());
	});
}

function geocodePosition(pos) {

	geocoder.geocode({
		latLng: pos
	}, function(responses) {
		if (responses && responses.length > 0) {
			updateMarkerAddress(responses[0].formatted_address);
		} else {
			updateMarkerAddress('Cannot determine address at this location.');
		}
	});
}

function updateMarkerPosition(id, latLng) {
	document.getElementById('placeObj').innerHTML = "<h4>Place Smart Object: </h4>"+
	"<form id = \"markerLocation\" action = \"updateSmartObj.php\" method = \"post\" class=''>"+
	"<input type='hidden' id='soid' name='soid' value="+ id +">" +
	"<input type = \"hidden\" id = \"newlat\" name = \"newlat\" value = " +latLng.lat()+">"+ 
	"<input type = \"hidden\" id = \"lng\" name = \"newlng\" value = "+latLng.lng()+">"+
	"<input type = \"submit\" class='btn btn-primary' value = \"Locate!\"></form>";
}


