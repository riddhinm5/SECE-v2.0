<?php
$con = mysql_connect('localhost', 'root', '');
	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("secev2", $con);
	echo $_GET['polyID'];
	$update_grp_parents = "update groups set parent = 1 where parent = ".$_GET['polyID'].";";
	$update_poly_parents = "update polygons set parent = 1 where parent = ".$_Get['polyID'].";";
	$update_fp_parent = "update floor_plans set parent = 1 where parent = ".$_GET['polyID'].";";
	$result = mysql_query($update_grp_parents, $con);
	$result = mysql_query($update_poly_parents, $con);
	$result = mysql_query($update_fp_parent, $con);

	$poly_query = "delete from polygons where polyID = ".$_GET['polyID'].";";
	echo $poly_query."<br>";
	$poly_result = mysql_query($poly_query, $con);
	$obj_ids_query = "delete from obj_ids where id = ".$_GET['polyID'].";";
	echo $obj_ids_query."<br>";
	$obj_ids_result = mysql_query($obj_ids_query, $con);
	//header('Location: http://irtlaptop8.cs.columbia.edu/SECE-v2.0/Web/dashboard.php');
?>