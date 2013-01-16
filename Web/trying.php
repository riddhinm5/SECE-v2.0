<html>
<body>
<?php
echo "here<br>";
//echo _POST['key'];
$image = file_get_contents("http://overlaytilersece.appspot.com/download?key=ahJzfm92ZXJsYXl0aWxlcnNlY2VyDgsSB092ZXJsYXkY2jYM");
file_put_contents("overlay.zip", $image);
echo "all done<br>";
?>
</body>
</html>