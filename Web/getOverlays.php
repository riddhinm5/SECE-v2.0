<?php
$zip = new ZipArchive;
if ($zip->open('test.zip') === TRUE) {
  $zip->extractTo('./overlays');
  $zip->close();
  echo 'ok';
} else {
  echo 'failed';
}
header("location: ./overlays/test");
?>