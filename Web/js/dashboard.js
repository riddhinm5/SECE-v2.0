var geocoder;
var map;
var panorama;
var sObj = [];
var polygons = [];
var floor_plans = [];

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

// Constructor for floor plans
function floorPlanOverlay(id, name, coords, path) {
	this.id = id;
	this.name = name;
	this.coords = coords;
	this.path = path;
	this.dispFloorPlans = dispFloorPlans;
}

function dispFloorPlans() {
	alert(this.id);
	alert(this.name);
	alert(this.coords);
	alert(this.path);
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
		//polygons[i].dispPolygons();
		i++;
	}

	i = 0;

	while(document.getElementById("fpid"+i) != null) {
		var id = document.getElementById("fpid"+i).value;
		var name = document.getElementById("fpname"+i).value;
		var coords = document.getElementById("fpcoords"+i).value;
		var path = document.getElementById("fppath"+i).value;
		floor_plans[i] = new floorPlanOverlay(id, name, coords, path);
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
	addFloorPlans();
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

function addFloorPlans() {
	var path = [];
	var xpt = [[]];
	var ypt = [[]];

	for( var k = 0 ; k < floor_plans.length; k++) {	
		path[k] = document.getElementById("fppath"+k).value;
		var coords = floor_plans[k].coords.replace("POLYGON((","");
		coords = coords.replace("))","");
		var boundpoints = coords.split(",");

		for (var j = 0 ; j < boundpoints.length; j++) {
			xpt[k, j] = boundpoints[j].split("+")[0];
			ypt[k, j] = boundpoints[j].split("+")[1];
		}
	}
	var j = 0;
	var overlay = [];
	for (var k = 0; k < floor_plans.length; k++) {
		j = 0;
		overlay[k] = new google.maps.ImageMapType({
          getTileUrl: function(coord, zoom) {
	            if (!inBounds(coord, zoom, j)) {
	              return null;
	            }
	            return "overlays/"+path[j]+"/"+[zoom, coord.x, coord.y + '.png'].join('/')
          },
          tileSize: new google.maps.Size(256, 256)
    	});
	}

    var overlayBounds = [];
    function inBounds(coord, zoom, j) {
      var proj = map.getProjection();
      
      var tileWidth = 256 / Math.pow(2, zoom);
      var tl = new google.maps.Point(coord.x * tileWidth, coord.y * tileWidth);
      var br = new google.maps.Point(tl.x + tileWidth, tl.y + tileWidth);

      var tileBounds = new google.maps.LatLngBounds;
      tileBounds.extend(proj.fromPointToLatLng(tl));
      tileBounds.extend(proj.fromPointToLatLng(br));
      return overlayBounds[j].intersects(tileBounds);
    }

    google.maps.event.addListenerOnce(map, 'projection_changed', function() {
    	for(var j = 0 ; j < floor_plans.length; j++) {
    		overlayBounds[j] = new google.maps.LatLngBounds;
    		var proj = map.getProjection();
    		
    		var extend = function(x, y) {
    			overlayBounds[j].extend(proj.fromPointToLatLng(new google.maps.Point(x, y)));
      	};
	    	extend(xpt[j, 0], ypt[j, 0]);
	      	extend(xpt[j, 1], ypt[j, 1]);
	      	extend(xpt[j, 2], ypt[j, 2]);
	      	extend(xpt[j, 3], ypt[j, 3]);

  			map.overlayMapTypes.push(overlay[j]);
      		//map.fitBounds(overlayBounds[j]);
      	}
	});
}
