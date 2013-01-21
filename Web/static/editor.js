// Copyright 2012 Google Inc. All Rights Reserved.

window.addEventListener('load', function() {
  alert("here");
  var map = new google.maps.Map(document.querySelector('#map'), {
    center: new google.maps.LatLng(0, 0),
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  addDragAndDrop(map);
  addNavEvents(map);
  alert("here");
  new SearchWidget(map, document.querySelector('#kd-search'));
});

/**
 * Adds the events to the navbar
 *
 * @param {google.maps.Map} map
 */
function addNavEvents(map) {
  var buttonBar = document.querySelector('#button-bar');
  if (!buttonBar) return;

  var buttons = buttonBar.getElementsByClassName('kd-button');

  for (var i = 0, button; button = buttons[i]; i++) {
    button.addEventListener('click', toggleButton.bind(button, map), false);
  }
}

/**
 * Toggles a button
 *
 * @this {Node}
 * @param {google.maps.Map} map
 */
function toggleButton(map) {
  // TODO(cbro): Toggle selected style to button (this).
  toggleSideBar(map);
}

/**
 * Toggles the side bar
 *
 * @param {google.maps.Map} map
 */
function toggleSideBar(map) {
  document.body.classList.toggle('side-open');
}


/**
 * Adds drag and drop functionality to the map.
 *
 * @param {google.maps.Map} map
 */
function addDragAndDrop(map) {
  var drop = document.querySelector('#map');

  drop.addEventListener('dragenter', stopEvent, false);
  drop.addEventListener('dragexit', stopEvent, false);
  drop.addEventListener('dragover', stopEvent, false);

  drop.addEventListener('drop', function(e) {
    stopEvent(e);

    var files = e.dataTransfer.files;
    if (!files.length) {
      window.alert('No file uploaded');
      return;
    }
    var imageURL = (window.URL || window.webkitURL).createObjectURL(files[0]);

    var rect = map.getDiv().getBoundingClientRect();
    var x = e.pageX - rect.left;
    var y = e.pageY - rect.top;
    var overlay = new Overlay(imageURL, x, y);

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
        new OpacityWidget(overlay));

    overlay.setMap(map);

    var editor = new OverlayEditor(overlay);

    uploadInBackground(files[0], map, overlay);
  }, false);
}

/**
 * Uploads given file to blob store.
 *
 * @param {File} file
 * @param {google.maps.Map} map
 * @param {Overlay} overlay
 */
function uploadInBackground(file, map, overlay) {
  // FIXME(cbro): position this somewhere less ugly.
  var progress = document.createElement('progress');
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      progress);

  var xhr = new XMLHttpRequest;
  xhr.open('POST', document.querySelector('#upload-url').value, true);
  xhr.onload = function(e) {
    // TODO(cbro): more robust error handling.
    if (xhr.statusText != 'OK') {
      window.alert(xhr.statusText + ': ' + xhr.responseText);
      return;
    }
    overlay.setKey(xhr.responseText);
    console.log(overlay.getKey());
    var processButton = new ProcessButton(overlay, function(token) {
      new StatusBox(overlay, token);
    });
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(processButton);
    progress.parentNode.removeChild(progress);
  };

  xhr.upload.onprogress = function(e) {
    if (e.loaded == e.total) {
      // uploadHandler is still doing some work. Just be ambiguous.
      progress.removeAttribute('value');
    } else {
      progress.value = e.loaded;
      progress.max = e.total;
    }
  };

  var form = new FormData;
  form.append('overlay', file);
  xhr.send(form);
}
