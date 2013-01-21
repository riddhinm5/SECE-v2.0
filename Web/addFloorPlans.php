<!DOCTYPE html>
<head>
  <link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.css" >
  <link rel="stylesheet" type="text/css" href="css/styles.css" >
	<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDB8hSxJc0O5AOlzvYVAle7ARvFENvFqbI&sensor=true&libraries=places">
    </script>
    <script type="text/javascript" src="js/floorPlans.js"></script>
    <script type="text/javascript" src="../bootstrap/js/bootstrap.js"></script>
    <script src="static/common.js"></script>
    <script src="static/editor.js"></script>
    <script src="static/widgets.js"></script>
    <script src="static/overlayeditor.js"></script>
    <script src="static/overlay.js"></script>
</head>
<body>
<?php
  $_SESSION['data'] = $_POST['data'];
  ?>
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
		<div class="row-fluid">
			<div id="sidebar" class="span3">
        <div id="area-editor">
          <div class="editor-form">
            Please enter the following information:<br>
            <input type="text" id="add-name" name='add-name' placeholder="Name"><br>
            <input type="text" id="add-altitude" name='add-altitude' placeholder="Altitude"><br>
            <input type='hidden' id="add-parent" name='add-parent' value=<?php echo "'".$_GET['parent']."'"?>></select><br>
            <div class="shape hide"></div>
            <a href="#" class="btn btn-primary">Save</a>
            <a href="#" class="btn btn-danger">Cancel</a>
          </div>
        </div>
      </div>
			<div class="span9" id="overlay-tiler">
        <div class="kd-appbar">
          <div id="kd-search">
            <input type="text">
            <a class="btn btn-primary" id="kd-searchbutton">search</a>
          </div>
        </div>
        <div id="container">
          <input type="hidden" value="http://localhost/SECE-v2.0/Web/overlays/file.jpg" id="upload-url">
          <div id="status">
            <p></p>
          </div>
          <div id="map-container">
            <div id="map">here</div>
          </div>
        </div>
	</div>
</body>
</html>