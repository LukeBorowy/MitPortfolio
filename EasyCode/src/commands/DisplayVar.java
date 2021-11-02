package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.Position;
import data.Sprite;
import main.CodeRoutine;
import main.Program;

public class DisplayVar implements Command {


	static final DataTypes[] inTypes={DataTypes.TEXT,DataTypes.POSITION};//var, pos
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("{1(center)}|[show;display;put] ?[|[\";']]{0}?[|[\";']]?[ on?[ ]screen]?[ |[at;in;on] {1}]?[ on?[ ?[the ]]screen]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		
		Position pos=input[1].toPosition(p);
		p.getEventHandlers().addDisplayText(input[0], pos);
		
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
		
		return "DisplayVar";
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
