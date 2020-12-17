<?php
	$bytes = 0;
	$filename = $_SERVER['DOCUMENT_ROOT']."/syx/".$_POST['filename'];
	$strlength = $_POST['msglength'];
	if ($strlength == 35) {
//		echo "length: ", $strlength, "\n";
		$inputstring = $_POST['tempPatch'];
	}
	else {
		$inputstring = $_POST['sysexDT1'];
//                echo "length: ", $strlength, "\n";
//               echo "actual length: ", count($inputstring), "\n";
	}

	$fp = fopen($filename, "w+") or die("Unable to open $filename!");
	$arghex="";
	foreach($inputstring as $value) {
		$arghex .= pack("C*", $value);
		$bytes++;
	}
	fwrite($fp,$arghex);
	fclose($fp);
?>
