package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.EasyCodeColor;
import data.Sprite;
import main.CodeRoutine;
import main.Program;

public class MoveConstant implements Command {

	static final DataTypes[] inTypes={DataTypes.SPRITE,DataTypes.DIRECTION};//thing, direction
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[|[make?[ it so];start] {0} ?[keep?[s] ]|[mov|[e;ing];going]?[ {1}];|[launch;shoot] {0}?[ {1}]]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);//                           made the "ing" mandatory to avoid conflict with "make the circle go faster"
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		
		Sprite sprite=input[0].toSprite();
		
		if(input[1].getTypeName()==DataTypes.NONE) {
			
		}else {
			sprite.setDirection(input[1].toDirection());
		}
		
		sprite.setMoving(true);
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
		
		return "MoveConstant";
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
