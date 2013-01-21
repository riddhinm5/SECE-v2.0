<!DOCTYPE html>
<head>
  <link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.css" >
  <link rel="stylesheet" type="text/css" href="css/styles.css" >
	<script type="text/javascript" src="js/jquery-1.7.1.js"></script>
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyAECqGYTwjGNSQcRBRGGm3jy5B4cDhVLqE&sensor=true">
    </script>
    <script type="text/javascript" src="js/dashboard.js"></script>
    <script type="text/javascript" src="../bootstrap/js/bootstrap.js"></script>
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
                          // columns for polygons: polyID, name, coords, parent, UserId, circle, center, radius, altitude
                          $poly_query = "select polyID,name,cast(AsText(coords) as char) AS coords,parent,circle,cast(AsText(center) as char) AS center,radius,altitude from polygons where userId = '11';";
                          //"select * from groups where userID = '11';"; //. $_SESSION['userid']."';";
                          // columns for groups: gid, location, parent, UserId, name
                          $groups_query = "select gid,cast(AsText(location) as char) AS location,parent,name from groups where userID = '11';"; //. $_SESSION['userid']."';";
                          // columns for floor plans: fpid, name, file_path, parent, UserId, tiler_key, pixbounds, latlngbounds
                          $fp_query = "select fpid,name,tiler_key, file_path,cast(AsText(pixbounds) as char) AS coords,parent from floor_plans where userID = '11';"; //. $_SESSION['userid']."';";
                          
                          $groups_result = mysql_query($groups_query, $con);
                          $poly_result = mysql_query($poly_query, $con);
                          $fp_result = mysql_query($fp_query, $con);
                          
                          $i = 0;
                          $parents;
                          $all_rows;
                          $j = 0; $k = 0; $l = 0;

                          while($row = mysql_fetch_array($groups_result)){
                            $all_rows[$row['gid']]['name'] = $row['name'];
                            $all_rows[$row['gid']]['coords'] = $row['location'];
                            $all_rows[$row['gid']]['coords'] = str_replace(" ", "+", $all_rows[$row['gid']]['coords']);
                            $all_rows[$row['gid']]['radius'] = 0;
                            $all_rows[$row['gid']]['parent'] = $row['parent'];
                            $all_rows[$row['gid']]['file_path'] = '';
                            $all_rows[$row['gid']]['type'] = "group";
                            $parents[$row['gid']] = $row['parent'];
                            $i++;
                          }
                          $crap;
                          while($row = mysql_fetch_array($poly_result)){
                            $all_rows[$row['polyID']]['name'] = $row['name'];
                            $all_rows[$row['polyID']]['coords'] = $row['coords'];
                            if ($row['circle'] == 0) {
                              $all_rows[$row['polyID']]['coords'] = str_replace(" ", "+", $all_rows[$row['polyID']]['coords']);
                              $all_rows[$row['polyID']]['radius'] = 0;
                            }
                            else {
                              $all_rows[$row['polyID']]['coords'] = str_replace(" ","+", $row['center']);
                              $all_rows[$row['polyID']]['radius'] = $row['radius'];
                            }
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
                            $all_rows[$row['fpid']]['coords'] = str_replace(" ", "+", $all_rows[$row['fpid']]['coords']);
                            $all_rows[$row['fpid']]['parent'] = $row['parent'];
                            $all_rows[$row['fpid']]['file_path'] = $row['tiler_key'];
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
                              echo "<li class = 'pop-up'><a href='#' id='groupobj".$j."' class='btn btn-link' rel='popover' data-html='true' data-placement='bottom' data-content=\"<a href='addFloorPlans.php?parent=".$key."'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='mapPolygon.php?parent=".$key."'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?parent=".$key."'><i class='icon-plus'></i>&nbspgroup</a><br><a href='deleteGroup.php?gid=".$key."'><i class='icon-minus'></i>&nbspDelete</a>\" data-original-title='Options' data-trigger='click'>" . $all_rows[$key]['name'] . "</a></li>";
                              echo "<input type='hidden' id='groupobj".$j."' value=".$all_rows[$key]['coords'].">";
                              echo "<script type='text/javascript'>";
                              echo "$('#groupobj".$j++."').popover();";
                              echo "</script>";
                            }
                            // Handle floor plans
                            else if(strcmp($all_rows[$key]['type'], "fp") == 0) {
                              if ($all_rows[$key]['parent'] == $prev_obj)
                                echo "<ul>";
                              else if ($all_rows[$key]['parent'] != $all_rows[$prev_obj]['parent'])
                                echo "</ul>";
                               echo "<li class = 'pop-up'><a href='#' id='fpobj".$k."' class='btn btn-link' rel='popover' data-html='true' data-placement='bottom' data-original-title='Options' data-trigger='click' data-content=\"<a href='addFloorPlans.php?parent=".$key."'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='fpPolygon.php?parent=".$key."'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?parent=".$key."'><i class='icon-plus'></i>&nbspgroup</a><br><a href='deleteFp.php?fpid=".$key."'><i class='icon-minus'></i>&nbspDelete</a>\">". $all_rows[$key]['name'] . "</a></li>";
                                echo "<input type='hidden' id='fpid".$k."' value=".$key.">";
                                echo "<input type='hidden' id='fpname".$k."' value=".str_replace(" ","+", $all_rows[$key]['name']).">";
                                echo "<input type='hidden' id='fppath".$k."' value=".$all_rows[$key]['file_path'].">";
                                echo "<input type='hidden' id='fpcoords".$k."' value=".$all_rows[$key]['coords'].">";
                                echo "<script type='text/javascript'>";
                                echo "$('#fpobj".$k++."').popover();";
                                echo "</script>";
                             }
                            // Handle polygons
                            else {
                               if ($all_rows[$key]['parent'] == $prev_obj)
                                echo "<ul>";
                              else if ($all_rows[$key]['parent'] != $all_rows[$prev_obj]['parent'])
                                echo "</ul>";
                                echo "<li class = 'pop-up'><a href='#' id='polyobj".$l."' class='btn btn-link' rel='popover' data-html='true' data-placement='bottom' data-original-title='Options' data-trigger='click' data-content=\"<a href='addFloorPlans.php?parent=".$key."'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='mapPolygon.php?parent=".$key."'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='addGroup.php?parent=".$key."'><i class='icon-plus'></i>&nbspgroup</a><br><a href='deletePolygon.php?polyID=".$key."'><i class='icon-minus'></i>&nbspDelete</a>\">". $all_rows[$key]['name'] . "</a></li>";
                                echo "<input type='hidden' id='polyid".$l."' value=".$key.">";
                                echo "<input type='hidden' id='polyname".$l."' value=".str_replace(" ","+",$all_rows[$key]['name']).">";
                                echo "<input type='hidden' id='polyradius".$l."' value=".$all_rows[$key]['radius'].">";
                                echo "<input type='hidden' id='polycoords".$l."' value=".$all_rows[$key]['coords'].">";
                                echo "<script type='text/javascript'>";
                                echo "$('#polyobj".$l++."').popover();";
                                echo "</script>";
                             }
                              $prev_obj = $key;
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
                        <li class="pop-up"><a href='#' id="grp-root" class="btn btn-link" rel="popover" data-html="true" data-placement="bottom" data-content="<a href='#'><i class='icon-plus'></i>&nbspFloor Plan</a><br><a href='#'><i class='icon-plus'></i>&nbspPolygon</a><br><a href='#'><i class='icon-plus'></i>&nbspgroup</a>" data-original-title="Options" data-trigger="click">ROOT</a>
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
                        <?php
                          $con = mysql_connect('localhost', 'root', '');
                          if (!$con)
                          {
                            die('Could not connect: ' . mysql_error());
                          }

                          mysql_select_db("secev2", $con);
                          
                          // Getting all the groups, polygons & floor_plans that belong to the user
                          $smartobjs_query = "select * from smart_objs where userID = '11';";
                          $smartobjs_result = mysql_query($smartobjs_query, $con);
                          
                          $smart_objs;
                          $i = 0;
                          $all_rows;

                          while($row = mysql_fetch_array($smartobjs_result)){
                            $all_rows[$row['soid']]['name'] = $row['name'];
                            $all_rows[$row['soid']]['latitude'] = $row['latitude'];
                            $all_rows[$row['soid']]['longitude'] = $row['longitude'];
                            $all_rows[$row['soid']]['altitude'] = $row['altitude'];
                            $all_rows[$row['soid']]['alt_acc'] = $row['alt_acc'];
                            $all_rows[$row['soid']]['loc_acc'] = $row['lat_lng_acc'];
                            $all_rows[$row['soid']]['status'] = $row['status'];
                            $smart_objs[$i] = $row['soid'];
                            $i++;
                          }
                          $i = 0;
                          echo "<li>Located SmartObjects</li>";
                          echo "<ul>";
                          foreach ($smart_objs as $key => $value) {
                            if ($all_rows[$value]['loc_acc'] <= 10 && $all_rows[$value]['status'] != 0) {
                              echo "<li><a href=\"#\" id=\"smartobj".$value."\" class=\"btn btn-link\" rel=\"popover\" data-html=\"true\" data-placement=\"bottom\" data-content=\"<a href='editSmartObjs.php'><i class='icon-pencil'></i>&nbspEdit</a><br><a href='#'><i class='icon-minus'></i>&nbspHide</a>\" data-original-title=\"Options\" data-trigger=\"click\">".$all_rows[$value]['name']."</a></li>";
                              echo "<input type = 'hidden' id = \"soid".$i."\" value = ".$value.">";
                              echo "<input type = 'hidden' id = \"soname".$i."\" value = ".$all_rows[$value]['name'].">";
                              echo "<input type = 'hidden' id = \"solat".$i."\" value = ".$all_rows[$value]['latitude'].">";
                              echo "<input type = 'hidden' id = \"solng".$i."\" value = ".$all_rows[$value]['longitude'].">";
                              echo "<input type = 'hidden' id = \"soalt".$i."\" value = ".$all_rows[$value]['altitude'].">";
                              echo "<input type = 'hidden' id = \"solocacc".$i."\" value = ".$all_rows[$value]['loc_acc'].">";
                              echo "<script type='text/javascript'>";
                              echo "$('#smartobj".$value."').popover();";
                              echo "</script>";
                              $i++;
                            }
                          }
                          echo "</ul><br>";
                          echo "<li>Inaccurate SmartObjects</li>";
                          echo "<ul>";
                          foreach ($smart_objs as $key => $value) {
                            if ($all_rows[$value]['loc_acc'] > 10 && $all_rows[$value]['status'] != 0){
                              echo "<li><a href=\"#\" id=\"smartobj".$value."\" class=\"btn btn-link\" rel=\"popover\" data-html=\"true\" data-placement=\"bottom\" data-content=\"<a href='editSmartObjs.php?soid=".$value."&lat=".$all_rows[$value]['latitude'].".&lng=".$all_rows[$value]['longitude']."&alt=".$all_rows[$value]['altitude']."'><i class='icon-pencil'></i>&nbspEdit</a><br><a href='hideSmartObj.php?soid=".$value."'><i class='icon-minus'></i>&nbspHide</a>\" data-original-title=\"Options\" data-trigger=\"click\">".$all_rows[$value]['name']."</a></li>";
                              echo "<input type = 'hidden' id = \"soid".$i."\" value = ".$value.">";
                              echo "<input type = 'hidden' id = \"soname".$i."\" value = ".$all_rows[$value]['name'].">";
                              echo "<input type = 'hidden' id = \"solat".$i."\" value = ".$all_rows[$value]['latitude'].">";
                              echo "<input type = 'hidden' id = \"solng".$i."\" value = ".$all_rows[$value]['longitude'].">";
                              echo "<input type = 'hidden' id = \"soalt".$i."\" value = ".$all_rows[$value]['altitude'].">";
                              echo "<input type = 'hidden' id = \"solocacc".$i."\" value = ".$all_rows[$value]['loc_acc'].">";
                              echo "<script type='text/javascript'>";
                              echo "$('#smartobj".$value."').popover();";
                              echo "</script>";
                              $i++;
                            }
                          }
                          echo "</ul>";
                          echo "</ul>";
                        ?>
                    </div>
                  </div>
                </div>
        </div>
			</div>
			<div class="span9" id="map">
			</div>
		</div>
	</div>
</body>
</html>