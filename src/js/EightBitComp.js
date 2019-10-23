class EightBitComp {
	constructor(){
		this.PC      = 0b0000;		// Program Counter
		this.MAR     = 0b0000;		// Memory Address Register
		this.A_reg   = 0b00000000;	// A Register
		this.B_reg   = 0b00000000;	// B register
		this.ALU_reg = 0b00000000;	// ALU Output Register
		this.OUT_reg = 0b00000000;  // Output register
		this.IR      = 0b00000000;  // Instruction Register
		this.SC      = 0b000; 		// MicroStep Counter
		this.FLAGS   = 0b00;		// Flag Register
		this.BUS     = 0b00000000;  // Jerome Bettis

		this.RAM   = new Array(16);
		for (var i = 0; i < this.RAM.length; i++) {
				this.RAM[i] = 0b00000000;
		}

		// Control Word
		this.CW= 0b0000000000000000;

		// Control Word Access Enum
		this.SIG = { 
			HLT: 0b1000000000000000,  // Halt clock
			MI:  0b0100000000000000,  // Memory address register in
			RI:  0b0010000000000000,  // RAM data in
			RO:  0b0001000000000000,  // RAM data out
			IO:  0b0000100000000000,  // Instruction register out
			II:  0b0000010000000000,  // Instruction register in
			AI:  0b0000001000000000,  // A register in
			AO:  0b0000000100000000,  // A register out
			EO:  0b0000000010000000,  // ALU out
			SU:  0b0000000001000000,  // ALU subtract
			BI:  0b0000000000100000,  // B register in
			OI:  0b0000000000010000,  // Output register in
			CE:  0b0000000000001000,  // Program counter enable
			CO:  0b0000000000000100,  // Program counter out
			J:   0b0000000000000010,  // Jump (program counter in)
			FI:  0b0000000000000001   // Flags in
		};

		// Flags Access Enum
		this.FLG = {
			CF: 0b01,
			ZF: 0b10
		};

		// Machine Code Enum - To index microcode
		this.MC = {
			NOP: 0b0000, 
			LDA: 0b0001, 
			ADD: 0b0010, 
			SUB: 0b0011, 
			STA: 0b0100, 
			LDI: 0b0101, 
			JMP: 0b0110, 
			JC:  0b0111, 
			JZ:  0b1000,
			OUT: 0b1110, 
			HLT: 0b1111 
		}

		// Microcode - Without the first 2 steps, hardcoded later.
		this.MICRO = [];
		this.MICRO[this.MC.ADD] = [this.SIG.IO | this.SIG.MI,
								   this.SIG.RO | this.SIG.BI,
								   this.SIG.EO | this.SIG.AI | this.SIG.FI,
								   0,0,0];
		this.MICRO[this.MC.SUB] = [this.SIG.IO | this.SIG.MI,
								   this.SIG.RO | this.SIG.BI,
								   this.SIG.EO | this.SIG.AI | this.SIG.SU | this.SIG.FI,
								   0,0,0];
		this.MICRO[this.MC.LDA] = [this.SIG.IO | this.SIG.MI,							   
								   this.SIG.RO | this.SIG.AI, 
								   0,0,0,0];
		this.MICRO[this.MC.STA] = [this.SIG.IO | this.SIG.MI,
								   this.SIG.AO | this.SIG.RI,
								   0,0,0,0];
    	this.MICRO[this.MC.LDI] = [this.SIG.IO | this.SIG.AI,
								   0,0,0,0,0];
		this.MICRO[this.MC.JMP] = [this.SIG.IO | this.SIG.J,
								   0,0,0,0,0];
		this.MICRO[this.MC.OUT] = [this.SIG.AO | this.SIG.OI,
								   0,0,0,0,0];
	    this.MICRO[this.MC.HLT] = [this.SIG.HLT,
								   0,0,0,0,0];
		this.MICRO[this.MC.NOP] = [0,0,0,0,0,0];
		this.MICRO[this.MC.JC]  = [0,0,0,0,0,0];
		this.MICRO[this.MC.JZ]  = [0,0,0,0,0,0];
	
		this.running = true;
		this.debug = false;
	}

	tick(){
		if(this.running){
			this.CW = this.decode_instruction(this.SC, this.IR >>> 4, this.FLAGS);
			log_tick(this.PC, this.SC, this.CW, this.debug);
			this.update_modules(this.CW);
		}
	}

	decode_instruction(step, instruction, flags){
		// Hardcoding the first two steps - "Fetch"
		if(step == 0){
			return this.SIG.MI | 	
				   this.SIG.CO; 	
		}
		if(step == 1){
			return this.SIG.RO |
			       this.SIG.II |
			       this.SIG.CE;
		}

		// Handle Jump Carry
		if((instruction == this.MC.JC) && 
		   (flags & this.FLG.CF) &&
		   (step  == 2)){
			return this.SIG.IO | this.SIG.J;
		}

		// Handle Zero Carry
		if((instruction == this.MC.JZ) && 
		   (flags & this.FLG.ZF) &&
		   (step  == 2)){
			return this.SIG.IO | this.SIG.J;
		}

		// Handle "normal" microcode - Note the MICRO array starts at
		//                             the 2th step. 
		return this.MICRO[instruction][step-2];
	}	
	
	update_modules(word){
		// ** Write(ish) ** operations first for timing
		if(word & this.SIG.RO){	// Ram Out
			this.BUS = this.RAM[this.MAR]; 
			log_ma(this.MAR, this.RAM[this.MAR], true, this.debug);
		}
		if(word & this.SIG.IO){	// Instruction Out
			// 4 LSB from IR to BUS
			this.BUS = this.IR & 0b00001111; 
			log_reg("IR Out", this.IR, 8, this.debug);
		} 
		if(word & this.SIG.AO){	// A Register Out
			this.BUS = this.A_reg; 
			log_reg("A Out", this.A_reg, 8, this.debug);
		}
		if(word & this.SIG.CO){ // Program Counter Out
			this.BUS = this.PC;
			log_reg("Counter Out", this.PC, 4, this.debug);
		}

		// ALU Reg Gets updated every clock cycle
		var result;
		if( word & this.SIG.SU ){	// Subtract Signal 
			result = this.A_reg - this.B_reg;
		} else {					// Add
			result = this.A_reg + this.B_reg;
		}
		this.ALU_reg = result & 0b11111111;

		if(word & this.SIG.FI){		// Flags In
			this.FLAGS = 0b00;
			if( result > 0b11111111){ 	// Carry 
				this.FLAGS = this.FLAGS | this.FLG.CF;
			}
			if( result == 0b00000000){	// Zero
				this.FLAGS = this.FLAGS | this.FLG.ZF;
			}
			log_reg("Flags In", this.FLAGS, 2, this.debug);
		}

		// ** Add/Sub have the 'complicated' timing. must happen before AI.
		if(word & this.SIG.EO){	// ALU Register Out
			this.BUS = this.ALU_reg;
			log_reg("ALU Out", this.ALU_reg, 8, this.debug);
		}

		// ** Read(ish) ** operations. 
		if(word & this.SIG.MI){ // Memory Address Register In
			this.MAR = this.BUS & 0b00001111;
			log_reg("MAR In", this.MAR, 4, this.debug);
		} 
		if(word & this.SIG.RI){ // RAM In (at MAR location)
			this.RAM[this.MAR] = this.BUS;
			log_ma(this.MAR, this.BUS, false, this.debug);
		} 
		if(word & this.SIG.II){ // Instruction Register In
			this.IR = this.BUS;
			log_reg("IR In", this.IR, 8, this.debug);
		} 
		if(word & this.SIG.AI){ // A Register In
			this.A_reg = this.BUS;	
			log_reg("A In", this.A_reg, 8, this.debug);
		}
		if(word & this.SIG.BI){ // B Register In
			this.B_reg = this.BUS;	
			log_reg("B In", this.B_reg, 8, this.debug);
		}
		if(word & this.SIG.OI){ // Output Register In
			this.OUT_reg = this.BUS;	
			log_reg("Out In", this.OUT_reg, 8, this.debug);
		}
		if(word & this.SIG.J){ // Jump - Program Counter In
			this.PC = this.BUS & 0b00001111; // Only 4 LSB
			log_reg("PC In", this.PC, 4, this.debug);	
		}

		// Advance PC on Counter Enable Signal
		if(word & this.SIG.CE){
			this.PC = (this.PC + 1);
			log_reg("Counter Enabled", this.PC, 4, this.debug);
		}
		// Advance Step Counter 
		this.SC = (this.SC + 1) & 0b111;

		if(word & this.SIG.HLT){ // 
			this.running = false;
		}
	}

	reset_not_RAM(){
		this.PC      = 0b0000;		
		this.MAR     = 0b0000;		
		this.A_reg   = 0b00000000;	
		this.B_reg   = 0b00000000;	
		this.ALU_reg = 0b00000000;	
		this.OUT_reg = 0b00000000;  
		this.IR      = 0b00000000; 
		this.SC      = 0b000; 		
		this.FLAGS   = 0b00;		
		this.BUS     = 0b00000000;  
		this.CW= 0b0000000000000000;
	}
};


// ** Logging functions **
// Generic Register-Bus Interaction
function log_reg(n, r, l, debug){
	if(debug){
		console.log("\t"+n+" "+r.toString(2).padStart(l, '0'));
	}
}
// Memory Access
function log_ma(addy, value, out, debug){
	if(debug){
		var msg;
		if(out){
			msg = "\tRAM Out [";
		} else {
			msg = "\tRAM In [";
		}
		console.log(msg+addy+"]="+value);
	}
}
// Summarize a tick
function log_tick(pc, sc, cw, debug){
	if(debug){
		var msg = "pc: "+pc+" sc: "+sc+" cw: ";
		msg    += cw.toString(2).padStart(16, '0');
		console.log(msg);
	}
}

export default EightBitComp;