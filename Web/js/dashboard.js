var geocoder;
var map;
var panorama;
var sObj = [];
var polygons = [];

// Constructor for the smartObject
function smartObj(id, name, lat, lng, loc_acc, alt, marker,infowindow){
	this.id = id;
	this.name = name;
	this.lat = lat;
	this.lng = lng;
	this.loc_acc = loc_acc;
	this.altitude = alt;
	this.infoWindow = null;
	this.marker = null;
	this.displayProps = displayProps;
}
// Constructor for polygons
function polygonsOverlay(id, name, coords, radius) {
	this.id = id;
	this.name = name;
	this.coords = coords;
	this.radius = radius;
	this.dispPolygons = dispPolygons;
}

function dispPolygons() {
	alert(this.id);
	alert(this.id);
	alert(this.name);
	alert(this.coords);
	alert(this.radius);
}

$(function(){
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 10,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	map = new google.maps.Map(document.getElementById("map"), myOptions);
	var num = document.getElementById("numobjs").value;

	var i = 0;
	while (document.getElementById("soname"+i) != null) {
		var id = document.getElementById("soid"+i).value;
		var name = document.getElementById("soname"+i).value;
		var lat = document.getElementById("solat"+i).value;
		var lng = document.getElementById("solng"+i).value;
		var loc_acc = document.getElementById("solocacc"+i).value;
		var alt = document.getElementById("soalt"+i).value;
		sObj[i] = new smartObj(id, name, lat, lng, loc_acc, alt);
		i++;
	}
	
	i = 0;
	while(document.getElementById("polyid"+i) != null) {
		var polyId = document.getElementById("polyid"+i).value;
		var polyName = document.getElementById("polyname"+i).value;
		var polyCoords = document.getElementById("polycoords"+i).value;
		var polyRadius = document.getElementById("polyradius"+i).value;
		polygons[i] = new polygonsOverlay(polyId, polyName, polyCoords, polyRadius);
		i++;
	}

	initialize();
});

function displayProps(){
	alert("in display properties");	
	alert(this.name);
	alert(this.lat);
	alert(this.lng);

}

function initialize() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 4,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	addSmartObjects();
	addPolygons();
}

function addSmartObjects(){
	var marker = [];
	var infoWindow = [];
	for(var k = 0 ; k < sObj.length; k++){
		latlng = new google.maps.LatLng(sObj[k].lat,sObj[k].lng);

		marker[k] = new google.maps.Marker({
			position: latlng, 
			map: map,
			title: sObj[k].id,
			animation: google.maps.Animation.DROP
		}); 

		infoWindow[k] = new google.maps.InfoWindow({
			content: sObj[k].name
		});

		google.maps.event.addListener(marker[k], "click", function(k) {
			return function(){
				infoWindow[k].open(map, marker[k]);
			}
			
		}(k));
		var accRadius = parseInt(sObj[k].loc_acc);
		if (sObj[k].loc_acc > 10){
			var accOptions = {
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
	            strokeWeight: 2,
	            fillColor: '#FF0000',
	            fillOpacity: 0.35,
	            map: map,
	            center: latlng,
	            radius: accRadius
			};
			accCircle = new google.maps.Circle(accOptions);
		}
	}
	latlng = new google.maps.LatLng(sObj[sObj.length-1].lat, sObj[sObj.length-1].lng);

	map.setCenter(latlng);

	map.setZoom(11);
}

function addPolygons(){
	for(var k = 0 ; k < polygons.length; k++) {

		if(parseInt(polygons[k].radius) == 0) {
			var coords = polygons[k].coords.replace("POLYGON((","");
			coords = coords.replace("))","");
			polypoints = coords.split(",");

			var polygonlat = [];
			var polygonlng = [];
			var polygonVertices = [];
			var polygonOL;

			for(var i = 0; i < polypoints.length; i++) {
				polygonlat[i] = polypoints[i].split("+")[1];
				polygonlng[i] = polypoints[i].split("+")[0];
			}
			for (var j = 0; j < polygonlng.length ; j++) {
				polygonVertices[j] = new google.maps.LatLng(polygonlat[j],polygonlng[j]);
			}

			polygonOL = {
	          paths: polygonVertices,
	          strokeColor: '#0000FF',
	          strokeOpacity: 0.8,
	          strokeWeight: 3,
	          fillColor: '#0000FF',
	          fillOpacity: 0.35,
	          map: map
	        };

	        var newPolygon = new google.maps.Polygon(polygonOL);
		}

		else {
			var coords = polygons[k].coords.replace("POINT(","");
			coords = coords.replace(")","");
			polypoints = coords.split("+");

			var latlng = new google.maps.LatLng(polypoints[1],polypoints[0]);
			var accRadius = parseInt(polygons[k].radius);
			var accOptions = {
				strokeColor: '#0000FF',
				strokeOpacity: 0.8,
	            strokeWeight: 2,
	            fillColor: '#0000FF',
	            fillOpacity: 0.35,
	            map: map,
	            center: latlng,
	            radius: accRadius
			};
			accCircle = new google.maps.Circle(accOptions);
		}
	}
}