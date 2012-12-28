(function(exports) {
  var am = exports;
  var mapAreas = {};
  var visible = false, altitude = -1;
  var extraGenerator = null, searchText = "";

  am.setExtra = function(e) {
    extraGenerator = e;
  }

  am.currentAreas = function() {
    return mapAreas;
  }

  am.search = function(text) {
    searchText = text;
    update();
  }

  am.clearAreas = function() {
    am.setMap(null);
    mapAreas = {};
  }

  am.setAltitude = function(alt) {
    altitude = alt;
    update();
  }

  function update() {
    am.toggle(visible);
  }

  function inSearchResults(area) {
    if(!visible) {
      return false;
    } else if(altitude != -1 && (area.altitude > altitude + 5 || area.altitude < altitude - 5)) {
      return false;
    } else if(area.name.indexOf(searchText) == -1) {
      return false;
    }
    return true;
  }

  am.setMap = function(m) {
    for (i in mapAreas) {
      var visible = inSearchResults(mapAreas[i].area);
      if(visible && m != null) {
        mapAreas[i].overlay.setMap(m);
        if(mapAreas[i].extra != null) {
          mapAreas[i].extra.show();
        }
      } else {
        am.removeArea(mapAreas[i].area, false);
      }
    }
  }

  am.removeArea = function(area, deleteIt) {
    mapAreas[area.id].overlay.setMap(null);
    if(mapAreas[area.id].extra != null) {
      mapAreas[area.id].extra.hide();
    }

    if(deleteIt) {
      if(mapAreas[area.id].extra != null) {
        mapAreas[area.id].extra.remove();
      }
      
      delete mapAreas[area.id];
    }
  }

  am.addArea = function(area) {
    var pOverlay = null;
    if(area.circle) {
      pOverlay = new google.maps.Circle({
        center: new google.maps.LatLng(area.center_point.lat, area.center_point.lng),
        radius: area.radius,
        map: inSearchResults(area) ? Map.objs.map : null
      });
    } else {
      var points = new google.maps.MVCArray();
      $(area.shape_points).each(function(i, pt) {
        points.push(new google.maps.LatLng(pt.lat, pt.lng)); 
      });
      pOverlay = new google.maps.Polygon({
        paths: points,
        map: inSearchResults(area) ? Map.objs.map : null
      });
    }

    pOverlay.setOptions({
      clickable: false,
      fillColor: '#FF0000',
      strokeColor: '#BBB'
    });

    var extra = (extraGenerator == null) ? null : extraGenerator(area);
    if(extra != null && !inSearchResults(area)) {
      extra.hide();
    }

    mapAreas[area.id] = {
      area: area,
      overlay: pOverlay,
      extra: extra
    };
  }

  am.drawAreas = function(areas) {
    $(areas).each(function(i, area) {
      area = area.area;

      if(!(area.id in mapAreas)) {
        am.addArea(area);
      }
    });
  }

  am.toggle = function(v) {
    if(typeof v === "undefined") v = !visible;

    visible = v;

    if(v) {
      am.setMap(Map.objs.map);
    } else {
      am.setMap(null);
    }
  }
})(AreaMap = {});
