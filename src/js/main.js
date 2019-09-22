EightBitComp = require("./EightBitComp").default;
EBCGUI       = require("./EBCGUI").default;
Examples     = require("./Examples");

Assembler    = require("./Assembler").default;
AssemblerGUI = require("./AssemblerGUI").default;

ebc     = new EightBitComp();
ebc_gui = new EBCGUI();
ebc.debug = false;

ass     = new Assembler();
ass_gui = new AssemblerGUI();

var DELAY = 5;
var running = false;
var timer;

// **** BUTTONS ****
// Advance Clock One Tick - The 'Step' button
function step(){
	ebc.tick(); 
	ebc_gui.update_elements(ebc);
}
btn_step = document.getElementById('clk_step');
btn_step.onclick = step;

// Start/Stop the clock - "play/pause" button
function startstop(){
	if(running){
		running = false;
		clearTimeout(timer);
	} else {
		running = true;
		timer = setInterval(step, DELAY);
	}
}
btn_ss   = document.getElementById('clk_start');
btn_ss.onclick = startstop;

// Process Code in Assembler Area
ass_txt  = document.getElementById('ass_in');
ass_txt.value = Examples.AddSub_Src;

function assemble(){
	src = ass_txt.value; 
	res = ass.assemble(src); // Will return an object, so I can pass a
							 // error code if needed. 

	if(res[0] == 0){         // Error code of 0 == no error
		ebc.RAM = res[1];    // Means we can safely dump result into ram.
	} else {
		console.log("Error in assembly: "+res[0]);
	}

	return false;
}
form_ass  = document.getElementById('ass_form');
form_ass.onsubmit = assemble;

// Load some initial code. 
ebc.RAM = Examples.AddSub;
ebc_gui.update_elements(ebc);




