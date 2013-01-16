(function(exports) {
  var dapi = exports;
  var host = "irtlaptop8.cs.columbia.edu", port = 3000;
  var apiurl = "http://" + host + ":" + port + "/";

  dapi.getURL = function() {
    return apiurl;
  }

  dapi.getDevices = function(data, callback) {
    $.getJSON(apiurl + "devices.js?callback=?", data, callback); 
  }

  dapi.getAreas = function(data, callback) {
    $.getJSON(apiurl + "areas.js?callback=?", data, callback); 
  }

  dapi.getOverlays = function(data, callback) {
    $.getJSON(apiurl + "overlays.js?callback=?", data, callback); 
  }

  dapi.addDevice = function(device, callback) {
    $.post(apiurl + "devices/", {device: device}, callback);
  }

  dapi.addArea = function(area, callback, string) {
    alert(string);
    $.post("http://localhost/SECe-v2.0/Web/addMapPolygon.php", area, callback); 
  }

  dapi.addOverlay = function(mA, mB, rA, rB, file, name, description, altitude, callback) {
    var pA = mA.getPosition(), pB = mB.getPosition();

    var data = new FormData();
    data.append('overlay[name]', name);
    data.append('overlay[description]', description);
    data.append('overlay[img]', file);
    data.append('overlay[geoRefA]', pA.lng() + " " + pA.lat());
    data.append('overlay[geoRefB]', pB.lng() + " " + pB.lat());
    data.append('overlay[imgRefAXhttp://localhost/SECe-v2.0/Web/dashboard.php]', rA.x);
    data.append('overlay[imgRefAY]', rA.y);
    data.append('overlay[imgRefBX]', rB.x);
    data.append('overlay[imgRefBY]', rB.y);
    data.append('overlay[altitude]', altitude);

    $.ajax({ 
      url: apiurl + "overlays/",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      complete: callback
    });
  }

  function del(url, id, callback) {
    $.ajax(apiurl + url + id + "/", {
      type: "delete",
      complete: callback
    });
  }

  dapi.deleteDevice = function(id, callback) {
    del("devices/", id, callback);
  }

  dapi.deleteOverlay = function(id, callback) {
    del("overlays/", id, callback);
  }

  dapi.deleteArea = function(id, callback) {
    del("areas/", id, callback);
  }
})(DeviceAPI = {});
