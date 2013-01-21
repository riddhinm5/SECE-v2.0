$(function(){

    $( ".hover" ).draggable({
      connectToSortable: "#sortable",
      helper: "clone",
      revert: "invalid"
    });

    $(".hover").droppable({
     drop: function(event, ui) {
        	var child, parent, childKey, parentKey, childId, parentId, childType, parentType;
        	child = $(ui.draggable).attr("id");
        	parent = event.target.id; 
        	childKey = child.charAt(child.length-1);
        	parentKey = parent.charAt(parent.length-1);
        	
        	// Getting child details
        	if(child.indexOf("group") > -1) {
        		childType = "groups";
        		childId = $("#groupid"+childKey).val();
        	} 
        	else if(child.indexOf("fp") > -1) {
        		childType = "floor_plans";
        		childId = $("#fpid"+childKey).val();
        	} 
        	else {
        		childType = "polygons";
        		childId = $("#polyid"+childKey).val();
        	}

        	// Getting parent details
        	if(parent.indexOf("group") > -1) {
        		parentType = "group";
        		parentId = $("#groupid"+parentKey).val();
        	} 
        	else if(parent.indexOf("fp") > -1) {
        		parentType = "fp";
        		parentId = $("#fpid"+parentKey).val();
        	} 
        	else {
        		parentType = "polygon";
        		parentId = $("#polyid"+parentKey).val();
        	}
	        if(childId != 1) {
        		$.post("http://localhost/SECe-v2.0/Web/editParent.php", 
        				{childId:childId, childType:childType, parentId:parentId}, checkResults);

        	}
           }
	});

	$('.hover').hover( 
		function(){ $(this).css('background','#94B8FF');
					var id = $(this).attr("id");
					var key = id.charAt(id.length-1);
					if(id.indexOf("group") > -1) {
						var gid = $("#groupid"+key).val();
						$(this).children().append("<a class='icon-chevron-down' href='#' id='groupobj"+key+"' rel='popover' data-html='true' data-placement='bottom' data-content=\"<a href='addFloorPlans.php?parent="+gid+"'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='mapPolygon.php?parent="+gid+"'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?parent="+gid+"'><i class='icon-plus'></i>&nbspgroup</a><br><a href='deleteGroup.php?gid="+gid+"'><i class='icon-minus'></i>&nbspDelete</a>\" data-original-title='Options' data-trigger='click'><i class='icon-chevron-down'></i></a>");
						$(".icon-chevron-down").popover();
					}
					else if(id.indexOf("fp") > -1){
						var fpid = $("#fpid"+key).val();
						$(this).children().append("<a class='icon-chevron-down' href='#' id='fpobj"+key+"' class='btn btn-link' rel='popover' data-html='true' data-placement='bottom' data-original-title='Options' data-trigger='click' data-content=\"<a href='addFloorPlans.php?parent="+fpid+"'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='fpPolygon.php?parent="+fpid+"'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?parent="+fpid+"'><i class='icon-plus'></i>&nbspgroup</a><br><a href='deleteFp.php?fpid="+fpid+"'><i class='icon-minus'></i>&nbspDelete</a>\"><i class='icon-chevron-down'></i></a>");
						$(".icon-chevron-down").popover();
					} else if(id.indexOf("poly") > -1){
						var polyid = $("#polyid"+key).val();
						$(this).children().append("<a class='icon-chevron-down' href='#' id='polyobj"+key+"' class='btn btn-link' rel='popover' data-html='true' data-placement='bottom' data-original-title='Options' data-trigger='click' data-content=\"<a href='addFloorPlans.php?parent="+polyid+"'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='mapPolygon.php?parent="+polyid+"'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?parent="+polyid+"'><i class='icon-plus'></i>&nbspgroup</a><br><a href='deletePolygon.php?polyID="+polyid+"'><i class='icon-minus'></i>&nbspDelete</a>\"><i class='icon-chevron-down'></i></a>");
						$(".icon-chevron-down").popover();
					} else {
						var soid = $("#soid"+key).val();
						var lat = $("#solat"+key).val();
						var lng = $("#solng"+key).val();
						var alt = $("#soalt"+key).val();
						$(this).children().append("<a href=\"#\" id=\"smartobj"+key+"\" class=\"btn btn-link icon-chevron-down\" rel=\"popover\" data-html=\"true\" data-placement=\"bottom\" data-content=\"<a href='editSmartObjs.php?soid="+soid+"&lat="+lat+".&lng="+lng+"&alt="+alt+"'><i class='icon-pencil'></i>&nbspEdit</a><br><a href='#'><i class='icon-minus'></i>&nbspHide</a>\" data-original-title=\"Options\" data-trigger=\"click\"><i class='icon-chevron-down'></i></a>")
						$(".icon-chevron-down").popover();
					}
				}, 
		function(){ 
					$(".icon-chevron-down").popover('hide');
					$(this).css('background','white');
					var id = $(this).attr("id");
					$(".icon-chevron-down").remove(); 
				} 
	);
});

function checkResults(data){
	if(data.success = 'success') {
		alert("Parent updated!")
      window.location= "http://localhost/SECE-v2.0/Web/dashboard.php";
    } else {
      alert("Error adding area please try again");
    }
}