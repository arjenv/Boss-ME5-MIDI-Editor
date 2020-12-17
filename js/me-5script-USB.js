/***********************************************************
*
*	me-5script-USB.js
*
*	Script to control Boss ME-5 floorboard
*
*	Author: 	Arjen
*	Date:		november 2018
*
*	Please do not change or delete this header
*
*
************************************************************/


"use strict";

var radioGroup  = document.getElementsByName("ME5Group");
var radioBank   = document.getElementsByName("ME5Bank");
var radioNumber = document.getElementsByName("ME5Number");
var messagefieldleft = document.getElementById("messagewindowleft");
var messagefieldright = document.getElementById("messagewindowright");
var currentGroup = 0;
var currentBank = 0;
var currentNumber = 0;
var Pstring = "1 1 1";
var Pnumber	= 0;
var i = 0;
var changecommand = [];	// for sending post data
changecommand[0] = parseInt("0xC0");
changecommand[1] = parseInt("0x00");
var sysexDT1 = [];	// system exclusive bytes
/*	sysexDT1['SOX']        = parseInt("0xF0");
	sysexDT1['RolandID']   = parseInt("0x41");	
	sysexDT1['DEV']        = parseInt("0x00");
	sysexDT1['MODEL']      = parseInt("0x1F");
	sysexDT1['RQ1_DT1']    = parseInt("0x11"); // RQ1=11, DT1=12
	sysexDT1['ADDRESSMSB'] = parseInt("0x00");
	sysexDT1['ADDRESSLSB'] = parseInt("0x00"); // 00, 00 = temp memory
	sysexDT1['D00']        = parseInt("0x00"); // (00-1F)
//				#d00	Effects on/off
//				Bit0	Compressor
//				Bit1	Overdrive/distortion
//				Bit2	Equalizer
//				Bit3	Chorus/Flanger
//				Bit4	Reverb/Delay
	sysexDT1['D01']         = parseInt("0x00");	// Compressor Sustain			(00-0B)
	sysexDT1['D02']         = parseInt("0x00");	//	Compressor Attack				(00-07)
	sysexDT1['D03']			= parseInt("0x00");	//	Compressor Tone				(00-0B)
	sysexDT1['D04']			= parseInt("0x00");	//	Compressor Level				(00-0B)
	sysexDT1['D05']			= parseInt("0x00");	// Overdrive/distortion Mode	(00-02)
	sysexDT1['D06']			= parseInt("0x00"); //	Overdrive/distortion Drive	(00-07)
	sysexDT1['D07']			= parseInt("0x00");	//	Overdrive/distortion Level	(00-07)
	sysexDT1['D08']			= parseInt("0x00");	//	Equalizer HI Level			(00-0B)
	sysexDT1['D09']			= parseInt("0x00");	//	Equalizer MID FREQ			(00-02)
	sysexDT1['D0A']			= parseInt("0x00");	//	Equalizer MID LEVEL			(00-0B)
	sysexDT1['D0B']			= parseInt("0x00");	//	Equalizer LOW LEVEL			(00-0B)
	sysexDT1['D0C']			= parseInt("0x00");	//	Equalizer Total LEVEL		(00-0B)
	sysexDT1['D0D']			= parseInt("0x00");	//	Chorus/Flanger  MODE			(00-04)
	sysexDT1['D0E']			= parseInt("0x00");	//	Chorus/Flanger  RATE			(00-46)
	sysexDT1['D0F']			= parseInt("0x00");	//	Chorus/Flanger  DEPTH		(00-0B)
	sysexDT1['D10']			= parseInt("0x00");	//	Chorus/Flanger  Resonance	(00-0B)
	sysexDT1['D11']			= parseInt("0x00");	//	Chorus/Flanger  Level		(00-B0)
	sysexDT1['D12']			= parseInt("0x00");	//	Noise Suppressor				(00-07)
	sysexDT1['D13']			= parseInt("0x00");	//	Send/Return						(00-01) 0=OFF
	sysexDT1['D14']			= parseInt("0x00");	//	REVERB/DELAY MODE				(00-05) 5=delay
	sysexDT1['D15']			= parseInt("0x00");	//	REVERB/DELAY TIME				(00-15) (reverb)
														//										(00-31) (delay)
	sysexDT1['D16']			= parseInt("0x00");	//	REVERB/DELAY DELAY F.B.		(00-07)
	sysexDT1['D17']			= parseInt("0x00");	//	REVERB/DELAY TONE				(00-07)
	sysexDT1['D18']			= parseInt("0x00");	//	REVERB/DELAY EFFECT LEVEL	(00-0B)
	sysexDT1['D19']			= parseInt("0x00");	//	MASTER LEVEL					(00-47)
	sysexDT1['CHKSUM']		= parseInt("0x00");	//	Calculate
	sysexDT1['EOX']			= parseInt("0xF7"); //	End Of system Exclusive
*/
var sysexRQ1 = [];	// system exclusive bytes Request
	sysexRQ1[0]  = parseInt("0xF0");	// SOX
	sysexRQ1[1]  = parseInt("0x41");	// Roland ID
	sysexRQ1[2]  = parseInt("0x00");	// Device ID
	sysexRQ1[3]  = parseInt("0x1F");	// Model ID
	sysexRQ1[4]  = parseInt("0x11");	// RQ1=11, DT1=12
	sysexRQ1[5]  = parseInt("0x00");	// Address MSB
	sysexRQ1[6]  = parseInt("0x00");	// Address LSB (00, 00 = temp memory)
	sysexRQ1[7]  = parseInt("0x00");	// Size (00-FF)
	sysexRQ1[8]  = parseInt("0x00");	// Size	(00-FF)
	sysexRQ1[9]	 = parseInt("0x00");	//	Calculate
	sysexRQ1[10] = parseInt("0xF7");	//	End Of system Exclusive

