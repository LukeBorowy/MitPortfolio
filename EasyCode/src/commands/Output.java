package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.Text;
import main.CodeRoutine;
import main.Program;

public class Output implements Command {
	
	static final int totalArgs=1;
	static SentenceMatcher pattern=new SentenceMatcher("|[|[say;output;print];|[tell;inform] ?[the ]user]?[ that] ?[|[\";']]{0}?[|[\";']]",totalArgs);
	static SentenceMatcher exprPattern=new SentenceMatcher("NONE");
	
	public Output() {
	}

	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		//TODO: make it a popup window instead of logging
		System.out.println(input[0].toText().getVal());
		final Data[] noData= {};
		return noData;
	}

	@Override
	public DataTypes[] getNeededData() {
		final DataTypes[] textData= {DataTypes.TEXT};
		return textData;
	}

	@Override
	public DataTypes[] getOutputData() {
		final DataTypes[] noData= {};
		return noData;
	}

	@Override
	public SentenceMatcher getPattern() {
		return pattern;
	}
	
	@Override
	public SentenceMatcher getExpressionPattern() {
		return exprPattern;
	}
	
	@Override
	public String getName() {
		return "Output";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] ignored) {
		final SentenceMatcher[] noData = {};
		return noData;
	}

	@Override
	public int getDefaultReturnedData() {
		
		return -1;//AKA none
	}

	@Override
	public boolean isStartOfBlock() {
		return false;
	}

}
