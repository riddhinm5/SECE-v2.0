var num_click = 1;
var prev_x, prev_y;

function areaDone(data) {
	if(data.success = 'success') {
	  alert("area added successfully!");
	} else {
	  alert("Error adding area please try again");
	}
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


$(function(){

	$("#fp").click(function(event){
		var x = event.pageX;
		var y = event.pageY;
		
		var overlay = "<img src='../img/circle_green.png' style='position:absolute; top:"+y+"px; left:"+x+"px; z-index:1000; width:7.5px; height:7.5px'>";
		$("#shape").HTML += "<input type='hidden' id='x"+num_click+"' value='"+x+"'><input type='hidden' id='y"+(num_click++)+"' value='"+y+"'>";
		document.getElementById("fp").innerHTML += overlay;
	});

    $(".btn-primary").click(function(event){
    	var b = $(event.target);
    	var form = b.parent();
    	var name = form.find("#add-name").val()
    	var altitude = form.find("#add-altitude").val()
    	var parent_area = form.find("#add-parent").val()
    	if (name == "") {
      		$error.text("Please enter a valid name.").show();
      		return;
    	} else if (!isNumeric(altitude)) {
     		$error.text("Please enter a valid altitude.").show();
      		return;
    	}
	    var area = {
	        name: name,
	        altitude: altitude,
	        parent: parent_area,
	        circle: false
	    }
    	var points= [];
    	var tiler-key;
    	var floor-plan;

    	for(var i = 0; i < num_click; i++)
    		points[i] = $("#x"+i).val() + " " + $("#y"+i).val();
    	area.shape = points;
    	$.post("http://localhost/SECe-v2.0/Web/addMapPolygon.php", area, areaDone); 
	});
});
