export let Add42 = [ 
	0b00010100, // LDA [4] - Load from memory at 4
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
	0b00000000];//
 
export let CountSub2 = [ 
	0b00101111, // [00] ADD [15] - Load from memory at 15 (2) into B, put A+B in A
	0b11100000, // [01] OUT      - Put A in OR, and Display
	0b01110100, // [02] JC  [4]  - If Carry, Jump to 4 (Just before start of sub loop)
	0b01100000, // [03] J   [0]  - Else,     Jump to 0 (Start of add loop)
	0b00011110, // [04] LDA [14] - Load in 256.
	0b00111111, // [05] SUB [15] - Load from memory at 15 (2) into B, put A-B in A
	0b11100000, // [06] OUT      - Put A in OR, and Display
	0b10000000, // [07]	JZ  [0]  - If Zero,  Jump to 0 (Start of add loop)
	0b01100101, // [08] J   [5]  - Else,     Jump to 4 (Start of sub loop)
	0b00000000, // [09]
	0b00000000, // [10]			 	 
	0b00000000, // [11]
	0b00000000, // [12]
	0b00000000, // [13]
	0b00000000, // [14] 256 - Max value
	0b00000010];// [15] 2   - Value that's added/subbed. 

