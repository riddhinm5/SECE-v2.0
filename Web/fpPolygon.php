<!DOCTYPE html>
<head>
  <link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.css" >
  <link rel="stylesheet" type="text/css" href="css/styles.css" >
	<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDB8hSxJc0O5AOlzvYVAle7ARvFENvFqbI&sensor=true">
    </script>
    <script type="text/javascript" src="js/fpPolygon.js"></script>
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
					<li class="active"><a href="dashboard.php">Geoloc</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span3">
        <div id="area-editor">
          <div class="editor-form">
            Please enter the following information:<br>
            <input type="text" id="add-name" placeholder="Name"><br>
            <input type="text" id="add-altitude" placeholder="Altitude"><br>
            <input type='hidden' id="add-parent" value=<?php echo "'".$_GET['parent']."'"?>></select><br>
            <div class="shape hide"></div>
            <a href="#" class="btn btn-primary">Save</a>
            <a href="#" class="btn btn-danger">Cancel</a>
          </div>
          <div class="success hide">
            Area was added!
          </div>
        </div>
			</div>
			<div class="span9">
        <div id="fp">
          <canvas id="myCanvas" style="background: url('../img/fo2-01-base.gif')no-repeat; height:500px; width:100%;"></canvas>
        </div>
		  </div>
		</div>
	</div>
</body>
</html>