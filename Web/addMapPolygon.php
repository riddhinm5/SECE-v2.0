<html>
<body>
<?php
$userId = '11';//$_SESSION['userId'];
if( $_REQUEST['name'] )
{
	$name = $_REQUEST['name'];
	$altitude = $_REQUEST['altitude'];
	$parent = $_REQUEST['parent'];
	$is_circle = $_REQUEST['circle'];
	$circle = 0;
	$coord_string = null;
	
	if(strcmp($is_circle, "true") == 0) {
		$circle = 1;
		$center = $_REQUEST['center'];
		$radius = $_REQUEST['radius'];
	}
	else {
		$circle = 0;
		$shape = $_REQUEST['shape'];
		$radius = 0;
		$putRes = mysql_query($sql, $con);
		$size = 0;
		foreach ($shape as $key => $value) {
			$coord_string .= $value. ",";
			$size++;
		}
		$coord_string = substr($coord_string, 0, -1);
		if ($shape[0] != $shape[$size])
			$coord_string .= ",".$shape[0];
		echo $coord_string."<br>";
	}

	$con = mysql_connect('localhost', 'root', '');
	if (!$con)
	{
		die('Could not connect: ' . mysql_error());
	}

	mysql_select_db("secev2", $con);

	$select = "select * from obj_ids;";
	$selectResult = mysql_query($select, $con);
	$max = 1;
	while($selectRow = mysql_fetch_array($selectResult)){
		$max = max($max, (int)$selectRow['id']);
		echo "current_max".$max."<br>";
	}

	$newid = $max + 1;
	echo "new id".$newid."<br>";

	// obj_ids query order id, type
	$obj_ids = "insert into obj_ids values(".$newid.", 'polygon');";
	echo $obj_ids."<br>";
	$ins_ids = mysql_query($obj_ids, $con);
	// Insert query for polygons polyID, name, coords, parent, userId, circle, center, radius, altitude
	echo $coord_string."<br>";
	$insert_query = "insert into polygons values(".$newid.",'".$name."',PolygonFromText('POLYGON((".$coord_string."))'),'".$parent."',".$userId.",".$circle.",GeomFromText('POINT(".$center.")'),'".$radius."','".$altitude."');";
	echo $insert_query;
	$result = mysql_query($insert_query, $con);
	echo $result."<br>";
	if($result)
		$response_array['success'] = 'success';
}
?>
</body>
</html>
