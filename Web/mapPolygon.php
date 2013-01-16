<!DOCTYPE html>
<head>
  <link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.css" >
  <link rel="stylesheet" type="text/css" href="css/styles.css" >
	<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDB8hSxJc0O5AOlzvYVAle7ARvFENvFqbI&sensor=true&libraries=drawing">
    </script>
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
        <form class="form-search">
          <div class="input-append">
            <input type="text" class="search-query" id="location" placeholder="Search Location">
            <button type="submit" class="btn btn-primary" onclick="getAddress()"><i class="icon-search"></i></button>
          </div>
        </form>
        <br>
        <br>
        <div id="area-editor">
          <div class="editor-form">
            Please enter the following information:<br>
            <input type="text" id="add-name" placeholder="Name"><br>
            <input type="text" id="add-altitude" placeholder="Altitude"><br>
            <input type='hidden' id='add-parent' value='<?php echo $_GET['parent']?>'>
            <div class="error hide"></div>
            <a href="#" class="btn btn-primary">Save</a>
            <a href="#" class="btn btn-danger">Cancel</a>
          </div>
          <div class="success hide">
            Area was added!
          </div>
        </div>
			</div>
			<div class="span9">
        <div id="map-canvas"></div>
        <script type = "text/javascript" src = "js/map.js"></script>
        <script type = "text/javascript" src = "js/device-api.js"></script>
        <script type = "text/javascript" src = "js/area-map.js"></script>
        <script type = "text/javascript" src = "js/area-create.js"></script>
        <script type="text/javascript">
          (function() {
            Map.initializeMap("#map-canvas");
            AreaCreate.initialize();
            AreaCreate.start();
          })();
        </script>
		  </div>
		</div>
	</div>
</body>
</html>