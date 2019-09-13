EightBitComp = require("./EightBitComp").default;
EBCGUI       = require("./EBCGUI").default;
Examples     = require("./Examples");

ebc = new EightBitComp();
gui = new EBCGUI();

var DELAY = 5;

var running = false;
var timer;

function step(){
	ebc.tick(); 
	gui.update_elements(ebc);
}

function startstop(){
	if(running){
		running = false;
		clearTimeout(timer);
	} else {
		running = true;
		timer = setInterval(step, DELAY);
	}
}

btn_step = document.getElementById('clk_step');
btn_step.onclick = step;

btn_ss   = document.getElementById('clk_start');
btn_ss.onclick = startstop;

ebc.RAM = Examples.CountSub2;
gui.update_elements(ebc);



