package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import events.EventListener;
import graphics.DisplayWindow;
import main.CodeRoutine;
import main.Program;

public class AddKeyHandler implements Command {

	static final DataTypes[] inTypes={DataTypes.TEXT,DataTypes.TEXT};//second arg is line number of subroutine
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[when;if] |[|[the user;someone;i] |[press?[es];push?[es];type?[s]] ?[the ]{0}?[ key?[s]];?[the ]{0} ?[key?[s] ]|[is;are] |[pressed;pushed;typed]], {<1>}",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
    final SentenceMatcher spaces=new SentenceMatcher("space?[?[ ]bar]");
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		String key=input[0].toText().getVal();
		int[] bounds=EventListener.getLinesFromString(input[1].toText().getVal());
		int start=bounds[0];
		int end=bounds[1];
		if(spaces.matchesText(key)){
			key="space";
		}
		if(key.equals("arrow")||key.equals("any arrow")){
			key="arrows";
		}
		
		if(key.equals("up")) {
			key="up arrow";
		}else if(key.equals("down")) {
			key="down arrow";
		}else if(key.equals("right")) {
			key="right arrow";
		}else if(key.equals("left")) {
			key="left arrow";
		}
		
		p.getWindow().eventListeners.addKeyListener(key, start, end,this);
		
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
		
		return "AddKeyHandler";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] ignored) {
		final SentenceMatcher[] label= {new SentenceMatcher("NONE")};
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

