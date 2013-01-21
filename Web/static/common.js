// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * Kills a DOM event.
 *
 * @param {Event} e event.
 */
function stopEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

/**
 * Helper function - equivalent to g.m.event.addListener.
 *
 * @param {string} e event name.
 * @param {Function} l handler.
 * @return {MapsEventListener}
 */
google.maps.MVCObject.prototype.on = function(e, l) {
  return google.maps.event.addListener(this, e, l);
};

function objToUrlParams(o) {
  var r = [];
  for (var k in o) if (o.hasOwnProperty(k)) {
    r.push(k + '=' + encodeURIComponent(o[k]));
  }
  return r.join('&');
}

/**
 * requestAnimationFrame shim.
 */
window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame
