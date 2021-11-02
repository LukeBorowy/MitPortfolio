package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.EasyCodeColor;
import data.Sprite;
import events.EventListener;
import events.TimerListener;
import main.CodeRoutine;
import main.Program;

public class WaitTime implements Command {

	static final DataTypes[] inTypes= {DataTypes.NUMBER};//seconds
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[wait;pause;stop] ?[for ]{0} seconds",inTypes.length);//TODO: make it work for "{<1>} every 5 seconds"
	static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		
		int millis=(int)(input[0].toNumber().getValue()*1000);//times 1000 to convert to milliseconds
		try {
			Thread.sleep(millis);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return new Data[] {};//no return data
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
		
		return "WaitTime";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] in) {
		final SentenceMatcher[] label= {};
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
