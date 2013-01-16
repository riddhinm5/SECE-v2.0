<?php
echo $_POST['soid']."<br>";
echo $_POST['newlat']."<br>";
$con = mysql_connect('localhost', 'root', '');
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("secev2", $con);

// Getting all the groups, polygons & floor_plans that belong to the user
$smartobjs_query1 = "update smart_objs set latitude = ".$_POST['newlat']."where soid = ".$_POST['soid'].";";
$smartobjs_query2 = "update smart_objs set longitude = ".$_POST['newlng']."where soid = ".$_POST['soid'].";";
$smartobjs_query3 = "update smart_objs set lat_lng_acc = 0 where soid = ".$_POST['soid'].";";
echo $smartobjs_query."<br>";
$smartobjs_result = mysql_query($smartobjs_query1, $con);
$smartobjs_result = mysql_query($smartobjs_query2, $con);
$smartobjs_result = mysql_query($smartobjs_query3, $con);
header("location: dashboard.php");
?>