<?php
	$bytes = 0;
	$filename = $_SERVER['DOCUMENT_ROOT']."/syx/".$_POST['filename'];
//	echo "filename = ", $filename, "\n";
	$strlength = $_POST['msglength'];
	$fp = fopen($filename, "r") or die("Unable to open $filename!");
	$arghex = fread($fp,$strlength);
/*	foreach($inputstring as $value) {
		$arghex .= pack("C*", $value);
		$bytes++;
	}
*/
	$arghex = bin2hex($arghex);
	echo $arghex;
	fclose($fp);
?>
