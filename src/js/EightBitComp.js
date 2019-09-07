function log_reg(n, r, l){
	console.log("\t"+n+" "+r.toString(2).padStart(l, '0'));
}

function log_ma(){
	
}

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

		// Microcode Steps - Without the first 2 steps, hardcode that later.
		// 				   - Note, makes the noop steps the default. 
		this.MICRO = [16];
		for (var i = 0; i < this.MICRO.length; i++) {
			this.MICRO[i] = [0,0,0,0,0,0];
		}
		this.MICRO[this.MC.NOP] = [0,0,0,0,0,0];
		this.MICRO[this.MC.LDA] = [this.SIG.IO | this.SIG.MI,							   
								   this.SIG.RO | this.SIG.AI,
								   0,0,0,0];
		this.MICRO[this.MC.ADD] = [this.SIG.IO | this.SIG.MI,
								   this.SIG.RO | this.SIG.BI,
								   this.SIG.EO | this.SIG.AI | this.SIG.FI,
								   0,0,0];
		this.MICRO[this.MC.SUB] = [this.SIG.IO | this.SIG.MI,
								   this.SIG.RO | this.SIG.BI,
								   this.SIG.EO | this.SIG.AI | this.SIG.SU | this.SIG.FI,
								   0,0,0];
		this.MICRO[this.MC.STA] = [this.SIG.IO | this.SIG.MI,
								   this.SIG.AO | this.SIG.RI,
								   0,0,0,0];
    	this.MICRO[this.MC.LDI] = [this.SIG.IO | this.SIG.AI,
								   0,0,0,0,0];
		this.MICRO[this.MC.JMP] = [this.SIG.IO | this.SIG.J,
								   0,0,0,0,0];
		this.MICRO[this.MC.OUT] = [this.SIG.AO | this.SIG.OI,
								   0,0,0,0,0];
	}

	tick(){
		// ** Advance cpu by one clock cycle
		console.log("pc: "+this.PC+ " sc: "+this.SC);
		console.log("IR: "+this.IR.toString(2).padStart(8, '0'));
		var word = this.decode_instruction(this.SC, this.IR >>> 4);
		this.CW = word;
		console.log("cw: "+word.toString(2).padStart(16,'0'));
		this.update_modules(word);
	}

	decode_instruction(step, instruction, flags){
		// First 2 are easy, the fetch.
		if(step == 0){
			return this.SIG.MI | 	// Memory In
				   this.SIG.CO; 	// Clock Out
		}
		if(step == 1){
			return this.SIG.RO |
			       this.SIG.II |
			       this.SIG.CE;
		}

		// Handle "normal" microcode - No flag checks needed
		var cw = this.MICRO[instruction][step-2];

		// Handle Jump Carry
		if((instruction == this.MC.JC) && 
		   (flag & this.FLG.CF) &&
		   (step == 2)){
			cw = this.SIG.IO | this.SIG.J;
		}

		// Handle Zero Carry
		if((instruction == this.MC.JZ) && 
		   (flag & this.FLG.ZF) &&
		   (step == 2)){
			cw = this.SIG.IO | this.SIG.J;
		}
		return cw;
	}	
	
	update_modules(word){
		// ** Write(ish) ** operations first for timing
		if(word & this.SIG.RO){	// Ram Out
			console.log("RAM Out ["+this.MAR+"]="+this.RAM[this.MAR]);
			this.BUS = this.RAM[this.MAR]; 
		}
		if(word & this.SIG.IO){	// Instruction Out
			// 4 LSB from IR to BUS
			this.BUS = this.IR & 0b00001111; 
			log_reg("IR Out", this.IR, 4);
		} 
		if(word & this.SIG.AO){	// A Register Out
			this.BUS = this.A_reg; 
			log_reg("A Out", this.A_reg, 8);
		}
		if(word & this.SIG.CO){
			this.BUS = this.PC;
			log_reg("Counter Out", this.PC, 4);
		}

		// ** Add/Sub are the complicated ones. must happen before AI.
		if(word & this.SIG.EO){
			var result;
			if( word & this.SIG.SU ){
				result = this.A_reg - this.B_reg;

			} else {
				result = this.A_reg + this.B_reg;
			}
			this.FLAGS = 0b00;
			if( result > 0b11111111){
				this.FLAGS = this.FLAGS & this.FLG.CF;
			}
			if( result == 0b00000000){
				this.FLAGS = this.FLAGS & this.FLG.CF;
			}
			this.BUS = result & 0b11111111;
		}

		// ** Read(ish) ** operations. 
		if(word & this.SIG.MI){
			this.MAR = this.BUS & 0b00001111;
			log_reg("MAR In", this.MAR, 4);
		} 
		if(word & this.SIG.RI){
			this.RAM[this.MAR] = this.BUS;
			console.log("Ram In: RAM["+this.MAR+"]="+this.BUS.toString(2).padStart(8,'0'));
		} 
		if(word & this.SIG.II){
			this.IR = this.BUS;
			log_reg("IR In", this.IR, 4);
		} 
		if(word & this.SIG.AI){
			this.A_reg = this.BUS;	
			log_reg("A In", this.A_reg, 8);
		}
		if(word & this.SIG.BI){
			this.B_reg = this.BUS;	
		}
		if(word & this.SIG.OI){
			this.OUT_reg = this.BUS;	
		}
		if(word & this.SIG.J){
			this.PC = this.BUS & 0b00001111; // Only 4 LSB	
		}

		// if(word & this.SIG.FI){
		// 	// Noop in this kind of simulation, we only save the flags when 
		// 	// we want to. 
		// }


		// advance pc
		if(word & this.SIG.CE){
			console.log("\tClock Enable");
			this.PC = (this.PC + 1);
		}
		// advance step
		this.SC = (this.SC + 1) & 0b111;
	}
};
export default EightBitComp;