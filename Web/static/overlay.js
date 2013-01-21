// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * A manipulatable ground overlay.
 *
 * @param {string} src the URL to the image (i.e. data URL).
 * @param {number} x x-coordinate of initial position within map container.
 * @param {number} y y-coordinate of initial position within map container.
 * @extends {google.maps.OverlayView}
 * @constructor
 */
function Overlay(src, x, y) {
  var el = this.el_ = document.createElement('img');
  el.style.width = el.style.height = '1px';
  el.onload = this.setup_.bind(this);
  el.src = src;
  el.style.position = 'absolute';
  el.style.webkitTransformOrigin = '0 0';

  this.start_ = new google.maps.Point(x, y);
}
Overlay.prototype = new google.maps.OverlayView;

/**
 * @const
 */
Overlay.MAX_DIMENSION_ = 800;

/**
 * Resize the target image
 * @param {number} maxDimension the maximum width of the generated image.
 * @private
 */
Overlay.prototype.resize_ = function(maxDimension) {
  var el = this.el_;

  var canvas = document.createElement('canvas');
  canvas.width = maxDimension;
  canvas.height = canvas.width / this.aspectRatio_;

  var ctx = canvas.getContext('2d');
  ctx.drawImage(el, 0, 0, canvas.width, canvas.height);

  el.src = canvas.toDataURL();
};

/**
 * @inheritDoc
 */
Overlay.prototype.onAdd = function() {
  this.added_ = true;
};

/**
 * Sets up the Overlay with initial ground control points and adds the overlay
 * to the map pane.
 * @private
 */
Overlay.prototype.setup_ = function() {
  if (!this.added_) {
    window.setTimeout(this.setup_.bind(this), 50);
    return;
  }

  this.aspectRatio_ = this.el_.naturalWidth / this.el_.naturalHeight;
  var maxPixels = Overlay.MAX_DIMENSION_ * Overlay.MAX_DIMENSION_;
  if (this.el_.naturalWidth * this.el_.naturalHeight > maxPixels) {
    this.resize_(Overlay.MAX_DIMENSION_);
  }
  this.getPanes().overlayImage.appendChild(this.el_);
  this.setInitialGCP_(this.start_);

  this.retriggerDom_('mousedown');
  this.retriggerDom_('mouseup');
};

/**
 * @inheritDoc
 */
Overlay.prototype.draw = function() {
  if (!this.added_) {
    // not ready yet
    return;
  }
  requestAnimFrame(this.draw_.bind(this), this.el_);
};

/**
 * Modifies the overlay's warping dependent on the control points.
 * @private
 */
Overlay.prototype.draw_ = function() {
  this.el_.style.webkitTransform = this.computeTransform_();
};

/**
 * @inheritDoc
 */
Overlay.prototype.onRemove = function() {
  this.el_.parentNode.removeChild(this.el_);
};

/**
 * Sets up the initial positioning of the overlay.
 *
 * @param {google.maps.Point} tl the top-left point to position the overlay,
 * relative within the Map container.
 * @private
 */
Overlay.prototype.setInitialGCP_ = function(tl) {
  var proj = this.getProjection();

  // TODO(cbro): figure out something potentially more appropriate.
  var width = 100;
  var height = width / this.aspectRatio_;

  var tr = new google.maps.Point(tl.x + width, tl.y);
  var br = new google.maps.Point(tl.x + width, tl.y + height);

  this.set('topLeft', proj.fromContainerPixelToLatLng(tl));
  this.set('topRight', proj.fromContainerPixelToLatLng(tr));
  this.set('bottomRight', proj.fromContainerPixelToLatLng(br));
};

/**
 * Listens for DOM events and re-fires them.
 *
 * @param {string} eventName DOM event name.
 */
Overlay.prototype.retriggerDom_ = function(eventName) {
  var that = this;
  this.el_.addEventListener(eventName, function(e) {
    google.maps.event.trigger(that, eventName, e);
  });
};

Overlay.prototype.changed = function() {
  google.maps.event.trigger(this, 'change');
  this.draw();
};

/**
 * Computes CSS affine transformation matrix.
 *
 * @return {string} suitable value for -webkit-transform.
 * @private
 */
Overlay.prototype.computeTransform_ = function() {
  var proj = this.getProjection();

  var tl = proj.fromLatLngToDivPixel(this.get('topLeft'));
  var tr = proj.fromLatLngToDivPixel(this.get('topRight'));
  var br = proj.fromLatLngToDivPixel(this.get('bottomRight'));

  return 'matrix(' +
      [tr.x - tl.x, tr.y - tl.y, br.x - tr.x, br.y - tr.y, tl.x, tl.y] + ')';
};

/**
 * Sets the opacity of the image.
 *
 * @param {number} opacity the opacity, between 0 and 1.
 */
Overlay.prototype.setOpacity = function(opacity) {
  this.el_.style.opacity = opacity + '';
};

/**
 * Sets the unique Overlay key provided by the server.
 *
 * @param {string} key
 */
Overlay.prototype.setKey = function(key) {
  this.set('key', key);
};

/**
 * @return {string}
 */
Overlay.prototype.getKey = function() {
  return this.get('key');
};
