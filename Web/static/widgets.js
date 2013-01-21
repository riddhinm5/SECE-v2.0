// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * Autocomplete widget. Allows the user to reposition the map.
 *
 * @param {google.maps.Map} map
 * @param {!Element} container
 * @constructor
 */
function SearchWidget(map, container) {
  this.map_ = map;
  this.geocoder_ = new google.maps.Geocoder;

  this.input_ = container.querySelector('input');
  this.initAutocomplete_();

  var button = container.querySelector('a');
  google.maps.event.addDomListener(button, 'click', this.geocode_.bind(this));
}

/**
 * Initialise Autocomplete. Set up events and bindings.
 */
SearchWidget.prototype.initAutocomplete_ = function() {
  var me = this;

  var autocomplete = new google.maps.places.Autocomplete(this.input_);
  autocomplete.bindTo('bounds', this.map_);
  autocomplete.on('place_changed', function() {
    var place = this.getPlace();
    if (!place || !place.geometry) {
      me.geocode_();
      return;
    }
    me.onGeocode_([place]);
  });
};

/**
 * Callback for geocode requests and place_changed events.
 * @param {Array.<google.maps.GeocoderResult|google.maps.Placeresult>}
 */
SearchWidget.prototype.onGeocode_ = function(result) {
  if (!result || !result.length) {
    return;
  }
  var map = this.map_;
  var place = result[0];
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
    return;
  }

  // no good viewport - try to guess a good zoom level.
  for (var i = 0, type, zoom; !zoom && (type = place.types[i]); i++) {
    zoom = SearchWidget.TYPE_ZOOM_MAPPING_[type];
  }
  map.setCenter(place.geometry.location);
  map.setZoom(zoom || 14);
};

/**
 * Geocodes whatever is in the input field.
 */
SearchWidget.prototype.geocode_ = function() {
  this.geocoder_.geocode({
    address: this.input_.value
  }, this.onGeocode_.bind(this));
};

/**
 * Mappings between Places types and suitable zoom levels.
 * @type {Object.<number>}
 * @const
 */
SearchWidget.TYPE_ZOOM_MAPPING_ = {
  'street_address': 19,
  'establishment': 18,
  'route': 16,
  'university': 15
};

/**
 * Opacity widget. Allows the user to slide to change the opacity of the given
 * overlay.
 *
 * @param {Overlay} overlay
 * @return {Element}
 */
function OpacityWidget(overlay) {
  var input = document.createElement('input');
  input.type = 'range';
  input.min = 0;
  input.max = input.value = 100;

  input.onchange = function() {
    overlay.setOpacity(this.value / 100);
  };

  return input;
}

/**
 * @param {!Overlay} overlay
 * @param {!function(string)} callback
 * @return {Element}
 */
function ProcessButton(overlay, callback) {
  // TODO(cbro): prettify
  var button = document.createElement('button');
  button.innerHTML = 'Process';

  button.onclick = function() {
    document.body.classList.add('processing');

    var proj = overlay.getMap().getProjection();
    function xy(ll) {
      var p = proj.fromLatLngToPoint(ll);
      return [p.x, p.y];
    }
    var params = {
      key: overlay.getKey(),
      topLeft: xy(overlay.get('topLeft')),
      topRight: xy(overlay.get('topRight')),
      bottomRight: xy(overlay.get('bottomRight'))
    };

    var xhr = new XMLHttpRequest;
    xhr.onload = function(e) {
      if (xhr.status != 200) {
        // TODO(adg): notify user that process failed
        console.log('process', xhr.status);
        return;
      }
      callback(xhr.responseText);
    };
    xhr.open('POST', '/process?' + objToUrlParams(params), true);
    xhr.send();
  };

  return button;
}

/**
 * @param {!Overlay} overlay
 * @param {string} token
 */
function StatusBox(overlay, token) {
  var container = document.querySelector('#status p');
  var progress = document.querySelector('#status progress');
  function setStatus(msg, val) {
    container.innerHTML = msg;
    if (val) {
      progress.value = val;
    } else {
      progress.removeAttribute('value');
    }
  }
  setStatus('Getting started&hellip;');

  var key = overlay.getKey();
  var sock = new goog.appengine.Channel(token).open();
  sock.onopen = function() {
    console.log('open');
    setStatus('Generating tiles&hellip;');
  };
  var tilesDone = false;
  var tiles = {};
  sock.onmessage = function(msg) {
    var d = JSON.parse(msg.data);
    console.log('message', d);
    if (d.ZipDone) {
      setStatus('Downloading <a href="/download?key=' + key +
          '">ZIP archive</a>', 100);
      window.location = '/download?key=' + key;
      window.setTimeout(function() {
        progress.parentNode.removeChild(progress);
      }, 1000);
    } else if (d.TilesDone) {
      setStatus('Creating ZIP archive');
      tilesDone = true;
    } else if (!tilesDone && d.IDs) {
      for (var i = 0, id; id = d.IDs[i]; i++) {
        tiles[id] = true;
      }
      var count = 0;
      for (var i in tiles) {
        count++;
      }
      var pc = Math.floor(count / d.Total * 100);
      setStatus('Generating tiles: ' + pc + '% complete', pc);
    }
  };
  sock.onclose = sock.onerror = function(err) {
    console.log('error/close', err);
    setStatus('Connection to server lost. <a href="/download?key=' + key +
        '">Download later</a>.');
    progress.parentNode.removeChild(progress);
  };
}
