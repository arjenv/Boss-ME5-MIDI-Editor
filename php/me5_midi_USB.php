<?php

/**
 * Execute a command and return it's output. Either wait until the command exits or the timeout has expired.
 *
 * @param string $cmd     Command to execute.
 * @param number $timeout Timeout in milliseconds.
 * @return string Output of the command.
 * @throws \Exception
 */
function exec_timeout($cmd, $timeout) {
  // File descriptors passed to the process.
  $descriptors = array(
    0 => array('pipe', 'r'),  // stdin
    1 => array('pipe', 'w'),  // stdout
    2 => array('pipe', 'w')   // stderr
  );
  // some variables for timeout
  $bufferlen_former = 0;
  $bufferlen_now = 0;

  // Start the process.
  $process = proc_open('exec ' . $cmd, $descriptors, $pipes);

  if (!is_resource($process)) {
    throw new \Exception('Could not execute process');
  }

  // Set the stdout stream to none-blocking.
  stream_set_blocking($pipes[1], 0);
  stream_set_blocking($pipes[2], 0);

  // Turn the timeout into microseconds.
  $timeout = $timeout * 1000;

  // Output buffer.
  $buffer = '';

  // While we have time to wait.
  while ($timeout > 0) {
    $start = microtime(true);

    // Wait until we have output or the timer expired.
    $read  = array($pipes[1]);
    $other = array();
    stream_select($read, $other, $other, 0, $timeout);

    // Get the status of the process.
    // Do this before we read from the stream,
    // this way we can't lose the last bit of output if the process dies between these functions.
    $status = proc_get_status($process);
//    echo "command parsed: ", $status['command'], "\n";

    // Read the contents from the buffer.
    // This function will always return immediately as the stream is none-blocking.
    $buffer .= stream_get_contents($pipes[1]);
    $bufferlen_former = $bufferlen_now;
    $bufferlen_now = strlen($buffer);
//    echo "buffer ", $bufferlen_now, "\n";
    if ($bufferlen_now > $bufferlen_former) { // while there is still input...
       $start = microtime(true); // reset timeout
    }

    if (!$status['running']) {
      // Break from this loop if the process exited before the timeout.
      break;
    }
    // Subtract the number of microseconds that we waited.
    $timeout -= (microtime(true) - $start) * 1000000;
//    echo "timeout: ", $timeout, "\n";
  }
//	echo "now at line 62\n";

  // Check if there were any errors.
  $errors = stream_get_contents($pipes[2]);
//	echo "now at line 66\n";

  if (!empty($errors)) {
    throw new \Exception($errors);
  }

  // Kill the process in case the timeout expired and it's still running.
  // If the process already exited this won't do anything.
  proc_terminate($process, 9);

  // Close all streams.
  fclose($pipes[0]);
  fclose($pipes[1]);
  fclose($pipes[2]);

  proc_close($process);

  return $buffer;
}

	$strlength = 0;
	$arghex = "";
	$hardware = $_POST['hardware'];
//	$hardware = "hw:1,0,0";
	$inputstr = $_POST['commandstring'];
	foreach($inputstr as $value) {
		$arghex .= dechex($value)." ";
		$strlength++;
	}
//$arghex = "F0 41 00 1F 11 10 00 7F 7F 00 F7";
//	echo "bytes: ", $strlength, "\n";
//	echo $hardware;
//echo $arghex;
	
	$response = exec_timeout("amidi -p $hardware -S $arghex -d", 200);
	$response = trim($response);
	$response = preg_replace('/\s+/','',$response); //remove all whitespaces and stuff
	echo $response;
?>
