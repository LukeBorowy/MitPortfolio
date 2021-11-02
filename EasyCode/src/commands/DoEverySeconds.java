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

public class DoEverySeconds implements Command {

	static final DataTypes[] inTypes= {DataTypes.NUMBER,DataTypes.TEXT,DataTypes.NUMBER};//seconds,code,repeat
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[?[once ]|[every;each;per]{2(1)};|[wait;pause;after]{2(0)}] |[{0} ;?[a ]{0(1)}]second?[s], ?[then ]{<1>}",inTypes.length);//TODO: make it work for "{<1>} every 5 seconds"
	static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		
		int seconds=(int)(input[0].toNumber().getValue()*1000);//times 1000 to convert to milliseconds
		boolean repeat=input[2].toNumber().getValue()==1;
		int[] bounds=EventListener.getLinesFromString(input[1].toText().getVal());
		int start=bounds[0];
		int end=bounds[1];
		
		p.getEventHandlers().addTimerListener(start, end,this,seconds,repeat);
		
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
		
		return "DoEverySeconds";
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
		return true;
	}

}
