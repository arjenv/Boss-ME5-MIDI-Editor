<?php
/***************************************************
*
*	togglemanualmode.php
*
*	PHP script to toggle ME-5 between manual and edit mode
*	
*	No returns or feedback
*
*	Author: Arjen
*	Date: September 2017
*
*	Pls do not change this header
*
*****************************************************/

	exec("gpio mode 0 out");
	exec("gpio write 0 1");
	exec("gpio write 0 0");
	exec("gpio mode 0 in");
	
?>
