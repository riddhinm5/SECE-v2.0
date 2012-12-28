$(function(){
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 10,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	var map = new google.maps.Map(document.getElementById("map"), myOptions);
	$('#my-root').popover();
	$('#grp-root').popover();
	$('#fridge').popover();
	$('#IRT-lab').popover();
});