var	temp = 0;
var	singlePatch = [];
var	tempPatch = [];
var	EffectOn=0;
var	EffectCompressorOn = 0;
var	EffectOverdriveOn = 0;
var	EffectEqualizerOn = 0;
var	EffectChorusOn = 0;
var	EffectReverbOn = 0;
var	SendReturnOn = 0;
var	ReverbTimelist = ["0.1","0.2","0.3","0.4","0.5","0.6","0.7","0.8","0.9","1.0","1.2","1.5","2.0","2.5","3.0",
								"3.5","4.0","4.5","5.0","5.5","6.0","6.5","7.0","7.5","8.0","8.5","9.0","9.5","10","11",
								"12","14","16","18","20","22","24","26","28","30","32","34","36","38","40",
								"42","44","46","48","50"];
var	List0to12 = ["0.0", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5", "6.0", "7.0"];	
var 	TimeOut;
var	checksum=0;
var	j=0;
var	f1;
var	err = 0;
var	manual_edit = 0;
var hardware = "Inithardware";	// holds the portnumber used in amidi

function ME5detect_USB() {
	$.post("php/detect_ME5.php",{sysexRQ1: sysexRQ1},function(response,status) {
//		alert("response: " + response);
		hardware = response;
	
//	alert("hardware = " + hardware);
		if (hardware.indexOf("Error") !== -1) {
			messagefieldleft.innerHTML = "No hardware port";
		}
		else {
			messagefieldleft.innerHTML = hardware;
			ME5readall();
		}
	});
}

	function ME5readall() {

	sysexRQ1[5] = parseInt("0x10"); // start address of request, start at patch 0
	sysexRQ1[6] = parseInt("0x00");	// Address LSB 
	sysexRQ1[7] = parseInt("0x7F");	// 64 x 35 bytes = 2240 bytes
	sysexRQ1[8] = parseInt("0x7F");	// 2240 ==> 0x08C0

	$.post("php/me5_midi_USB.php", {hardware:hardware,commandstring:sysexRQ1}, function(response,status) { // Required Callback Function
//		alert("*----Received Data----*\n" + response + " bytes\nStatus : " + status);
			//"response" receives - whatever written in echo of above PHP script.

		if (response.indexOf("timeout") !== -1) {
			messagefieldright.innerHTML = "Timeout.. try reload";
		}
		else if (response.length > 4400) {
			for (i=0; i<64; i++) { // patches range from 0 - 63
				checksum = 0;
				for (j=0; j<35; j++) {
					temp = parseInt(response.substr(70*i+2*j,2), 16);
					sysexDT1[35*i+j] = parseInt(response.substr(70*i+2*j,2), 16);
					if (j==0 && (sysexDT1[35*i+j] != parseInt("0xF0"))) {// check 1st byte
						messagefieldright.innerHTML = "patch: "+i+" not sysex start!";
						err++;
					}
					if (j==34 && (sysexDT1[35*i+j] != parseInt("0xF7"))) {// check last byte
						messagefieldright.innerHTML = "patch: "+i+" not sysex End!";
						err++;
					}
					if (j>6 && j<33) {
						checksum += sysexDT1[35*i+j];
					}
				}
				checksum &= 0x7F;
				checksum = 128 - checksum;
				if (checksum != sysexDT1[35*i+33]) {
					messagefieldright.innerHTML = "patch: "+i+" checksum does not match!";
					err++;
				}
			}
			Pnumber = 0;
			for (i=0; i<35; i++) { // fill tempPatch
				tempPatch[i] = sysexDT1[Pnumber*35+i];
			}
			if (!err) {
				messagefieldright.innerHTML = "Received 2240 Bytes"
				setslidervalues();
			}
			else {
				messagefieldright.innerHTML = "Errors: "+err+" Try a reload";
			}
		}
		else {
			if (response.length == 0) {
				messagefieldright.innerHTML = "Could not connect....."
			}
			else {
				messagefieldright.innerHTML = response;
			}
		}
});}


	function setslidervalues() {
	
		radioGroup[parseInt(Pnumber/16)].checked = true;
		radioBank[parseInt((Pnumber%16)/4)].checked = true;
		radioNumber[((parseInt(Pnumber%16)%4))].checked = true;
		setGroupPatch.value = (parseInt(Pnumber/16)+1).toString();
		setBankPatch.value = (parseInt((Pnumber%16)/4)+1).toString();
		setNumberPatch.value = ((parseInt(Pnumber%16)%4)+1).toString();

		// set values in html
		EffectOn = sysexDT1[Pnumber*35+7];
		EffectCompressorOn = EffectOn&parseInt("00001",2) ? 1:0; 		//If true then 1, else 0
		EffectOverdriveOn  = EffectOn&parseInt("00010",2) ? 1:0;
		EffectEqualizerOn  = EffectOn&parseInt("00100",2) ? 1:0;
		EffectChorusOn     = EffectOn&parseInt("01000",2) ? 1:0;
		EffectReverbOn     = EffectOn&parseInt("10000",2) ? 1:0;
		
		// set sliders and stuff
		// Compressor

		document.getElementById("CompressorOn").style.color = EffectCompressorOn ? "#FF0000" : "grey";
		sliderCompSustain.value = sysexDT1[Pnumber*35+8];
		sliderCompAttack.value  = sysexDT1[Pnumber*35+9];
		sliderCompTone.value    = sysexDT1[Pnumber*35+10];
		sliderCompLevel.value   = sysexDT1[Pnumber*35+11];
		outputCompSustain.innerHTML = List0to12[parseInt(sliderCompSustain.value)]; // from 0.0 to 7.0
		outputCompAttack.innerHTML = sliderCompAttack.value;		// 0 to 7
		outputCompTone.innerHTML = sliderCompTone.value - 6;		// -6 to +6
		outputCompLevel.innerHTML = List0to12[parseInt(sliderCompLevel.value)]; // from 0.0 to 7.0

		// Overdrive/distortion
		document.getElementById("OverdriveOn").style.color = EffectOverdriveOn ? "#FF0000" : "grey";
		sliderOverdriveMode.value  = sysexDT1[Pnumber*35+12];
		sliderOverdriveDrive.value = sysexDT1[Pnumber*35+13];
		sliderOverdriveLevel.value = sysexDT1[Pnumber*35+14];
		outputOverdriveMode.innerHTML  = parseInt(sliderOverdriveMode.value) + 1 + ODmodestring[parseInt(sliderOverdriveMode.value)]; //from 1-3
		outputOverdriveDrive.innerHTML = sliderOverdriveDrive.value;		// 0 to 7
		outputOverdriveLevel.innerHTML = sliderOverdriveLevel.value;		// 0 to 7

		// Equalizer
		document.getElementById("EqualizerOn").style.color = EffectEqualizerOn ? "#FF0000" : "grey";

		sliderEqualizerHiLevel.value     = sysexDT1[Pnumber*35+15];
		sliderEqualizerMidFreq.value     = sysexDT1[Pnumber*35+16];
		sliderEqualizerMidLevel.value    = sysexDT1[Pnumber*35+17];
		sliderEqualizerLoLevel.value     = sysexDT1[Pnumber*35+18];
		sliderEqualizerTotalLevel.value  = sysexDT1[Pnumber*35+19];
		outputEqualizerHiLevel.innerHTML = parseInt(sliderEqualizerHiLevel.value) - 6; // from -6 to +6 
		if (parseInt(sliderEqualizerMidFreq.value) == 0) 
			outputEqualizerMidFreq.innerHTML = "0.5 kHz";
		else 
			outputEqualizerMidFreq.innerHTML = parseInt(sliderEqualizerMidFreq.value).toFixed(1) + " kHz";
		outputEqualizerMidLevel.innerHTML   = parseInt(sliderEqualizerMidLevel.value) - 6; // from -6 to +6 
		outputEqualizerLoLevel.innerHTML    = parseInt(sliderEqualizerLoLevel.value) - 6; // from -6 to +6 
		outputEqualizerTotalLevel.innerHTML = parseInt(sliderEqualizerTotalLevel.value) - 6; // from -6 to +6 

		// Chorus/Flanger
		document.getElementById("ChorusOn").style.color = EffectChorusOn ? "#FF0000" : "grey";
		sliderChorusMode.value      = sysexDT1[Pnumber*35+20];
		sliderChorusRate.value      = sysexDT1[Pnumber*35+21];
		sliderChorusDepth.value     = sysexDT1[Pnumber*35+22];
		sliderChorusResonance.value = sysexDT1[Pnumber*35+23];
		sliderChorusLevel.value     = sysexDT1[Pnumber*35+24];
		outputChorusMode.innerHTML = parseInt(sliderChorusMode.value) + 1 + Chorusmodestring[parseInt(sliderChorusMode.value)]; // from 1 to 5 

		outputChorusRate.innerHTML = (parseInt(sliderChorusRate.value) / 10).toFixed(1); // 0, 0.1, 0.2, .... 7.0   (71 steps)
		outputChorusDepth.innerHTML = List0to12[parseInt(sliderChorusDepth.value)]; // from 0.0 to 7.0
		outputChorusResonance.innerHTML = List0to12[parseInt(sliderChorusResonance.value)]; // from 0.0 to 7.0
		outputChorusLevel.innerHTML = List0to12[parseInt(sliderChorusLevel.value)]; // from 0.0 to 7.0

		// Reverb/Delay
		document.getElementById("ReverbOn").style.color = EffectReverbOn ? "#FF0000" : "grey";
		sliderReverbMode.value    = sysexDT1[Pnumber*35+27];
		if (parseInt(sliderReverbMode.value) == 5) {	// Must come next otherwise max = 14
															// delay mode has other time values
			document.getElementById("ReverbTime").max = "49";		
		}
		sliderReverbTime.value    = sysexDT1[Pnumber*35+28];
		sliderReverbDelayFB.value = sysexDT1[Pnumber*35+29];
		sliderReverbTone.value    = sysexDT1[Pnumber*35+30];
		sliderReverbLevel.value   = sysexDT1[Pnumber*35+31];
		outputReverbMode.innerHTML = parseInt(sliderReverbMode.value) + 1 + Reverbmodestring[parseInt(sliderReverbMode.value)]; // from 1 to 6 

		if (parseInt(sliderReverbMode.value) == 5) {	// delay mode has other time values
			document.getElementById("ReverbTime").max = "49";
			outputReverbTime.innerHTML = ReverbTimelist[sliderReverbTime.value];
		}
		else {
			document.getElementById("ReverbTime").max = "14";
			outputReverbTime.innerHTML = (parseInt(sliderReverbTime.value) / 2).toFixed(1); // 0, 0.5, 1.0, .... 7.0   (15 steps)
		}
		outputReverbDelayFB.innerHTML = sliderReverbDelayFB.value; // 0-7 only in Delay mode = 6
		outputReverbTone.innerHTML = sliderReverbTone.value; // 0 - 7
		outputReverbLevel.innerHTML = List0to12[parseInt(sliderReverbLevel.value)]; // from 0.0 to 7.0

		// Noise suppression, Send/Return, Master Level
		document.getElementById("NSMOn").style.color = "#FF0000";
		sliderNSMNoise.value       = sysexDT1[Pnumber*35+25];
		sliderNSMSendReturn.value  = sysexDT1[Pnumber*35+26];
		sliderNSMMasterLevel.value = sysexDT1[Pnumber*35+32];
		outputNSMNoise.innerHTML = parseInt(sliderNSMNoise.value); // from 0 to 7 
		outputNSMSendReturn.innerHTML = parseInt(sliderNSMSendReturn.value) ? "ON" : "OFF";
		outputNSMSendReturn.style.color = parseInt(sliderNSMSendReturn.value) ? "#FF0000" : "grey";
		outputNSMMasterLevel.innerHTML = (parseInt(sliderNSMMasterLevel.value) / 10).toFixed(1);
}
	
function changePatchnr() {
	Pnumber = 0;
	for (i=0; i<4; i++) {

		if (radioGroup[i].checked) {
			currentGroup = parseInt(radioGroup[i].value)/16+1;
			Pnumber += parseInt(radioGroup[i].value, 10);
		}	
		if (radioBank[i].checked) {
			currentBank = parseInt(radioBank[i].value)/4+1;
			Pnumber += parseInt(radioBank[i].value, 10);
		}
		if (radioNumber[i].checked) {
			currentNumber = parseInt(radioNumber[i].value)+1;
			Pnumber += parseInt(radioNumber[i].value, 10);
		}				
	}
	Pstring = "# "+currentGroup+" "+currentBank+" "+currentNumber+" \u2192 "+Pnumber;
	document.getElementById("patchstring").innerHTML = Pstring;
	sendmidi();	// post it
	for (i=0; i<35; i++) { // fill tempPatch
		tempPatch[i] = sysexDT1[Pnumber*35+i];
	}
	setslidervalues(); // set sliders
}

function patchupdown(updown) {		// Change patch relative to updown
	Pnumber += parseInt(updown, 10);
	if (Pnumber < 0) Pnumber = 63;
	if (Pnumber > 63) Pnumber = 0;
	radioGroup[parseInt(Pnumber/16)].checked = true;
	radioBank[parseInt((Pnumber%16)/4)].checked = true;
	radioNumber[((parseInt(Pnumber%16)%4))].checked = true;
	changePatchnr();
}

function sendmidi() {
	changecommand[1] = parseInt(Pnumber);
	$.post("php/me5_midi_USB.php", {hardware:hardware,commandstring:changecommand}, 
		function(response,status) { // Required Callback Function
//			alert("*----Received Data----*\n\nResponse : " + response+"\n\nStatus : " + status);
						//"response" receives - whatever written in echo of above PHP script.
});
}

function programTempPatch() { // set timeout, if sliders are moved within certain time reset former action
	tempPatch[5] = parseInt("0x00"); // address to 0x00 0x00 = temp
	tempPatch[6] = parseInt("0x00");
	clearTimeout(TimeOut); // Reset timer
	TimeOut = setTimeout(function(){PostprogramTempPatch()}, 300);
}

function PostprogramTempPatch() { // update ME5 temp memory or patch (set RQ1 or DT1)
	// tempPatch[] holds the info for the ME-5
	$.post("php/me5_midi_USB.php", {hardware:hardware,commandstring:tempPatch}, 
		function(response,status) { // Required Callback Function
//			alert("*----Received Data----*\n\nResponse : " + response+"\n\nStatus : " + status);
			//"response" receives - whatever written in echo of above PHP script.
		});
}
	
// <!-- Toggle Manual/Edit	-->
function ToggleManual()	{
	document.getElementById("Switchmanual").innerHTML = manual_edit ? "ME-5 Editor":"Manual Mode";
	document.getElementById("Switchmanual").style.color = manual_edit ?  "#D6000F":"blue"
	manual_edit ^= 1;
	$.post("php/togglemanualmode.php", {}, 
		function(response,status) { // Required Callback Function
//			alert("*----Received Data----*\n\nResponse : " + response+"\n\nStatus : " + status);
			//"response" receives - whatever written in echo of above PHP script.
		});
}

// <!-- Compressor -->

var sliderCompSustain = document.getElementById("CompSustain");
var sliderCompAttack  = document.getElementById("CompAttack");
var sliderCompTone    = document.getElementById("CompTone");
var sliderCompLevel   = document.getElementById("CompLevel");
var outputCompSustain = document.getElementById("CompSustainValue");
var outputCompAttack  = document.getElementById("CompAttackValue");
var outputCompTone    = document.getElementById("CompToneValue");
var outputCompLevel   = document.getElementById("CompLevelValue");

sliderCompSustain.oninput = function() {
	outputCompSustain.innerHTML = List0to12[parseInt(this.value)]; // from 0.0 to 7.0
	tempPatch[8] = parseInt(this.value);
	programTempPatch();	// update ME-5
		
}
sliderCompAttack.oninput = function() {
	outputCompAttack.innerHTML = this.value;
	tempPatch[9] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderCompTone.oninput = function() {
	outputCompTone.innerHTML = parseInt(this.value) - 6;
	tempPatch[10] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderCompLevel.oninput = function() {
	outputCompLevel.innerHTML = List0to12[parseInt(this.value)]; // from 0.0 to 7.0
	tempPatch[11] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
function ToggleCompressor() {
	document.getElementById("CompressorOn").style.color = EffectCompressorOn ? "grey" : "#FF0000";
	EffectCompressorOn ^= 1;
	tempPatch[7] ^= parseInt("00001",2); 
	programTempPatch();
}

// <!-- End Compressor -->
	
// <!-- Overdrive -->

var sliderOverdriveMode  = document.getElementById("OverdriveMode");
var sliderOverdriveDrive = document.getElementById("OverdriveDrive");
var sliderOverdriveLevel = document.getElementById("OverdriveLevel");
var outputOverdriveMode  = document.getElementById("OverdriveModeValue");
var outputOverdriveDrive = document.getElementById("OverdriveDriveValue");
var outputOverdriveLevel = document.getElementById("OverdriveLevelValue");
var ODmodestring = [];
 ODmodestring[0] = " Normal OD";
 ODmodestring[1] = " Heavy OD";
 ODmodestring[2] = " Distortion";

sliderOverdriveMode.oninput = function() {
	outputOverdriveMode.innerHTML = parseInt(this.value) + 1 + ODmodestring[this.value]; // from 1-3
	tempPatch[12] = parseInt(this.value);
	programTempPatch();	// update ME-5
		
}
sliderOverdriveDrive.oninput = function() {
	outputOverdriveDrive.innerHTML = this.value;
	tempPatch[13] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderOverdriveLevel.oninput = function() {
	outputOverdriveLevel.innerHTML = this.value;
	tempPatch[14] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
function ToggleOverdrive() {
	document.getElementById("OverdriveOn").style.color = EffectOverdriveOn ? "grey" : "#FF0000";
	EffectOverdriveOn ^= 1;	
	tempPatch[7] ^= parseInt("00010",2); 
	programTempPatch();
}

// <!-- End Overdrive -->

// <!-- Equalizer -->

var sliderEqualizerHiLevel    = document.getElementById("EqualizerHiLevel");
var sliderEqualizerMidFreq    = document.getElementById("EqualizerMidFreq");
var sliderEqualizerMidLevel   = document.getElementById("EqualizerMidLevel");
var sliderEqualizerLoLevel    = document.getElementById("EqualizerLoLevel");
var sliderEqualizerTotalLevel = document.getElementById("EqualizerTotalLevel");
var outputEqualizerHiLevel    = document.getElementById("EqualizerHiLevelValue");
var outputEqualizerMidFreq    = document.getElementById("EqualizerMidFreqValue");
var outputEqualizerMidLevel   = document.getElementById("EqualizerMidLevelValue");
var outputEqualizerLoLevel    = document.getElementById("EqualizerLoLevelValue");
var outputEqualizerTotalLevel = document.getElementById("EqualizerTotalLevelValue");

sliderEqualizerHiLevel.oninput = function() {
	outputEqualizerHiLevel.innerHTML = parseInt(this.value) - 6; // from -6 to +6
	tempPatch[15] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderEqualizerMidFreq.oninput = function() {
	if (parseInt(this.value) == 0)
		outputEqualizerMidFreq.innerHTML = "0.5 kHz";
	else
		outputEqualizerMidFreq.innerHTML = this.value + " kHz"; // value = 0.5 - 1 - 2
	tempPatch[16] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderEqualizerMidLevel.oninput = function() {
	outputEqualizerMidLevel.innerHTML = this.value - 6; // from -6 to +6
	tempPatch[17] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderEqualizerLoLevel.oninput = function() {
	outputEqualizerLoLevel.innerHTML = this.value - 6; // from -6 to +6
	tempPatch[18] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderEqualizerTotalLevel.oninput = function() {
	outputEqualizerTotalLevel.innerHTML = this.value - 6; // from -6 to +6
	tempPatch[19] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
function ToggleEqualizer() {
	document.getElementById("EqualizerOn").style.color = EffectEqualizerOn ? "grey" : "#FF0000";
	EffectEqualizerOn ^= 1;	
	tempPatch[7] ^= parseInt("00100",2); 
	programTempPatch();
}

// <!-- End Equalizer -->

var sliderChorusMode      = document.getElementById("ChorusMode");
var sliderChorusRate      = document.getElementById("ChorusRate");
var sliderChorusDepth     = document.getElementById("ChorusDepth");
var sliderChorusResonance = document.getElementById("ChorusResonance");
var sliderChorusLevel     = document.getElementById("ChorusLevel");
var outputChorusMode      = document.getElementById("ChorusModeValue");
var outputChorusRate      = document.getElementById("ChorusRateValue");
var outputChorusDepth     = document.getElementById("ChorusDepthValue");
var outputChorusResonance = document.getElementById("ChorusResonanceValue");
var outputChorusLevel     = document.getElementById("ChorusLevelValue");
var Chorusmodestring = [];
	Chorusmodestring[0] = " Chorus";
	Chorusmodestring[1] = " Flanger freq=1";
	Chorusmodestring[2] = " Flanger freq=2";
	Chorusmodestring[3] = " Flanger freq=3";
	Chorusmodestring[4] = " Flanger freq=4";
	

sliderChorusMode.oninput = function() {
	outputChorusMode.innerHTML = parseInt(this.value) +1 + Chorusmodestring[this.value]; // from 1 to 5
	tempPatch[20] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderChorusRate.oninput = function() {
	outputChorusRate.innerHTML = (parseInt(this.value) / 10).toFixed(1); // 0, 0.1, 0.2 ..... 7.0 (71 steps)
	tempPatch[21] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderChorusDepth.oninput = function() {
	outputChorusDepth.innerHTML = List0to12[parseInt(this.value)]; // from 0.0 to 7.0
	tempPatch[22] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderChorusResonance.oninput = function() {
	outputChorusResonance.innerHTML = List0to12[parseInt(this.value)]; // from 0.0 to 7.0
	tempPatch[23] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderChorusLevel.oninput = function() {
	outputChorusLevel.innerHTML = List0to12[parseInt(this.value)]; // from 0.0 to 7.0
	tempPatch[24] = parseInt(this.value);
	programTempPatch();	// update ME-5
}


function ToggleChorus() {
	document.getElementById("ChorusOn").style.color = EffectChorusOn ? "grey" : "#FF0000";
	EffectChorusOn ^= 1;	
	tempPatch[7] ^= parseInt("01000",2); 
	programTempPatch();
}

// <!-- End Chorus/Flanger -->

// <!-- Reverb/Delay -->

var sliderReverbMode    = document.getElementById("ReverbMode");
var sliderReverbTime    = document.getElementById("ReverbTime");
var sliderReverbDelayFB = document.getElementById("ReverbDelayFB");
var sliderReverbTone    = document.getElementById("ReverbTone");
var sliderReverbLevel   = document.getElementById("ReverbLevel");
var outputReverbMode    = document.getElementById("ReverbModeValue");
var outputReverbTime    = document.getElementById("ReverbTimeValue");
var outputReverbDelayFB = document.getElementById("ReverbDelayFBValue");
var outputReverbTone    = document.getElementById("ReverbToneValue");
var outputReverbLevel   = document.getElementById("ReverbLevelValue");
var Reverbmodestring = [];
	Reverbmodestring[0] = " Room";
	Reverbmodestring[1] = " Hall 15m";
	Reverbmodestring[2] = " Hall 30m";
	Reverbmodestring[3] = " Plate";
	Reverbmodestring[4] = " Gated";
	Reverbmodestring[5] = " Delay";

sliderReverbMode.oninput = function() {
	outputReverbMode.innerHTML = parseInt(this.value) +1 + Reverbmodestring[this.value]; // from 1 to 6
	tempPatch[27] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderReverbTime.oninput = function() {
	if (sliderReverbMode.value == "5") {
		document.getElementById("ReverbTime").max = "49";
		outputReverbTime.innerHTML = ReverbTimelist[parseInt(sliderReverbTime.value)];
	}
	else {
		document.getElementById("ReverbTime").max = "14";
		outputReverbTime.innerHTML = (parseInt(this.value) / 2).toFixed(1); // 0, 0.5, 1.0 ..... 7.0 (15 steps)
	}
	tempPatch[28] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderReverbDelayFB.oninput = function() {
	outputReverbDelayFB.innerHTML = this.value // 0-7
	tempPatch[29] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderReverbTone.oninput = function() {
	outputReverbTone.innerHTML = this.value; // 0-7
	tempPatch[30] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderReverbLevel.oninput = function() {
	outputReverbLevel.innerHTML = List0to12[parseInt(this.value)]; // from 0.0 to 7.0
	tempPatch[31] = parseInt(this.value);
	programTempPatch();	// update ME-5
}


function ToggleReverb() {
	document.getElementById("ReverbOn").style.color = EffectReverbOn ? "grey" : "#FF0000";
	EffectReverbOn ^= 1;	
	tempPatch[7] ^= parseInt("10000",2); 
	programTempPatch();
}

// <!-- End Reverb/delay -->

// <!-- Noise suppressor/Send-Return/Master-Level -->

var sliderNSMNoise       = document.getElementById("NSMNoise");
var sliderNSMSendReturn  = document.getElementById("NSMSendReturn");
var sliderNSMMasterLevel = document.getElementById("NSMMasterLevel");
var outputNSMNoise       = document.getElementById("NSMNoiseValue");
var outputNSMSendReturn  = document.getElementById("NSMSendReturnValue");
var outputNSMMasterLevel = document.getElementById("NSMMasterLevelValue");

sliderNSMNoise.oninput = function() {
	outputNSMNoise.innerHTML = parseInt(this.value); // from 0 to 7
	tempPatch[25] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderNSMSendReturn.oninput = function() {
	outputNSMSendReturn.innerHTML = parseInt(sliderNSMSendReturn.value) ? "ON" : "OFF";
	outputNSMSendReturn.style.color = parseInt(sliderNSMSendReturn.value) ? "#FF0000" : "grey";
	tempPatch[26] = parseInt(this.value);
	programTempPatch();	// update ME-5
}
sliderNSMMasterLevel.oninput = function() {
	outputNSMMasterLevel.innerHTML = (parseInt(this.value)/10).toFixed(1) // 0-7.0 (71 steps)
	tempPatch[32] = parseInt(this.value);
	programTempPatch();	// update ME-5
}

// <!-- End NSM -->

// <!-- Save/Load -->

var filedialogpressed;
function filepopup(pressed) {
	filedialogpressed = pressed;
   filedialogmodal.style.display = "block";
	document.getElementById("filedialogpath").innerHTML = "";	
	filedir = "";
   readdir("");
}

// <!-- End Save/Load -->

// <!-- The Modal Popup boxes-->
// <!--	Save temp settings to Patch -->

function SaveTemptoPatch() {
// check the input
	if (parseInt(GroupPatch.value) < 1 || parseInt(GroupPatch.value) > 4 || 
		parseInt(BankPatch.value) < 1 || parseInt(BankPatch.value) > 4 || 
		parseInt(NumberPatch.value) < 1 || parseInt(NumberPatch.value) > 4) {
		alert("Please enter 1-4");
	}
	else {
		tempPatch[4] = parseInt("12",16); // set DT1
//		address = 0001ggbb 0nn00000
		tempPatch[5] = (parseInt("00010000",2) + ((parseInt(GroupPatch.value)-1)<<2) + 
																(parseInt(BankPatch.value)-1));
		tempPatch[6] = ((parseInt(NumberPatch.value)-1)<<5);
		if (confirm("Change settings of Patch "+GroupPatch.value+BankPatch.value+NumberPatch.value+" ?") == true) {
			PostprogramTempPatch();
			modal.style.display = "none";
		}
	}
		  
}
// Get the modal (Save temp to Patch)
var modal = document.getElementById('SavePatchPopup');

// Get the button that opens the modal
var btn = document.getElementsByClassName("StoreTempsetting");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
// multiple buttons on the page
for (i=0; i<btn.length; i++) {
	btn[i].onclick = function() {
   	modal.style.display = "block";
	}
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
var setGroupPatch = document.getElementById("GroupPatch");
var setBankPatch = document.getElementById("BankPatch");
var setNumberPatch = document.getElementById("NumberPatch");

// <!-- End modal popup Save temp to Patch -->

// <!-- for filedialog -->

function Filehandler() {
	var fullfilepath = filedir+document.getElementById("txtFilename").value;
	
	while (document.getElementById("filedialogtable").rows.length > 3) 
		document.getElementById("filedialogtable").deleteRow(-1); //delete last row
	document.getElementById("filedialogpath").innerHTML = filedir;
	document.getElementById("txtFilename").value = "";
	


//	alert("Filename: " + fullfilepath);
	if (filedialogpressed == 0) { // save temp to file
		checksum = 0;
		for (j=0;j<35;j++) { //calculate checksum
			if (j>6 && j<33) {
				checksum += tempPatch[j];
			}
		}
		checksum = 128 - (checksum & parseInt("0x7F",16));
		tempPatch[33] = checksum;
		$.post("php/Savetofile.php", {msglength: "35", filename:fullfilepath,
											 tempPatch:tempPatch, sysexDT1:sysexDT1}, 
			function(response,status) { // Required Callback Function
//			alert("*----Received Data----*\n\nResponse : " + response+"\n\nStatus : " + status);
			//"response" receives - whatever written in echo of above PHP script.
		});
//		search();
	   filedialogmodal.style.display = "none";
	}
	else if (filedialogpressed == 1) { // Load file to temp
		$.post("php/Loadfromfile.php", {msglength: "35", filename:fullfilepath,
											 tempPatch:tempPatch, sysexDT1:sysexDT1}, 
			function(response,status) { // Required Callback Function
//			alert("*----Received Data----*\n\nResponse : " + response+"\n\nStatus : " + status);
			//"response" receives - whatever written in echo of above PHP script.

		checksum = 0;
		for (j=0; j<35; j++) {
			temp = parseInt(response.substr(2*j,2), 16);
			tempPatch[j] = parseInt(response.substr(2*j,2), 16);
			if (j==0 && (tempPatch[j] != parseInt("0xF0"))) // check 1st byte
					alert("patch: "+j+" not sysex start!" );
			if (j==34 && (tempPatch[j] != parseInt("0xF7"))) // check last byte
				alert("patch: "+j+" not sysex End!" );
			if (j>6 && j<33) {
				checksum += tempPatch[j];
			}
		}
		checksum &= 0x7F;
		checksum = 128 - checksum;
		if (checksum != tempPatch[33]) {
			alert("patch: "+j+" checksum does not match!")
		}
		setslidervalues();
		programTempPatch();	// update ME-5
	
		});
	   filedialogmodal.style.display = "none";
	}			
	else if (filedialogpressed == 2) { // Dump Save sysexDT1 to file
//	alert("sysexDT1 length: "+sysexDT1.length + "\n");
		$.post("php/Savetofile.php", {msglength: "2240", filename:fullfilepath,
											 tempPatch:tempPatch, sysexDT1:sysexDT1}, 
			function(response,status) { // Required Callback Function
//			alert("*----Received Data----*\n\nResponse : " + response+"\n\nStatus : " + status);
			//"response" receives - whatever written in echo of above PHP script.
		});
//	   search();
    	filedialogmodal.style.display = "none";		
	}
	else if (filedialogpressed == 3) { // Dump load file to sysexDT1
		$.post("php/Loadfromfile.php", {msglength: "2240", filename:fullfilepath,
											 tempPatch:tempPatch, sysexDT1:sysexDT1}, 
			function(response,status) { // Required Callback Function
//			alert("*----Received Data----*\n\nResponse : " + response+"\n\nStatus : " + status);
			//"response" receives - whatever written in echo of above PHP script.

			for (i=0; i<64; i++) { // patches range from 0 - 63
				checksum = 0;
				for (j=0; j<35; j++) {
					temp = parseInt(response.substr(70*i+2*j,2), 16);
					sysexDT1[35*i+j] = parseInt(response.substr(70*i+2*j,2), 16);
					if (j==0 && (sysexDT1[35*i+j] != parseInt("0xF0"))) // check 1st byte
						alert("patch: "+i+" not sysex start!" );
					if (j==34 && (sysexDT1[35*i+j] != parseInt("0xF7"))) // check last byte
						alert("patch: "+i+" not sysex End!" );
					if (j>6 && j<33) {
						checksum += sysexDT1[35*i+j];
					}
				}
				checksum &= 0x7F;
				checksum = 128 - checksum;
				if (checksum != sysexDT1[35*i+33]) {
					alert("patch: "+i+" checksum does not match!")
				}
			}
			Pnumber = 64;
			patchupdown(1);
		for (i=0; i<35; i++) { // fill tempPatch
			tempPatch[i] = sysexDT1[Pnumber*35+i];
		}
			
			setslidervalues();
		});
	   filedialogmodal.style.display = "none";
	}			
}

// Get the modal for Filedialog
var filedialogtable = document.getElementById('filedialogtable');
var filedialogmodal = document.getElementById('filedialogmodal');
// Get the button that opens the modal
//var filedialogbtn = document.getElementsByClassName("FileDialogButton");

// Get the <span> element that closes the modal
//var filedialogspan = document.getElementsByClassName("filedialogclose")[0];

// When the user clicks on Cancel button close the filedialog modal
function readwritecancel(){
	while (filedialogtable.rows.length > 3) 
		document.getElementById("filedialogtable").deleteRow(-1); //delete last row
	document.getElementById("filedialogpath").innerHTML = filedir;
	document.getElementById("txtFilename").value = "";
	
   filedialogmodal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == filedialogmodal) {
		while (filedialogtable.rows.length > 3) 
			document.getElementById("filedialogtable").deleteRow(-1); //delete last row
		document.getElementById("filedialogpath").innerHTML = filedir;
		document.getElementById("txtFilename").value = "";
        filedialogmodal.style.display = "none";
    }
}
//addLoadEvent(init);
// <!-- End for filedialog -->

