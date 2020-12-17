/***********************************************************
*
*	filedialog.js
*
*	handles filedialog on the server
*	BE CAREFULL WITH CHANGES
*
*	Author: 	Arjen
*	Date:		september 2017
*
*	Please do not change or delete this header
*	arjen_r (a) hotmail.com
*
************************************************************/

var filedir = "";

function readdir(fdir){

	$.post("php/dirlist.php", {dir:fdir}, function(response,status) { // Required Callback Function
//		alert("*----Received Data----*\n" + response.length + " bytes\nresponse: " + response + "\nStatus : " + status);
			//"response" receives - whatever written in echo of above PHP script.
	var filelist = JSON.parse(response);
	
 	odd = 0;
   var tbl = document.getElementById("filedialogtable");
   addedrows = filelist.length;
 	for (i=0; i<addedrows; i++) {
		var new_row = tbl.insertRow(3+i);
		new_row.className = (odd = i%2) ? "filerow evenrow":"filerow oddrow";
//		if (odd = i%2)
//			new_row.className = "filerow evenrow";
//		else
//			new_row.className = "filerow oddrow";
		new_row.onclick = choosefile;	
		
		var new_cell1 = new_row.insertCell(0);
		new_cell1.className = (filelist[i].type == "dir") ? "tblcell1 folder":"tblcell1";

		var new_cell2 = new_row.insertCell(1);
		new_cell2.className = "tblcell2";
		
		var new_cell3 = new_row.insertCell(2);
		new_cell3.className = "tblcell3";
		
		new_cell1.innerHTML = filelist[i].name;
		new_cell2.innerHTML = filelist[i].size;
//		new_cell2.innerHTML = filelist[i].type == "dir"? "dir":filelist[i].size;
		new_cell3.innerHTML = filelist[i].lastmod;
		
	}
	});
}
function choosefile() {
	filechoice = this.cells[0].innerHTML;
	if (this.cells[1].innerHTML == "dir") { //change directory
		if (filechoice == "../") { // one up
			filedir = filedir.substr(0,filedir.lastIndexOf("/"));
			filedir = filedir.substr(0,filedir.lastIndexOf("/")+1); // needs to be twice
		}
		else {
			filedir += filechoice;
		}
		while (document.getElementById("filedialogtable").rows.length > 3)
			document.getElementById("filedialogtable").deleteRow(-1); //delete last row
		document.getElementById("filedialogpath").innerHTML = filedir;
		document.getElementById("txtFilename").value = "";
		readdir(filedir);
	}
	else {	// choose this file
		document.getElementById("txtFilename").value = filechoice;
//		alert("choice: "+filechoice);
	}
	
	
}
