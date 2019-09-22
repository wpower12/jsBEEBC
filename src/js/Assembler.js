class Assembler {
	constructor(){
		// Need an object that can map from the OPCODE MNENOMIC to the 
		// specifics of that opcode, specifically, the actual machine 
		// code value for it and its number of operands. For this 
		// 'computer' all operations are the same length - 1 word
		// so it should be easy?
		//  [OPC,  MC, # of Operands]
		this.OP_MNE = {
			'NOP': [0b0000, 0], 
			'LDA': [0b0001, 1], 
			'ADD': [0b0010, 1], 
			'SUB': [0b0011, 1], 
			'STA': [0b0100, 1], 
			'LDI': [0b0101, 1], 
			'JMP': [0b0110, 1], 
			'JC':  [0b0111, 1], 
			'JZ':  [0b1000, 1],
			'OUT': [0b1110, 0], 
			'HLT': [0b1111, 0]};
	}

	assemble(src){
		// First pass - Fill in the symbol table
		var lc = 0;
		var symbol_table = [];
		
		var token;
		var src_lines = src.split("\n");
		for (var i = 0; i < src_lines.length; i++) {
			token = get_tokens(src_lines[i])[0];
			if (is_symbol(token, this.OP_MNE)){
				symbol_table[token] = lc;
			} else {
				lc += 1;
			}
		}
		console.log(symbol_table);

		// Second pass - build the actual machine code 
		var mc = [16];
		for (var i = 0; i < 16; i++) {
			mc[i] = 0;
		}
		var tokens;
		var op;
		var st_v;
		lc = 0;
		for (var i = 0; i < src_lines.length; i++) {
			tokens = get_tokens(src_lines[i]);
			if(!is_symbol(tokens[0], this.OP_MNE)){
				if(is_int_literal(tokens[0])){
					mc[lc] = parseInt(tokens[0]);
				} else {
					op = this.OP_MNE[tokens[0]];
					if (op[1] == 0) {
						mc[lc] = op[0] << 4;
					} else {
						if(is_symbol(tokens[1], this.OP_MNE)){
							console.log((op[0] << 4), symbol_table[tokens[1]])
							mc[lc] = (op[0] << 4) | symbol_table[tokens[1]];
						} else {
							mc[lc] = (op[0] << 4) | parseInt(tokens[1]);
						}
					}
				}
				lc += 1;
			} 
			// Tokenize Line
			// If first token is a symbol
				// Do nothing
			// Else
				// Output MC to i-th slot in MC
				// Use Symbol Table to 'translate' when needed
				// then increment LC
		}
		log_mc(mc);
		return [1, mc];
	}
};

function get_tokens(l){
	return l.trim().split(/\s+/);
}

// function is_opcode(token, ops){
// 	for (var i = 0; i < ops.length; i++) {
// 		if(token == ops[i][0]) return true;
// 	}
// 	return false;
// }

function is_opcode(token, ops){
	return token in ops;
}

function is_int_literal(token){
	return !isNaN(parseInt(token, 10));
}

function is_symbol(token, ops){
	return !(is_opcode(token, ops) || is_int_literal(token));
}

function log_mc(mc){
	for (var i = 0; i < 16; i++) {
		console.log("0b"+mc[i].toString(2).padStart(8, '0'));
	}

}

export default Assembler;