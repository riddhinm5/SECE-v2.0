/**
 * Editing UI for Overlays.
 *
 * @param {Overlay} overlay
 * @constructor
 */
function OverlayEditor(overlay) {
  this.set('overlay', overlay);
  this.bindTo('map', overlay);

  /**
   * @type {Array.<google.maps.Marker>}
   */
  this.markers_ = [
    this.addGCPControl_('topLeft'),
    this.addGCPControl_('topRight'),
    this.addGCPControl_('bottomRight')
  ];

  this.addMover_();
  this.handleTranslate_();
}
OverlayEditor.prototype = new google.maps.MVCObject;

/**
 * Adds a ground control point to the overlay at a given corner.
 *
 * @param {string} anchor the corner name (e.g. topLeft).
 * @return {google.maps.Marker}
 * @private
 */
OverlayEditor.prototype.addGCPControl_ = function(anchor) {
  var marker = new google.maps.Marker({
    optimized: false,
    draggable: true
  });
  marker.bindTo('map', this);

  this.get('overlay').bindTo(anchor, marker, 'position');
  this.set(anchor, marker);

  var that = this;
  marker.on('position_changed', function() {
    google.maps.event.trigger(that, 'gcpmove');
  });

  return marker;
};

/**
 * Adds a mover that's positioned in the middle of the overlay.
 *
 * @private
 */
OverlayEditor.prototype.addMover_ = function() {
  var oe = this;

  var marker = this.mover_ = new google.maps.Marker({
    draggable: true
  });
  marker.bindTo('map', this);

  var dragging = false;
  var prevLatLng;
  marker.on('dragstart', function() {
    dragging = true;
    prevLatLng = this.getPosition();
  });
  marker.on('dragend', function() {
    dragging = false;
  });
  marker.on('drag', function(e) {
    var dLat = e.latLng.lat() - prevLatLng.lat();
    var dLng = e.latLng.lng() - prevLatLng.lng();
    oe.translate_(dLat, dLng);
    prevLatLng = this.getPosition();
  });

  this.on('gcpmove', function() {
    if (dragging) return;

    var tl = oe.get('topLeft').getPosition();
    var br = oe.get('bottomRight').getPosition();

    if (!tl || !br) return;

    marker.setPosition(new google.maps.LatLng(
      (tl.lat() + br.lat()) / 2,
      (tl.lng() + br.lng()) / 2
    ));
  });
};

/**
 * Translates all anchor points by a number of degrees north and east.
 *
 * @param dLat {number} the delta in latitude.
 * @param dLng {number} the delta in longitude.
 * @private
 */
OverlayEditor.prototype.translate_ = function(dLat, dLng) {
  this.markers_.forEach(function(marker) {
    var position = marker.getPosition();
    marker.setPosition(new google.maps.LatLng(
      position.lat() + dLat,
      position.lng() + dLng
    ));
  });
};

/**
 * Translates all anchor points by a number of pixels.
 *
 * @param dx {number}
 * @param dy {number}
 * @private
 */
OverlayEditor.prototype.translatePixels_ = function(dx, dy) {
  var proj = this.get('overlay').getProjection();

  var before = this.mover_.getPosition();
  var p = proj.fromLatLngToDivPixel(before);
  p.x += dx;
  p.y += dy;
  var after = proj.fromDivPixelToLatLng(p);

  this.translate_(after.lat() - before.lat(), after.lng() - before.lng());
};

/**
 * Add event handling for translation.
 */
OverlayEditor.prototype.handleTranslate_ = function() {
  var listener;
  var that = this;
  var overlay = this.get('overlay');
  var map = overlay.getMap();
  overlay.on('mousedown', function(e) {
    if (!e.metaKey) {
      return;
    }
    map.set('draggable', false);
    var prevEvent = e;
    listener && google.maps.event.removeListener(listener);
    listener = google.maps.event.addDomListener(document.body, 'mousemove',
        function(e) {
          that.translatePixels_(
              e.screenX - prevEvent.screenX,
              e.screenY - prevEvent.screenY);
          prevEvent = e;
        });
  });
  overlay.on('mouseup', function(e) {
    map.set('draggable', true);
    listener && google.maps.event.removeListener(listener);
  });
};
