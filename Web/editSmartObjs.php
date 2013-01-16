<html>
	<head>
		<link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.css" >
  		<link rel="stylesheet" type="text/css" href="css/styles.css" >
		<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDB8hSxJc0O5AOlzvYVAle7ARvFENvFqbI&sensor=true"></script>
    	<script type="text/javascript" src="js/editSmartObjs.js"></script>
    	<script type="text/javascript" src="../bootstrap/js/bootstrap.js"></script>
	</head>
	<body>
		<div class="navbar">
			<div class="navbar-inner">
				<div class="container">
					<ul class="nav">
						<li><a class="brand" href="#">SECE</a></li>
						<li><a href="#">Devices</a></li>
						<li><a href="#">Rules</a></li>
						<li class="active"><a href="#">Geoloc</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="container-fluid">
			<div id = "submit">
				<div id = 'placeObj'></div>
			</div>
			<div class="row-fluid">
				<div id="map" class="span6">
				</div>
				<div id = "floor-plans" class = "span6">
					<?php
					echo "<input type='hidden' id='soid' value=".$_GET['soid'].">";
					echo "<input type='hidden' id='lat' value=".$_GET['lat'].">";
					echo "<input type='hidden' id='lng' value=".$_GET['lng'].">";
					echo "<input type='hidden' id='alt' value=".$_GET['alt'].">";
					?>
				</div>
			</div>
		</div>
	</body>
</html>