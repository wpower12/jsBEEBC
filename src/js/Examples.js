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

export let SubTest = [ 
	0b00010101, // LDA [4] - Load from memory at 5
	0b00110100, // SUB [5] - Load from memory at 4 into B, put A-B in A
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
 
export let AddSub = [ 
	0b11100000, // [00] OUT
	0b00101000, // [01] ADD 8
	0b01110100, // [02] JC  4
	0b01100000, // [03] JMP 0
	0b00111000, // [04] SUB 8
	0b11100000, // [05] OUT
	0b10000000, // [06] JZ  0
	0b01100100, // [07]	JMP 4 
	0b00000001, // [08] 1
	0b00000000, // [09]
	0b00000000, // [10]			 	 
	0b00000000, // [11]
	0b00000000, // [12]
	0b00000000, // [13]
	0b00000000, // [14] 
	0b00000000];// [15] 

export let AddSub_Src = 
`ADD_LOOP
  OUT
  ADD ONE
  JC SUB_LOOP
  JMP ADD_LOOP
SUB_LOOP
  SUB ONE
  OUT
  JZ ADD_LOOP
  JMP SUB_LOOP
ONE
  1`;
