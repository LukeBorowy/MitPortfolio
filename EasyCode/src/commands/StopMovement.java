package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.EasyCodeColor;
import data.Sprite;
import main.CodeRoutine;
import main.Program;

public class StopMovement implements Command {

	static final DataTypes[] inTypes={DataTypes.SPRITE};//thing
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[|[make?[ it so];stop] {0} ?[stop?[s] ]|[mov|[e;ing];going];stop {0}]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);//                           made the "ing" mandatory to avoid conflict with "make the circle go faster"
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		
		Sprite sprite=input[0].toSprite();
		
		
		sprite.setMoving(false);
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
		
		return "StopMovement";
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
