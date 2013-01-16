<html>
<head>

</head>
<body>

<?php 
session_start();
echo "<h3>Placing object</h3>";
$userid = '11';//$_SESSION['userid'];
echo $_POST['grpname']."<br>";
echo $_POST['grpaltitude']."<br>";
echo $_POST['grpparent']."<br>";

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
$obj_ids = "insert into obj_ids values(".$newid.", 'group');";
echo $obj_ids."<br>";
$ins_ids = mysql_query($obj_ids, $con);

// groups query order gid, location, parent, userid, name
$sql = "insert into groups values(".$newid.",'',".$_POST['grpparent'].", ".$userid.",'".$_POST['grpname']."');";
echo $sql ."<br>";
$putRes = mysql_query($sql, $con);

header('Location: dashboard.php');
mysql_close($con);

?>
</form>
</body>
</html>
