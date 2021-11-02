package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.Position;
import data.Sprite;
import events.CollisionListener;
import main.CodeRoutine;
import main.EasyCodeRuntimeException;
import main.Program;

public class EndProgram implements Command {

	public EndProgram() {
		// TODO Auto-generated constructor stub
	}

	static final DataTypes[] inTypes={};
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[end;stop;quit;close]?[ the |[game;program]]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine cause) {
		p.endProgram();
		
		
		
        Data[] dataList= {};
		return dataList;
	}
    
	@Override
	public DataTypes[] getNeededData() {
		
		return inTypes;
	}

	@Override
	public DataTypes[] getOutputData() {
		return outTypes;
	}

	@Override
	public SentenceMatcher getPattern() {
		
		return pattern;
	}
	@Override
	public String getName() {
		
		return "EndProgram";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] in) {
		SentenceMatcher[] label= {new SentenceMatcher("NONE")};
		return label;
	}

	@Override
	public int getDefaultReturnedData() {
		return -1;
	}

	@Override
	public SentenceMatcher getExpressionPattern() {
		return exprPattern;
	}

	@Override
	public boolean isStartOfBlock() {
		return false;
	}

}
