package main;

import commands.Command;
import data.Data;

public class CodeLine {

	public int[] argMemPos;
	public int[] outMemPos;
	public Data[] input;
	public Data[] output;
	public Command command;
	public int subDepth;
	public CodeLine(Command command, int[] argMemPos,int[] outMemPos, int subDepth) {
		this.command=command;
		this.argMemPos=argMemPos;
		this.outMemPos=outMemPos;
		this.subDepth=subDepth;
		input=new Data[command.getNeededData().length];//note: size is getNeededData, but args might not all be supplied. If so, command gets NONE, to deal as it likes.
		output=new Data[outMemPos.length];
	}
	@Override
	public String toString() {
		String s=command.getName()+"(";
		for(int i=0;i<subDepth;i++) {
			s="\t"+s;
		}
		for(int i=0;i<argMemPos.length;i++) {
			int arg=argMemPos[i];
			s+=arg;
			if(i!=argMemPos.length-1) {
				s+=",";
			}
		}
		s+=")\t";
		
		if(outMemPos.length>0) {
			s+=" --> ";
			for(int i=0;i<outMemPos.length;i++) {
				int out=outMemPos[i];
				s+=out;
				if(i!=outMemPos.length-1) {
					s+=",";
				}
			}
		}
		return s;
	}
	public void run(Program program,CodeRoutine routine) {
		for(int i=0;i<argMemPos.length;i++) {
			int in=argMemPos[i];
			input[i]=program.getMemAt(in);
		}
		output=command.runCommand(input,program,routine);
		for(int i=0;i<outMemPos.length;i++) {
			int out=outMemPos[i];
			program.setMemAt(out,output[i]);
		}
		
	}

}
