$(function(){
	$("#fp").click(function(event){
		var x = event.pageX;
		var y = event.pageY;
		var overlay = "<img src='../img/circle_green.png' style='position:absolute; top:"+y+"px; left:"+x+"px; z-index:1000; width:7.5px; height:7.5px'>";
		document.getElementById("fp").innerHTML += overlay;
	});
});
