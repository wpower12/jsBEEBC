EightBitComp = require("./EightBitComp").default;
EBCGUI       = require("./EBCGUI").default;

ebc = new EightBitComp();
gui = new EBCGUI();

btn_step = document.getElementById('clk_step');
btn_step.onclick = function () { ebc.tick(); gui.update_elements(ebc);};

ebc.RAM = [ 0b00010100, // LDA [4] - Load from memory at 4
			0b00100101, // ADD [5] - Load from memory at 5 into B, put A+B in A
			0b11100000, // OUT     - Put A in OR, and Display
			0b11110000, // HLT     - Halt		 
			0b00001110, // [4]     - 14
			0b00011100, // [5]     - 28
			0b00000000, //
			0b00000000, //		 
			0b00000000, //
			0b00000000, //
			0b00000000, //
			0b00000000, //			 	 
			0b00000000, //
			0b00000000, //
			0b00000000, //
			0b00000000];

gui.update_elements(ebc);



