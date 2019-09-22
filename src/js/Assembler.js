class Assembler {
	constructor(){
		// Need an object that can map from the OPCODE MNENOMIC to the 
		// specifics of that opcode, specifically, the actual machine 
		// code value for it and its number of operands. For this 
		// 'computer' all operations are the same length - 1 word
		// so it should be easy?
		this.OP_MNE = [];
	}

	assemble(src){
		// console.log(src);

		// First pass - Fill in the "symbol table"
		var lc = 0;
		var symbol_table = [];
		
		var line;
		var src_lines = src.split("\n");
		for (var i = 0; i < src_lines.length; i++) {
			line = src_lines[i];
			// Tokenize Line
			// If first token isn't a MNE, assume it's a label.
				// Add symbol to the table, set it to current line count
				// Do NOT increment the line counter
			// Else
				// Increment line counter
		}


		// Second pass - build the actual machine code 
		var mc = [16];
		lc = 0;

		for (var i = 0; i < src_lines.length; i++) {
			line = src_lines[i];

			// Tokenize Line
			// If first token is a symbol
				// Do nothing
			// Else
				// Output MC to i-th slot in MC
				// Use Symbol Table to 'translate' when needed
		}

		return [1, mc];
	}
}
export default Assembler;