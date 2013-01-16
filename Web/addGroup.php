<!DOCTYPE html>
<head>
  <link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.css" >
  <link rel="stylesheet" type="text/css" href="css/styles.css" >
	<script type="text/javascript" src="http://api.jquery.com/jQuery.noConflict/"></script>
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDB8hSxJc0O5AOlzvYVAle7ARvFENvFqbI&sensor=true">
    </script>
    <script type="text/javascript" src="js/dashboard.js"></script>
    <script type="text/javascript" src="../bootstrap/js/bootstrap.js"></script>
</head>
<body>
	<div class="navbar">
		<div class="navbar-inner">
			<div class="container-fluid">
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
        <div class="accordion" id="accordion2">
          <div class="accordion-group">
                  <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseOne">
                      My Floor Plans
                    </a>
                  </div>
                  <div id="collapseOne" class="accordion-body in collapse" style="height: auto;">
                    <div class="accordion-inner">
                        <?php 
                          session_start();
                          $con = mysql_connect('localhost', 'root', '');
                          if (!$con)
                          {
                            die('Could not connect: ' . mysql_error());
                          }

                          mysql_select_db("secev2", $con);
                          
                          // Getting all the groups, polygons & floor_plans that belong to the user
                          $groups_query = "select * from groups where userID = '11';"; //. $_SESSION['userid']."';";
                          $poly_query = "select * from polygons where userID = '11';"; //. $_SESSION['userid']."';";
                          $fp_query = "select * from floor_plans where userID = '11';"; //. $_SESSION['userid']."';";
                          
                          $groups_result = mysql_query($groups_query, $con);
                          $poly_result = mysql_query($poly_query, $con);
                          $fp_result = mysql_query($fp_query, $con);
                          
                          $i = 0;
                          $parents;
                          $all_rows;
                          $j = 0;

                          while($row = mysql_fetch_array($groups_result)){
                            $all_rows[$row['gid']]['name'] = $row['name'];
                            $all_rows[$row['gid']]['coords'] = $row['location'];
                            $all_rows[$row['gid']]['parent'] = $row['parent'];
                            $all_rows[$row['gid']]['file_path'] = '';
                            $all_rows[$row['gid']]['type'] = "group";
                            $parents[$row['gid']] = $row['parent'];
                            $i++;
                          }
                          while($row = mysql_fetch_array($poly_result)){
                            $all_rows[$row['polyID']]['name'] = $row['name'];
                            $all_rows[$row['polyID']]['coords'] = $row['coords'];
                            $all_rows[$row['polyID']]['parent'] = $row['parent'];
                            $all_rows[$row['polyID']]['file_path'] = '';
                            $all_rows[$row['polyID']]['type'] = "polygon";
                            $all_rows[$row['polyID']]['name']."<br>";
                            $parents[$row['polyID']] = $row['parent'];
                            $i++;
                          }
                          while($row = mysql_fetch_array($fp_result)){
                            $all_rows[$row['fpid']]['name'] = $row['name'];
                            $all_rows[$row['fpid']]['coords'] = $row['coords'];
                            $all_rows[$row['fpid']]['parent'] = $row['parent'];
                            $all_rows[$row['fpid']]['file_path'] = $row['file_path'];
                            $all_rows[$row['fpid']]['type'] = "fp";
                            $all_rows[$row['fpid']]['name']."<br>";
                            $parents[$row['fpid']] = $row['parent']; 
                            $i++;
                          }
                          echo "<input type='hidden' id='numobjs' value=".$i."><br>";
                          // Display all objects in the database within the tree structure
                          $prev_obj = 1;
                          asort($parents);
                          
                          echo "<ul class=\"my-floor-plans\">";
                          foreach ($parents as $key => $value) {
                            // Handle Groups
                            if(strcmp($all_rows[$key]['type'], "group") == 0) {
                              if ($all_rows[$key]['parent'] == $prev_obj)
                                echo "<ul>";
                              else if ($all_rows[$key]['parent'] != $all_rows[$prev_obj]['parent'])
                                echo "</ul>";
                              echo "<li class = 'pop-up'><a href='#' id='groupobj".$j."' class='btn btn-link' rel='popover' data-html='true' data-placement='right' data-content=\"<a href='addFloorPlan.html'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='mapPolygon.php?parent=".$key."'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?parent=".$key."'><i class='icon-plus'></i>&nbspgroup</a>\" data-original-title='Options' data-trigger='click'>" . $all_rows[$key]['name'] . "</a></li>";
                              echo "<script type='text/javascript'>";
                              echo "$('#groupobj".$j."').popover();";
                              echo "</script>";
                            }
                            // Handle floor plans
                            else if(strcmp($all_rows[$key]['type'], "fp") == 0) {
                              if ($all_rows[$key]['parent'] == $prev_obj)
                                echo "<ul>";
                              else if ($all_rows[$key]['parent'] != $all_rows[$prev_obj]['parent'])
                                echo "</ul>";
                               echo "<li class = 'pop-up'><a href='#' id='fpobj".$j."' class='btn btn-link' rel='popover' data-html='true' data-placement='right' data-original-title='Options' data-trigger='click' data-content=\"<a href='#'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='fpPolygon.php?parent=".$key."'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?parent=".$key."'><i class='icon-plus'></i>&nbspgroup</a>\">". $all_rows[$key]['name'] . "</a></li>";
                                echo "<script type='text/javascript'>";
                                echo "$('#fpobj".$j."').popover();";
                                echo "</script>";
                             }
                            // Handle polygons
                            else {
                               if ($all_rows[$key]['parent'] == $prev_obj)
                                echo "<ul>";
                              else if ($all_rows[$key]['parent'] != $all_rows[$prev_obj]['parent'])
                                echo "</ul>";
                               echo "<li class = 'pop-up'><a href='#' id='polyobj".$j."' class='btn btn-link' rel='popover' data-html='true' data-placement='right' data-original-title='Options' data-trigger='click' data-content=\"<a href='#'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='mapPolygon.php?parent=".$key."'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?".$key."'><i class='icon-plus'></i>&nbspgroup</a>\">". $all_rows[$key]['name'] . "</a></li>";
                                echo "<script type='text/javascript'>";
                                echo "$('#polyobj".$j."').popover();";
                                echo "</script>";
                             }
                              $prev_obj = $key;
                              $j++;
                           }

                           echo "</ul>";
                          echo $_SESSION['data']."<br>";
                        ?>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="accordion-group">
                  <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseTwo">
                      Group Floor Plans
                    </a>
                  </div>
                  <div id="collapseTwo" class="accordion-body collapse" style="height: 0px;">
                    <div class="accordion-inner">
                      <ul class="grp-floor-plans">
                        <li class="pop-up"><a href='#' id="grp-root" class="btn btn-link" rel="popover" data-html="true" data-placement="right" data-content="<a href='#'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='#'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='#'><i class='icon-plus'></i>&nbspgroup</a>" data-original-title="Options" data-trigger="click">ROOT</a>
                          <ul>
                            <li class="poop-up">CEPSR</li>
                              <ul>
                                <li class="pop-up">IRT Lab</li>
                                <li class="pop-up">Corridoor</li>
                              </ul>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="accordion-group">
                  <div class="accordion-heading">
                    <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapseThree">
                      SmartObjects
                    </a>
                  </div>
                  <div id="collapseThree" class="accordion-body collapse" style="height: 0px;">
                    <div class="accordion-inner">
                      <ul class="smart-objects">
                        <li>Located SmartObjects</li>
                          <ul>
                            <li>
                            <a href="#" id="fridge" class="btn btn-link" rel="popover" data-html="true" data-placement="right" data-content="<a href='#'><i class='icon-pencil'></i>&nbspEdit</a><br><a href='#'><i class='icon-minus'></i>&nbspHide</a>" data-original-title="Options" data-trigger="click">Fridge</a></li>
                            <li>TV</li>
                          </ul>
                        <li>Inaccurate SmartObjects</li>
                      </ul>
                    </div>
                  </div>
                </div>
        </div>
			</div>
			<div class="span9">
        <form class="form-horizontal" method="post" action="addingGroup.php">
          <div class="control-group">
            <?php
              echo "<input type='hidden' id='grpparent' name='grpparent' value=".$_GET['parent'].">"
            ?>
            <label class="control-label" for="inputName">Name</label>
            <div class="controls">
              <input type="text" id="inputName" placeholder="Group Name" name="grpname">
            </div>
          </div>
          <div class="control-group">
            <label class="control-label" for="inputAltitude">Altitude</label>
            <div class="controls">
              <input type="text" id="inputAltitude" placeholder="Altitude" name="grpaltitude">
            </div>
          </div>
          <div class="control-group">
            <div class="controls">
              <button type="submit" class="btn">Submit</button>
            </div>
          </div>
        </form>
		  </div>
		</div>
	</div>
</body>
</html>