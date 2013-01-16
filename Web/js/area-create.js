(function(exports) {
  var ac = exports;
  var $editor = null;
  var dm = null, overlayType = null, overlay = null, infoWindow = null, infoWindowContent = null;
  var currentParent = null;

  ac.initialize = function() {
    $editor = $("#area-editor");
    $(".btn-danger").live('click', cancelOverlay);
    $(".btn-primary").live('click', saveOverlay);

    dm = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      }
    });

    google.maps.event.addListener(dm, 'overlaycomplete', doneDrawing);
    
    AreaMap.toggle(true);
  }

  ac.start = function() {
    overlayType = overlay = infoWindow = infoWindowContent = currentParent = null;
    Map.setDrawingManager(dm);
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function getBounds(o) {
    if(typeof o.getBounds !== "undefined")
      return o.getBounds();

    var bounds = new google.maps.LatLngBounds();
    var points = o.getPath();
    
    points.forEach(function(p) {
      bounds.extend(p);
    });

    return bounds;
  }

  function makeid(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return "c" + text;
  }

  function fillParentSelect(data, parentClass) {
    var $sel = $("." + parentClass);
    var html = '<option value="-1">(None)</option>';

    if(data.length == 0) {
      $sel.html(html).hide();
      return;
    }

    AreaMap.drawAreas(data);

    $(data).each(function(i, el) {
      var area = el.area;
      html += '<option value="' + area.id + '">' + area.name + '</option>';
    });
    $sel.html(html);
  }

  function selectParent(e) {
    var id = $(e.target).val();
    if(currentParent != null) {
      currentParent.overlay.setOptions({
        clickable: false,
        fillColor: '#DDD',
        strokeColor: '#BBB'
      });
    }

    if(id != -1) {
      currentParent = AreaMap.currentAreas()[id];
      currentParent.overlay.setOptions({
        clickable: false,
        fillColor: '#00DD00',
        strokeColor: '#BBB'
      });
    } else {
      currentParent = null;
    }
  }

  function doneDrawing(event) {
    overlay = event.overlay;
    overlayType = event.type;

    overlay.setOptions({ zIndex: 10000 });

    var bounds = getBounds(overlay);

    dm.setOptions({
      drawingControl: false,
      drawingMode: null 
    });

    var content = $editor.clone();
    var parentClass = makeid(10);
    content.find("#add-parent").addClass(parentClass);
   // $("." + parentClass).live('change', selectParent);
// Changing the display by removing infowindow, adding form on side bar instead
    //infoWindow = new google.maps.InfoWindow({
     // content: content.html(),
     // position: bounds.getCenter()
    //});

    //google.maps.event.addListener(infoWindow, 'closeclick', cancelOverlay);
    /*google.maps.event.addListener(infoWindow, 'domready', function() {
      AreaMap.clearAreas();
      DeviceAPI.getAreas({
        n: bounds.getNorthEast().lat(),
        e: bounds.getNorthEast().lng(),
        s: bounds.getSouthWest().lat(),
        w: bounds.getSouthWest().lng()
      },
      function(data) {
          fillParentSelect(data, parentClass);
      });
    });
*/
    //infoWindow.open(Map.objs.map);
  }

  function cancelOverlay() {
    infoWindow.close();

    overlay.setMap(null);
    dm.setOptions({ drawingControl: true });

    AreaMap.clearAreas();
    currentParent = null;

    overlay = null;
    overlayType = null;
  }

  function saveOverlay(e) {
    var b = $(e.target);
    var form = b.parent();
    //infoWindowContent = form.parent();
    var $error = form.find(".error");

    $error.hide();
    b.show();
    
    var name = form.find("#add-name").val()
    var altitude = form.find("#add-altitude").val()
    var parent_area = $("#add-parent").val()
    alert(parent_area);
    if (name == "") {
      $error.text("Please enter a valid name.").show();
      return;
    } else if (!isNumeric(altitude)) {
      $error.text("Please enter a valid altitude.").show();
      return;
    }

    var area = {
        name: name,
        altitude: altitude,
        parent: parent_area,
        circle: (overlayType == "circle")
    }
    alert(area.parent);
    if(area.circle) {
        alert(overlay.getCenter());
        var c = overlay.getCenter();
        area.center = c.lng() + " " + c.lat();
        area.radius = overlay.radius;
    } else if (overlayType == 'rectangle') {
        var bnds = overlay.getBounds();
        var ne = bnds.getNorthEast();
        var sw = bnds.getSouthWest();
        var points = [
          ne.lng() + " " + ne.lat(),
          ne.lng() + " " + sw.lat(),
          sw.lng() + " " + sw.lat(),
          sw.lng() + " " + ne.lat(),
          ne.lng() + " " + ne.lat()
        ];
        alert(points[0]);
        area.shape = points;
    } else {
        var points = [];
        overlay.getPath().forEach(function(p) {
          points.push(p.lng() + " " + p.lat());
        });
        area.shape = points;
        alert(points[0]);
    }
    alert(area.name);
    DeviceAPI.addArea(area, areaDone, "from saveOverlay");
    b.hide();
  }

  function areaDone(data) {
    if(data.success = 'success') {
      alert("area added successfully!");
      window.location= "http://localhost/SECe-v2.0/Web/dashboard.php";
    } else {
      alert("Error adding area please try again");
    }
  }
})(AreaCreate = {});
