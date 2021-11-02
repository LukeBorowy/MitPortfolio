package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.Number;
import data.Position;
import main.CodeRoutine;
import main.Program;

public class SetNumberVar implements Command {

	static final DataTypes[] inTypes={DataTypes.TEXT,DataTypes.NUMBER};//name, val
	static final DataTypes[] outTypes={DataTypes.NUMBER};
    static SentenceMatcher pattern=new SentenceMatcher("|[start;set;make] ?[the ]{0} |[to;be;at] {1}",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		Number num;
		
		if(input[0].getTypeName()==DataTypes.NUMBER) {//this number already exists. If the type is Number, it is a reference to a pre-existing variable.
			num=input[0].toNumber();
		}else {//this is a new number
			num=new Number(0);
		}
		
		num.setValue(input[1].toNumber().getValue());
		
        Data[] dataList= {num};
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
		
		return "SetNumberVar";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] in) {
		String varName=in[0];
		if(varName.endsWith("s")) {
			varName=varName.substring(0, varName.length()-1);
			System.out.println(varName);
		}
		SentenceMatcher[] label= {new SentenceMatcher("?[the ]"+varName+"?[s]")};
		return label;
	}

	@Override
	public int getDefaultReturnedData() {
		return 0;
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
