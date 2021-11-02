package commands;

import compiler.SentenceMatcher;
import data.*;
import main.CodeRoutine;
import main.Program;

public interface Command {
	Data[] runCommand(Data input[],Program program,CodeRoutine routine);
	
	DataTypes[] getNeededData();
	
	DataTypes[] getOutputData();
	
	SentenceMatcher[] getReturnLabels(String[] argsText);//labels for each returned data, if the input is args
	
	int getDefaultReturnedData();//index of default data to use from return
	
	SentenceMatcher getPattern();
	
	SentenceMatcher getExpressionPattern();
	
	boolean isStartOfBlock();
	
	String getName();
	

}
