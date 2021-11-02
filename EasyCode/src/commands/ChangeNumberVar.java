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

public class ChangeNumberVar implements Command {


	static final DataTypes[] inTypes={DataTypes.NUMBER,DataTypes.NUMBER};//var, amnt
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[|[|[add;increase;increment]{1(1)};|[reduce;decrement]{1(-1)}] {0} ?[|[to;by] ]{1};|[|[gain;get;score]{1(1)};|[lose;subtract]{1(-1)}] |[{1};a] ?[from ]{0}]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine cause) {
		input[0].toNumber().changeValue(input[1].toNumber().getValue());
		
		
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
		
		return "BounceOff";
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
