<?php
echo $_POST['childId']."<br>";
echo $_POST['childType']."<br>";
echo $_POST['parentId']."<br>";

$con = mysql_connect('localhost', 'root', '');
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("secev2", $con);
$update_query;
if(strcmp($_POST['childType'], "groups") == 0)
	$update_query = "update groups set parent = ".$_POST['parentId']." where gid = ".$_POST['childId'].";";
else if(strcmp($_POST['childType'], "polygons") == 0)
	$update_query = "update polygons set parent = ".$_POST['parentId']." where polyID = ".$_POST['childId'].";";
else
	$update_query = "update floor_plans set parent = ".$_POST['parentId']." where fpid = ".$_POST['childId'].";";
echo $update_query;
$result = mysql_query($update_query, $con);
echo $result."<br>";
if($result)
	$response_array['success'] = 'success';
?>