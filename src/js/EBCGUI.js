class EBCGUI {
	constructor(){
		this.el_PC      = document.getElementById('PC');
		this.el_MAR     = document.getElementById('MAR');
		this.el_BUS     = document.getElementById('Bus');
		this.el_A_REG   = document.getElementById('A_reg');
		this.el_B_REG   = document.getElementById('B_reg');
		this.el_ALU_REG = document.getElementById('S_reg');
		this.el_OUT     = document.getElementById('OUT');
		this.el_SC 	    = document.getElementById('SC_reg');

		this.el_IR_I 	= document.getElementById('IR_I_reg');
		this.el_IR_D 	= document.getElementById('IR_D_reg');
		this.el_INST    = document.getElementById('INST');

		this.el_cwHT    = document.getElementById('cwHT');
		this.el_cwMI    = document.getElementById('cwMI');
		this.el_cwRI    = document.getElementById('cwRI');
		this.el_cwRO    = document.getElementById('cwRO');
		this.el_cwIO    = document.getElementById('cwIO');
		this.el_cwII    = document.getElementById('cwII');
		this.el_cwAI    = document.getElementById('cwAI');
		this.el_cwAO    = document.getElementById('cwAO');
		this.el_cwΣO    = document.getElementById('cwΣO');
		this.el_cwSU    = document.getElementById('cwSU');
		this.el_cwBI    = document.getElementById('cwBI');
		this.el_cwOI    = document.getElementById('cwOI');
		this.el_cwCE    = document.getElementById('cwCE');
		this.el_cwCO    = document.getElementById('cwCO');
		this.el_cw_J    = document.getElementById('cw_J');
		this.el_cwFI    = document.getElementById('cwFI');

		this.el_dIR	    = document.getElementById('decoded_ir');
		
		this.els_RAM = [16];
		for (var i = 0; i < 16; i++) {
			var el_name = "m"+i.toString(2).padStart(4, '0');
			this.els_RAM[i] = document.getElementById(el_name);
		}

		this.inst_map = [16];
		for (var i = 0; i < 16; i++) {
			this.inst_map[i] = "NOP";
		}

		this.inst_map[0b0001] = "LDA";
		this.inst_map[0b0010] = "ADD";
		this.inst_map[0b0011] = "SUB";
		this.inst_map[0b0100] = "STA";
		this.inst_map[0b0101] = "LDI";
		this.inst_map[0b0110] = "JMP";
		this.inst_map[0b0111] = "JC:";
		this.inst_map[0b1000] = "JZ:";
		this.inst_map[0b1110] = "OUT";
		this.inst_map[0b1111] = "HLT";

	}

	update_elements(ebc){
		// Registers
		this.el_PC.innerHTML      = this.format_register_html(ebc.PC,      4, true);
		this.el_MAR.innerHTML     = this.format_register_html(ebc.MAR,     4, true);
		this.el_BUS.innerHTML     = this.format_register_html(ebc.BUS,     8, true);
		this.el_A_REG.innerHTML   = this.format_register_html(ebc.A_reg,   8, true);
		this.el_B_REG.innerHTML   = this.format_register_html(ebc.B_reg,   8, true);	
		this.el_ALU_REG.innerHTML = this.format_register_html(ebc.ALU_reg, 8, true);
		this.el_SC.innerHTML	  = this.format_register_html(ebc.SC,      3, true);

		this.el_IR_I.innerHTML	  = this.format_register_html((ebc.IR >> 4), 4, true);
		this.el_INST.innerHTML    = this.format_register_html((ebc.IR >> 4), 4, true);
		this.el_IR_D.innerHTML	  = this.format_register_html((ebc.IR & 0b00001111), 4, true);

		// Ram
		for (var i = 0; i < 16; i++) {
			this.els_RAM[i].innerHTML = this.format_register_html(ebc.RAM[i], 8, true);	
		}

		// Control Word Signals
		this.el_cwHT.innerHTML = this.format_register_html((ebc.SIG.HLT & ebc.CW) ? 1 : 0, 1, true); 
		this.el_cwMI.innerHTML = this.format_register_html((ebc.SIG.MI & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwRI.innerHTML = this.format_register_html((ebc.SIG.RI & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwRO.innerHTML = this.format_register_html((ebc.SIG.RO & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwIO.innerHTML = this.format_register_html((ebc.SIG.IO & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwII.innerHTML = this.format_register_html((ebc.SIG.II & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwAI.innerHTML = this.format_register_html((ebc.SIG.AI & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwAO.innerHTML = this.format_register_html((ebc.SIG.AO & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwΣO.innerHTML = this.format_register_html((ebc.SIG.EO & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwSU.innerHTML = this.format_register_html((ebc.SIG.SU & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwBI.innerHTML = this.format_register_html((ebc.SIG.BI & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwOI.innerHTML = this.format_register_html((ebc.SIG.OI & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwCE.innerHTML = this.format_register_html((ebc.SIG.CE & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cwCO.innerHTML = this.format_register_html((ebc.SIG.CO & ebc.CW)  ? 1 : 0, 1, true); 
		this.el_cw_J.innerHTML = this.format_register_html((ebc.SIG.J & ebc.CW)   ? 1 : 0, 1, true); 
		this.el_cwFI.innerHTML = this.format_register_html((ebc.SIG.FI & ebc.CW)  ? 1 : 0, 1, true); 

		// Decoded IR
		this.el_dIR.innerHTML = this.inst_map[ebc.IR >> 4];
		
		// Output Display (in base 10)
		this.el_OUT.innerHTML = ebc.OUT_reg.toString(10).padStart(4,'0');
	}

	format_register_html(content, len, hl){
		var initial_str = content.toString(2).padStart(len, '0');
		
		if(hl == false){
			return initial_str;
		}

		var ret_str = "";
		for (var c = 0; c < initial_str.length; c++) {
			var char = initial_str[c];
			if (char == '0') {
				ret_str = ret_str + '0';
			} else {
				ret_str = ret_str + "<span class='high'>1</span>";
			}
		}
		return ret_str;
	}
}

export default EBCGUI;