<?PHP
  // Original PHP code by Chirp Internet: www.chirp.com.au
  // Please acknowledge use of this code by including this header.

  function getFileList($dir, $recurse=false)
  {
    $retval = array();

    // add trailing slash if missing
    if(substr($dir, -1) != "/") $dir .= "/";

    // open pointer to directory and read list of files
    $d = @dir($dir) or die("getFileList: Failed opening directory $dir for reading");
    while(false !== ($entry = $d->read())) {
      // skip hidden files
      if($entry[0] == "." && ($dir == $_SERVER['DOCUMENT_ROOT']."/syx/")) continue;
      if($entry[0] == "." && $entry != "..") continue;
      if(is_dir("$dir$entry")) {
        $dirval[] = array(
          "name" => basename("$dir$entry")."/",
          "type" => filetype("$dir$entry"),
          "size" => "dir",
          "lastmod" => date("d/m/y", filemtime("$dir$entry"))
        );
        if($recurse && is_readable("$dir$entry/")) {
          $retval = array_merge($retval, getFileList("$dir$entry/", true));
        }
      } elseif(is_readable("$dir$entry")) {
        $retval[] = array(
          "name" => basename("$dir$entry"),
          "type" => mime_content_type("$dir$entry"),
          "size" => filesize("$dir$entry"),
          "lastmod" => date("d/m/y", filemtime("$dir$entry"))
        );
      }
    }
    $d->close();
    usort($retval, function($a, $b) {return $a['name'] > $b['name'];});
    usort($dirval, function($a, $b) {return $a['name'] > $b['name'];});
    $retval = array_merge( (array)$dirval, (array)$retval);
    return $retval;
  }
$filedir = $_SERVER['DOCUMENT_ROOT']."/syx/".$_POST["dir"];
//$filedir = $_POST["dir"];
//$filedir = "/var/www/html/syx/";
//echo $filedir, "\n";
$dirlist = getFileList($filedir, false);
//print_r($dirlist);

echo json_encode($dirlist);
//echo $_SERVER['DOCUMENT_ROOT']
?>
