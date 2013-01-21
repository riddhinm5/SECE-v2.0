<?php
$con = mysql_connect('localhost', 'root', '');
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("secev2", $con);

// Getting all the groups, polygons & floor_plans that belong to the user
$smartobjs_query = "update smart_objs set status = 0 where soid = ".$_GET['soid'].";";
$smartobjs_result = mysql_query($smartobjs_query, $con);
//header("location: http://irtlaptop8.cs.columbia.edu/SECE-v2.0/Web/dashboard.php");
?>