<?php
$con = mysql_connect('localhost', 'root', '');
	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("secev2", $con);
	echo $_GET['fpid'];
		$update_grp_parents = "update groups set parent = 1 where parent = ".$_GET['fpid'].";";
	$update_poly_parents = "update polygons set parent = 1 where parent = ".$_Get['fpid'].";";
	$update_fp_parent = "update floor_plans set parent = 1 where parent = ".$_GET['fpid'].";";
	$result = mysql_query($update_grp_parents, $con);
	$result = mysql_query($update_poly_parents, $con);
	$result = mysql_query($update_fp_parent, $con);
	$fp_query = "delete from floor_plans where fpid = ".$_GET['fpid'].";";
	echo $fp_query."<br>";
	$fp_result = mysql_query($fp_query, $con);
	$obj_ids_query = "delete from obj_ids where id = ".$_GET['fpid'].";";
	echo $obj_ids_query."<br>";
	$obj_ids_result = mysql_query($obj_ids_query, $con);
	//header('Location: http://irtlaptop8.cs.columbia.edu/SECE-v2.0/Web/dashboard.php');
?>